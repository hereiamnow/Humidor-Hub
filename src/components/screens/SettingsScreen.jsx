// File: SettingsScreen.js
// Path: src/screens/SettingsScreen.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 24, 2025
// Time: 4:00 PM CDT

// Description:
// SettingsScreen component provides the main settings navigation interface for the Humidor Hub application.
// Features include organized setting categories with icons, titles, and descriptions for easy navigation.
// The component includes settings for Profile management, Data & Sync operations, Dashboard Components
// customization, Theme selection with modal interface, Font preferences, Deeper Statistics access,
// and About information with version display. Each setting item is presented as a clickable card with
// consistent styling and hover effects. The component integrates with the theme system and provides
// navigation to various settings sub-screens throughout the application.

import React, { useState } from 'react';
import {
    User,
    Database,
    LayoutGrid,
    Palette,
    Info,
    BarChart2,
    Crown,
    Settings as SettingsIcon
} from 'lucide-react';

// Import modal components
import ThemeModal from '../Modals/Content/ThemeModal';
import PageHeader from '../UI/PageHeader';

const SettingsScreen = ({ navigate, theme, setTheme, dashboardPanelVisibility, setDashboardPanelVisibility, selectedFont, setSelectedFont }) => {
    // Debug: Log component props on render
    console.log('SettingsScreen: Component rendered with props:', {
        theme: theme?.name || 'undefined',
        dashboardPanelVisibility,
        selectedFont,
        hasNavigate: typeof navigate === 'function',
        hasSetTheme: typeof setTheme === 'function'
    });

    console.log('SettingsScreen: Full theme object:', theme);
    console.log('SettingsScreen: Dashboard panel visibility settings:', dashboardPanelVisibility);

    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const appVersion = process.env.REACT_APP_VERSION || '1.1.0-dev';

    console.log('SettingsScreen: App version:', appVersion);
    console.log('SettingsScreen: Theme modal state initialized:', isThemeModalOpen);

    const SettingItem = ({ icon: Icon, title, subtitle, onClick }) => {
        console.log('SettingsScreen: SettingItem rendered:', { title, subtitle, hasOnClick: typeof onClick === 'function' });

        const handleClick = () => {
            console.log('SettingsScreen: Setting item clicked:', title);
            if (onClick) {
                console.log('SettingsScreen: Executing onClick for:', title);
                onClick();
            } else {
                console.warn('SettingsScreen: No onClick handler for:', title);
            }
        };

        return (
            <button onClick={handleClick} className="w-full flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors text-left">
                <div className="p-2 bg-gray-700 rounded-full"><Icon className={`w-6 h-6 ${theme.primary}`} /></div>
                <div>
                    <p className={`font-bold ${theme.text}`}>{title}</p>
                    <p className={`text-xs ${theme.subtleText}`}>{subtitle}</p>
                </div>
            </button>
        );
    };

    return (
        <div id="pnlContainerWrapper" className="bg-gray-900 min-h-screen pb-24 px-4 pt-4">


            {isThemeModalOpen && <ThemeModal currentTheme={theme} setTheme={setTheme} onClose={() => setIsThemeModalOpen(false)} />}

            <PageHeader
                icon={SettingsIcon}
                title="Settings"
                subtitle="Text Here"
                theme={theme}
            />

            <div className="space-y-4">
                <SettingItem icon={User} title="Profile" subtitle="Manage your account details" onClick={() => navigate('Profile')} />
                <SettingItem icon={Crown} title="Subscription" subtitle="Manage your plan and billing" onClick={() => navigate('Subscription')} />
                <SettingItem icon={Database} title="Data & Sync" subtitle="Export or import your collection" onClick={() => navigate('DataSync')} />
                <SettingItem icon={LayoutGrid} title="Dashboard Components" subtitle="Customize what appears on your dashboard" onClick={() => navigate('DashboardSettings')} />
                {/* <SettingItem icon={Bell} title="Notifications" subtitle="Set up alerts for humidity and temp" onClick={() => navigate('Notifications')} /> */}
                {/* <SettingItem icon={Zap} title="Integrations" subtitle="Connect to Govee and other services" onClick={() => navigate('Integrations')} /> */}
                <SettingItem icon={Palette} title="Theme" subtitle={`Current: ${theme.name}`} onClick={() => {
                    console.log('SettingsScreen: Opening theme modal, current theme:', theme.name);
                    setIsThemeModalOpen(true);
                }} />
                <SettingItem icon={Info} title="Fonts" subtitle="Choose your preferred font combination" onClick={() => navigate('Fonts')} disabled={true} />
                <SettingItem icon={BarChart2} title="Deeper Statistics & Insights" subtitle="Explore advanced stats about your collection" onClick={() => navigate('DeeperStatistics')} />
                <SettingItem icon={Info} title="About Humidor Hub" subtitle={`Version ${appVersion}`} onClick={() => navigate('About')} />
            </div>
        </div>
    );
};

export default SettingsScreen;