import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

// Standard Screen Imports
import Login from '../pages/Login';
import Register from '../pages/Register';
import Verify from '../pages/Verify';
import HomePage from '../pages/HomePage';
// import MapPage from '../pages/MapPage';
// import SurfProfile from '../pages/SurfProfile';
// import UpdateUser from '../pages/UpdateUser';

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
// const ProfileStack = () => (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="SurfProfile" component={SurfProfile} />
//         <Stack.Screen name="UpdateUser" component={UpdateUser} />
//     </Stack.Navigator>
// );

// 3. Main Application Tabs (Protected)
const AppTabs = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Dashboard" component={HomePage} />
        {/* <Tab.Screen name="Explorer" component={MapPage} />
        <Tab.Screen name="Profile" component={ProfileStack} /> */}
    </Tab.Navigator>
);

// 4. The Master Gatekeeper Controller
export const RootNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    // UI Blocking: Native ActivityIndicator replaces the web <div>Loading...</div>
    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
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
