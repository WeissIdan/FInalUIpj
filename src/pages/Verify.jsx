import React, { useState, useEffect, useContext } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmStatus, verifyLogin } from '../api/authService.js'; 
import { AuthContext } from '../context/AuthContext'; 
import { globalStyles } from '../styles/globalStyles';

const Verify = () => {
    // useRoute hooks into the navigation params passed from Login/Register
    const route = useRoute();
    const navigation = useNavigation();
    
    const [errorMsg, setErrorMsg] = useState(null);
    const { login } = useContext(AuthContext);
    
    const userId = route.params?.userId;
    const isFirstTime = route.params?.isFirstTime; 

    const [verificationData, setVerificationData] = useState({
        id: userId,
        code: ""   
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            Alert.alert("Error", "Verification context lost. Please initiate the process from the login page.");
            navigation.navigate('Login'); 
        }
    }, [userId, navigation]);
    
    const handleChange = (field, value) => {
        setVerificationData(prev => ({ ...prev, [field]: value }));
    };

    const handleVerify = async () => {
        setLoading(true); 
        setErrorMsg(null);
        try {
            if (isFirstTime) {
                await confirmStatus({ id: userId, code: verificationData.code });
                Alert.alert("Success", "Account securely activated! Please log in to establish a session.");
                navigation.navigate('Login');
            } else {
                const response = await verifyLogin({ id: userId, code: verificationData.code });
                login(response.data.user, response.data.token);
                // Once login() fires, RootNavigator swaps to AppTabs automatically.
            }
        } catch (error) {
            if (error.response?.status !== 429) {
                setErrorMsg(error.response?.data?.message || "Verification failed. Please ensure the code is correct.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.authPageWrapper}>
            <View style={globalStyles.authCard}>
                <Text style={globalStyles.authTitle}>Verify Your Email</Text>

                {errorMsg && (
                    <View style={globalStyles.errorBanner}>
                        <Text style={globalStyles.errorBannerTitle}>Verification Error</Text>
                        <Text style={globalStyles.errorBannerText}>{errorMsg}</Text>
                    </View>
                )}

                <Text style={{ marginBottom: 15, textAlign: 'center' }}>
                    Please enter the 6-digit code sent to your email address.
                </Text>
                
                <View style={globalStyles.formContainer}>
                    <TextInput 
                        style={globalStyles.input}
                        placeholder="6-Digit Code" 
                        keyboardType="number-pad"
                        onChangeText={(value) => handleChange("code", value)} 
                    />
                    <TouchableOpacity style={globalStyles.primaryButton} onPress={handleVerify} disabled={loading}>
                        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={globalStyles.primaryButtonText}>Verify</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Verify;