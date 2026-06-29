import { StyleSheet, Platform } from 'react-native';

// 1. THEME VARIABLES
// Centralized colors and values exported for use in inline dynamic styles if needed.
export const theme = {
    colors: {
        primaryBlue: '#0077be',
        primaryBlueHover: '#005fa3',
        sandyWhite: '#f4f1ea',
        darkGrey: '#333333',
        lightGrey: '#cccccc',
        errorRed: '#d9534f',
        errorRedBg: '#fffcfc',
        successGreen: '#28a745',
    },
    spacing: {
        base: 15,
        padding: 20,
    }
};

// 2. GLOBAL STYLESHEET
export const globalStyles = StyleSheet.create({
    // Shared Layout
    container: {
        flex: 1,
        backgroundColor: theme.colors.sandyWhite,
    },
    authPageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.padding,
        backgroundColor: theme.colors.sandyWhite,
    },
    authCard: {
        backgroundColor: '#ffffff',
        padding: 30,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Android Shadow
        elevation: 5,
    },
    
    // Typography
    authTitle: {
        fontSize: 24,
        color: theme.colors.primaryBlue,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    authFooterText: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    linkText: {
        color: theme.colors.primaryBlue,
        fontWeight: '600',
    },

    // Forms & Inputs
    formContainer: {
        gap: 15, // React Native now supports gap for Flexbox
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors.lightGrey,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    inputError: {
        borderColor: theme.colors.errorRed,
        backgroundColor: theme.colors.errorRedBg,
    },
    
    // Buttons
    primaryButton: {
        backgroundColor: theme.colors.primaryBlue,
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    primaryButtonDisabled: {
        backgroundColor: '#a0c4db',
        opacity: 0.8,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primaryBlue,
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    secondaryButtonText: {
        color: theme.colors.primaryBlue,
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Error States
    errorText: {
        color: theme.colors.errorRed,
        fontSize: 12,
        marginTop: -10,
        marginBottom: 5,
        fontWeight: '500',
    },
    errorBanner: {
        backgroundColor: '#fdeaea',
        borderLeftWidth: 5,
        borderLeftColor: '#d93025',
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
    },
    errorBannerTitle: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorBannerText: {
        fontSize: 14,
        color: '#333',
    }
});