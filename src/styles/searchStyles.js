import { StyleSheet } from 'react-native';
import { theme } from './globalStyles';

export const searchStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginBottom: 15,
        width: '100%',
    },
    // The main capsule
    searchBarWrapper: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        width: '100%',
        // Default Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchBarFocused: {
        borderColor: theme.colors.primaryBlue,
        shadowColor: theme.colors.primaryBlue,
        shadowOpacity: 0.15,
        elevation: 4,
    },
    
    // Sport Selection Chips (Replaces Web Dropdown)
    sportsScrollContainer: {
        flexGrow: 0,
        marginBottom: 10,
    },
    sportChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sportChipActive: {
        backgroundColor: '#e3f2fd',
        borderColor: theme.colors.primaryBlue,
    },
    sportChipText: {
        fontSize: 14,
        color: '#444',
        fontWeight: '600',
    },
    sportChipTextActive: {
        color: theme.colors.primaryBlue,
    },

    // Inputs & Buttons
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: theme.colors.darkGrey,
    },
    searchButton: {
        backgroundColor: theme.colors.primaryBlue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },

    // Advanced Filters Panel
    advancedWrapper: {
        alignItems: 'center',
        marginTop: 10,
    },
    toggleButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    toggleButtonText: {
        color: theme.colors.primaryBlue,
        fontWeight: '600',
        fontSize: 14,
    },
    filtersPanel: {
        marginTop: 15,
        padding: 20,
        backgroundColor: '#f8fbff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.primaryBlue,
        width: '100%',
        gap: 20, // Applies spacing between filter groups
    },
    filterGroup: {
        flexDirection: 'column',
        gap: 8,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
    numericInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    numericInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        width: 60,
        textAlign: 'center',
        fontSize: 14,
    },
    numericSeparator: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    }
});