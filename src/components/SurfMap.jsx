import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location'; // NEW: Import Expo Location
import { searchByBoxAPI, getSpotsByBox, getMyFavorites, getWeatherForLocation } from '../api/authService'; 
import { AuthContext } from '../context/AuthContext';
import { surfMapStyles } from '../styles/surfMapStyles';

const DEFAULT_CENTER = {
    latitude: 31.0461,
    longitude: 34.8516,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
};

const icons = {
    target: '🎯',
    favorite: '⭐',
    beach: '🌊',
    marina: '⚓',
    search: '📍'
};

const SurfMap = ({ searchResults = [] }) => {
    const route = useRoute();
    const mapRef = useRef(null);
    const { user } = useContext(AuthContext);
    
    const [discoverySpots, setDiscoverySpots] = useState([]); 
    const [urlLocation, setUrlLocation] = useState(null); 
    const [favoriteObjects, setFavoriteObjects] = useState([]);
    const [forecast, setForecast] = useState(null);
    const [showDeepSearchButton, setShowDeepSearchButton] = useState(false);
    const [isDeepSearching, setIsDeepSearching] = useState(false);
    const [currentBounds, setCurrentBounds] = useState(null);
    const hasAutoDeepSearched = useRef(false);
    const [searchesLeft, setSearchesLeft] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    // NEW: User Location State
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [userCoords, setUserCoords] = useState(null);

    // NEW: Request Device GPS Permissions on Mount
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setHasLocationPermission(true);
                // Fetch the exact coordinates to power our "Locate Me" button
                const location = await Location.getCurrentPositionAsync({});
                setUserCoords({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        })();
    }, []);

    // NEW: Fly camera to user's physical device location
    const handleLocateMe = () => {
        if (userCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: userCoords.latitude,
                longitude: userCoords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            }, 1000);
        }
    };

    useEffect(() => {
        if (user) {
            getMyFavorites().then(res => {
                setFavoriteObjects(res.data.favoriteSpots || []);
            }).catch(console.error);
        }
    }, [user]);

    const handleMapDiscovery = useCallback(async (bbox, isDeep = false) => {
        try {
            let res; 
            if (isDeep) {
                setIsDeepSearching(true);
                res = await searchByBoxAPI(bbox); 
                if (res.headers && res.headers['ratelimit-remaining'] !== undefined) {
                    setSearchesLeft(parseInt(res.headers['ratelimit-remaining'], 10));
                }
                setDiscoverySpots(prev => [...prev, ...res.data]);
            } else {
                res = await getSpotsByBox(bbox); 
                if (res.data.length === 0 && !hasAutoDeepSearched.current) {
                    hasAutoDeepSearched.current = true;
                    const autoRes = await searchByBoxAPI(bbox);
                    if (autoRes.headers && autoRes.headers['ratelimit-remaining'] !== undefined) {
                        setSearchesLeft(parseInt(autoRes.headers['ratelimit-remaining'], 10));
                    }
                    res = autoRes; 
                }
                setDiscoverySpots(res.data);
            }
        } catch (err) { 
            if (err.response && err.response.status === 429) {
                setSearchesLeft(0);
            } else {
                console.error("[Geospatial Discovery Error]:", err); 
            }
        } finally {
            setIsDeepSearching(false);
        }
    }, []);

    useEffect(() => {
        const lat = route.params?.lat;
        const lon = route.params?.lon;
        const name = route.params?.name;

        if (lat && lon) {
            const numericLat = parseFloat(lat);
            const numericLon = parseFloat(lon);

            setUrlLocation({
                lat: numericLat,
                lon: numericLon,
                display_name: name || 'Selected Location',
                type: 'search' 
            });

            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: numericLat,
                    longitude: numericLon,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }, 1500);
            }

            handleMapDiscovery({
                south: numericLat - 0.1,
                west: numericLon - 0.1,
                north: numericLat + 0.1,
                east: numericLon + 0.1
            }, false);
        }
    }, [route.params, handleMapDiscovery]);

    useEffect(() => {
        if (searchResults && searchResults.length > 0) {
            const topResult = searchResults[0];
            const lat = topResult.lat !== undefined ? Number(topResult.lat) : Number(topResult.location?.coordinates?.[1]);
            const lon = topResult.lon !== undefined ? Number(topResult.lon) : Number(topResult.location?.coordinates?.[0]);

            if (!isNaN(lat) && !isNaN(lon) && mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }, 1500); 
            }
        }
    }, [searchResults]);

    const targetSpot = searchResults.length > 0 ? searchResults[0] : urlLocation;
    const targetLat = targetSpot ? targetSpot.lat : null;
    const targetLon = targetSpot ? targetSpot.lon : null;

    const getSpotIcon = (spot, isTarget) => {
        if (isTarget) return icons.target;
        const isFav = favoriteObjects.some(fav => {
            if (!fav) return false;
            const targetId = spot.place_id || spot.placeId;
            if (targetId && String(fav.placeId) === String(targetId)) return true;

            if (fav?.location?.coordinates?.length >= 2) {
                const targetLon = spot.lon !== undefined ? Number(spot.lon) : Number(spot?.location?.coordinates?.[0]);
                const targetLat = spot.lat !== undefined ? Number(spot.lat) : Number(spot?.location?.coordinates?.[1]);

                if (!isNaN(targetLon) && !isNaN(targetLat)) {
                    const isSameLon = Number(fav.location.coordinates[0]) === targetLon;
                    const isSameLat = Number(fav.location.coordinates[1]) === targetLat;
                    return isSameLon && isSameLat;
                }
            }
            return false;
        });

        if (isFav) return icons.favorite;        
        const type = (spot.type || spot.category || '').toLowerCase();
        if (type.includes('beach')) return icons.beach;
        if (type.includes('marina') || type.includes('port')) return icons.marina;
        
        return icons.search; 
    };

    const urlSpots = urlLocation ? [urlLocation] : [];
    const allSpots = [...searchResults, ...urlSpots, ...discoverySpots];

    const uniqueMapSpots = allSpots.reduce((acc, current) => {
        const isDuplicate = acc.find(spot => {
            const currentId = current.place_id || current.placeId;
            const spotId = spot.place_id || spot.placeId;
            const isSameId = currentId && spotId && String(currentId) === String(spotId);
            const currentLon = current.lon !== undefined ? Number(current.lon) : Number(current?.location?.coordinates?.[0]);
            const currentLat = current.lat !== undefined ? Number(current.lat) : Number(current?.location?.coordinates?.[1]);
            const spotLon = spot.lon !== undefined ? Number(spot.lon) : Number(spot?.location?.coordinates?.[0]);
            const spotLat = spot.lat !== undefined ? Number(spot.lat) : Number(spot?.location?.coordinates?.[1]);
            const isSameLocation = !isNaN(currentLon) && !isNaN(currentLat) && currentLon === spotLon && currentLat === spotLat;

            return isSameId || isSameLocation;
        });

        if (!isDuplicate) return acc.concat([current]);
        return acc;
    }, []);

    const getForecast = async (lat, lon) => {
        try {
            const response = await getWeatherForLocation(lat, lon);
            setForecast(response.data); 
        } catch (error) {
            console.error("[Forecast Fetch Error]:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch complete weather data.");
        }
    };

    const getCardinalDirection = (angle) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(angle / 45) % 8];
    };

    const handleRegionChangeComplete = (region) => {
        const newBounds = {
            south: region.latitude - (region.latitudeDelta / 2),
            north: region.latitude + (region.latitudeDelta / 2),
            west: region.longitude - (region.longitudeDelta / 2),
            east: region.longitude + (region.longitudeDelta / 2)
        };
        
        setCurrentBounds(newBounds);
        handleMapDiscovery(newBounds, false);
        setShowDeepSearchButton(true);
    };

    return (
        <View style={surfMapStyles.container}>
            
            {/* NEW: Custom "Locate Me" Floating Button */}
            {hasLocationPermission && userCoords && (
                <TouchableOpacity style={surfMapStyles.locateMeBtn} onPress={handleLocateMe}>
                    <Text style={surfMapStyles.locateIcon}>🎯</Text>
                </TouchableOpacity>
            )}

            {showDeepSearchButton && (
                <View style={surfMapStyles.floatingSearchWrapper}>
                    <TouchableOpacity 
                        style={[
                            surfMapStyles.floatingSearchBtn, 
                            searchesLeft === 0 && surfMapStyles.floatingSearchBtnLimit
                        ]}
                        onPress={async () => {
                            if (currentBounds) {
                                setIsDeepSearching(true);
                                await handleMapDiscovery(currentBounds, true);
                                setIsDeepSearching(false);
                                setShowDeepSearchButton(false);
                            }
                        }}
                        disabled={isDeepSearching || searchesLeft === 0}
                    >
                        <Text style={[
                            surfMapStyles.floatingSearchText,
                            searchesLeft === 0 && surfMapStyles.floatingSearchTextLimit
                        ]}>
                            {isDeepSearching 
                                ? '🔄 Searching...' 
                                : searchesLeft === 0 
                                    ? '⛔ Hourly Limit Reached' 
                                    : searchesLeft !== null 
                                        ? `🔍 Search deeply (${searchesLeft} left)` 
                                        : '🔍 Search deeply in this area'
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <MapView 
                ref={mapRef}
                style={surfMapStyles.map} 
                initialRegion={DEFAULT_CENTER}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={hasLocationPermission} // NEW: Turns on the native Blue Dot
                showsMyLocationButton={false} // We disabled the default button to use our custom one
            >
                {uniqueMapSpots.map((spot, index) => {                    
                    const lat = spot.lat !== undefined ? Number(spot.lat) : Number(spot.location.coordinates[1]);
                    const lon = spot.lon !== undefined ? Number(spot.lon) : Number(spot.location.coordinates[0]);
                    const name = spot.name || spot.display_name?.split(',')[0] || 'Unknown Spot';
                    const isTarget = targetLat !== null && targetLon !== null && 
                                     Number(targetLat) === lat && 
                                     Number(targetLon) === lon;
                    return (
                        <Marker 
                            key={index} 
                            coordinate={{ latitude: lat, longitude: lon }} 
                            onPress={() => {
                                setSelectedMarker({ ...spot, lat, lon, name, isTarget });
                                setForecast(null); 
                                getForecast(lat, lon);
                            }}
                        >
                            <Text style={surfMapStyles.markerIcon}>{getSpotIcon(spot, isTarget)}</Text>
                        </Marker>
                    );
                })}
            </MapView>

            {selectedMarker && (
                <View style={surfMapStyles.bottomCardContainer}>
                    <TouchableOpacity 
                        style={surfMapStyles.closeCardButton} 
                        onPress={() => setSelectedMarker(null)}
                    >
                        <Text style={surfMapStyles.closeCardText}>✕</Text>
                    </TouchableOpacity>

                    <View style={surfMapStyles.calloutHeader}>
                        <Text style={surfMapStyles.calloutLabel}>Spot</Text>
                        <View style={surfMapStyles.calloutTitleRow}>
                            <Text style={surfMapStyles.calloutTitle}>{selectedMarker.name}</Text>
                            {user && selectedMarker.matchScore !== undefined && (
                                <Text style={surfMapStyles.matchScore}>⭐ {selectedMarker.matchScore}/100</Text>
                            )}
                        </View>
                    </View>

                    {!forecast ? (
                        <Text style={surfMapStyles.loadingText}>Loading live weather...</Text>
                    ) : (
                        <View style={surfMapStyles.weatherGrid}>
                            <Text style={[
                                surfMapStyles.windArrow, 
                                { transform: [{ rotate: `${forecast.wind_direction_10m?.[0] || 0}deg` }] }
                            ]}>
                                ↓
                            </Text>
                            <View style={surfMapStyles.weatherStat}>
                                <Text style={surfMapStyles.statLabel}>DIRECTION</Text>
                                <Text style={surfMapStyles.statValue}>
                                    {forecast.wind_direction_10m?.[0]}° ({getCardinalDirection(forecast.wind_direction_10m?.[0])})
                                </Text>
                            </View>
                            <View style={surfMapStyles.weatherStat}>
                                <Text style={surfMapStyles.statLabel}>SPEED</Text>
                                <Text style={surfMapStyles.statValue}>
                                    {Math.round(forecast.wind_speed_10m?.[0] || 0)} kts
                                </Text>
                            </View>
                        </View>
                    )}

                    {forecast?.wave_height && forecast.wave_height[0] !== null && (
                        <View style={surfMapStyles.wavesContainer}>
                            <Text style={surfMapStyles.wavesText}>
                                🌊 Waves: <Text style={surfMapStyles.wavesBold}>{forecast.wave_height[0]}m</Text>
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default SurfMap;