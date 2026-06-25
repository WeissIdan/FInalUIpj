import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
 * Centralized API Service Configuration.
 * Instantiates the primary Axios client and orchestrates all outbound HTTP requests to the backend server.
 */

// EXPO NOTE: Use process.env.EXPO_PUBLIC_API_URL for environment variables.
// 10.0.2.2 is the special alias to your host loopback interface for Android emulators.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

const authApi = axios.create({
    baseURL: API_URL,
    withCredentials: true 
});

/*
 * Axios Request Interceptor (Security Middleware).
 * Intercepts every outbound request prior to dispatch to dynamically append the JWT from AsyncStorage.
 */
authApi.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Storage Error: Failed to retrieve JWT", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

 
// ALL DOMAIN METHODS

// USER DOMAIN (Authentication & Profile Administration)
const registerUser = (userData) => authApi.post('/user/register', userData);
const loginUser = (credentials) => authApi.post('/user/login', credentials);
const sendCode = (id) => authApi.post('/user/send-code', { id });
const confirmStatus = (data) => authApi.post('/user/confirm-status', data);
const verifyLogin = (data) => authApi.post('/user/verify-login', data);
const updateUserProfile = (id, profileData) => authApi.patch(`/user/update-profile/${id}`, profileData);
const updatePassword = (id, passwordData) => authApi.patch(`/user/update-password/${id}`, passwordData);
const deleteUser = (id) => authApi.delete(`/user/delete-user/${id}`);

// SURF PROFILE DOMAIN (Preferences & Favorites)
const toggleFavoriteSpot = (spotData) => authApi.post('/surf/toggle-favorite', spotData);
const getMyFavorites = () => authApi.get('/surf/my-favorites');
const getMyProfile = () => authApi.get('/surf/profile');
const updateMyProfile = (profileData) => authApi.post('/surf/profile', profileData);

// SPOT DOMAIN (Internal Database Queries)
const getAllSpots = () => authApi.get('/spot/all'); 
const getSpotsByBox = (bbox) => authApi.get('/spot/discover', {
    params: {
        west: bbox.west,
        south: bbox.south,
        east: bbox.east,
        north: bbox.north
    }
});

// PROXY DOMAIN (External API Routing)
const searchLocations = (q, filters = {}) => authApi.get('/proxy/search', { params: { q, ...filters } });
const getNearbySpots = (lat, lon, excludePlaceId) => authApi.get('/proxy/spots-nearby', { params: { lat, lon, excludePlaceId } });
const searchByBoxAPI = (bbox) => authApi.get('/proxy/discover', { 
    params: { 
        west: bbox.west, 
        south: bbox.south, 
        east: bbox.east, 
        north: bbox.north 
    } 
});

// METEOROLOGICAL DOMAIN (Weather Forecasts)
const getWeatherForLocation = (lat, lon) => authApi.get('/weather/forecasts', { params: { lat, lon } });

// REVIEW DOMAIN (User Generated Content)
const addOrUpdateReview = (reviewData) => authApi.post('/review', reviewData);
const getSpotReviewsAndStats = (spotId, page = 1, limit = 10) => 
    authApi.get(`/review/${spotId}`, { params: { page, limit } });

export { 
    authApi,
    registerUser, 
    loginUser, 
    sendCode, 
    confirmStatus, 
    verifyLogin, 
    updateUserProfile,
    updatePassword,
    deleteUser,
    toggleFavoriteSpot, 
    getMyFavorites, 
    getMyProfile,
    updateMyProfile,
    getAllSpots,
    searchLocations,
    searchByBoxAPI,
    getSpotsByBox,
    getWeatherForLocation,
    addOrUpdateReview,
    getSpotReviewsAndStats,
    getNearbySpots
};