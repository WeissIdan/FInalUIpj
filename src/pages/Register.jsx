import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser, sendCode } from '../api/authService.js';
import { 
    validateEmail, 
    validatePassword, 
    validatePhone, 
    validateName, 
    validateBirthday 
} from '../utils/validators.js';
import { globalStyles } from '../styles/globalStyles';

const Register = () => {
    const [user, setUser] = useState({
        firstname: "", 
        lastname: "", 
        password: "",
        email: "",
        phonenum: "",  
        birthday: "",
        gender: "male" 
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); 
    const [errorMsg, setErrorMsg] = useState(null);
    const navigation = useNavigation();

    const changeField = (field, value) => {
        setUser(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleRegister = async () => {
        setErrors({});
        setErrorMsg(null);

        const newErrors = {};
        if (!validateName(user.firstname)) newErrors.firstname = "First name must be at least 2 letters, and contain only letters";
        if (!validateName(user.lastname)) newErrors.lastname = "Last name must be at least 2 letters, and contain only letters";
        if (!validatePassword(user.password)) newErrors.password = "Password needs 8+ chars, uppercase, lowercase, and a number";
        if (!validateEmail(user.email)) newErrors.email = "Please enter a valid email address";
        if (!validatePhone(user.phonenum)) newErrors.phonenum = "Phone must follow 05XXXXXXXX format";
        if (!validateBirthday(user.birthday)) newErrors.birthday = "Birth date cannot be in the future";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await registerUser(user);
            
            await sendCode(response.data.userId); 
            Alert.alert('Success', 'Registration successful! Check email for activation code.');
            
            navigation.navigate('Verify', { userId: response.data.userId, isFirstTime: true });
        } catch (error) {
            if (error.response?.status !== 429) {
                setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.authPageWrapper}>
            <View style={globalStyles.authCard}>
                <Text style={globalStyles.authTitle}>Register Page</Text>

                {errorMsg && (
                    <View style={globalStyles.errorBanner}>
                        <Text style={globalStyles.errorBannerTitle}>Registration Error</Text>
                        <Text style={globalStyles.errorBannerText}>{errorMsg}</Text>
                    </View>
                )}

                <View style={globalStyles.formContainer}>
                    <TextInput 
                        style={[globalStyles.input, errors.firstname && globalStyles.inputError]}
                        placeholder='First Name' 
                        onChangeText={(value) => changeField("firstname", value)} 
                    />
                    {errors.firstname && <Text style={globalStyles.errorText}>{errors.firstname}</Text>}

                    <TextInput 
                        style={[globalStyles.input, errors.lastname && globalStyles.inputError]}
                        placeholder='Last Name' 
                        onChangeText={(value) => changeField("lastname", value)} 
                    />
                    {errors.lastname && <Text style={globalStyles.errorText}>{errors.lastname}</Text>}

                    <TextInput
                        style={[globalStyles.input, errors.password && globalStyles.inputError]}                     
                        placeholder='Password' 
                        secureTextEntry
                        onChangeText={(value) => changeField("password", value)} 
                    />
                    {errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}

                    <TextInput 
                        style={[globalStyles.input, errors.email && globalStyles.inputError]}                    
                        placeholder='Email' 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(value) => changeField("email", value)} 
                    />
                    {errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}

                    <TextInput 
                        style={[globalStyles.input, errors.phonenum && globalStyles.inputError]}                        
                        placeholder='Phone Number' 
                        keyboardType="phone-pad"
                        onChangeText={(value) => changeField("phonenum", value)} 
                    />
                    {errors.phonenum && <Text style={globalStyles.errorText}>{errors.phonenum}</Text>}
                    
                    <TextInput 
                        style={[globalStyles.input, errors.birthday && globalStyles.inputError]}
                        placeholder='Birthday (YYYY-MM-DD)' 
                        onChangeText={(value) => changeField("birthday", value)} 
                    />
                    {errors.birthday && <Text style={globalStyles.errorText}>{errors.birthday}</Text>}
            
                    <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                        <Text>Gender:</Text>
                        <TouchableOpacity onPress={() => changeField("gender", "male")}>
                            <Text style={user.gender === "male" ? globalStyles.linkText : {}}>
                                {user.gender === "male" ? "☑ Male" : "☐ Male"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeField("gender", "female")}>
                            <Text style={user.gender === "female" ? globalStyles.linkText : {}}>
                                {user.gender === "female" ? "☑ Female" : "☐ Female"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={globalStyles.primaryButton} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={globalStyles.primaryButtonText}>Register</Text>}
                    </TouchableOpacity>
                </View>
                
                <Text style={globalStyles.authFooterText}>
                    Already have an account?{' '}
                    <Text style={globalStyles.linkText} onPress={() => navigation.navigate('Login')}>
                        Login here
                    </Text>
                </Text>
            </View>
        </View>
    );
};

export default Register;