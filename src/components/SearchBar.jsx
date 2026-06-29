import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getMyProfile } from '../api/authService';
import { searchStyles } from '../styles/searchStyles';
import { ThemeContext } from '../context/ThemeContext';

/*
 * Intelligent Geographic Search Component.
 * Acts as the primary query interface. Automatically hydrates localized search filters 
 * by extracting the user's specific meteorological thresholds (saved in their SurfProfile)
 * based on the currently selected active sport.
 */
const SearchBar = ({ onSearch, placeholder = "Search for a beach, city..." }) => {
    const { user } = useContext(AuthContext);
    const { colors } = useContext(ThemeContext);
    const [query, setQuery] = useState('');
    
    // UI State for simulating CSS :focus-within
    const [isFocused, setIsFocused] = useState(false);

    const [fullProfile, setFullProfile] = useState(null);
    const [selectedSport, setSelectedSport] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState({
        minWindSpeed: 0, maxWindSpeed: 15, 
        minWaveHeight: 0.4, maxWaveHeight: 1.5, 
        skillLevel: 'Beginner'
    });

    useEffect(() => {
        if (user) {
            getMyProfile().then(res => {
                if (res.data) {
                    setFullProfile(res.data);
                    if (res.data.preferredTypes?.length > 0) {
                        setSelectedSport(res.data.preferredTypes[0]);
                    }
                }
            }).catch(console.error);
        }
    }, [user]);

    useEffect(() => {
        if (selectedSport && fullProfile?.sportConditions?.[selectedSport]) {
            const conditions = fullProfile.sportConditions[selectedSport];
            setFilters({
                minWindSpeed: conditions.minWindSpeed,
                maxWindSpeed: conditions.maxWindSpeed,
                minWaveHeight: conditions.minWaveHeight,
                maxWaveHeight: conditions.maxWaveHeight,
                skillLevel: fullProfile.skillLevel || 'Beginner'
            });
        }
    }, [selectedSport, fullProfile]);

    const handleSubmit = () => {
        // Dismiss the mobile keyboard when submitting
        Keyboard.dismiss(); 
        
        if (query.trim()) {
            onSearch(query.trim(), user ? filters : {});
        }
    };

    const emojis = { WaveSurfing: '🌊', WindSurfing: '🌬️', WingSurfing: '🪂', KiteSurfing: '🪁' };

    return (
        <View style={[searchStyles.container, { backgroundColor: colors.background }]}>
            
            {/* Conditional Rendering: Horizontal scrolling chips replacing the Web Dropdown */}
            {user && fullProfile?.preferredTypes?.length > 0 && (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={searchStyles.sportsScrollContainer}
                >
                    {fullProfile.preferredTypes.map(sport => (
                        <TouchableOpacity 
                            key={sport} 
                            style={[
                                searchStyles.sportChip, 
                                selectedSport === sport && searchStyles.sportChipActive
                            ]}
                            onPress={() => setSelectedSport(sport)}
                        >
                            <Text style={[
                                searchStyles.sportChipText,
                                selectedSport === sport && searchStyles.sportChipTextActive
                            ]}>
                                {emojis[sport] || '🏄‍♂️'} {sport}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* The primary interactive capsule */}
            <View style={[
                searchStyles.searchBarWrapper, 
                isFocused && searchStyles.searchBarFocused
            ]}>
                <TextInput 
                    style={searchStyles.searchInput}
                    value={query} 
                    onChangeText={setQuery} 
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onSubmitEditing={handleSubmit} // Triggers search on keyboard "Return" key
                    returnKeyType="search"
                />

                <TouchableOpacity style={searchStyles.searchButton} onPress={handleSubmit}>
                    <Text style={searchStyles.searchButtonText}>🔍 Search</Text>
                </TouchableOpacity>
            </View>

            {/* Conditional Rendering: Advanced User Controls */}
            {user && (
                <View style={searchStyles.advancedWrapper}>
                    <TouchableOpacity 
                        style={searchStyles.toggleButton}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Text style={searchStyles.toggleButtonText}>
                            {showFilters ? 'Hide Advanced Options ⬆️' : '⚙️ Tweak Conditions for this Search'}
                        </Text>
                    </TouchableOpacity>

                    {showFilters && (
                        <View style={searchStyles.filtersPanel}>
                            
                            {/* Wind Speed Filter */}
                            <View style={searchStyles.filterGroup}>
                                <Text style={searchStyles.filterLabel}>Wind Speed (kts):</Text>
                                <View style={searchStyles.numericInputRow}>
                                    <TextInput 
                                        style={searchStyles.numericInput}
                                        keyboardType="numeric"
                                        value={String(filters.minWindSpeed)}
                                        onChangeText={(val) => setFilters({
                                            ...filters, 
                                            minWindSpeed: Math.min(Number(val) || 0, filters.maxWindSpeed)
                                        })}
                                    />
                                    <Text style={searchStyles.numericSeparator}>to</Text>
                                    <TextInput 
                                        style={searchStyles.numericInput}
                                        keyboardType="numeric"
                                        value={String(filters.maxWindSpeed)}
                                        onChangeText={(val) => setFilters({
                                            ...filters, 
                                            maxWindSpeed: Math.max(Number(val) || 0, filters.minWindSpeed)
                                        })}
                                    />
                                </View>
                            </View>

                            {/* Wave Height Filter */}
                            <View style={searchStyles.filterGroup}>
                                <Text style={searchStyles.filterLabel}>Wave Height (m):</Text>
                                <View style={searchStyles.numericInputRow}>
                                    <TextInput 
                                        style={searchStyles.numericInput}
                                        keyboardType="numeric"
                                        value={String(filters.minWaveHeight)}
                                        onChangeText={(val) => setFilters({
                                            ...filters, 
                                            minWaveHeight: Math.min(Number(val) || 0, filters.maxWaveHeight)
                                        })}
                                    />
                                    <Text style={searchStyles.numericSeparator}>to</Text>
                                    <TextInput 
                                        style={searchStyles.numericInput}
                                        keyboardType="numeric"
                                        value={String(filters.maxWaveHeight)}
                                        onChangeText={(val) => setFilters({
                                            ...filters, 
                                            maxWaveHeight: Math.max(Number(val) || 0, filters.minWaveHeight)
                                        })}
                                    />
                                </View>
                            </View>

                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default SearchBar;