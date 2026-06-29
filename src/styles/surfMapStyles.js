import { StyleSheet } from 'react-native';
import { theme } from './globalStyles';

export const surfMapStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    map: {
        flex: 1,
        width: '100%',
    },
    
    // Floating Deep Search Button
    floatingSearchWrapper: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        zIndex: 1000,
        elevation: 5, // Android shadow
    },
    // --- NEW: Locate Me Button ---
    locateMeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 100, // Keeps it above the map
    },
    locateIcon: {
        fontSize: 20,
    },
    floatingSearchBtn: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
    },
    floatingSearchBtnLimit: {
        backgroundColor: '#ffebee',
        borderColor: '#ef9a9a',
        borderWidth: 1,
    },
    floatingSearchText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 14,
    },
    floatingSearchTextLimit: {
        color: '#d32f2f',
    },

    // Map Markers
    markerIcon: {
        fontSize: 28,
        // Text shadow gives emojis depth against the map background
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    // Map Popups (Callouts)
    calloutContainer: {
        width: 220,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    calloutHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        marginBottom: 10,
    },
    calloutLabel: {
        fontSize: 10,
        color: '#888',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    calloutTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 6,
    },
    matchScore: {
        fontSize: 12,
        backgroundColor: '#e7f3ff',
        color: theme.colors.primaryBlue,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },

    // Weather Data Inside Popup
    loadingText: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        marginVertical: 10,
    },
    weatherGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    windArrow: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    weatherStat: {
        flexDirection: 'column',
    },
    statLabel: {
        fontSize: 10,
        color: '#888',
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    wavesContainer: {
        backgroundColor: '#f9f9f9',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    wavesText: {
        fontSize: 14,
        color: '#555',
    },
    wavesBold: {
        fontWeight: 'bold',
    },
    bottomCardContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        // Stronger shadow for the floating effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 1000,
    },
    closeCardButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 5,
    },
    closeCardText: {
        fontSize: 18,
        color: '#888',
        fontWeight: 'bold',
    },
});

