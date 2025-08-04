/**
 *
 * @file App.js
 * @path src/App.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 1, 2025
 *
 * Main Application Component
 *
 * The root component for the Humidor Hub app. Handles Firebase initialization, authentication, and real-time data sync for cigars, humidors, and journal entries. Manages navigation, theming, and dashboard state. Renders all major screens and panels, and provides the main entry point for the user interface.
 *
 * Next Features:
 * - Implement drag-and-drop reordering for the dashboard panels on desktop.
 * - Persist the user's custom panel order to local storage.
 * - Enhance error handling with user-friendly messages for all API calls and database operations.
 * - Add more robust input validation for all forms.
 * - Give the user the option to reset the date when moving cigars to a new humidor.
 * - Implement a "Cigar of the Day" feature that highlights a random cigar from the user's collection each day picked by Roxy.
 * - Implement Firebase Storage integration for image uploads.
 * - Add user-uploaded image support for cigars and humidors.
 */

// React Core
import React, { useState, useEffect } from 'react';

// Third-party Libraries
import { LoaderCircle } from 'lucide-react';

// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, connectAuthEmulator } from "firebase/auth";
import { getFirestore, collection, onSnapshot, connectFirestoreEmulator } from "firebase/firestore";
import { firebaseConfigExport } from './firebase';
import FirebaseAuthUI from './components/Screens/FirebaseAuthUI';

// Constants
import { fontOptions } from './constants/fontOptions';
import { themes } from './constants/themes';

// Components - Journal0
import AddEditJournalEntry from './components/Screens/journal/AddEditJournalEntry';
import CigarJournalScreen from './components/Screens/JournalScreen';

// Components - Navigation
import BottomNav from './components/Navigation/BottomNav';

// Components - Settings
import AboutScreen from './components/Screens/settings/AboutScreen';
import NotificationsScreen from './components/Screens/settings/NotificationsScreen';
import ProfileScreen from './components/Screens/settings/ProfileScreen';
import SubscriptionScreen from './components/Screens/settings/SubscriptionScreen';

// Subscription Context
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Screens
import AddCigar from './components/Screens/cigar/AddCigar';
import AddHumidor from './components/Screens/humidor/AddHumidor';
import AlertsScreen from './components/Screens/AlertsScreen';
import CigarDetail from './components/Screens/cigar/CigarDetail';
import Dashboard from './components/Screens/Dashboard';
import DashboardSettingsScreen from './components/Screens/settings/DashboardSettingsScreen';
import DataSyncScreen from './components/Screens/settings/DataSyncScreen';
import DeeperStatisticsScreen from './components/Screens/settings/DeeperStatisticsScreen';
import EditCigar from './components/Screens/cigar/EditCigar';
import EditHumidor from './components/Screens/humidor/EditHumidor';
import FontsScreen from './components/Screens/settings/FontsScreen';
import HumidorsScreen from './components/Screens/MyHumidors';
import IntegrationsScreen from './components/Screens/settings/IntegrationsScreen';
import MyHumidor from './components/Screens/humidor/MyHumidor';
import SettingsScreen from './components/Screens/SettingsScreen';
//import RegisterUser from './components/Screens/RegisterUser';

// Initialize Firebase Authentication token
const initialAuthToken = typeof window !== "undefined" && window.initialAuthToken ? window.initialAuthToken : null;

// Debug toggle for development
const DEBUG = process.env.NODE_ENV === 'development';
const log = DEBUG ? console.log : () => { };

export default function App() {
    log('🚀 App component mounted');

    const [navigation, setNavigation] = useState({ screen: 'Dashboard', params: {} });
    const [cigars, setCigars] = useState([]);
    const [humidors, setHumidors] = useState([]);
    const [journalEntries, setJournalEntries] = useState([]);
    // Initialize theme from localStorage or default to "Humidor Hub"
    const [theme, setTheme] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('humidor-hub-theme');
            if (savedTheme) {
                const parsedTheme = JSON.parse(savedTheme);
                // Verify the saved theme still exists in our themes object
                const themeExists = Object.values(themes).find(t => t.name === parsedTheme.name);
                if (themeExists) {
                    log('🎨 Restored theme from localStorage:', parsedTheme.name);
                    return parsedTheme;
                }
            }
        } catch (error) {
            console.warn('Failed to load saved theme:', error);
        }
        log('🎨 Using default theme: Humidor Hub');
        return themes["Humidor Hub"];
    });
    const [goveeApiKey, setGoveeApiKey] = useState('');
    const [goveeDevices, setGoveeDevices] = useState([]);

    const [selectedFont, setSelectedFont] = useState(fontOptions[0]);

    // State for controlling dashboard panel visibility
    // This state will determine which panels are shown in the Dashboard.
    // It is initialized to show all panels by default, will be conditionally overridden in Dashboard component
    const [dashboardPanelVisibility, setDashboardPanelVisibility] = useState({
        showAchievements: true,
        showAgingWellPanel: true,
        showWrapperPanel: false,
        showStrengthPanel: false,
        showCountryPanel: false,
        showInventoryAnalysis: true,
        showWorldMap: false
    });

    // New state to manage the open/closed status of dashboard panels
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

    // This state will hold the Firebase database and authentication instances.
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state for initial data fetch

    // Extract appId from the Firebase configuration to pass as a prop.
    const appId = firebaseConfigExport.appId;

    // Log initial state after component setup
    log('📊 Initial state:', {
        navigation: navigation.screen,
        cigarCount: cigars.length,
        humidorCount: humidors.length,
        isLoading,
        userId,
        appId
    });

    // One-time Firebase initialization and authentication
    useEffect(() => {
        log('🔥 Firebase initialization starting...');
        log('🔧 Firebase config available:', Object.keys(firebaseConfigExport).length > 0);
        log('🌐 Environment:', window.location.hostname);
        log('🎫 Initial auth token present:', !!initialAuthToken);

        try {
            // Check if the Firebase config object is available.
            if (Object.keys(firebaseConfigExport).length === 0) {
                console.error("Firebase config is empty. App cannot initialize.");
                setIsLoading(false);
                return;
            }

            // Initialize the Firebase app with the provided configuration.
            const app = initializeApp(firebaseConfigExport);
            log('✅ Firebase app initialized successfully');

            // Get instances of Firestore and Authentication services.
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);

            // --- LOCAL DEVELOPMENT EMULATOR SETUP ---
            // This checks if the app is running on 'localhost'.
            // If it is, it connects to the local Firebase emulators instead of the live cloud services.
            // This is crucial for development to avoid touching production data.
            const isLocalDev = window.location.hostname === 'localhost';
            if (isLocalDev) {
                log('🏠 Local development detected - using emulators');
                console.log("Connecting to local Firebase emulators...");

                // Connect to the Auth emulator. The default port is 9099.
                connectAuthEmulator(firebaseAuth, "http://localhost:9099");

                // Connect to the Firestore emulator. The default port is 8080.
                connectFirestoreEmulator(firestoreDb, 'localhost', 8080);
            } else {
                log('☁️ Production environment - using live Firebase');
            }
            // --- END OF EMULATOR SETUP ---

            // Set the initialized db and auth instances to state.
            setDb(firestoreDb);
            setAuth(firebaseAuth);
            log('🔗 Firebase instances set to state');

            // Set the Firebase app ID for use in Firestore paths.
            onAuthStateChanged(firebaseAuth, async (user) => {
                log('👤 Auth state changed:', user ? `User: ${user.uid}` : 'No user');
                if (user) {
                    log('🔐 User authentication successful:', {
                        uid: user.uid,
                        isAnonymous: user.isAnonymous,
                        provider: user.providerData[0]?.providerId || 'anonymous'
                    });
                    setUserId(user.uid);
                    console.log("User signed in:", user.uid);
                } else {
                    if (isLocalDev || !initialAuthToken) {
                        // Gemini TODO: App hangs here when loading into Capacitor
                        log('🔄 Starting anonymous sign-in process...');
                        console.log("No user signed in. Using anonymous sign-in.");
                        // Local dev or no token: use anonymous sign-in
                        await signInAnonymously(firebaseAuth);
                        log('✅ Anonymous sign-in completed');
                    } else {
                        // Production with token: use custom token
                        log('🎫 Starting custom token sign-in...');
                        console.log("Using custom auth token for sign-in.");
                        try {
                            await signInWithCustomToken(firebaseAuth, initialAuthToken);
                            log('✅ Custom token sign-in successful');
                        } catch (error) {
                            console.error("Failed to sign in with custom token:", error);
                            log('⚠️ Custom token failed, falling back to anonymous');
                            await signInAnonymously(firebaseAuth);
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Firebase initialization failed:", error);
            setIsLoading(false);
        }
    }, []); // The empty dependency array `[]` ensures this effect runs only once when the component mounts.

    // Effect for fetching data from Firestore
    // This effect runs whenever the `db` or `userId` state changes.
    useEffect(() => {
        // We only proceed if both the database connection and the user ID are available.
        if (db && userId) {
            log('📡 Setting up Firestore listeners for user:', userId);
            log('🏢 App ID:', appId);
            setIsLoading(true); // Set loading to true while we fetch data.

            // Set up a real-time listener for the 'humidors' collection.
            // `onSnapshot` will automatically update the `humidors` state whenever data changes in Firestore.
            const humidorsCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'humidors');
            const unsubscribeHumidors = onSnapshot(humidorsCollectionRef, (snapshot) => {
                log('🏠 Humidors data updated:', snapshot.docs.length, 'items');
                const humidorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                log('🏠 Humidors:', humidorsData.map(h => ({ id: h.id, name: h.name })));
                setHumidors(humidorsData);
            }, (error) => {
                console.error("Error fetching humidors:", error);
            });

            // Set up a real-time listener for the 'cigars' collection.
            const cigarsCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'cigars');
            const unsubscribeCigars = onSnapshot(cigarsCollectionRef, (snapshot) => {
                log('🚬 Cigars data updated:', snapshot.docs.length, 'items');
                const cigarsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                log('🚬 Sample cigar data:', cigarsData.slice(0, 3));
                setCigars(cigarsData);
                setIsLoading(false); // Set loading to false after the initial cigar data is loaded.
                log('✅ Initial data load complete');
            }, (error) => {
                console.error("Error fetching cigars:", error);
                setIsLoading(false);
            });

            // Set up a real-time listener for the 'journalEntries' collection.
            const journalEntriesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'journalEntries');
            const unsubscribeJournalEntries = onSnapshot(journalEntriesCollectionRef, (snapshot) => {
                log('📔 Journal entries updated:', snapshot.docs.length, 'items');
                const entriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setJournalEntries(entriesData);
            }, (error) => {
                console.error("Error fetching journal entries:", error);
            });

            // This is a cleanup function. When the component unmounts (or `db`/`userId` changes),
            // it will detach the listeners to prevent memory leaks.
            return () => {
                log('🧹 Cleaning up Firestore listeners...');
                console.log("Cleaning up Firestore listeners...");
                unsubscribeHumidors();
                console.log("Unsubscribing from humidors updates.");
                unsubscribeCigars();
                console.log("Unsubscribing from cigars updates.");
                unsubscribeJournalEntries();
                console.log("Unsubscribing from journal entries updates.");
            };
        } else {
            log('⏳ Waiting for database and user ID...', { db: !!db, userId });
        }
    }, [db, userId]); // Dependencies for this effect.

    // This effect runs whenever the `navigation` state changes.
    // It is used to scroll the window to the top smoothly when navigating between screens.
    // Scroll to top on navigation change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [navigation]);

    // Function to handle navigation between screens.
    // It takes the screen name and any parameters to pass to that screen.
    const navigate = (screen, params = {}) => {
        log('🧭 Navigation:', { from: navigation.screen, to: screen, params });
        setNavigation({ screen, params });
    };

    // This function determines which screen component to render based on the current navigation state.
    const renderScreen = () => {
        const { screen, params } = navigation;
        log('🖥️ Rendering screen:', screen, 'with params:', params);

        // A loading screen is shown while Firebase is initializing and fetching data.
        if (isLoading) {
            log('⏳ Showing loading screen');
            return (
                <div className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg}`}>
                    <LoaderCircle className={`w-12 h-12 ${theme.primary} animate-spin`} />
                    <p className={`mt-4 ${theme.text}`}>Loading Your Collection...</p>
                </div>
            );
        }

        // Log data availability for screen rendering
        log('📊 Data available for screen:', {
            cigars: cigars.length,
            humidors: humidors.length,
            journalEntries: journalEntries.length
        });

        // A `switch` statement is used to select the correct component.
        switch (screen) {
            case 'Dashboard':
                return <Dashboard navigate={navigate} cigars={cigars}
                    humidors={humidors} theme={theme}
                    showWrapperPanel={dashboardPanelVisibility.showWrapperPanel}
                    showStrengthPanel={dashboardPanelVisibility.showStrengthPanel}
                    showCountryPanel={dashboardPanelVisibility.showCountryPanel}
                    showInventoryAnalysis={dashboardPanelVisibility.showInventoryAnalysis}
                    panelStates={dashboardPanelStates}
                    setPanelStates={setDashboardPanelStates}
                    dashboardPanelVisibility={dashboardPanelVisibility} />;
            case 'HumidorsScreen':
                return <HumidorsScreen navigate={navigate} cigars={cigars} humidors={humidors} db={db} appId={appId} userId={userId} theme={theme} {...params} />;
            case 'MyHumidor':
                const humidor = humidors.find(h => h.id === params.humidorId);
                log('🏠 MyHumidor lookup:', {
                    requestedId: params.humidorId,
                    found: !!humidor,
                    availableIds: humidors.map(h => h.id)
                });
                return humidor ? <MyHumidor humidor={humidor} navigate={navigate} cigars={cigars} humidors={humidors} db={db} appId={appId} userId={userId} theme={theme} /> : <div>Humidor not found</div>;
            case 'CigarDetail':
                const cigar = cigars.find(c => c.id === params.cigarId);
                log('🚬 CigarDetail lookup:', {
                    requestedId: params.cigarId,
                    found: !!cigar,
                    availableIds: cigars.map(c => c.id).slice(0, 5)
                });
                return cigar ? <CigarDetail cigar={cigar} navigate={navigate} db={db} appId={appId} userId={userId} journalEntries={journalEntries} theme={theme} /> : <div>Cigar not found</div>;
            case 'AddCigar':
                return <AddCigar navigate={navigate} db={db} appId={appId} userId={userId} humidorId={params.humidorId} theme={theme} cigars={cigars} />;
            case 'EditCigar':
                const cigarToEdit = cigars.find(c => c.id === params.cigarId);
                return cigarToEdit ? <EditCigar navigate={navigate} db={db} appId={appId} userId={userId} cigar={cigarToEdit} theme={theme} /> : <div>Cigar not found</div>;
            case 'Alerts':
                return <AlertsScreen navigate={navigate} humidors={humidors} />;
            case 'Fonts':
                return <FontsScreen navigate={navigate} selectedFont={selectedFont} setSelectedFont={setSelectedFont} theme={theme} />;
            case 'Settings':
                return <SettingsScreen navigate={navigate} theme={theme} setTheme={handleSetTheme} dashboardPanelVisibility={dashboardPanelVisibility} setDashboardPanelVisibility={setDashboardPanelVisibility} selectedFont={selectedFont} setSelectedFont={setSelectedFont} />;
            case 'AddHumidor':
                return <AddHumidor navigate={navigate} db={db} appId={appId} userId={userId} theme={theme} />;
            case 'EditHumidor':
                const humidorToEdit = humidors.find(h => h.id === params.humidorId);
                return humidorToEdit ? <EditHumidor navigate={navigate} db={db} appId={appId} userId={userId} humidor={humidorToEdit} goveeApiKey={goveeApiKey} goveeDevices={goveeDevices} theme={theme} /> : <div>Humidor not found</div>;
            case 'CigarJournal':
                return <CigarJournalScreen navigate={navigate} journalEntries={journalEntries} theme={theme} db={db} appId={appId} userId={userId} />;
            case 'AddEditJournalEntry':
                const cigarForJournal = cigars.find(c => c.id === params.cigarId);
                const entryToEdit = journalEntries.find(e => e.id === params.entryId);
                return cigarForJournal ? <AddEditJournalEntry navigate={navigate} db={db} appId={appId} userId={userId} cigar={cigarForJournal} existingEntry={entryToEdit} theme={theme} /> : <div>Cigar not found for journal entry.</div>;
            case 'DashboardSettings':
                return <DashboardSettingsScreen navigate={navigate} theme={theme} dashboardPanelVisibility={dashboardPanelVisibility} setDashboardPanelVisibility={setDashboardPanelVisibility} />;
            case 'DeeperStatistics':
                return <DeeperStatisticsScreen navigate={navigate} cigars={cigars} theme={theme} />;
            case 'Integrations':
                return <IntegrationsScreen navigate={navigate} goveeApiKey={goveeApiKey} setGoveeApiKey={setGoveeApiKey} goveeDevices={goveeDevices} setGoveeDevices={setGoveeDevices} theme={theme} />;
            case 'DataSync':
                return <DataSyncScreen navigate={navigate} db={db} appId={appId} userId={userId} cigars={cigars} humidors={humidors} />;
            case 'Notifications':
                return <NotificationsScreen navigate={navigate} humidors={humidors} />;
            case 'About':
                return <AboutScreen navigate={navigate} />;
            case 'Profile':
                return <ProfileScreen navigate={navigate} cigars={cigars} humidors={humidors} theme={theme} userId={userId} auth={auth} />;
            case 'Subscription':
                return <SubscriptionScreen navigate={navigate} theme={theme} />;
            // case 'RegisterUser':
            //     return <RegisterUser navigate={navigate} />;
            default:
                return <Dashboard navigate={navigate} cigars={cigars} humidors={humidors} theme={theme} showWrapperPanel={dashboardPanelVisibility.showWrapperPanel} showStrengthPanel={dashboardPanelVisibility.showStrengthPanel} showCountryPanel={dashboardPanelVisibility.showCountryPanel} showInventoryAnalysis={dashboardPanelVisibility.showInventoryAnalysis} panelStates={dashboardPanelStates} setPanelStates={setDashboardPanelStates} />;
        }
    }; //end of renderScreen function

    // Add state monitoring effects
    useEffect(() => {
        log('📈 State update - Cigars:', cigars.length);
    }, [cigars]);

    useEffect(() => {
        log('🏠 State update - Humidors:', humidors.length);
    }, [humidors]);

    // Save theme to localStorage whenever it changes
    useEffect(() => {
        log('🎨 Theme changed:', theme.name || 'Unknown theme');
        try {
            localStorage.setItem('humidor-hub-theme', JSON.stringify(theme));
            log('💾 Theme saved to localStorage:', theme.name);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }, [theme]);

    // Create a wrapper function for setTheme that handles persistence
    const handleSetTheme = (newTheme) => {
        log('🎨 Setting new theme:', newTheme.name);
        setTheme(newTheme);
    };

    // If the user is not signed in and Firebase auth is available, show the Firebase Auth UI.
    // This component handles user authentication.
    if (!userId && auth) {
        log('🔐 Showing Firebase Auth UI');
        return <FirebaseAuthUI auth={auth} onSignIn={setUserId} />;
    }

    // Final render logging
    log('🎯 Final render with:', {
        userId,
        authAvailable: !!auth,
        currentScreen: navigation.screen,








































































































        
        themeLoaded: !!theme
    });

    // The main return statement for the App component.

    // min - h - screen:
    // This is a Tailwind CSS utility class.
    // It sets the minimum height of the element to the height of the viewport(the visible part of the browser window).
    // This ensures your app always fills the screen vertically, even if there isn’t much content.
    return (
        <SubscriptionProvider db={db} appId={appId} userId={userId}>
            <div
                className={`min-h-screen bg-gray-900 text-white`}
                style={{
                    fontFamily: selectedFont.body,
                }}
            >

                {/* 
                max-w-md:
                Sets the maximum width of the content to a medium size (by default, 28rem or 448px in Tailwind).
                This keeps your content from stretching too wide on large screens, improving readability.

                mx-auto:
                Applies automatic left and right margins, centering the content horizontally. 
                */}
                <div className="max-w-md mx-auto">
                    {renderScreen()}
                </div>
                <BottomNav activeScreen={navigation.screen} navigate={navigate} theme={theme} />
            </div>
        </SubscriptionProvider>
    );
}
