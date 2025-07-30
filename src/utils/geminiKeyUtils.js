// File: geminiKeyUtils.js
// Path: src/utils/geminiKeyUtils.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 27, 2025

/**
 * Utility functions for managing and checking Gemini API keys
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Constants
const API_KEY_COLLECTION = 'userSettings';
const API_KEY_PATTERN = /^[A-Za-z0-9_-]{20,}$/;

/**
 * Checks if a user has a valid Gemini API key stored in Firebase
 * @param {string} userId - The user's Firebase Auth UID
 * @returns {Promise<boolean>} - True if user has a valid API key
 */
export const hasValidGeminiKey = async (userId) => {
    if (!userId) {
        console.log('geminiKeyUtils: No user ID provided');
        return false;
    }

    try {
        console.log('geminiKeyUtils: Checking for API key for user:', userId);
        const userDocRef = doc(db, API_KEY_COLLECTION, userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.log('geminiKeyUtils: No user document found');
            return false;
        }

        const data = userDoc.data();
        const apiKey = data?.geminiApiKey;

        if (!apiKey) {
            console.log('geminiKeyUtils: No API key found in user document');
            return false;
        }

        const isValid = API_KEY_PATTERN.test(apiKey);
        console.log('geminiKeyUtils: API key validation result:', isValid);
        return isValid;

    } catch (error) {
        console.error('geminiKeyUtils: Error checking API key:', error);
        return false;
    }
};

/**
 * Gets the user's Gemini API key from Firebase
 * @param {string} userId - The user's Firebase Auth UID
 * @returns {Promise<string|null>} - The API key or null if not found
 */
export const getUserGeminiKey = async (userId) => {
    if (!userId) {
        console.log('geminiKeyUtils: No user ID provided');
        return null;
    }

    try {
        console.log('geminiKeyUtils: Getting API key for user:', userId);
        const userDocRef = doc(db, API_KEY_COLLECTION, userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.log('geminiKeyUtils: No user document found');
            return null;
        }

        const data = userDoc.data();
        const apiKey = data?.geminiApiKey;

        if (!apiKey) {
            console.log('geminiKeyUtils: No API key found in user document');
            return null;
        }

        console.log('geminiKeyUtils: API key found, length:', apiKey.length);
        return apiKey;

    } catch (error) {
        console.error('geminiKeyUtils: Error getting API key:', error);
        return null;
    }
};