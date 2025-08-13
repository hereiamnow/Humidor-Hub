// File: FontsScreen.js
// Path: src/screens/FontsScreen.js
// Project: Humidor Hub
// Author: Extracted from App.js
// Date: July 23, 2025

// Description:
// A dedicated screen for font customization that allows users to preview and apply
// different font combinations throughout the app. Features local preview state management,
// save/cancel functionality, and integrates with the FontPicker component for font selection.
// Provides a user-friendly interface for typography customization with live preview capabilities.

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import FontPicker from './FontPicker';

import { useAppContext } from '../../../contexts/AppContext';

const FontsScreen = ({ navigate }) => {
    const { selectedFont, setSelectedFont } = useAppContext();
    // Local state for the font preview. Initialized with the currently active app font.
    const [previewFont, setPreviewFont] = useState(selectedFont);

    // Handler to save the selected preview font as the new app-wide font.
    const handleSaveChanges = () => {
        setSelectedFont(previewFont);
        navigate('Settings'); // Go back to settings after saving.
    };

    return (
        <div
            id="pnlContentWrapper_FontsScreen"
            className="p-4 pb-24">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('Settings')} className="p-2 -ml-2 mr-2">
                    <ChevronLeft className="w-7 h-7 text-base-content" />
                </button>
                <h1 className="text-3xl font-bold text-base-content">Fonts</h1>
            </div>
            <div className="bg-base-200 rounded-lg p-4">
                {/* Pass the local preview state and its setter to the FontPicker */}
                <FontPicker selectedFont={previewFont} setSelectedFont={setPreviewFont} />
            </div>
            <p className="mt-6 text-base-content/70 text-sm">
                Choose your preferred font combination for the app. This will change the look and feel of all text throughout Humidor Hub.
            </p>
            {/* Save Changes Button */}
            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleSaveChanges}
                    className="btn btn-primary w-full"
                >
                    Save Changes
                </button>
                <button
                    onClick={() => navigate('Settings')}
                    className="btn btn-ghost w-full"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default FontsScreen;