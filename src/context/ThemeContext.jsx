import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightColors, darkColors } from '../styles/globalStyles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();
    
    const [themeName, setThemeName] = useState(Appearance.getColorScheme() || 'light');

    useEffect(() => {
        if (systemTheme) {
            setThemeName(systemTheme);
        }
    }, [systemTheme]);

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