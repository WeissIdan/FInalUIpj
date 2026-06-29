import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateUserProfile, updatePassword } from '../api/authService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../localization/translation';
import { ThemeContext } from '../context/ThemeContext';

import { 
    validatePhone, validateName, validateBirthday, validatePassword 
} from '../utils/validators.js';
import { globalStyles } from '../styles/globalStyles';

/*
 * User Profile Administration Component.
 * Provides a unified interface for modifying standard demographic data and cryptographic credentials.
 * Implements an intelligent state-hydration mechanism to update the global AuthContext immediately 
 * upon a successful database mutation, preventing UI staleness without requiring a full page reload.
 */
const UpdateUser = () => {
    const { user, logout, login } = useContext(AuthContext);
    const { colors } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        firstname: "", lastname: "", phonenum: "", birthday: "", gender: "",
        oldPassword: "", newPassword: "", confirmPassword: ""
    });
    
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleUnifiedSave = async () => {
        setErrors({});
        const newErrors = {};

        const userId = user?.id || user?._id;

        // --- Phase 1: Pre-flight Validation ---
        if (formData.firstname && !validateName(formData.firstname)) newErrors.firstname = "Invalid Name";
        if (formData.lastname && !validateName(formData.lastname)) newErrors.lastname = "Invalid Name";
        if (formData.birthday && !validateBirthday(formData.birthday)) newErrors.birthday = "Invalid Birthday (YYYY-MM-DD)";
        if (formData.phonenum && !validatePhone(formData.phonenum)) newErrors.phonenum = "Invalid Phone";

        if (formData.newPassword) {
            if (!formData.oldPassword) newErrors.oldPassword = "Current password required to change";
            if (!validatePassword(formData.oldPassword)) newErrors.oldPassword = "Invalid current password";
            if (!validatePassword(formData.newPassword)) newErrors.newPassword = "New password must be 8+ chars with uppercase, lowercase, and a number";
            if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        }

        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        setLoading(true);
        setErrorMsg(null);
        
        try {
            // --- Phase 2: Demographic Profile Synchronization ---
            const profileUpdates = {};
            ['firstname', 'lastname', 'phonenum', 'birthday', 'gender'].forEach(key => {
                if (formData[key]) profileUpdates[key] = formData[key];
            });

            if (Object.keys(profileUpdates).length > 0) {
                await updateUserProfile(userId, profileUpdates);
                
                // Context Hydration Strategy:
                if (profileUpdates.firstname || profileUpdates.lastname) {
                    const updatedUserContext = { 
                        ...user, 
                        ...profileUpdates 
                    };

                    // NEW: Retrieve the existing token securely from native storage
                    // Note: If your AuthContext uses a different key like 'userToken', change it here!
                    const currentToken = await AsyncStorage.getItem('token');
                    
                    if (currentToken) {
                        login(updatedUserContext, currentToken);
                    } else {
                        console.error("Could not locate existing token during profile hydration");
                    }
                }
            }

            // --- Phase 3: Cryptographic Credential Update ---
            if (formData.newPassword) {
                await updatePassword(userId, { 
                    oldPassword: formData.oldPassword, 
                    newPassword: formData.newPassword 
                });
            }

            Alert.alert(
                "Success", 
                "System Profile successfully updated!", 
                [{ text: "OK", onPress: () => navigation.navigate('Dashboard') }]
            );
            
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "An error occurred during the update transaction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={[globalStyles.authPageWrapper, { backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
            <View style={[globalStyles.profileSubNav, { width: '100%', maxWidth: 400 }]}>
                <TouchableOpacity 
                    style={globalStyles.subNavBtn} 
                    onPress={() => navigation.navigate('SurfProfile')}
                >
                    <Text style={globalStyles.subNavBtnText}>{i18n.t('surfGear')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[globalStyles.subNavBtn, globalStyles.subNavBtnActive]}>
                    <Text style={globalStyles.subNavBtnTextActive}>{i18n.t('account')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={globalStyles.subNavBtn} onPress={logout}>
                    <Text style={globalStyles.logoutBtnText}>{i18n.t('logout')}</Text>
                </TouchableOpacity>
            </View>

            
            <View style={[globalStyles.authCard, { backgroundColor: colors.background }]}>
                <Text style={globalStyles.authTitle}>{i18n.t('profileSettings')}</Text>

                {errorMsg && (
                    <View style={globalStyles.errorBanner}>
                        <Text style={globalStyles.errorBannerTitle}>{i18n.t('profileError')}</Text>
                        <Text style={globalStyles.errorBannerText}>{errorMsg}</Text>
                    </View>
                )}

                <View style={globalStyles.formContainer}>
                    {/* Demographic Fields */}
                    <View>
                        <TextInput 
                            placeholder={i18n.t('firstName')} 
                            value={formData.firstname} 
                            onChangeText={(val) => handleChange('firstname', val)}
                            style={[globalStyles.input, errors.firstname && globalStyles.inputError]} 
                        />
                        {errors.firstname && <Text style={globalStyles.errorText}>{errors.firstname}</Text>}
                    </View>

                    <View>
                        <TextInput 
                            placeholder={i18n.t('lastName')} 
                            value={formData.lastname} 
                            onChangeText={(val) => handleChange('lastname', val)}
                            style={[globalStyles.input, errors.lastname && globalStyles.inputError]} 
                        />
                        {errors.lastname && <Text style={globalStyles.errorText}>{errors.lastname}</Text>}
                    </View>

                    <View>
                        <TextInput 
                            placeholder={i18n.t('phoneNumber')}
                            keyboardType="phone-pad"
                            value={formData.phonenum} 
                            onChangeText={(val) => handleChange('phonenum', val)}
                            style={[globalStyles.input, errors.phonenum && globalStyles.inputError]} 
                        />
                        {errors.phonenum && <Text style={globalStyles.errorText}>{errors.phonenum}</Text>}
                    </View>

                    <View>
                        <TextInput 
                            placeholder={i18n.t('birthday')}
                            value={formData.birthday} 
                            onChangeText={(val) => handleChange('birthday', val)}
                            style={[globalStyles.input, errors.birthday && globalStyles.inputError]} 
                        />
                        {errors.birthday && <Text style={globalStyles.errorText}>{errors.birthday}</Text>}
                    </View>
                    
                    {/* Cryptographic Security Section Toggle */}
                    <TouchableOpacity 
                        style={globalStyles.secondaryButton} 
                        onPress={() => setShowPasswordFields(!showPasswordFields)}
                    >
                        <Text style={globalStyles.secondaryButtonText}>
                            {showPasswordFields ? i18n.t('cancelPassword') : i18n.t('changePassword')}
                        </Text>
                    </TouchableOpacity>

                    {/* Conditional Rendering: Cryptographic Fields */}
                    {showPasswordFields && (
                        <View style={globalStyles.formContainer}>
                            <View>
                                <TextInput 
                                    secureTextEntry
                                    placeholder={i18n.t('currentPassword')}
                                    value={formData.oldPassword}
                                    onChangeText={(val) => handleChange('oldPassword', val)}
                                    style={[globalStyles.input, errors.oldPassword && globalStyles.inputError]} 
                                />
                                {errors.oldPassword && <Text style={globalStyles.errorText}>{errors.oldPassword}</Text>}
                            </View>
                            
                            <View>
                                <TextInput 
                                    secureTextEntry
                                    placeholder={i18n.t('newPassword')}
                                    value={formData.newPassword}
                                    onChangeText={(val) => handleChange('newPassword', val)}
                                    style={[globalStyles.input, errors.newPassword && globalStyles.inputError]} 
                                />
                                {errors.newPassword && <Text style={globalStyles.errorText}>{errors.newPassword}</Text>}
                            </View>
                            
                            <View>
                                <TextInput 
                                    secureTextEntry
                                    placeholder={i18n.t('confirmNewPassword')}
                                    value={formData.confirmPassword}
                                    onChangeText={(val) => handleChange('confirmPassword', val)}
                                    style={[globalStyles.input, errors.confirmPassword && globalStyles.inputError]} 
                                />
                                {errors.confirmPassword && <Text style={globalStyles.errorText}>{errors.confirmPassword}</Text>}
                            </View>
                        </View>
                    )}

                    {/* Submission */}
                    <TouchableOpacity 
                        style={[globalStyles.primaryButton, loading && globalStyles.primaryButtonDisabled]}
                        onPress={handleUnifiedSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={globalStyles.primaryButtonText}>{i18n.t('saveAllChanges')}</Text>
                        )}
                    </TouchableOpacity>

                    {/* Delete Account (Danger Zone) */}
                    <TouchableOpacity 
                        style={globalStyles.dangerBtn}
                        onPress={() => {
                            Alert.alert(
                                i18n.t('deleteAccount'), 
                                i18n.t('deleteAccountConfirm'),
                                [
                                    { text: i18n.t('cancel'), style: "cancel" },
                                    { 
                                        text: i18n.t('delete'), 
                                        style: "destructive",
                                        onPress: () => {
                                            // Call your delete API here, e.g., deleteMyAccount()
                                            // Then logout()
                                            Alert.alert("Notice", "Hook this up to your delete API route!");
                                        }
                                    }
                                ]
                            );
                        }}
                    >
                        <Text style={globalStyles.dangerBtnText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default UpdateUser;