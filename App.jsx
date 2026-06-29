import React, { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
/*
 * Root Application Component.
 * Injects the global Authentication Context provider into the React component tree
 * and initializes the Native Routing Controller.
 */
export default function App() {
    useEffect(() => {
        async function lockOrientation() {
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        }
        lockOrientation();
    }, []);
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </ThemeProvider>
    );
}