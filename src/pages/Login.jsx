import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser, sendCode } from '../api/authService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { globalStyles } from '../styles/globalStyles';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    
    const { login } = useContext(AuthContext);
    const navigation = useNavigation();

    const changeField = (field, value) => {
        setCredentials(prevState => ({ ...prevState, [field]: value }));
    };

    const handleLogin = async () => {
        setErrors({});
        setErrorMsg(null);

        const newErrors = {};        
        if (!validateEmail(credentials.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!validatePassword(credentials.password)) {
            newErrors.password = "Password must be 8+ chars with Big/Small letters and numbers";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await loginUser(credentials);
            
            if (response.data.requiresVerification) {
                await sendCode(response.data.userId);
                navigation.navigate('Verify', { userId: response.data.userId });
            } else {
                login(response.data.user, response.data.token);
            }
        } catch (error) {
            if (error.response?.status !== 429) {
                setErrorMsg(error.response?.data?.message || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.authPageWrapper}>
            <View style={globalStyles.authCard}>
                <Text style={globalStyles.authTitle}>Login Page</Text>

                {errorMsg && (
                    <View style={globalStyles.errorBanner}>
                        <Text style={globalStyles.errorBannerTitle}>We couldn't sign you in</Text>
                        <Text style={globalStyles.errorBannerText}>{errorMsg}</Text>
                    </View>
                )}

                <View style={globalStyles.formContainer}>
                    <TextInput 
                        style={[globalStyles.input, errors.email && globalStyles.inputError]}
                        placeholder='Email' 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(value) => changeField("email", value)}
                    />
                    {errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}
                    
                    <TextInput 
                        style={[globalStyles.input, errors.password && globalStyles.inputError]}
                        placeholder='Password' 
                        secureTextEntry
                        onChangeText={(value) => changeField("password", value)} 
                    />
                    {errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}
                    
                    <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={globalStyles.primaryButtonText}>Login</Text>}
                    </TouchableOpacity>
                </View>
                
                <Text style={globalStyles.authFooterText}>
                    Don't have an account?{' '}
                    <Text style={globalStyles.linkText} onPress={() => navigation.navigate('Register')}>
                        Register here
                    </Text>
                </Text>
            </View>
        </View>
    );
};

export default Login;