/**
 * @file useFirestoreData.js
 * @path src/hooks/useFirestoreData.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date January 8, 2025
 *
 * Firestore Data Management Hook
 *
 * Custom hook that handles real-time data synchronization for cigars,
 * humidors, and journal entries. Provides loading states and error handling
 * for all Firestore collections.
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";

const DEBUG = process.env.NODE_ENV === 'development';
const log = DEBUG ? console.log : () => {};

export const useFirestoreData = (db, userId, appId) => {
    const [cigars, setCigars] = useState([]);
    const [humidors, setHumidors] = useState([]);
    const [journalEntries, setJournalEntries] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [dataError, setDataError] = useState(null);

    useEffect(() => {
        if (!db || !userId || !appId) {
            log('⏳ Waiting for database, user ID, and app ID...', { db: !!db, userId, appId });
            return;
        }

        log('📡 Setting up Firestore listeners for user:', userId);
        setIsDataLoading(true);

        const unsubscribers = [];

        try {
            // Set up humidors listener
            const humidorsCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'humidors');
            const unsubscribeHumidors = onSnapshot(
                humidorsCollectionRef, 
                (snapshot) => {
                    log('🏠 Humidors data updated:', snapshot.docs.length, 'items');
                    const humidorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setHumidors(humidorsData);
                }, 
                (error) => {
                    console.error("Error fetching humidors:", error);
                    setDataError(error.message);
                }
            );
            unsubscribers.push(unsubscribeHumidors);

            // Set up cigars listener
            const cigarsCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'cigars');
            const unsubscribeCigars = onSnapshot(
                cigarsCollectionRef, 
                (snapshot) => {
                    log('🚬 Cigars data updated:', snapshot.docs.length, 'items');
                    const cigarsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setCigars(cigarsData);
                    setIsDataLoading(false); // Set loading to false after initial cigar data
                    log('✅ Initial data load complete');
                }, 
                (error) => {
                    console.error("Error fetching cigars:", error);
                    setDataError(error.message);
                    setIsDataLoading(false);
                }
            );
            unsubscribers.push(unsubscribeCigars);

            // Set up journal entries listener
            const journalEntriesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'journalEntries');
            const unsubscribeJournalEntries = onSnapshot(
                journalEntriesCollectionRef, 
                (snapshot) => {
                    log('📔 Journal entries updated:', snapshot.docs.length, 'items');
                    const entriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setJournalEntries(entriesData);
                }, 
                (error) => {
                    console.error("Error fetching journal entries:", error);
                    setDataError(error.message);
                }
            );
            unsubscribers.push(unsubscribeJournalEntries);

        } catch (error) {
            console.error("Error setting up Firestore listeners:", error);
            setDataError(error.message);
            setIsDataLoading(false);
        }

        // Cleanup function
        return () => {
            log('🧹 Cleaning up Firestore listeners...');
            unsubscribers.forEach(unsubscribe => unsubscribe());
        };
    }, [db, userId, appId]);

    return {
        cigars,
        humidors,
        journalEntries,
        isDataLoading,
        dataError
    };
};