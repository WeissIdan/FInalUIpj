import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

/*
 * Root Application Component.
 * Injects the global Authentication Context provider into the React component tree
 * and initializes the Native Routing Controller.
 */
export default function App() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}