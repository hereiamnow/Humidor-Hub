/**
 * @file useNavigation.js
 * @path src/hooks/useNavigation.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date January 8, 2025
 *
 * Navigation Management Hook
 *
 * Custom hook that manages application navigation state and provides
 * navigation utilities. Handles screen transitions and parameter passing.
 */

import { useState, useEffect } from 'react';

const DEBUG = process.env.NODE_ENV === 'development';
const log = DEBUG ? console.log : () => {};

export const useNavigation = (initialScreen = 'Dashboard') => {
    const [navigation, setNavigation] = useState({ 
        screen: initialScreen, 
        params: {} 
    });

    // Scroll to top on navigation change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [navigation]);

    const navigate = (screen, params = {}) => {
        log('🧭 Navigation:', { 
            from: navigation.screen, 
            to: screen, 
            params 
        });
        setNavigation({ screen, params });
    };

    return {
        navigation,
        navigate,
        currentScreen: navigation.screen,
        currentParams: navigation.params
    };
};