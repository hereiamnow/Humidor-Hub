/**
 *
 * @file FirebaseAuthUI.js
 * @path src/FirebaseAuthUI.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 1, 2025
 *
 * Firebase Authentication UI Component
 *
 * Provides a custom authentication UI for Humidor Hub, supporting email/password and 
 * Google OAuth sign-in. Features user registration with email verification, password 
 * visibility toggle, error handling, and a responsive, branded interface for secure 
 * access to the cigar collection app.
 *
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSignIn - Callback function called after successful authentication with user ID
 *
 */

import React, { useState, useEffect } from 'react';
import {
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, sendEmailVerification
} from 'firebase/auth';
import { Box, DogIcon } from 'lucide-react'; // Optional: Replace with your logo/icon
import RoxyLogo from '../UI/RoxyLogo';
/**
 * CustomAuth Component
 * @param {Function} onSignIn - Callback function called after successful authentication with user ID
 */
export default function CustomAuth({ onSignIn, navigate }) {
    console.log('🔧 CustomAuth component rendered with onSignIn:', typeof onSignIn);

    // Form state management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false); // Toggle between sign-in and registration modes
    const [error, setError] = useState(''); // Error message display
    const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

    // Add state for new fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    // Add validation error state for each field
    const [fieldErrors, setFieldErrors] = useState({});

    // Add state for verification message
    const [verificationSent, setVerificationSent] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');

    // Firebase auth instance
    const auth = getAuth();
    console.log('🔥 Firebase auth instance initialized:', !!auth);

    /**
     * Validate registration fields
     * @returns {Object} - Object containing validation errors, if any
     */
    const validateRegisterFields = () => {
        const errors = {};
        if (!firstName.trim()) {
            errors.firstName = "First name is required";
        }
        if (!lastName.trim()) {
            errors.lastName = "Last name is required";
        }
        // Simple phone validation: must be at least 10 digits
        if (!phone.trim()) {
            errors.phone = "Phone is required";
        } else if (!/^\d{10,}$/.test(phone.replace(/\D/g, ""))) {
            errors.phone = "Enter a valid phone number";
        }
        return errors;
    };

    /**
     * Handles email/password authentication for both sign-in and registration
     * @param {Event} e - Form submission event
     */
    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setVerificationSent(false);

        if (isRegister) {
            const errors = validateRegisterFields();
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
            }
        }

        console.log('📧 Email auth form submitted');
        console.log('📧 Auth mode:', isRegister ? 'REGISTER' : 'SIGN_IN');
        console.log('📧 Email:', email);
        console.log('📧 Password length:', password.length);

        setError(''); // Clear any previous errors
        try {
            let userCredential;
            // Switch between registration and sign-in based on current mode
            if (isRegister) {
                console.log('📧 Attempting user registration...');
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('✅ Registration successful:', userCredential.user.uid);

                // Send verification email
                await sendEmailVerification(userCredential.user);
                console.log('✅ Verification email sent.');
                setVerificationSent(true);
                setPendingEmail(email);
                clearForm(); // Clear fields after successful registration submission

                // Sign out the user to force them to verify before logging in
                await auth.signOut();
                return; // Stop further execution
            } else {
                console.log('📧 Attempting user sign-in...');
                userCredential = await signInWithEmailAndPassword(auth, email, password);

                // Check if email is verified
                if (!userCredential.user.emailVerified) {
                    setError('Please verify your email address before signing in. Check your inbox for a verification link.');
                    setPendingEmail(email); // Set for potential resend
                    setVerificationSent(true); // Show the resend button
                    await auth.signOut(); // Prevent access
                    return;
                }
                console.log('✅ Sign-in successful:', userCredential.user.uid);
            }

            console.log('👤 User object:', {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName
            });

            // Call parent callback with user ID on successful authentication
            if (onSignIn) {
                console.log('🔄 Calling onSignIn callback with UID:', userCredential.user.uid);
                onSignIn(userCredential.user.uid);
            } else {
                console.warn('⚠️ No onSignIn callback provided');
            }
        } catch (err) {
            console.error('❌ Email auth error:', err);
            console.error('❌ Error code:', err.code);
            console.error('❌ Error message:', err.message);
            setError(err.message); // Display Firebase error message to user
        }
    };

    /**
     * Handles Google OAuth sign-in using popup window
     */
    const handleGoogleSignIn = async () => {
        console.log('🔵 Google sign-in button clicked');
        setError(''); // Clear any previous errors
        try {
            console.log('🔵 Creating Google auth provider...');
            const provider = new GoogleAuthProvider();
            console.log('🔵 Opening Google sign-in popup...');
            const result = await signInWithPopup(auth, provider);

            console.log('✅ Google sign-in successful');
            console.log('👤 Google user object:', {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL
            });

            // Call parent callback with user ID on successful authentication
            if (onSignIn) {
                console.log('🔄 Calling onSignIn callback with UID:', result.user.uid);
                onSignIn(result.user.uid);
            } else {
                console.warn('⚠️ No onSignIn callback provided');
            }
        } catch (err) {
            console.error('❌ Google sign-in error:', err);
            console.error('❌ Error code:', err.code);
            console.error('❌ Error message:', err.message);
            setError(err.message); // Display Firebase error message to user
        }
    };

    // Helper to clear all fields and errors
    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setError('');
        setFieldErrors({});
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-gray-800/90 rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center">
                <DogIcon className="w-14 h-14 text-amber-400 mb-4" />
                {/* <RoxyLogo height="56" width="56" text-amber-400 className="mb-4" /> */}

                <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Humidor Hub</h1>
                <p className="text-gray-400 mb-6 text-center">Your personal cigar collection companion</p>
                <h2 className="text-xl font-bold text-white mb-4">{isRegister ? 'Create Account' : 'Sign In'}</h2>

                {verificationSent && !isRegister && (
                    <div className="bg-amber-100 text-amber-800 rounded-md p-3 mb-4 text-center text-sm w-full">
                        A verification link was sent to <b>{pendingEmail}</b>. Please check your inbox.
                    </div>
                )}
                {verificationSent && isRegister && (
                    <div className="bg-green-100 text-green-800 rounded-md p-3 mb-4 text-center text-sm w-full">
                        Registration successful! A verification link has been sent to <b>{pendingEmail}</b>. Please verify your email before signing in.
                    </div>
                )}

                <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 w-full">
                    {/* Show extra fields only when registering */}
                    {isRegister && (
                        <>
                            <input
                                className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                            />
                            {fieldErrors.firstName && (
                                <div className="text-red-400 text-xs mb-1">{fieldErrors.firstName}</div>
                            )}
                            <input
                                className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                            />
                            {fieldErrors.lastName && (
                                <div className="text-red-400 text-xs mb-1">{fieldErrors.lastName}</div>
                            )}
                            <input
                                className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                type="tel"
                                placeholder="Phone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                            />
                            {fieldErrors.phone && (
                                <div className="text-red-400 text-xs mb-1">{fieldErrors.phone}</div>
                            )}
                        </>
                    )}
                    <input
                        className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <div className="relative">
                        <input
                            className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 w-full pr-12"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 focus:outline-none"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                // Eye-off icon (SVG)
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M6.343 6.343A7.963 7.963 0 004 12c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938M17.657 17.657A7.963 7.963 0 0020 12c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                // Eye icon (SVG)
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-md shadow transition-colors" type="submit">
                        {isRegister ? 'Register' : 'Sign In'}
                    </button>
                </form>
                <div className="my-4 flex items-center w-full">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="mx-3 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full flex items-center justify-center gap-2 shadow transition-colors"
                    onClick={handleGoogleSignIn}
                    type="button"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.5h11.84c-.5 3.24-2.08 6.04-4.38 7.9v5.5h7.08c4.14-3.82 6.56-9.47 6.56-16.4z"></path>
                        <path fill="#34A853" d="M24 46c6.5 0 12-2.14 16-5.7l-7.08-5.5c-2.16 1.45-4.92 2.3-8.92 2.3-6.86 0-12.7-4.6-14.78-10.8H2.06v5.68C6.06 41.44 14.38 46 24 46z"></path>
                        <path fill="#FBBC05" d="M9.22 28.4c-.38-1.13-.6-2.3-.6-3.5s.22-2.37.6-3.5V15.7H2.06C.76 18.24 0 21.04 0 24s.76 5.76 2.06 8.3l7.16-5.6z"></path>
                        <path fill="#EA4335" d="M24 10.3c3.52 0 6.62 1.2 9.08 3.5l6.28-6.28C36 2.28 30.5 0 24 0 14.38 0 6.06 4.56 2.06 11.2l7.16 5.7c2.08-6.2 7.92-10.6 14.78-10.6z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    Sign in with Google
                </button>
                <button
                    className="mt-4 text-amber-400 underline text-sm"
                    onClick={() => {
                        setIsRegister((prev) => {
                            const next = !prev;
                            clearForm();
                            setVerificationSent(false);
                            setPendingEmail('');
                            return next;
                        });
                    }}
                    type="button"
                >
                    {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                </button>
                {error && <div className="mt-3 text-red-400 text-center">{error}</div>}
            </div>
            <div className="mt-8 text-gray-500 text-xs text-center">
                &copy; {new Date().getFullYear()} Humidor Hub &mdash; Secure, private, and for aficionados only.
            </div>
        </div>
    );
}