/**
 * @file themeUtils.js
 * @path src/utils/themeUtils.js
 * @author Shawn Miller
 * @date August 3, 2025
 * 
 * Theme Utility Functions
 * 
 * Utilities for managing theme application, including DaisyUI theme switching
 * and dynamic color synchronization.
 */

/**
 * Apply a DaisyUI theme to the document
 * @param {string} themeName - The DaisyUI theme name
 */
export const applyDaisyUITheme = (themeName) => {
    if (themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
    }
};

/**
 * Remove DaisyUI theme from the document
 */
export const removeDaisyUITheme = () => {
    document.documentElement.removeAttribute('data-theme');
};

/**
 * Get current DaisyUI theme
 * @returns {string|null} Current theme name or null
 */
export const getCurrentDaisyUITheme = () => {
    return document.documentElement.getAttribute('data-theme');
};

/**
 * Check if a theme is a DaisyUI theme
 * @param {Object} theme - Theme object to check
 * @returns {boolean} True if it's a DaisyUI theme
 */
export const isDaisyUITheme = (theme) => {
    return theme && theme.daisyUI;
};

/**
 * Apply theme (either original or DaisyUI)
 * @param {Object} theme - Theme object
 */
export const applyTheme = (theme) => {
    if (isDaisyUITheme(theme)) {
        applyDaisyUITheme(theme.daisyUI);
    } else {
        removeDaisyUITheme();
    }
};