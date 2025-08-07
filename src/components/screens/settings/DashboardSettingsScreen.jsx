// File: DashboardSettingsScreen.js
// Path: src/screens/DashboardSettingsScreen.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 24, 2025
// Time: 3:30 PM CDT

// Description:
// DashboardSettingsScreen component provides user interface for customizing dashboard panel visibility
// in the Humidor Hub application. Features include toggle switches for controlling the display of
// various dashboard components such as Inventory Analysis, Interactive World Map, Browse by Wrapper,
// Browse by Strength, Browse by Country, and Aging Well panels. The component uses a clean toggle
// switch interface with visual feedback and integrates with the application's theme system. Changes
// are immediately applied to the dashboard panel visibility state, allowing users to personalize
// their dashboard experience by showing or hiding specific analytical and browsing panels.

import React from 'react';
import { ChevronLeft } from 'lucide-react';

const DashboardSettingsScreen = ({ navigate, dashboardPanelVisibility, setDashboardPanelVisibility }) => {
    const ToggleSwitch = ({ id, label, isChecked, onToggle }) => (
        <div className="form-control">
            <label htmlFor={id} className="label cursor-pointer">
                <span className="label-text">{label}</span>
                <input
                    id={id}
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={isChecked}
                    onChange={onToggle}
                />
            </label>
        </div>
    );

    return (
        <div
            id="pnlContentWrapper_DashboardSettingsScreen"
            className="p-4 pb-24">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('Settings')} className="btn btn-ghost btn-square -ml-2 mr-2">
                    <ChevronLeft className="w-7 h-7" />
                </button>
                <h1 className="text-3xl font-bold text-base-content">Dashboard Components</h1>
            </div>
            <p className="text-base-content/70 mb-4 leading-relaxed">
                Customize your dashboard by choosing which components to display. Toggle any component on or off to
                personalize your Humidor-Hub experience.
            </p>
            <div className="bg-base-200 p-4 rounded-box space-y-2">
                <ToggleSwitch
                    id="tsAchievements"
                    label="Achievements"
                    isChecked={dashboardPanelVisibility.showAchievements}
                    onToggle={() => setDashboardPanelVisibility(prev => ({ ...prev, showAchievements: !prev.showAchievements }))}
                />
                <ToggleSwitch
                    id="tsAgingWell"
                    label="Aging Well / From the Cellar"
                    isChecked={dashboardPanelVisibility.showAgingWellPanel}
                    onToggle={() => setDashboardPanelVisibility(prev => ({ ...prev, showAgingWellPanel: !prev.showAgingWellPanel }))}
                />
                <ToggleSwitch
                    id="tsInventoryAnalysis"
                    label="Inventory Analysis"
                    isChecked={dashboardPanelVisibility.showInventoryAnalysis}
                    onToggle={() => setDashboardPanelVisibility(prev => ({ ...prev, showInventoryAnalysis: !prev.showInventoryAnalysis }))}
                />
                <ToggleSwitch
                    id="tsWorldMap"
                    label="Interactive World Map"
                    isChecked={dashboardPanelVisibility.showWorldMap}
                    onToggle={() => setDashboardPanelVisibility(prev => ({ ...prev, showWorldMap: !prev.showWorldMap }))}
                />
                <ToggleSwitch
                    id="tsCountryPanel"
                    label="Browse by Country"
                    isChecked={dashboardPanelVisibility.showCountryPanel}
                    onToggle={() => setDashboardPanelVisibility(prev => ({ ...prev, showCountryPanel: !prev.showCountryPanel }))}
                />
                <ToggleSwitch
                    id="tsWrapperPanel"
                    label="Browse by Wrapper"
                    isChecked={dashboardPanelVisibility.showWrapperPanel}
                    onToggle={() => setDashboardPanelVisibility(prev => ({ ...prev, showWrapperPanel: !prev.showWrapperPanel }))}
                />
                <ToggleSwitch
                    id="tsStrengthPanel"
                    label="Browse by Strength"
                    isChecked={dashboardPanelVisibility.showStrengthPanel}
                    onToggle={() => setDashboardPanelVisibility(prev => ({ ...prev, showStrengthPanel: !prev.showStrengthPanel }))}
                />
            </div>
        </div>
    );
};

export default DashboardSettingsScreen;