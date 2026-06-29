import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightColors, darkColors } from '../styles/globalStyles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Ask React Native for the OS theme
    const systemTheme = useColorScheme();
    
    // 2. Try to grab it synchronously on boot, fallback to 'light'
    const [themeName, setThemeName] = useState(Appearance.getColorScheme() || 'light');

    // 3. NEW FIX: If Android delays the answer and resolves it late, force the state to update!
    useEffect(() => {
        if (systemTheme) {
            setThemeName(systemTheme);
        }
    }, [systemTheme]);

    // 4. Listen for real-time toggles from the control center
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (colorScheme) {
                setThemeName(colorScheme);
            }
        });
        
        return () => subscription.remove();
    }, []);

    const isDarkMode = themeName === 'dark';
    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ isDarkMode, colors, setThemeName }}>
            {children}
        </ThemeContext.Provider>
    );
};