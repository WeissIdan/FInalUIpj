import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext.jsx';
import { getMyFavorites, getWeatherForLocation } from '../api/authService.js';
import { homeStyles } from '../styles/homeStyles';
import { ThemeContext } from '../context/ThemeContext';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const { colors } = useContext(ThemeContext);
    const [favorites, setFavorites] = useState([]);
    const [forecasts, setForecasts] = useState({});
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                const favoritesResponse = await getMyFavorites();
                const allFavs = favoritesResponse.data?.favoriteSpots || favoritesResponse.data || [];
                const top6Favs = allFavs.slice(-6).reverse(); 
                setFavorites(top6Favs);

                const weatherPromises = top6Favs.map(async (spot) => {
                    const lat = spot.lat !== undefined ? spot.lat : spot.location?.coordinates?.[1];
                    const lon = spot.lon !== undefined ? spot.lon : spot.location?.coordinates?.[0];
                    const safeId = spot.placeId || spot.place_id || spot._id;

                    if (lat !== undefined && lon !== undefined) {
                        try {
                            const weatherRes = await getWeatherForLocation(lat, lon);
                            return { id: safeId, weather: weatherRes.data };
                        } catch (err) {
                            console.error(`[Dashboard] Weather fetch failed for location: ${spot.name}`);
                            return { id: safeId, weather: null };
                        }
                    }
                    return null;
                });

                const weatherResults = await Promise.all(weatherPromises);

                const forecastMap = {};
                weatherResults.forEach(item => {
                    if (item) forecastMap[item.id] = item.weather;
                });

                setForecasts(forecastMap);
            } catch (error) {
                console.error("[Dashboard Aggregation Error]:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const getCardinalDirection = (angle) => {
        if (angle === null || angle === undefined) return '';
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(angle / 45) % 8];
    };

    return (
        <View style={[homeStyles.wrapper, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={homeStyles.scrollContainer}>
                
                <View style={homeStyles.header}>
                    <Text style={homeStyles.headerTitle}>Welcome back, {user?.firstname || 'Surfer'}! 🌊</Text>
                    <Text style={homeStyles.headerSubtitle}>Here is the current forecast for your top spots.</Text>
                </View>

                {loading ? (
                    <View style={homeStyles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0077be" />
                        <Text style={homeStyles.loadingText}>Loading your personalized forecast...</Text>
                    </View>
                ) : favorites.length > 0 ? (
                    <View>
                        {favorites.map((spot) => {
                            const lat = spot.lat !== undefined ? spot.lat : spot.location?.coordinates?.[1];
                            const lon = spot.lon !== undefined ? spot.lon : spot.location?.coordinates?.[0];
                            const safeId = spot.placeId || spot.place_id || spot._id;
                            const spotWeather = forecasts[safeId];
                            
                            const icon = (spot.category || '').toLowerCase().includes('marina') ? '⚓' : '🌊';

                            return (
                                <View style={homeStyles.spotCard} key={safeId}>
                                    <View style={homeStyles.spotCardHeader}>
                                        <Text style={homeStyles.spotCardTitle}>{icon} {spot.name}</Text>
                                        <Text style={homeStyles.spotCountry}>{spot.country || 'Unknown'}</Text>
                                    </View>
                                    
                                    <View style={homeStyles.spotCardBody}>
                                        {!spotWeather ? (
                                            <Text style={homeStyles.noDataText}>Weather data unavailable</Text>
                                        ) : (
                                            <View style={homeStyles.weatherGrid}>
                                                
                                                {/* Metric 1: Wind Speed */}
                                                <View style={homeStyles.weatherStat}>
                                                    <View style={homeStyles.statValueContainer}>
                                                        <Text style={homeStyles.statValue}>{Math.round(spotWeather.wind_speed_10m?.[0] || 0)}</Text>
                                                        <Text style={homeStyles.statUnit}>kts</Text>
                                                    </View>
                                                    <Text style={homeStyles.statLabel}>WIND SPEED</Text>
                                                </View>
                                                
                                                {/* Metric 2: Wind Direction */}
                                                <View style={homeStyles.weatherStat}>
                                                    <View style={homeStyles.windDirectionWrapper}>
                                                        <Text style={[homeStyles.windArrow, { transform: [{ rotate: `${spotWeather.wind_direction_10m?.[0] || 0}deg` }] }]}>↓</Text>
                                                        <Text style={homeStyles.statValue}>
                                                            {getCardinalDirection(spotWeather.wind_direction_10m?.[0])}
                                                        </Text>
                                                    </View>
                                                    <Text style={homeStyles.statLabel}>DIRECTION</Text>
                                                </View>

                                                {/* Metric 3: Wave Height */}
                                                {spotWeather.wave_height && spotWeather.wave_height[0] !== null && (
                                                    <View style={[homeStyles.weatherStat, homeStyles.weatherStatFullWidth]}>
                                                        <View style={homeStyles.statValueContainer}>
                                                            <Text style={homeStyles.statValue}>{spotWeather.wave_height[0]}</Text>
                                                            <Text style={homeStyles.statUnit}>m</Text>
                                                        </View>
                                                        <Text style={homeStyles.statLabel}>WAVE HEIGHT</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>

                                    <TouchableOpacity 
                                        style={homeStyles.actionButton} 
                                        onPress={() => navigation.navigate('Explorer', { lat, lon, name: spot.name })}
                                    >
                                        <Text style={homeStyles.actionButtonText}>📍 Map</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View style={homeStyles.emptyDashboard}>
                        <Text style={homeStyles.emptyStateIcon}>🗺️</Text>
                        <Text style={homeStyles.emptyStateTitle}>Your dashboard is looking a little empty!</Text>
                        <Text style={homeStyles.emptyStateText}>Head over to the Explorer Map to discover breaks and add your first favorite spots.</Text>
                        <TouchableOpacity 
                            style={homeStyles.exploreButton} 
                            onPress={() => navigation.navigate('Explorer')}
                        >
                            <Text style={homeStyles.exploreButtonText}>Explore the Map</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default HomePage;