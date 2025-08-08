/**
 * @file useFirebaseAuth.js
 * @path src/hooks/useFirebaseAuth.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date January 8, 2025
 *
 * Firebase Authentication Hook
 *
 * Custom hook that handles Firebase initialization, authentication state,
 * and emulator connections. Extracts all Firebase auth logic from App.js
 * to improve separation of concerns and reusability.
 */

import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { firebaseConfigExport } from '../firebase';

const DEBUG = process.env.NODE_ENV === 'development';
const log = DEBUG ? console.log : () => {};

export const useFirebaseAuth = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeFirebase = async () => {
            log('🔥 Firebase initialization starting...');
            
            try {
                // Check if the Firebase config object is available
                if (Object.keys(firebaseConfigExport).length === 0) {
                    throw new Error("Firebase config is empty. App cannot initialize.");
                }

                // Initialize the Firebase app
                const app = initializeApp(firebaseConfigExport);
                log('✅ Firebase app initialized successfully');

                // Get instances of Firestore and Authentication services
                const firestoreDb = getFirestore(app);
                const firebaseAuth = getAuth(app);

                // Connect to emulators in local development
                const isLocalDev = window.location.hostname === 'localhost';
                if (isLocalDev) {
                    log('🏠 Local development detected - using emulators');
                    connectAuthEmulator(firebaseAuth, "http://localhost:9099");
                    connectFirestoreEmulator(firestoreDb, 'localhost', 8080);
                } else {
                    log('☁️ Production environment - using live Firebase');
                }

                // Set the initialized instances to state
                setDb(firestoreDb);
                setAuth(firebaseAuth);
                log('🔗 Firebase instances set to state');

                // Handle authentication state changes
                const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                    log('👤 Auth state changed:', user ? `User: ${user.uid}` : 'No user');
                    
                    if (user) {
                        log('🔐 User authentication successful:', {
                            uid: user.uid,
                            isAnonymous: user.isAnonymous,
                            provider: user.providerData[0]?.providerId || 'anonymous'
                        });
                        setUserId(user.uid);
                        setIsLoading(false);
                    } else {
                        await handleSignIn(firebaseAuth, isLocalDev);
                    }
                });

                return unsubscribe;
            } catch (error) {
                console.error("Firebase initialization failed:", error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        initializeFirebase();
    }, []);

    const handleSignIn = async (firebaseAuth, isLocalDev) => {
        const initialAuthToken = typeof window !== "undefined" && window.initialAuthToken ? window.initialAuthToken : null;
        
        try {
            if (isLocalDev || !initialAuthToken) {
                log('🔄 Starting anonymous sign-in process...');
                await signInAnonymously(firebaseAuth);
                log('✅ Anonymous sign-in completed');
            } else {
                log('🎫 Starting custom token sign-in...');
                try {
                    await signInWithCustomToken(firebaseAuth, initialAuthToken);
                    log('✅ Custom token sign-in successful');
                } catch (error) {
                    console.error("Failed to sign in with custom token:", error);
                    log('⚠️ Custom token failed, falling back to anonymous');
                    await signInAnonymously(firebaseAuth);
                }
            }
        } catch (error) {
            console.error("Sign-in failed:", error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    return {
        db,
        auth,
        userId,
        isLoading,
        error
    };
};