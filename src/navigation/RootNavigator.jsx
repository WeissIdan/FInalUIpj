import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Adjust path if needed

// Standard Screen Imports
import Login from '../pages/Login';
import Register from '../pages/Register';
import Verify from '../pages/Verify';
import HomePage from '../pages/HomePage';
import MapPage from '../pages/MapPage';
import SurfProfile from '../pages/SurfProfile';
import UpdateUser from '../pages/UpdateUser';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Authentication Stack (Unauthenticated / Public)
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Verify" component={Verify} />
    </Stack.Navigator>
);

// 2. Profile Stack (Nested to group profile management views)
const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SurfProfile" component={SurfProfile} />
        <Stack.Screen name="UpdateUser" component={UpdateUser} />
    </Stack.Navigator>
);

// 3. Main Application Tabs (Protected)
const AppTabs = () => {
    // NEW: Grab the theme colors for the Tab Bar
    const { colors } = useContext(ThemeContext);

    return (
        <Tab.Navigator 
            screenOptions={{ 
                headerShown: false,
                tabBarActiveTintColor: colors.primaryBlue,
                tabBarInactiveTintColor: colors.subText,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                }
            }}
        >
            <Tab.Screen name="Dashboard" component={HomePage} />
            <Tab.Screen name="Explorer" component={MapPage} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
};

// 4. The Master Gatekeeper Controller
export const RootNavigator = () => {
    const { user, loading } = useContext(AuthContext);
    
    // NEW: Grab the theme state to style the global navigation container
    const { colors, isDarkMode } = useContext(ThemeContext);

    // NEW: Create the custom React Navigation theme object
    const MyTheme = {
        ...(isDarkMode ? NavDarkTheme : DefaultTheme),
        colors: {
            ...(isDarkMode ? NavDarkTheme.colors : DefaultTheme.colors),
            background: colors.background, // Forces all screens to match your global background
            card: colors.card,             // Header/Tab bar background default
            text: colors.text,
            border: colors.border,
        },
    };

    // UI Blocking: Native ActivityIndicator replaces the web <div>Loading...</div>
    if (loading) {
        return (
            // Added inline background styling for the loading screen so it matches the theme
            <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primaryBlue} />
            </View>
        );
    }

    return (
        // NEW: Pass the MyTheme object into the NavigationContainer
        <NavigationContainer theme={MyTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // Protected Boundary: Render Tabs and Modals
                    <>
                        <Stack.Screen name="MainTabs" component={AppTabs} />
                    </>
                ) : (
                    // Public Boundary: Render Login/Registration
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// Assuming you have styles defined down here
const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});