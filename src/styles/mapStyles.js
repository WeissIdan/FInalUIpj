import { StyleSheet } from 'react-native';
import { theme } from './globalStyles';

export const mapStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.sandyWhite,
    },
    header: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'transparent',
        // zIndex ensures the search bar dropdown (if any) renders over the map
        zIndex: 10, 
    },
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },
    loadingText: {
        color: theme.colors.primaryBlue,
        fontWeight: '500',
        fontSize: 14,
    },
    mapMain: {
        // flex: 1 forces this container to consume all remaining vertical space
        flex: 1, 
        backgroundColor: '#e0e0e0', // Placeholder color until map loads
    },
    footer: {
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
    },
    footerText: {
        fontSize: 12,
        color: '#888',
    },
    linkText: {
        color: theme.colors.primaryBlue,
        textDecorationLine: 'underline',
    }
});