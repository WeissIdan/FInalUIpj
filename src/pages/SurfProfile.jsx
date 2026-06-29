import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { AuthContext } from '../context/AuthContext.jsx'; 
import { globalStyles } from '../styles/globalStyles'; 
import { updateMyProfile, getMyProfile } from '../api/authService.js';
import { surfProfileStyles } from '../styles/surfProfileStyles';
import { ThemeContext } from '../context/ThemeContext';
import i18n from '../localization/translation';
const SurfProfile = () => {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext); 
    const { colors } = useContext(ThemeContext);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    
    
    const [profile, setProfile] = useState({
        user: '',
        skillLevel: 'Beginner',
        preferredTypes: [],
        preferredWindSurfStyles: [],
        preferredWingSurfStyles: [],
        preferredKiteSurfStyles: [],
        preferredWaveSurfStyles: [],
        
        foildetailsWing: { frontWingSize: 0, backWingSize: 0, mastLength: 0, material: 'Aluminum' },
        foildetailsKite: { frontWingSize: 0, backWingSize: 0, mastLength: 0, material: 'Aluminum' },
        foildetailsWind: { frontWingSize: 0, backWingSize: 0, mastLength: 0, material: 'Aluminum' },
        foildetailsWave: { frontWingSize: 0, backWingSize: 0, mastLength: 0, material: 'Aluminum' },

        waveboardLength: 6, waveboardWidth: 20, waveboardVolume: 30, wavefinType: 'Thruster',
        windboardLength: 6, windboardWidth: 20, windboardVolume: 30, sailSize: 4.5, windfinType: 'Thruster',
        wingSize: 5, wingboardLength: 5, wingboardWidth: 20, wingboardVolume: 30,
        kiteSize: 9, kiteboardLength: 5, kiteboardWidth: 20, kiteboardVolume: 30,

        sportConditions: {
            WaveSurfing: { minWaveHeight: 0.4, maxWaveHeight: 1.5, minWindSpeed: 0, maxWindSpeed: 10, favoriteWindConditions: [] },
            WindSurfing: { minWaveHeight: 0.4, maxWaveHeight: 1.5, minWindSpeed: 15, maxWindSpeed: 30, favoriteWindConditions: [] },
            WingSurfing: { minWaveHeight: 0.4, maxWaveHeight: 1.5, minWindSpeed: 12, maxWindSpeed: 25, favoriteWindConditions: [] },
            KiteSurfing: { minWaveHeight: 0.4, maxWaveHeight: 1.5, minWindSpeed: 14, maxWindSpeed: 28, favoriteWindConditions: [] }
        },
        alertsEnabled: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfile();
                if (res.data && res.data._id) {
                    setProfile(prev => ({
                        ...prev,
                        ...res.data,
                        sportConditions: {
                            ...prev.sportConditions,
                            ...(res.data.sportConditions || {})
                        }
                    }));
                }
            } catch (err) {
                console.error("[Profile Initialization Error]:", err);
            }
        };
        fetchProfile();
    }, []);

    const toggleInArray = (field, value) => {
        const currentItems = profile[field] || [];
        const updatedItems = currentItems.includes(value)
            ? currentItems.filter(item => item !== value)
            : [...currentItems, value];
        setProfile({ ...profile, [field]: updatedItems });
    };

    const handleFoilChange = (sportGroup, field, value) => {
        setProfile({
            ...profile,
            [sportGroup]: { ...profile[sportGroup], [field]: value }
        });
    };

    const handleConditionChange = (sport, field, value) => {
        setProfile(prev => ({
            ...prev,
            sportConditions: {
                ...prev.sportConditions,
                [sport]: { ...prev.sportConditions[sport], [field]: value }
            }
        }));
    };

    const toggleWindCondition = (sport, condition) => {
        setProfile(prev => {
            const currentConditions = prev.sportConditions[sport].favoriteWindConditions || [];
            const updatedConditions = currentConditions.includes(condition)
                ? currentConditions.filter(c => c !== condition)
                : [...currentConditions, condition];
            
            return {
                ...prev,
                sportConditions: {
                    ...prev.sportConditions,
                    [sport]: { ...prev.sportConditions[sport], favoriteWindConditions: updatedConditions }
                }
            };
        });
    };

    const handleSave = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            await updateMyProfile(profile);
            Alert.alert("Success", "Profile configuration persisted successfully!");
        } catch (err) {
            console.error("Save error details:", err.response?.data || err);
            setErrorMsg(`Error saving profile: ${err.response?.data?.error || "Transaction Failed."}`);
        }
        setLoading(false);
    };

    const getSportEmoji = (sport) => {
        const emojis = { WaveSurfing: '🌊', WindSurfing: '🌬️', WingSurfing: '🪂', KiteSurfing: '🪁' };
        return emojis[sport] || '';
    };

    // Reusable UI Component for mapping selection chips
    const ChipGroup = ({ options, selectedValues, onToggle, singleSelect = false }) => (
        <View style={surfProfileStyles.chipContainer}>
            {options.map(option => {
                const isSelected = singleSelect ? selectedValues === option : selectedValues.includes(option);
                return (
                    <TouchableOpacity 
                        key={option} 
                        style={[surfProfileStyles.chip, isSelected && surfProfileStyles.chipActive]}
                        onPress={() => onToggle(option)}
                    >
                        <Text style={[surfProfileStyles.chipText, isSelected && surfProfileStyles.chipTextActive]}>
                            {option.replace('-', ' ')}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <ScrollView contentContainerStyle={[surfProfileStyles.scrollContainer, { backgroundColor: colors.background }]}>            
            <View style={globalStyles.profileSubNav}>
                <TouchableOpacity style={[globalStyles.subNavBtn, globalStyles.subNavBtnActive]}>
                    <Text style={globalStyles.subNavBtnTextActive}>{i18n.t('surfGear')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={globalStyles.subNavBtn} 
                    onPress={() => navigation.navigate('UpdateUser')}
                >
                    <Text style={globalStyles.subNavBtnText}>{i18n.t('account')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={globalStyles.subNavBtn} onPress={logout}>
                    <Text style={globalStyles.logoutBtnText}>{i18n.t('logout')}</Text>
                </TouchableOpacity>
            </View>

            <Text style={surfProfileStyles.header}>{i18n.t('surfProfileTitle')}</Text>

            {errorMsg && (
                <View style={surfProfileStyles.errorBanner}>
                    <Text style={surfProfileStyles.errorText}>{errorMsg}</Text>
                </View>
            )}

            {/* 1. CORE EXPERIENCE & DISCIPLINE SELECTION */}
            <View style={surfProfileStyles.section}>
                <Text style={surfProfileStyles.sectionTitle}>{i18n.t('experienceSports')}</Text>
                
                <View style={surfProfileStyles.inputGroup}>
                    <Text style={surfProfileStyles.label}>{i18n.t('skillLevel')}</Text>
                    <ChipGroup 
                        options={['Beginner', 'Intermediate', 'Advanced', 'Pro']}
                        selectedValues={profile.skillLevel}
                        onToggle={(val) => setProfile({ ...profile, skillLevel: val })}
                        singleSelect={true}
                    />
                </View>

                <View style={surfProfileStyles.inputGroup}>
                    <Text style={surfProfileStyles.label}>{i18n.t('preferredSports')}</Text>
                    <ChipGroup 
                        options={['WaveSurfing', 'WindSurfing', 'WingSurfing', 'KiteSurfing']}
                        selectedValues={profile.preferredTypes}
                        onToggle={(val) => toggleInArray('preferredTypes', val)}
                    />
                </View>
            </View>

            {/* 2. SUB-DISCIPLINE STYLE PREFERENCES */}
            <View style={surfProfileStyles.section}>
                <Text style={surfProfileStyles.sectionTitle}>{i18n.t('stylePreferences')}</Text>

                {profile.preferredTypes.includes('WaveSurfing') && (
                    <View style={surfProfileStyles.inputGroup}>
                        <Text style={surfProfileStyles.label}>🌊 {i18n.t('waveStyles')}</Text>
                        <ChipGroup 
                            options={['Shortboard', 'Longboard', 'Fish', 'Foiling', 'Funboard', 'Gun', 'Hybrid']}
                            selectedValues={profile.preferredWaveSurfStyles}
                            onToggle={(val) => toggleInArray('preferredWaveSurfStyles', val)}
                        />
                    </View>
                )}

                {profile.preferredTypes.includes('WindSurfing') && (
                    <View style={surfProfileStyles.inputGroup}>
                        <Text style={surfProfileStyles.label}>🌬️ {i18n.t('windStyles')}</Text>
                        <ChipGroup 
                            options={['Freestyle', 'Freewave', 'Foiling', 'Race', 'Wave Riding']}
                            selectedValues={profile.preferredWindSurfStyles}
                            onToggle={(val) => toggleInArray('preferredWindSurfStyles', val)}
                        />
                    </View>
                )}

                {profile.preferredTypes.includes('WingSurfing') && (
                    <View style={surfProfileStyles.inputGroup}>
                        <Text style={surfProfileStyles.label}>🪂 {i18n.t('wingStyles')}</Text>
                        <ChipGroup 
                            options={['Freestyle', 'Freewave', 'Race', 'Wave Riding']}
                            selectedValues={profile.preferredWingSurfStyles}
                            onToggle={(val) => toggleInArray('preferredWingSurfStyles', val)}
                        />
                    </View>
                )}

                {profile.preferredTypes.includes('KiteSurfing') && (
                    <View style={surfProfileStyles.inputGroup}>
                        <Text style={surfProfileStyles.label}>🪁 {i18n.t('kiteStyles')}</Text>
                        <ChipGroup 
                            options={['Freestyle', 'Freewave', 'Foiling', 'Race', 'Wave Riding']}
                            selectedValues={profile.preferredKiteSurfStyles}
                            onToggle={(val) => toggleInArray('preferredKiteSurfStyles', val)}
                        />
                    </View>
                )}
            </View>

            {/* 3. PHYSICAL EQUIPMENT & DIMENSIONS */}
            <View style={surfProfileStyles.section}>
                <Text style={surfProfileStyles.sectionTitle}>{i18n.t('gearDimensions')}</Text>
                
                {profile.preferredTypes.length === 0 ? (
                    <Text style={surfProfileStyles.subLabel}>{i18n.t('selectSportGear')}</Text>
                ) : (
                    <View>
                        {/* WAVE SURFING GEAR */}
                        {profile.preferredTypes.includes('WaveSurfing') && (
                            <View style={surfProfileStyles.gearCard}>
                                <Text style={surfProfileStyles.cardTitle}>🌊 {i18n.t('waveBoard')}</Text>
                                
                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>Length (ft) / Width (in) / Vol (L)</Text>
                                    <View style={surfProfileStyles.multiInputRow}>
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.waveboardLength)} onChangeText={(val) => setProfile({...profile, waveboardLength: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.waveboardWidth)} onChangeText={(val) => setProfile({...profile, waveboardWidth: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.waveboardVolume)} onChangeText={(val) => setProfile({...profile, waveboardVolume: val ? Number(val) : ''})} />
                                    </View>
                                </View>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('finSetup')}</Text>
                                    <ChipGroup 
                                        options={['Single Fin', 'Twin Fin', 'Thruster', 'Quad Fin', 'Five Fin']}
                                        selectedValues={profile.wavefinType}
                                        onToggle={(val) => setProfile({...profile, wavefinType: val})}
                                        singleSelect={true}
                                    />
                                </View>

                                {profile.preferredWaveSurfStyles?.includes('Foiling') && (
                                    <View style={surfProfileStyles.foilSetup}>
                                        <Text style={surfProfileStyles.cardTitle}>🛸 {i18n.t('waveFoilSetup')}</Text>
                                        
                                        <View style={surfProfileStyles.inputGroup}>
                                            <Text style={surfProfileStyles.label}>{i18n.t('frontBackWing')}</Text>
                                            <View style={surfProfileStyles.multiInputRow}>
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWave?.frontWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsWave', 'frontWingSize', val ? Number(val) : 0)} />
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWave?.backWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsWave', 'backWingSize', val ? Number(val) : 0)} />
                                            </View>
                                        </View>

                                        <View style={surfProfileStyles.inputGroup}>
                                            <Text style={surfProfileStyles.label}>{i18n.t('mastMaterial')}</Text>
                                            <View style={surfProfileStyles.multiInputRow}>
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWave?.mastLength || '')} onChangeText={(val) => handleFoilChange('foildetailsWave', 'mastLength', val ? Number(val) : 0)} />
                                            </View>
                                            <View style={{marginTop: 10}}>
                                                <ChipGroup 
                                                    options={['Aluminum', 'Carbon', 'Hybrid']}
                                                    selectedValues={profile.foildetailsWave?.material || 'Aluminum'}
                                                    onToggle={(val) => handleFoilChange('foildetailsWave', 'material', val)}
                                                    singleSelect={true}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* WIND SURFING GEAR */}
                        {profile.preferredTypes.includes('WindSurfing') && (
                            <View style={surfProfileStyles.gearCard}>
                                <Text style={surfProfileStyles.cardTitle}>🌬️ {i18n.t('windsurfGear')}</Text>
                                
                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('sailSize')}</Text>
                                    <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.sailSize)} onChangeText={(val) => setProfile({...profile, sailSize: val ? Number(val) : ''})} />
                                </View>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('boardDimsCm')}</Text>
                                    <View style={surfProfileStyles.multiInputRow}>
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.windboardVolume)} onChangeText={(val) => setProfile({...profile, windboardVolume: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.windboardLength)} onChangeText={(val) => setProfile({...profile, windboardLength: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.windboardWidth)} onChangeText={(val) => setProfile({...profile, windboardWidth: val ? Number(val) : ''})} />
                                    </View>
                                </View>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('finSetup')}</Text>
                                    <ChipGroup 
                                        options={['Single Fin', 'Twin Fin', 'Thruster', 'Quad Fin', 'Five Fin']}
                                        selectedValues={profile.windfinType}
                                        onToggle={(val) => setProfile({...profile, windfinType: val})}
                                        singleSelect={true}
                                    />
                                </View>

                                {profile.preferredWindSurfStyles?.includes('Foiling') && (
                                    <View style={surfProfileStyles.foilSetup}>
                                        <Text style={surfProfileStyles.cardTitle}>🛸 {i18n.t('windFoilSetup')}</Text>

                                        <View style={surfProfileStyles.inputGroup}>
                                            <Text style={surfProfileStyles.label}>{i18n.t('frontBackWing')}</Text>
                                            <View style={surfProfileStyles.multiInputRow}>
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWind?.frontWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsWind', 'frontWingSize', val ? Number(val) : 0)} />
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWind?.backWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsWind', 'backWingSize', val ? Number(val) : 0)} />
                                            </View>
                                        </View>

                                        <View style={surfProfileStyles.inputGroup}>
                                            <Text style={surfProfileStyles.label}>{i18n.t('mastMaterial')}</Text>
                                            <View style={surfProfileStyles.multiInputRow}>
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWind?.mastLength || '')} onChangeText={(val) => handleFoilChange('foildetailsWind', 'mastLength', val ? Number(val) : 0)} />
                                            </View>
                                            <View style={{marginTop: 10}}>
                                                <ChipGroup 
                                                    options={['Aluminum', 'Carbon', 'Hybrid']}
                                                    selectedValues={profile.foildetailsWind?.material || 'Aluminum'}
                                                    onToggle={(val) => handleFoilChange('foildetailsWind', 'material', val)}
                                                    singleSelect={true}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* WING SURFING GEAR */}
                        {profile.preferredTypes.includes('WingSurfing') && (
                            <View style={surfProfileStyles.gearCard}>
                                <Text style={surfProfileStyles.cardTitle}>🪂 {i18n.t('wingFoilBoard')}</Text>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('wingSize')}</Text>
                                    <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.wingSize)} onChangeText={(val) => setProfile({...profile, wingSize: val ? Number(val) : ''})} />
                                </View>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('boardDimsCm')}</Text>
                                    <View style={surfProfileStyles.multiInputRow}>
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.wingboardVolume)} onChangeText={(val) => setProfile({...profile, wingboardVolume: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.wingboardLength)} onChangeText={(val) => setProfile({...profile, wingboardLength: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.wingboardWidth)} onChangeText={(val) => setProfile({...profile, wingboardWidth: val ? Number(val) : ''})} />
                                    </View>
                                </View>

                                <View style={surfProfileStyles.foilSetup}>
                                    <Text style={surfProfileStyles.cardTitle}>🛸 {i18n.t('wingFoilSetup')}</Text>
                                    
                                    <View style={surfProfileStyles.inputGroup}>
                                        <Text style={surfProfileStyles.label}>{i18n.t('frontBackWing')}</Text>
                                        <View style={surfProfileStyles.multiInputRow}>
                                            <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWing?.frontWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsWing', 'frontWingSize', val ? Number(val) : 0)} />
                                            <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWing?.backWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsWing', 'backWingSize', val ? Number(val) : 0)} />
                                        </View>
                                    </View>

                                    <View style={surfProfileStyles.inputGroup}>
                                        <Text style={surfProfileStyles.label}>{i18n.t('mastMaterial')}</Text>
                                        <View style={surfProfileStyles.multiInputRow}>
                                            <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsWing?.mastLength || '')} onChangeText={(val) => handleFoilChange('foildetailsWing', 'mastLength', val ? Number(val) : 0)} />
                                        </View>
                                        <View style={{marginTop: 10}}>
                                            <ChipGroup 
                                                options={['Aluminum', 'Carbon', 'Hybrid']}
                                                selectedValues={profile.foildetailsWing?.material || 'Aluminum'}
                                                onToggle={(val) => handleFoilChange('foildetailsWing', 'material', val)}
                                                singleSelect={true}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* KITE SURFING GEAR */}
                        {profile.preferredTypes.includes('KiteSurfing') && (
                            <View style={surfProfileStyles.gearCard}>
                                <Text style={surfProfileStyles.cardTitle}>🪁 {i18n.t('kiteGear')}</Text>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('kiteSize')}</Text>
                                    <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.kiteSize)} onChangeText={(val) => setProfile({...profile, kiteSize: val ? Number(val) : ''})} />
                                </View>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('boardDimsCm')}</Text>
                                    <View style={surfProfileStyles.multiInputRow}>
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.kiteboardVolume)} onChangeText={(val) => setProfile({...profile, kiteboardVolume: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.kiteboardLength)} onChangeText={(val) => setProfile({...profile, kiteboardLength: val ? Number(val) : ''})} />
                                        <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.kiteboardWidth)} onChangeText={(val) => setProfile({...profile, kiteboardWidth: val ? Number(val) : ''})} />
                                    </View>
                                </View>

                                {profile.preferredKiteSurfStyles?.includes('Foiling') && (
                                    <View style={surfProfileStyles.foilSetup}>
                                        <Text style={surfProfileStyles.cardTitle}>🛸 {i18n.t('kiteFoilSetup')}</Text>
                                        
                                        <View style={surfProfileStyles.inputGroup}>
                                            <Text style={surfProfileStyles.label}>{i18n.t('frontBackWing')}</Text>
                                            <View style={surfProfileStyles.multiInputRow}>
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsKite?.frontWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsKite', 'frontWingSize', val ? Number(val) : 0)} />
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsKite?.backWingSize || '')} onChangeText={(val) => handleFoilChange('foildetailsKite', 'backWingSize', val ? Number(val) : 0)} />
                                            </View>
                                        </View>

                                        <View style={surfProfileStyles.inputGroup}>
                                            <Text style={surfProfileStyles.label}>{i18n.t('mastMaterial')}</Text>
                                            <View style={surfProfileStyles.multiInputRow}>
                                                <TextInput keyboardType="numeric" style={surfProfileStyles.flexInput} value={String(profile.foildetailsKite?.mastLength || '')} onChangeText={(val) => handleFoilChange('foildetailsKite', 'mastLength', val ? Number(val) : 0)} />
                                            </View>
                                            <View style={{marginTop: 10}}>
                                                <ChipGroup 
                                                    options={['Aluminum', 'Carbon', 'Hybrid']}
                                                    selectedValues={profile.foildetailsKite?.material || 'Aluminum'}
                                                    onToggle={(val) => handleFoilChange('foildetailsKite', 'material', val)}
                                                    singleSelect={true}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* 4. ENVIRONMENTAL WEATHER PREFERENCES */}
            <View style={surfProfileStyles.section}>
                <Text style={surfProfileStyles.sectionTitle}>Environmental Preferences</Text>
                
                {profile.preferredTypes.length === 0 ? (
                    <Text style={surfProfileStyles.subLabel}>Please select at least one sport above to set your condition preferences.</Text>
                ) : (
                    <View>
                        {profile.preferredTypes.map(sport => (
                            <View key={sport} style={surfProfileStyles.gearCard}>
                                <Text style={surfProfileStyles.cardTitle}>{getSportEmoji(sport)} {sport} {i18n.t('conditions')}</Text>
                                
                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('waveHeight')}</Text>
                                    <View style={surfProfileStyles.multiInputRow}>
                                        <TextInput 
                                            keyboardType="numeric" style={surfProfileStyles.flexInput} placeholder="Min" 
                                            value={String(profile.sportConditions[sport].minWaveHeight)} 
                                            onChangeText={(val) => handleConditionChange(sport, 'minWaveHeight', Math.min(val ? Number(val) : 0, profile.sportConditions[sport].maxWaveHeight))} 
                                        />
                                        <Text style={surfProfileStyles.inputSeparator}>to</Text>
                                        <TextInput 
                                            keyboardType="numeric" style={surfProfileStyles.flexInput} placeholder="Max" 
                                            value={String(profile.sportConditions[sport].maxWaveHeight)} 
                                            onChangeText={(val) => handleConditionChange(sport, 'maxWaveHeight', Math.max(val ? Number(val) : 0, profile.sportConditions[sport].minWaveHeight))} 
                                        />
                                    </View>
                                </View>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('windSpeed')}</Text>
                                    <View style={surfProfileStyles.multiInputRow}>
                                        <TextInput 
                                            keyboardType="numeric" style={surfProfileStyles.flexInput} placeholder="Min" 
                                            value={String(profile.sportConditions[sport].minWindSpeed)} 
                                            onChangeText={(val) => handleConditionChange(sport, 'minWindSpeed', Math.min(val ? Number(val) : 0, profile.sportConditions[sport].maxWindSpeed))} 
                                        />
                                        <Text style={surfProfileStyles.inputSeparator}>to</Text>
                                        <TextInput 
                                            keyboardType="numeric" style={surfProfileStyles.flexInput} placeholder="Max" 
                                            value={String(profile.sportConditions[sport].maxWindSpeed)} 
                                            onChangeText={(val) => handleConditionChange(sport, 'maxWindSpeed', Math.max(val ? Number(val) : 0, profile.sportConditions[sport].minWindSpeed))} 
                                        />
                                    </View>
                                </View>

                                <View style={surfProfileStyles.inputGroup}>
                                    <Text style={surfProfileStyles.label}>{i18n.t('favoriteWind')}</Text>
                                    <ChipGroup 
                                        options={['Offshore', 'Light-Onshore', 'Glassy', 'No-Wind']}
                                        selectedValues={profile.sportConditions[sport].favoriteWindConditions}
                                        onToggle={(val) => toggleWindCondition(sport, val)}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View> 

            <TouchableOpacity 
                style={[surfProfileStyles.saveBtn, loading && surfProfileStyles.saveBtnDisabled]} 
                onPress={handleSave} 
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={surfProfileStyles.saveBtnText}>{i18n.t('saveProfile')}</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SurfProfile;