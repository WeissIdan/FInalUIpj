import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SurfMap from '../components/SurfMap'; // We will build this next
import SearchBar from '../components/SearchBar'; // We will build this next
import { searchLocations } from '../api/authService';
import { mapStyles } from '../styles/mapStyles';
import { theme } from '../styles/globalStyles';

/*
 * Interactive Geographic Explorer (Container Component).
 * Manages the layout and state synchronization between the Search Interface and the 
 * underlying react-native-maps engine. Acts as the data-fetching parent component, 
 * pushing query results down to the map layer for rendering.
 */
const MapPage = () => {
    const [manualResults, setManualResults] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    /*
     * Executes targeted geographic searches based on user input and filter parameters.
     * The resulting payload is passed sequentially to the SurfMap child component to update markers.
     */
    const handleSearch = async (searchQuery, filters) => {
        setLoading(true);
        try {
            const response = await searchLocations(searchQuery, filters);
            setManualResults(response.data); 
        } catch (err) {
            console.error("[Map Search Error]:", err);
        } finally {
            setLoading(false);
        }
    };

    // Safely opens the device's default web browser
    const openMeteoAttribution = () => {
        Linking.openURL('https://open-meteo.com/');
    };

    return (
        <SafeAreaView style={mapStyles.container} edges={['top']}>
            
            {/* Overlay Search Interface */}
            <View style={mapStyles.header}>
                <SearchBar onSearch={handleSearch} placeholder="Search map..." />
                
                {loading && (
                    <View style={mapStyles.loadingContainer}>
                        <ActivityIndicator size="small" color={theme.colors.primaryBlue} />
                        <Text style={mapStyles.loadingText}>Scanning area...</Text>
                    </View>
                )}
            </View>

            {/* Primary Geographic Layer */}
            <View style={mapStyles.mapMain}>
                <SurfMap searchResults={manualResults} />
            </View>
            
            <View style={mapStyles.footer}>
                <Text style={mapStyles.footerText}>
                    Weather data provided by{' '}
                    <Text style={mapStyles.linkText} onPress={openMeteoAttribution}>
                        Open-Meteo.com
                    </Text>
                </Text>
            </View>
            
        </SafeAreaView>
    );
};

export default MapPage;