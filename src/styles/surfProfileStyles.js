import { StyleSheet } from 'react-native';
import { theme } from './globalStyles';

export const surfProfileStyles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: theme.colors.sandyWhite,
        padding: 15,
        paddingBottom: 40,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primaryBlue,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    gearCard: {
        backgroundColor: '#fdfdfd',
        borderWidth: 1,
        borderColor: '#eaeaea',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    
    // Inputs & Groupings
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 6,
    },
    multiInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    flexInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    inputSeparator: {
        color: '#666',
        fontWeight: 'bold',
    },

    // Mobile Selection Chips (Replaces Checkboxes & Selects)
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipActive: {
        backgroundColor: '#e3f2fd',
        borderColor: theme.colors.primaryBlue,
    },
    chipText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '600',
    },
    chipTextActive: {
        color: theme.colors.primaryBlue,
    },

    // Sub-sections
    foilSetup: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderStyle: 'dashed',
    },
    subLabel: {
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 10,
    },

    // Buttons & Alerts
    saveBtn: {
        backgroundColor: theme.colors.primaryBlue,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveBtnDisabled: {
        backgroundColor: '#95a5a6',
    },
    saveBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorBanner: {
        backgroundColor: '#ffebee',
        padding: 15,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#d32f2f',
        marginBottom: 20,
    },
    errorText: {
        color: '#d32f2f',
        fontWeight: 'bold',
    }
});