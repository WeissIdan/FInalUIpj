import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/authService';

const AuthContext = createContext();

/*
 * Global Authentication Provider.
 * Manages the React Native application's session state, orchestrates login/logout workflows,
 * and mounts a global Axios Response Interceptor to gracefully handle unauthorized (401) errors.
 */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Step 1: Session Hydration. 
        // Asynchronously restore user state from device storage.
        const hydrateSession = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('user_session');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error("[AuthContext] Failed to parse local user session:", error.message);
            } finally {
                // Unblock the UI render tree once hydration is complete (success or fail)
                setLoading(false);
            }
        };

        hydrateSession();

        // Mutex lock to prevent "Alert Storms" during concurrent asynchronous HTTP failures
        let isAlertShowing = false;

        // Step 2: Global Response Interceptor Registration
        const interceptor = authApi.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    // Ignore 401s originating from the login endpoint itself (invalid credentials)
                    if (!error.config.url.includes('/login')) {
                        
                        // Concurrency Lock: Ensure the user is only alerted and logged out once
                        if (!isAlertShowing) {
                            isAlertShowing = true;
                            
                            // Trigger state change. The Root Navigator will automatically detect this
                            // and route the user back to the AuthStack.
                            await logout();
                            
                            Alert.alert(
                                "Session Expired", 
                                "Your session is invalid or has expired. Please log in again."
                            );
                            
                            // Release the mutex lock after a reasonable timeout
                            setTimeout(() => { isAlertShowing = false; }, 3000);
                        }
                    }
                }

                // Graceful degradation for Rate Limit violations
                if (error.response?.status === 429) {
                    Alert.alert("Rate Limit", "Too many requests. Please try again later.");
                }
                
                return Promise.reject(error);
            }
        );
        
        // Cleanup phase: Eject the interceptor to prevent memory leaks if the provider unmounts
        return () => authApi.interceptors.response.eject(interceptor);
    }, []);

    /*
     * Authenticates the session, persisting the JWT and user metadata to device storage.
     * MUST be async to handle AsyncStorage promises.
     * @param {Object} userData - User metadata (ID, Name, Active Sport, etc.)
     * @param {String} token - JSON Web Token issued by the server.
     */
    const login = async (userData, token) => {
        try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user_session', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("[AuthContext] Failed to store session data:", error);
            Alert.alert("Storage Error", "Could not save your login session.");
        }
    };

    /**
     * Terminates the session, purging local state and device storage.
     * MUST be async to ensure storage is completely cleared before state updates.
     */
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user_session');
            setUser(null);
        } catch (error) {
            console.error("[AuthContext] Failed to clear session data:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };