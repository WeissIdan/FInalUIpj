//import { StyleSheet, Platform } from 'react-native';

// 1. THEME VARIABLES
// Centralized colors and values exported for use in inline dynamic styles if needed.
// export const theme = {
//     colors: {
//         primaryBlue: '#0077be',
//         primaryBlueHover: '#005fa3',
//         sandyWhite: '#f4f1ea',
//         darkGrey: '#333333',
//         lightGrey: '#cccccc',
//         errorRed: '#d9534f',
//         errorRedBg: '#fffcfc',
//         successGreen: '#28a745',
//     },
//     spacing: {
//         base: 15,
//         padding: 20,
//     }
// };
import { StyleSheet } from 'react-native';

// 1. THEME VARIABLES
export const lightColors = {
    background: '#f4f1ea',
    card: '#ffffff',
    text: '#333333',
    subText: '#666666',
    border: '#cccccc',
    primaryBlue: '#0077be',
    errorRed: '#d9534f',
    errorRedBg: '#fffcfc',
    inputBg: '#ffffff',
};

export const darkColors = {
    background: '#0B132B',   // Deep midnight ocean blue
    card: '#1C2541',         // Lighter slate blue so cards pop off the background
    text: '#F4F6F8',         // Crisp off-white (much easier to read than pure white)
    subText: '#8D99AE',      // Muted cool grey-blue for secondary text/placeholders
    border: '#3A506B',       // Subtle mid-tone blue for clean dividers
    primaryBlue: '#48CAE4',  // Vibrant cyan that glows beautifully against dark navy
    errorRed: '#FF5D73',     // Soft neon red for alerts
    errorRedBg: '#2A0D12',   // Very dark tinted red for error banners
    inputBg: '#050914',      // "Abyss" blue (darker than background) so inputs look indented
};

export const spacing = {
    base: 15,
    padding: 20,
};

export const theme = {
    colors: {
        ...lightColors,
        sandyWhite: lightColors.background,
        darkGrey: lightColors.text,
        lightGrey: lightColors.border,
        successGreen: '#28a745',
        primaryBlueHover: '#005fa3'
    },
    spacing: spacing
};

// 2. GLOBAL STYLESHEET (Defaults to lightColors for the baseline)
export const globalStyles = StyleSheet.create({
    // Shared Layout
    container: {
        flex: 1,
        backgroundColor: lightColors.background,
    },
    authPageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.padding,
        backgroundColor: lightColors.background,
    },
    authCard: {
        backgroundColor: lightColors.card,
        padding: 30,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    
    // Typography
    authTitle: {
        fontSize: 24,
        color: lightColors.primaryBlue,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    authFooterText: {
        marginTop: 20,
        fontSize: 14,
        color: lightColors.subText,
        textAlign: 'center',
    },
    linkText: {
        color: lightColors.primaryBlue,
        fontWeight: '600',
    },

    // Forms & Inputs
    formContainer: {
        gap: 15, 
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: lightColors.border,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: lightColors.inputBg,
    },
    inputError: {
        borderColor: lightColors.errorRed,
        backgroundColor: lightColors.errorRedBg,
    },
    
    // Buttons
    primaryButton: {
        backgroundColor: lightColors.primaryBlue,
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
        borderColor: lightColors.primaryBlue,
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    secondaryButtonText: {
        color: lightColors.primaryBlue,
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Error States
    errorText: {
        color: lightColors.errorRed,
        fontSize: 12,
        marginTop: -10,
        marginBottom: 5,
        fontWeight: '500',
    },
    errorBanner: {
        backgroundColor: lightColors.errorRedBg,
        borderLeftWidth: 5,
        borderLeftColor: lightColors.errorRed,
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
    },
    errorBannerTitle: {
        color: lightColors.errorRed,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorBannerText: {
        fontSize: 14,
        color: lightColors.text,
    },

    // Sub-Navigation Menu (For Profile Tabs)
    profileSubNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 5,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: lightColors.border,
    },
    subNavBtn: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#f0f0f0', // Kept static for contrast
    },
    subNavBtnActive: {
        backgroundColor: lightColors.primaryBlue,
    },
    subNavBtnText: {
        color: '#555', // Kept static for contrast
        fontWeight: 'bold',
        fontSize: 13,
    },
    subNavBtnTextActive: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
    logoutBtnText: {
        color: lightColors.errorRed,
        fontWeight: 'bold',
        fontSize: 13,
    },

    // Danger Zone
    dangerBtn: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: lightColors.errorRed,
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    dangerBtnText: {
        color: lightColors.errorRed,
        fontWeight: 'bold',
        fontSize: 16,
    }
});