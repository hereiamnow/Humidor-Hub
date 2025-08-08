/**
 * @file AppRouter.jsx
 * @path src/components/AppRouter.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 1, 2025
 *
 * Application Router Component
 *
 * Handles screen rendering logic based on navigation state.
 * Centralizes all screen routing and parameter passing.
 */

import React from 'react';
import { LoaderCircle } from 'lucide-react';

// Import all screen components
import AddCigar from './Screens/Cigar/AddCigar';
import AddHumidor from './Screens/Humidor/AddHumidor';
import AlertsScreen from './Screens/AlertsScreen';
import CigarDetail from './Screens/Cigar/CigarDetail';
import Dashboard from './Screens/Dashboard';
import DashboardSettingsScreen from './Screens/Settings/DashboardSettingsScreen';
import DataSyncScreen from './Screens/Settings/DataSyncScreen';
import DeeperStatisticsScreen from './Screens/Settings/DeeperStatisticsScreen';
import EditCigar from './Screens/Cigar/EditCigar';
import EditHumidor from './Screens/Humidor/EditHumidor';
import FontsScreen from './Screens/Settings/FontsScreen';
import HumidorsScreen from './Screens/MyHumidors';
import IntegrationsScreen from './Screens/Settings/IntegrationsScreen';
import MyHumidor from './Screens/Humidor/MyHumidor';
import SettingsScreen from './Screens/SettingsScreen';
import AddEditJournalEntry from './Screens/Journal/AddEditJournalEntry';
import CigarJournalScreen from './Screens/JournalScreen';
import AboutScreen from './Screens/Settings/AboutScreen';
import NotificationsScreen from './Screens/Settings/NotificationsScreen';
import ProfileScreen from './Screens/Settings/ProfileScreen';
import SubscriptionScreen from './Screens/Settings/SubscriptionScreen';

const DEBUG = process.env.NODE_ENV === 'development';
const log = DEBUG ? console.log : () => { };

const AppRouter = ({
    navigation,
    navigate,
    cigars,
    humidors,
    journalEntries,
    db,
    appId,
    userId,
    auth,
    isLoading,
    dashboardPanelVisibility,
    setDashboardPanelVisibility,
    dashboardPanelStates,
    setDashboardPanelStates,
    selectedFont,
    setSelectedFont,
    goveeApiKey,
    setGoveeApiKey,
    goveeDevices,
    setGoveeDevices
}) => {
    const { screen, params } = navigation;

    log('🖥️ Rendering screen:', screen, 'with params:', params);

    // Show loading screen while Firebase is initializing
    if (isLoading) {
        log('⏳ Showing loading screen');
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-base-100">
                <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
                <p className="mt-4 text-base-content">Loading Your Collection...</p>
            </div>
        );
    }

    // Log data availability for screen rendering
    log('📊 Data available for screen:', {
        cigars: cigars.length,
        humidors: humidors.length,
        journalEntries: journalEntries.length
    });

    switch (screen) {
        case 'Dashboard':
            return (
                <Dashboard
                    navigate={navigate}
                    cigars={cigars}
                    humidors={humidors}
                    showWrapperPanel={dashboardPanelVisibility.showWrapperPanel}
                    showStrengthPanel={dashboardPanelVisibility.showStrengthPanel}
                    showCountryPanel={dashboardPanelVisibility.showCountryPanel}
                    showInventoryAnalysis={dashboardPanelVisibility.showInventoryAnalysis}
                    panelStates={dashboardPanelStates}
                    setPanelStates={setDashboardPanelStates}
                    dashboardPanelVisibility={dashboardPanelVisibility}
                />
            );

        case 'HumidorsScreen':
            return (
                <HumidorsScreen
                    navigate={navigate}
                    cigars={cigars}
                    humidors={humidors}
                    db={db}
                    appId={appId}
                    userId={userId}
                    {...params}
                />
            );

        case 'MyHumidor':
            const humidor = humidors.find(h => h.id === params.humidorId);
            log('🏠 MyHumidor lookup:', {
                requestedId: params.humidorId,
                found: !!humidor,
                availableIds: humidors.map(h => h.id)
            });
            return humidor ? (
                <MyHumidor
                    humidor={humidor}
                    navigate={navigate}
                    cigars={cigars}
                    humidors={humidors}
                    db={db}
                    appId={appId}
                    userId={userId}
                />
            ) : (
                <div>Humidor not found</div>
            );

        case 'CigarDetail':
            const cigar = cigars.find(c => c.id === params.cigarId);
            log('🚬 CigarDetail lookup:', {
                requestedId: params.cigarId,
                found: !!cigar,
                availableIds: cigars.map(c => c.id).slice(0, 5)
            });
            return cigar ? (
                <CigarDetail
                    cigar={cigar}
                    navigate={navigate}
                    db={db}
                    appId={appId}
                    userId={userId}
                    journalEntries={journalEntries}
                />
            ) : (
                <div>Cigar not found</div>
            );

        case 'AddCigar':
            return (
                <AddCigar
                    navigate={navigate}
                    db={db}
                    appId={appId}
                    userId={userId}
                    humidorId={params.humidorId}
                    cigars={cigars}
                />
            );

        case 'EditCigar':
            const cigarToEdit = cigars.find(c => c.id === params.cigarId);
            return cigarToEdit ? (
                <EditCigar
                    navigate={navigate}
                    db={db}
                    appId={appId}
                    userId={userId}
                    cigar={cigarToEdit}
                />
            ) : (
                <div>Cigar not found</div>
            );

        case 'Alerts':
            return <AlertsScreen navigate={navigate} humidors={humidors} />;

        case 'Fonts':
            return (
                <FontsScreen
                    navigate={navigate}
                    selectedFont={selectedFont}
                    setSelectedFont={setSelectedFont}
                />
            );

        case 'Settings':
            return (
                <SettingsScreen
                    navigate={navigate}
                    dashboardPanelVisibility={dashboardPanelVisibility}
                    setDashboardPanelVisibility={setDashboardPanelVisibility}
                    selectedFont={selectedFont}
                    setSelectedFont={setSelectedFont}
                />
            );

        case 'AddHumidor':
            return (
                <AddHumidor
                    navigate={navigate}
                    db={db}
                    appId={appId}
                    userId={userId}
                />
            );

        case 'EditHumidor':
            const humidorToEdit = humidors.find(h => h.id === params.humidorId);
            return humidorToEdit ? (
                <EditHumidor
                    navigate={navigate}
                    db={db}
                    appId={appId}
                    userId={userId}
                    humidor={humidorToEdit}
                    goveeApiKey={goveeApiKey}
                    goveeDevices={goveeDevices}
                />
            ) : (
                <div>Humidor not found</div>
            );

        case 'CigarJournal':
            return (
                <CigarJournalScreen
                    navigate={navigate}
                    journalEntries={journalEntries}
                    db={db}
                    appId={appId}
                    userId={userId}
                />
            );

        case 'AddEditJournalEntry':
            const cigarForJournal = cigars.find(c => c.id === params.cigarId);
            const entryToEdit = journalEntries.find(e => e.id === params.entryId);
            return cigarForJournal ? (
                <AddEditJournalEntry
                    navigate={navigate}
                    db={db}
                    appId={appId}
                    userId={userId}
                    cigar={cigarForJournal}
                    existingEntry={entryToEdit}
                />
            ) : (
                <div>Cigar not found for journal entry.</div>
            );

        case 'DashboardSettings':
            return (
                <DashboardSettingsScreen
                    navigate={navigate}
                    dashboardPanelVisibility={dashboardPanelVisibility}
                    setDashboardPanelVisibility={setDashboardPanelVisibility}
                />
            );

        case 'DeeperStatistics':
            return <DeeperStatisticsScreen navigate={navigate} cigars={cigars} />;

        case 'Integrations':
            return (
                <IntegrationsScreen
                    navigate={navigate}
                    goveeApiKey={goveeApiKey}
                    setGoveeApiKey={setGoveeApiKey}
                    goveeDevices={goveeDevices}
                    setGoveeDevices={setGoveeDevices}
                />
            );

        case 'DataSync':
            return (
                <DataSyncScreen
                    navigate={navigate}
                    db={db}
                    appId={appId}
                    userId={userId}
                    cigars={cigars}
                    humidors={humidors}
                />
            );

        case 'Notifications':
            return <NotificationsScreen navigate={navigate} humidors={humidors} />;

        case 'About':
            return <AboutScreen navigate={navigate} />;

        case 'Profile':
            return (
                <ProfileScreen
                    navigate={navigate}
                    cigars={cigars}
                    humidors={humidors}
                    userId={userId}
                    auth={auth}
                />
            );

        case 'Subscription':
            return <SubscriptionScreen navigate={navigate} />;

        default:
            return (
                <Dashboard
                    navigate={navigate}
                    cigars={cigars}
                    humidors={humidors}
                    showWrapperPanel={dashboardPanelVisibility.showWrapperPanel}
                    showStrengthPanel={dashboardPanelVisibility.showStrengthPanel}
                    showCountryPanel={dashboardPanelVisibility.showCountryPanel}
                    showInventoryAnalysis={dashboardPanelVisibility.showInventoryAnalysis}
                    panelStates={dashboardPanelStates}
                    setPanelStates={setDashboardPanelStates}
                />
            );
    }
};

export default AppRouter;