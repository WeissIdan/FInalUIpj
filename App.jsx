import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
/*
 * Root Application Component.
 * Injects the global Authentication Context provider into the React component tree
 * and initializes the Native Routing Controller.
 */
export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </ThemeProvider>
    );
}