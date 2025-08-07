/**
 *
 * @file ThemeModal.jsx
 * @path src/components/Modals/Content/ThemeModal.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * Enhanced Theme Modal Component
 *
 * Modal dialog for selecting and previewing application themes with DaisyUI integration.
 * Features dynamic color synchronization, dark/light mode toggling, and enhanced UI.
 *
 * @param {Object} props - Component props
 * @param {Object} props.currentTheme - The currently selected theme object
 * @param {Function} props.setTheme - Callback to set the selected theme
 * @param {Function} props.onClose - Callback to close the modal
 *
 */

import React, { useState, useEffect } from 'react';
import { X, Box, Sun, Moon } from 'lucide-react';
import { applyDaisyUITheme, getCurrentDaisyUITheme } from '../../../utils/themeUtils';

const ThemeModal = ({ onClose }) => {
    const [selectedThemeName, setSelectedThemeName] = useState(getCurrentDaisyUITheme());
    const [isDarkMode, setIsDarkMode] = useState(true);

    // DaisyUI themes with enhanced metadata
    const daisyUIThemes = {
        light: { name: 'Light', isDark: false, daisyUI: 'light', primary: '#570df8', secondary: '#f000b8', accent: '#37cdbe', neutral: '#3d4451', base: '#ffffff' },
        dark: { name: 'Dark', isDark: true, daisyUI: 'dark', primary: '#661ae6', secondary: '#d926aa', accent: '#1fb2a5', neutral: '#191d24', base: '#2a303c' },
        cupcake: { name: 'Cupcake', isDark: false, daisyUI: 'cupcake', primary: '#65c3c8', secondary: '#ef9fbc', accent: '#eeaf3a', neutral: '#291334', base: '#faf7f5' },
        bumblebee: { name: 'Bumblebee', isDark: false, daisyUI: 'bumblebee', primary: '#e0a82e', secondary: '#f9d72f', accent: '#181830', neutral: '#181830', base: '#ffffff' },
        emerald: { name: 'Emerald', isDark: false, daisyUI: 'emerald', primary: '#66cc8a', secondary: '#377cfb', accent: '#ea5234', neutral: '#333c4d', base: '#ffffff' },
        corporate: { name: 'Corporate', isDark: false, daisyUI: 'corporate', primary: '#4b6bfb', secondary: '#7b92b2', accent: '#67cba0', neutral: '#181a2a', base: '#ffffff' },
        synthwave: { name: 'Synthwave', isDark: true, daisyUI: 'synthwave', primary: '#e779c1', secondary: '#58c7f3', accent: '#f3cc30', neutral: '#20134e', base: '#1d1536' },
        retro: { name: 'Retro', isDark: false, daisyUI: 'retro', primary: '#ef9995', secondary: '#a4cbb4', accent: '#dc8850', neutral: '#2e282a', base: '#ece3ca' },
        cyberpunk: { name: 'Cyberpunk', isDark: false, daisyUI: 'cyberpunk', primary: '#ff7598', secondary: '#75d1f0', accent: '#c07eec', neutral: '#423f00', base: '#ffee00' },
        valentine: { name: 'Valentine', isDark: false, daisyUI: 'valentine', primary: '#e96d7b', secondary: '#a991f7', accent: '#88dbdd', neutral: '#af4670', base: '#f0d6e8' },
        halloween: { name: 'Halloween', isDark: true, daisyUI: 'halloween', primary: '#f28c18', secondary: '#6d3a9c', accent: '#51a800', neutral: '#1b1d1d', base: '#212121' },
        garden: { name: 'Garden', isDark: false, daisyUI: 'garden', primary: '#5c7f67', secondary: '#ecf4e7', accent: '#fae5e5', neutral: '#5d5656', base: '#e9e7e7' },
        forest: { name: 'Forest', isDark: true, daisyUI: 'forest', primary: '#1eb854', secondary: '#1fd65f', accent: '#1db584', neutral: '#19362d', base: '#171212' },
        aqua: { name: 'Aqua', isDark: true, daisyUI: 'aqua', primary: '#09ecf3', secondary: '#966fb3', accent: '#ffe999', neutral: '#3b8ac4', base: '#345da7' },
        lofi: { name: 'Lo-Fi', isDark: false, daisyUI: 'lofi', primary: '#0d0d0d', secondary: '#1a1a1a', accent: '#262626', neutral: '#000000', base: '#fafafa' },
        pastel: { name: 'Pastel', isDark: false, daisyUI: 'pastel', primary: '#d1c1d7', secondary: '#f6cbd1', accent: '#b4e9d6', neutral: '#70acc7', base: '#ffffff' },
        fantasy: { name: 'Fantasy', isDark: false, daisyUI: 'fantasy', primary: '#6e0b75', secondary: '#c148ac', accent: '#4287f5', neutral: '#6f6f6f', base: '#ffffff' },
        wireframe: { name: 'Wireframe', isDark: false, daisyUI: 'wireframe', primary: '#b8b8b8', secondary: '#b8b8b8', accent: '#b8b8b8', neutral: '#b8b8b8', base: '#ffffff' },
        black: { name: 'Black', isDark: true, daisyUI: 'black', primary: '#343232', secondary: '#343232', accent: '#343232', neutral: '#2a2e37', base: '#000000' },
        luxury: { name: 'Luxury', isDark: true, daisyUI: 'luxury', primary: '#ffffff', secondary: '#152747', accent: '#513448', neutral: '#28344e', base: '#09090b' },
        dracula: { name: 'Dracula', isDark: true, daisyUI: 'dracula', primary: '#ff79c6', secondary: '#bd93f9', accent: '#ffb86c', neutral: '#414558', base: '#282a36' },
        cmyk: { name: 'CMYK', isDark: false, daisyUI: 'cmyk', primary: '#45aeee', secondary: '#e8488a', accent: '#ffc23c', neutral: '#2a2a2a', base: '#ffffff' },
        autumn: { name: 'Autumn', isDark: false, daisyUI: 'autumn', primary: '#8c0327', secondary: '#d85251', accent: '#f3cc30', neutral: '#5c5757', base: '#f1f1f1' },
        business: { name: 'Business', isDark: false, daisyUI: 'business', primary: '#1c4ed8', secondary: '#7c2d12', accent: '#dc2626', neutral: '#1f2937', base: '#ffffff' },
        acid: { name: 'Acid', isDark: false, daisyUI: 'acid', primary: '#ff00ff', secondary: '#ffff00', accent: '#00ffff', neutral: '#72757e', base: '#fefefe' },
        lemonade: { name: 'Lemonade', isDark: false, daisyUI: 'lemonade', primary: '#519903', secondary: '#e9e92f', accent: '#ff9500', neutral: '#8b8680', base: '#ffffff' },
        night: { name: 'Night', isDark: true, daisyUI: 'night', primary: '#38bdf8', secondary: '#818cf8', accent: '#f471b5', neutral: '#1e293b', base: '#0f172a' },
        coffee: { name: 'Coffee', isDark: true, daisyUI: 'coffee', primary: '#db924b', secondary: '#263e3f', accent: '#10576d', neutral: '#120c12', base: '#20161f' },
        winter: { name: 'Winter', isDark: false, daisyUI: 'winter', primary: '#047aed', secondary: '#463aa2', accent: '#c148ac', neutral: '#394e6a', base: '#ffffff' },
        dim: { name: 'Dim', isDark: true, daisyUI: 'dim', primary: '#9333ea', secondary: '#f471b5', accent: '#1dcdbc', neutral: '#2a323c', base: '#1f2937' },
        nord: { name: 'Nord', isDark: true, daisyUI: 'nord', primary: '#5e81ac', secondary: '#81a1c1', accent: '#88c0d0', neutral: '#4c566a', base: '#2e3440' },
        sunset: { name: 'Sunset', isDark: false, daisyUI: 'sunset', primary: '#ff6b35', secondary: '#f7931e', accent: '#ffe66d', neutral: '#4a5568', base: '#ffffff' }
    };

    const handleThemeSelection = (themeName) => {
        setSelectedThemeName(themeName);
        applyDaisyUITheme(themeName);
        localStorage.setItem('humidor-hub-theme', themeName);
    };

    const handleSave = () => {
        onClose();
    };

    const handleCancel = () => {
        // Revert to the original theme if the user cancels
        const originalTheme = localStorage.getItem('humidor-hub-theme') || 'dark';
        applyDaisyUITheme(originalTheme);
        onClose();
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={handleCancel}>
            <div
                className="bg-base-200 rounded-md p-0 w-full max-w-4xl max-h-[90vh] shadow-2xl border border-base-300 relative flex flex-col"
                style={{ minHeight: 0 }}
                onClick={e => e.stopPropagation()}
            >

                {/* Panel Header */}
                <div
                    id="pnlModalHeader"
                    className="flex justify-between items-center bg-base-100/90 backdrop-blur-md w-full px-4 py-4 rounded-t-md z-10 shadow-md"
                    style={{ flex: '0 0 auto' }}
                >
                    <div className="flex items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-base-content">Choose Theme</h3>
                            <p className="text-base-content/70 text-sm">Personalize your experience</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={toggleDarkMode}
                            className="btn btn-ghost p-2 rounded-sm transition-all flex items-center space-x-2"
                            title="Toggle Dark/Light Mode Filter"
                        >
                            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <span className="text-base-content text-sm">
                                {isDarkMode ? 'Dark' : 'Light'}
                            </span>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn btn-ghost btn-circle"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                {/* End Panel Header */}

                <div
                    id="theme-modal-content"
                    className="flex-1 overflow-y-auto p-8"
                >
                    {/* DaisyUI Themes Section */}
                    <div id="daisy-themes">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Object.values(daisyUIThemes)
                                .filter((theme) => isDarkMode ? theme.isDark : !theme.isDark)
                                .map((theme) => {
                                    const isSelected = selectedThemeName === theme.daisyUI;
                                    return (
                                        <button
                                            key={theme.daisyUI}
                                            onClick={() => handleThemeSelection(theme.daisyUI)}
                                            className={`group relative p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${isSelected
                                                ? `border-primary bg-primary/10 shadow-lg`
                                                : `border-base-300 hover:border-primary/50 hover:bg-base-300/30`
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                    ✓
                                                </div>
                                            )}

                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="relative">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20"
                                                        style={{ backgroundColor: theme.base }}
                                                    >
                                                        <Box
                                                            className="w-5 h-5"
                                                            style={{ color: theme.primary }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                                        style={{ backgroundColor: theme.primary }}
                                                    ></div>
                                                </div>

                                                <div className="text-center">
                                                    <span className="text-base-content font-semibold text-xs block">{theme.name}</span>
                                                    <span className="text-base-content/70 text-xs">
                                                        {theme.isDark ? 'Dark' : 'Light'}
                                                    </span>
                                                </div>

                                                <div className="flex space-x-1">
                                                    <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: theme.primary }}></div>
                                                    <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: theme.secondary }}></div>
                                                    <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: theme.accent }}></div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    id="pnlActionButtons"
                    className="flex justify-end space-x-4 p-4 border-t border-base-300 bg-base-100/90 backdrop-blur-md rounded-b-md"
                >
                    <button
                        onClick={handleCancel}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThemeModal;