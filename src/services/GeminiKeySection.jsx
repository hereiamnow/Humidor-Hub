// File: GeminiKeySection.jsx
// Path: src\services\GeminiKeySection.jsx
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 26, 2025
// Time: 3:06 PM CDT


/**
 * A React component that provides a secure interface for users to manage their
 * personal Gemini API key. This component allows users to input, validate, save,
 * and clear their API key for use with Google's Gemini AI services.
 * 
 * Features:
 * - Secure password-style input field for API key entry
 * - Client-side validation using regex pattern matching
 * - Firebase Firestore persistence tied to user authentication
 * - Visual feedback for save/error states
 * - Clear functionality to remove stored keys
 * - Loading states for async operations
 * - Responsive design with Tailwind CSS styling
 * 
 * Security Notes:
 * - API keys are stored in Firebase Firestore (server-side, user-specific)
 * - Requires user authentication to access/modify keys
 * - Input field uses password type to prevent shoulder surfing
 * - Keys are validated before storage to prevent malformed entries
 * 
 * Usage:
 * This component is typically used in settings or configuration screens
 * where users need to provide their own API credentials for enhanced
 * functionality or quota management. Users must be authenticated to use this component.
 * 
 * @component
 * @returns {JSX.Element} The GeminiKeySection component
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';

// Constants for Firestore collection and API key validation
const API_KEY_COLLECTION = 'userSettings';
const API_KEY_PATTERN = /^[A-Za-z0-9_-]{20,}$/; // Regex pattern for Gemini API key format validation

export default function GeminiKeySection() {
    // State management for component
    const [apiKey, setApiKey] = useState(''); // Current API key input value
    const [status, setStatus] = useState(null); // Status indicator: 'success' | 'error' | null
    const [message, setMessage] = useState(''); // User feedback message
    const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
    const [loading, setLoading] = useState(true); // Loading state for Firebase operations

    // Firebase auth hook
    const [user, authLoading] = useAuthState(auth);

    console.log('GeminiKeySection: Component rendered, user:', user?.uid, 'authLoading:', authLoading);

    // Effect hook to load saved API key from Firebase on component mount
    useEffect(() => {
        const loadApiKey = async () => {
            if (authLoading) {
                console.log('GeminiKeySection: Auth still loading, waiting...');
                return;
            }

            if (!user) {
                console.log('GeminiKeySection: No authenticated user, clearing state');
                setApiKey('');
                setLoading(false);
                return;
            }

            console.log('GeminiKeySection: Loading saved API key from Firebase for user:', user.uid);

            try {
                const userDocRef = doc(db, API_KEY_COLLECTION, user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && userDoc.data().geminiApiKey) {
                    const savedKey = userDoc.data().geminiApiKey;
                    console.log('GeminiKeySection: Found saved API key, length:', savedKey.length);
                    setApiKey(savedKey);
                } else {
                    console.log('GeminiKeySection: No saved API key found in Firebase');
                    setApiKey('');
                }
            } catch (error) {
                console.error('GeminiKeySection: Error loading API key from Firebase:', error);
                setStatus('error');
                setMessage('Failed to load saved API key.');
            } finally {
                setLoading(false);
            }
        };

        loadApiKey();
    }, [user, authLoading]);

    /**
     * Validates the API key format using regex pattern
     * @param {string} key - The API key to validate
     * @returns {boolean} - True if key matches expected format
     */
    const validateKey = (key) => {
        const isValid = API_KEY_PATTERN.test(key);
        console.log('GeminiKeySection: Validating API key, length:', key.length, 'isValid:', isValid);
        return isValid;
    };

    /**
     * Handles saving the API key to Firebase Firestore
     * Validates the key before saving and provides user feedback
     */
    const handleSave = async () => {
        console.log('GeminiKeySection: Save button clicked, attempting to save API key');

        if (!user) {
            console.log('GeminiKeySection: No authenticated user, cannot save');
            setStatus('error');
            setMessage('Please sign in to save your API key.');
            return;
        }

        // Validate the API key format before saving
        if (!validateKey(apiKey)) {
            console.log('GeminiKeySection: API key validation failed');
            setStatus('error');
            setMessage('Invalid key format. Please check and try again.');
            return;
        }

        // Save to Firebase Firestore and update UI state
        try {
            setLoading(true);
            const userDocRef = doc(db, API_KEY_COLLECTION, user.uid);
            await setDoc(userDocRef, {
                geminiApiKey: apiKey,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('GeminiKeySection: API key saved successfully to Firebase');
            setStatus('success');
            setMessage('API key saved successfully.');
        } catch (error) {
            console.error('GeminiKeySection: Error saving API key to Firebase:', error);
            setStatus('error');
            setMessage('Failed to save API key. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles clearing the API key from Firebase Firestore and resetting component state
     */
    const handleClear = async () => {
        console.log('GeminiKeySection: Clear button clicked, removing API key');

        if (!user) {
            console.log('GeminiKeySection: No authenticated user, cannot clear');
            setStatus('error');
            setMessage('Please sign in to manage your API key.');
            return;
        }

        try {
            setLoading(true);
            const userDocRef = doc(db, API_KEY_COLLECTION, user.uid);
            await deleteDoc(userDocRef);
            console.log('GeminiKeySection: API key removed from Firebase');

            // Reset all component state
            setApiKey('');
            setStatus(null);
            setMessage('');
        } catch (error) {
            console.error('GeminiKeySection: Error clearing API key from Firebase:', error);
            setStatus('error');
            setMessage('Failed to clear API key. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggles the password visibility state
     */
    const togglePasswordVisibility = () => {
        console.log('GeminiKeySection: Toggling password visibility, current state:', showPassword);
        setShowPassword(!showPassword);
    };

    // Show loading state while auth is loading
    if (authLoading) {
        return (
            <section className="p-6 bg-gray-800/50 rounded-xl shadow-lg max-w-md mx-auto">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                    <span className="ml-3 text-gray-400">Loading...</span>
                </div>
            </section>
        );
    }

    // Show authentication required message if user is not signed in
    if (!user) {
        return (
            <section className="p-6 bg-gray-800/50 rounded-xl shadow-lg max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-white">
                    Gemini API Key
                </h2>
                <p className="mt-2 text-gray-400 text-sm">
                    Please sign in to manage your personal Gemini API key.
                </p>
                <div className="mt-4 p-4 bg-amber-900/30 border border-amber-600/50 rounded-lg">
                    <p className="text-amber-200 text-sm">
                        🔒 Authentication required to access this feature
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="p-6 bg-gray-800/50 rounded-xl shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-white">
                Gemini API Key
            </h2>
            <p className="mt-2 text-gray-400 text-sm">
                Paste your personal Gemini API key to use your own quota and customize your experience.
            </p>

            <div className="mt-4 relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        setStatus(null);
                    }}
                    placeholder="Enter your Gemini API key"
                    disabled={loading}
                    className={`w-full px-4 py-2 pr-12 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    aria-label={showPassword ? "Hide API key" : "Show API key"}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            <div className="mt-4 flex space-x-2">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Saving...' : 'Save Key'}
                </button>
                <button
                    onClick={handleClear}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Clearing...' : 'Clear Key'}
                </button>
            </div>

            {status && (
                <p
                    className={`mt-3 text-sm font-medium ${status === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}
                >
                    {message}
                </p>
            )}

            <p className="mt-6 text-xs text-gray-500">
                Your key is stored securely in Firebase and synced across your devices.
            </p>
        </section>
    );
}