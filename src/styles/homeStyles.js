import { StyleSheet } from 'react-native';
import { theme } from './globalStyles';

export const homeStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: theme.colors.sandyWhite,
    },
    scrollContainer: {
        padding: theme.spacing.padding,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        color: '#2c3e50',
        marginBottom: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        color: '#7f8c8d',
        fontSize: 16,
        textAlign: 'center',
    },
    
    // Cards
    spotCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eaeaea',
        overflow: 'hidden',
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        // Android Shadow
        elevation: 3,
    },
    spotCardHeader: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    spotCardTitle: {
        color: '#2c3e50',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    spotCountry: {
        fontSize: 14,
        color: '#95a5a6',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    spotCardBody: {
        padding: 20,
    },

    // Weather Grid
    weatherGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    weatherStat: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        backgroundColor: '#fdfdfd',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 10,
    },
    weatherStatFullWidth: {
        width: '100%',
        backgroundColor: '#e3f2fd',
        borderColor: '#bbdefb',
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
    },
    statUnit: {
        fontSize: 14,
        color: '#2c3e50',
    },
    statLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    windDirectionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    windArrow: {
        fontWeight: 'bold',
        color: theme.colors.primaryBlue,
        fontSize: 18,
    },

    // Actions
    actionButton: {
        width: '100%',
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
        alignItems: 'center',
    },
    actionButtonText: {
        color: theme.colors.primaryBlue,
        fontWeight: '600',
        fontSize: 16,
    },

    // Empty & Loading States
    emptyDashboard: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    emptyStateIcon: {
        fontSize: 50,
        marginBottom: 15,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateText: {
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    exploreButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: theme.colors.primaryBlue,
        borderRadius: 25,
    },
    exploreButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    noDataText: {
        color: '#7f8c8d',
        textAlign: 'center',
        fontStyle: 'italic',
        padding: 10,
    }
});