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
        const hydrateSession = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('user_session');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error("[AuthContext] Failed to parse local user session:", error.message);
            } finally {
                setLoading(false);
            }
        };

        hydrateSession();

        let isAlertShowing = false;

        const interceptor = authApi.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    if (!error.config.url.includes('/login')) {
                        
                        if (!isAlertShowing) {
                            isAlertShowing = true;
                            

                            await logout();
                            
                            Alert.alert(
                                "Session Expired", 
                                "Your session is invalid or has expired. Please log in again."
                            );
                            
                            setTimeout(() => { isAlertShowing = false; }, 3000);
                        }
                    }
                }

                if (error.response?.status === 429) {
                    Alert.alert("Rate Limit", "Too many requests. Please try again later.");
                }
                
                return Promise.reject(error);
            }
        );
        
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