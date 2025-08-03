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
import { X, Palette, Box, Sun, Moon, Save, XCircle } from 'lucide-react';
import { themes } from '../../../constants/themes';
import { applyTheme, isDaisyUITheme } from '../../../utils/themeUtils';

const ThemeModal = ({ currentTheme, setTheme, onClose }) => {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // DaisyUI themes with enhanced metadata
    const daisyUIThemes = {
        light: { name: 'Light', isDark: false, primary: '#570df8', secondary: '#f000b8', accent: '#37cdbe', neutral: '#3d4451', base: '#ffffff' },
        dark: { name: 'Dark', isDark: true, primary: '#661ae6', secondary: '#d926aa', accent: '#1fb2a5', neutral: '#191d24', base: '#2a303c' },
        cupcake: { name: 'Cupcake', isDark: false, primary: '#65c3c8', secondary: '#ef9fbc', accent: '#eeaf3a', neutral: '#291334', base: '#faf7f5' },
        bumblebee: { name: 'Bumblebee', isDark: false, primary: '#e0a82e', secondary: '#f9d72f', accent: '#181830', neutral: '#181830', base: '#ffffff' },
        emerald: { name: 'Emerald', isDark: false, primary: '#66cc8a', secondary: '#377cfb', accent: '#ea5234', neutral: '#333c4d', base: '#ffffff' },
        corporate: { name: 'Corporate', isDark: false, primary: '#4b6bfb', secondary: '#7b92b2', accent: '#67cba0', neutral: '#181a2a', base: '#ffffff' },
        synthwave: { name: 'Synthwave', isDark: true, primary: '#e779c1', secondary: '#58c7f3', accent: '#f3cc30', neutral: '#20134e', base: '#1d1536' },
        retro: { name: 'Retro', isDark: false, primary: '#ef9995', secondary: '#a4cbb4', accent: '#dc8850', neutral: '#2e282a', base: '#ece3ca' },
        cyberpunk: { name: 'Cyberpunk', isDark: true, primary: '#ff7598', secondary: '#75d1f0', accent: '#c07eec', neutral: '#423f00', base: '#ffee00' },
        valentine: { name: 'Valentine', isDark: false, primary: '#e96d7b', secondary: '#a991f7', accent: '#88dbdd', neutral: '#af4670', base: '#f0d6e8' },
        halloween: { name: 'Halloween', isDark: true, primary: '#f28c18', secondary: '#6d3a9c', accent: '#51a800', neutral: '#1b1d1d', base: '#212121' },
        garden: { name: 'Garden', isDark: false, primary: '#5c7f67', secondary: '#ecf4e7', accent: '#fae5e5', neutral: '#5d5656', base: '#e9e7e7' },
        forest: { name: 'Forest', isDark: true, primary: '#1eb854', secondary: '#1fd65f', accent: '#1db584', neutral: '#19362d', base: '#171212' },
        aqua: { name: 'Aqua', isDark: true, primary: '#09ecf3', secondary: '#966fb3', accent: '#ffe999', neutral: '#3b8ac4', base: '#345da7' },
        lofi: { name: 'Lo-Fi', isDark: false, primary: '#0d0d0d', secondary: '#1a1a1a', accent: '#262626', neutral: '#000000', base: '#fafafa' },
        pastel: { name: 'Pastel', isDark: false, primary: '#d1c1d7', secondary: '#f6cbd1', accent: '#b4e9d6', neutral: '#70acc7', base: '#ffffff' },
        fantasy: { name: 'Fantasy', isDark: false, primary: '#6e0b75', secondary: '#c148ac', accent: '#4287f5', neutral: '#6f6f6f', base: '#ffffff' },
        wireframe: { name: 'Wireframe', isDark: false, primary: '#b8b8b8', secondary: '#b8b8b8', accent: '#b8b8b8', neutral: '#b8b8b8', base: '#ffffff' },
        black: { name: 'Black', isDark: true, primary: '#343232', secondary: '#343232', accent: '#343232', neutral: '#2a2e37', base: '#000000' },
        luxury: { name: 'Luxury', isDark: true, primary: '#ffffff', secondary: '#152747', accent: '#513448', neutral: '#28344e', base: '#09090b' },
        dracula: { name: 'Dracula', isDark: true, primary: '#ff79c6', secondary: '#bd93f9', accent: '#ffb86c', neutral: '#414558', base: '#282a36' },
        cmyk: { name: 'CMYK', isDark: false, primary: '#45aeee', secondary: '#e8488a', accent: '#ffc23c', neutral: '#2a2a2a', base: '#ffffff' },
        autumn: { name: 'Autumn', isDark: false, primary: '#8c0327', secondary: '#d85251', accent: '#f3cc30', neutral: '#5c5757', base: '#f1f1f1' },
        business: { name: 'Business', isDark: false, primary: '#1c4ed8', secondary: '#7c2d12', accent: '#dc2626', neutral: '#1f2937', base: '#ffffff' },
        acid: { name: 'Acid', isDark: false, primary: '#ff00ff', secondary: '#ffff00', accent: '#00ffff', neutral: '#72757e', base: '#fefefe' },
        lemonade: { name: 'Lemonade', isDark: false, primary: '#519903', secondary: '#e9e92f', accent: '#ff9500', neutral: '#8b8680', base: '#ffffff' },
        night: { name: 'Night', isDark: true, primary: '#38bdf8', secondary: '#818cf8', accent: '#f471b5', neutral: '#1e293b', base: '#0f172a' },
        coffee: { name: 'Coffee', isDark: true, primary: '#db924b', secondary: '#263e3f', accent: '#10576d', neutral: '#120c12', base: '#20161f' },
        winter: { name: 'Winter', isDark: false, primary: '#047aed', secondary: '#463aa2', accent: '#c148ac', neutral: '#394e6a', base: '#ffffff' },
        dim: { name: 'Dim', isDark: true, primary: '#9333ea', secondary: '#f471b5', accent: '#1dcdbc', neutral: '#2a323c', base: '#1f2937' },
        nord: { name: 'Nord', isDark: true, primary: '#5e81ac', secondary: '#81a1c1', accent: '#88c0d0', neutral: '#4c566a', base: '#2e3440' },
        sunset: { name: 'Sunset', isDark: false, primary: '#ff6b35', secondary: '#f7931e', accent: '#ffe66d', neutral: '#4a5568', base: '#ffffff' }
    };

    // Enhanced color extraction with DaisyUI support
    const getThemeColors = (theme, daisyTheme = null) => {
        if (daisyTheme) {
            return {
                primary: daisyTheme.primary,
                secondary: daisyTheme.secondary,
                accent: daisyTheme.accent,
                neutral: daisyTheme.neutral,
                background: daisyTheme.base,
                text: daisyTheme.isDark ? '#ffffff' : '#000000',
                cardColor: daisyTheme.base,
                iconColor: daisyTheme.primary
            };
        }

        const colorMap = {
            'text-amber-400': '#fbbf24',
            'text-sky-400': '#38bdf8',
            'text-orange-400': '#fb923c',
            'text-amber-700': '#b45309',
            'bg-gray-800': '#1f2937',
            'bg-slate-800': '#1e293b',
            'bg-stone-800': '#292524',
            'bg-white': '#ffffff'
        };

        return {
            primary: colorMap[theme.primary] || '#fbbf24',
            background: colorMap[theme.card?.replace('/50', '')] || colorMap[theme.bg] || '#1f2937',
            text: theme.name === 'Classic Light' ? '#1f2937' : '#ffffff',
            cardColor: colorMap[theme.card?.replace('/50', '')] || colorMap[theme.bg] || '#1f2937',
            iconColor: colorMap[theme.primary] || '#fbbf24'
        };
    };

    const handleSave = () => {
        applyTheme(selectedTheme);
        setTheme(selectedTheme);
        onClose();
    };

    const handleCancel = () => {
        setSelectedTheme(currentTheme);
        onClose();
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={handleCancel}>
            <div
                className={`${currentTheme.card} rounded-md p-0 w-full max-w-4xl max-h-[90vh] shadow-2xl ${currentTheme.borderColor} border relative flex flex-col`}
                style={{ minHeight: 0 }}
                onClick={e => e.stopPropagation()}
            >

                {/* Panel Header */}
                <div
                    id="pnlModalHeader"
                    className="flex justify-between items-center
                        bg-opacity-90 backdrop-blur-md
                        w-full
                        px-4 py-4
                        rounded-t-md
                        z-10
                        shadow-[0_2px_16px_0_rgba(0,0,0,0.10)]"
                    style={{ background: 'inherit', flex: '0 0 auto' }}
                >
                    <div className="flex items-center">

                        <div>
                            <h3 className={`text-2xl font-bold ${currentTheme.text}`}>Choose Theme</h3>
                            <p className={`${currentTheme.subtleText} text-sm`}>Personalize your experience with DaisyUI themes</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Dark/Light Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`${currentTheme.button} p-2 rounded-sm transition-all flex items-center space-x-2`}
                            title="Toggle Dark/Light Mode Filter"
                        >
                            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <span className={`${currentTheme.text} text-sm`}>
                                {isDarkMode ? 'Dark' : 'Light'}
                            </span>
                        </button>
                        <button
                            onClick={handleCancel}
                            className={`${currentTheme.subtleText} hover:${currentTheme.text} ${currentTheme.button} p-2 rounded-sm transition-all`}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                {/* End Panel Header */}

                <div
                    id="theme-modal-content"
                    className="flex-1 overflow-y-auto px-8"
                    style={{
                        minHeight: 0,
                        // The header/footer are both py-6/py-4, so reserve enough space
                        paddingTop: 0,
                        paddingBottom: 0,
                    }}
                >

                    {/* Original Themes Section */}
                    <div id="original-themes" className="mt-4 mb-8">
                        <h4 className={`${currentTheme.text} text-lg font-semibold mb-4`}>Original Themes</h4>
                        {/* Description here of original theme features */}
                        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {Object.entries(themes).map(([key, theme]) => {
                                const colors = getThemeColors(theme);
                                const isSelected = selectedTheme.name === theme.name;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedTheme(theme)}
                                        className={`group relative p-4 rounded-md border-2 transition-all duration-300 transform hover:scale-105 ${isSelected
                                            ? `${currentTheme.borderColor.replace('border-', 'border-')} bg-gradient-to-br ${currentTheme.primary.replace('text-', 'from-')}/20 ${currentTheme.primary.replace('text-', 'to-')}/10 shadow-lg`
                                            : `${currentTheme.borderColor} hover:${currentTheme.borderColor.replace('gray-700', 'gray-500')} hover:${currentTheme.card}/30`
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className={`absolute -top-2 -right-2 ${currentTheme.primaryBg} ${currentTheme.text} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`}>
                                                ✓
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="relative">
                                                <div id="iconBox"
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20"
                                                    style={{
                                                        backgroundColor: colors.cardColor || colors.background
                                                    }}
                                                >
                                                    <Box
                                                        className="w-5 h-5"
                                                        style={{ color: colors.iconColor || colors.primary }}
                                                    />
                                                </div>
                                                <div id="pnlThemePrimaryDot"
                                                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                                    style={{ backgroundColor: colors.primary }}
                                                ></div>
                                            </div>

                                            <div id="pnlColorMode" className="text-center">
                                                <span className={`${currentTheme.text} font-semibold text-xs block`}>{theme.name}</span>
                                                <span className={`${currentTheme.subtleText} text-xs`}>
                                                    {theme.name === 'Classic Light' ? 'Light' : 'Dark'}
                                                </span>
                                            </div>

                                            <div id="pnlColorSwatches" className="flex space-x-1">
                                                <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: colors.primary }}></div>
                                                <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: colors.background }}></div>
                                                <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: `${colors.primary}80` }}></div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* DaisyUI Themes Section */}
                    <div id="daisy-themes" className="mt-4 mb-4">
                        <h4 className={`${currentTheme.text} text-lg font-semibold mb-4`}>DaisyUI Themes</h4>
                        {/* Description here of experimental features */}


                        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {Object.entries(daisyUIThemes)
                                .filter(([_, daisyTheme]) => isDarkMode ? daisyTheme.isDark : !daisyTheme.isDark)
                                .map(([key, daisyTheme]) => {
                                    const colors = getThemeColors(null, daisyTheme);
                                    const themeObj = { name: daisyTheme.name, daisyUI: key, ...daisyTheme };
                                    const isSelected = selectedTheme.name === daisyTheme.name && selectedTheme.daisyUI === key;

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedTheme(themeObj)}
                                            className={`group relative p-4 rounded-md border-2 transition-all duration-300 transform hover:scale-105 ${isSelected
                                                ? `border-blue-500 bg-gradient-to-br from-blue-500/20 to-blue-600/10 shadow-lg`
                                                : `${currentTheme.borderColor} hover:border-gray-500 hover:${currentTheme.card}/30`
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                    ✓
                                                </div>
                                            )}

                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="relative">
                                                    <div id="iconBox"
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20"
                                                        style={{
                                                            backgroundColor: colors.background
                                                        }}
                                                    >
                                                        <Box
                                                            className="w-5 h-5"
                                                            style={{ color: colors.iconColor }}
                                                        />
                                                    </div>
                                                    <div id="pnlThemePrimaryDot"
                                                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                                        style={{ backgroundColor: colors.primary }}
                                                    ></div>
                                                </div>

                                                <div id="pnlColorMode" className="text-center">
                                                    <span className={`${currentTheme.text} font-semibold text-xs block`}>{daisyTheme.name}</span>
                                                    <span className={`${currentTheme.subtleText} text-xs`}>
                                                        {daisyTheme.isDark ? 'Dark' : 'Light'}
                                                    </span>
                                                </div>

                                                <div id="pnlColorSwatches" className="flex space-x-1">
                                                    <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: colors.primary }}></div>
                                                    <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: colors.secondary }}></div>
                                                    <div className="w-3 h-3 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: colors.accent }}></div>
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
                    className="flex justify-center space-x-4 pt-4 border-t border-gray-600
                        bg-opacity-90 backdrop-blur-md
                        w-full
                        px-2 py-2
                        rounded-b-md
                        z-10
                        shadow-[0_-2px_16px_0_rgba(0,0,0,0.10)]"
                    style={{ background: 'inherit', flex: '0 0 auto' }}
                >
                    <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 text-white font-semibold rounded-md "
                    >

                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 text-white font-semibold rounded-md"
                    >

                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThemeModal;