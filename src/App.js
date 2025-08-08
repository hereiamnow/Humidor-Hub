/**
 * @file App.js
 * @path src/App.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date January 8, 2025
 *
 * Main Application Component (Refactored)
 *
 * Simplified root component that orchestrates the application using custom hooks
 * and dedicated components. Handles high-level state management and provides
 * the main application structure with proper separation of concerns.
 */

import React, { useState } from 'react';

// Custom Hooks
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useFirestoreData } from './hooks/useFirestoreData';
import { useNavigation } from './hooks/useNavigation';

// Components
import AppRouter from './components/AppRouter';
import BottomNav from './components/Navigation/BottomNav';
import FirebaseAuthUI from './components/Screens/FirebaseAuthUI';

// Contexts
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Constants
import { fontOptions } from './constants/fontOptions';
import { firebaseConfigExport } from './firebase';

export default function App() {
// Check Mobile
    const isMobile = !!window.Capacitor;


    // Firebase authentication and database
    const { db, auth, userId, isLoading: authLoading, error: authError } = useFirebaseAuth();
    
    // Navigation state
    const { navigation, navigate } = useNavigation('Dashboard');
    
    // Firestore data
    const { 
        cigars, 
        humidors, 
        journalEntries, 
        isDataLoading, 
        dataError 
    } = useFirestoreData(db, userId, firebaseConfigExport.appId);

    // Application state
    const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
    const [goveeApiKey, setGoveeApiKey] = useState('');
    const [goveeDevices, setGoveeDevices] = useState([]);

    // Dashboard panel visibility state
    const [dashboardPanelVisibility, setDashboardPanelVisibility] = useState({
        showAchievements: true,
        showAgingWellPanel: true,
        showWrapperPanel: false,
        showStrengthPanel: false,
        showCountryPanel: false,
        showInventoryAnalysis: true,
        showWorldMap: false
    });

    // Dashboard panel states (open/closed)
    const [dashboardPanelStates, setDashboardPanelStates] = useState({
        roxy: true,
        liveEnvironment: true,
        inventoryAnalysis: true,
        wrapper: true,
        strength: true,
        country: true,
        worldMap: true,
        agingWell: true
    });

    // Handle authentication errors
    if (authError) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-base-100">
                <p className="text-error">Authentication Error: {authError}</p>
            </div>
        );
    }

    // Handle data errors
    if (dataError) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-base-100">
                <p className="text-error">Data Error: {dataError}</p>
            </div>
        );
    }

    // Show Firebase Auth UI if user is not signed in
    if (!userId && auth) {
        return <FirebaseAuthUI auth={auth} onSignIn={() => {}} />;
    }

    const isLoading = authLoading || isDataLoading;

    return (
        <SubscriptionProvider db={db} appId={firebaseConfigExport.appId} userId={userId}>
            <div
                className="min-h-screen bg-base-100 text-base-content"
                style={{
                    fontFamily: selectedFont.body,
                }}
            >
                <div className="max-w-md mx-auto">
                    <AppRouter
                        navigation={navigation}
                        navigate={navigate}
                        cigars={cigars}
                        humidors={humidors}
                        journalEntries={journalEntries}
                        db={db}
                        appId={firebaseConfigExport.appId}
                        userId={userId}
                        auth={auth}
                        isLoading={isLoading}
                        dashboardPanelVisibility={dashboardPanelVisibility}
                        setDashboardPanelVisibility={setDashboardPanelVisibility}
                        dashboardPanelStates={dashboardPanelStates}
                        setDashboardPanelStates={setDashboardPanelStates}
                        selectedFont={selectedFont}
                        setSelectedFont={setSelectedFont}
                        goveeApiKey={goveeApiKey}
                        setGoveeApiKey={setGoveeApiKey}
                        goveeDevices={goveeDevices}
                        setGoveeDevices={setGoveeDevices}
                    />
                </div>
                <BottomNav activeScreen={navigation.screen} navigate={navigate} />
            </div>
        </SubscriptionProvider>
    );
}
