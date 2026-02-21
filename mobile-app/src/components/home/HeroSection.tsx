/**
 * gadizone Mobile App - HeroSection (EXACT match to web)
 * Red-orange gradient bg, white search card, AI Search button, shimmer icon
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeroSectionProps {
  onSearchPress?: () => void;
  onVoicePress?: () => void;
}

export default function HeroSection({ onSearchPress, onVoicePress }: HeroSectionProps) {
  return (
    <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Find Your Perfect Car</Text>

      {/* Search Card */}
      <View style={styles.searchCard}>
        {/* Search Input */}
        <TouchableOpacity style={styles.searchInputContainer} onPress={onSearchPress} activeOpacity={0.8}>
          <TextInput
            style={styles.searchInput}
            placeholder="Best car for family under 15 lakhs"
            placeholderTextColor="#9CA3AF"
            editable={false}
            pointerEvents="none"
          />
          <TouchableOpacity style={styles.micButton} onPress={onVoicePress}>
            <Feather name="mic" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Start AI Search Button */}
        <TouchableOpacity style={styles.aiButtonWrapper} onPress={onSearchPress} activeOpacity={0.9}>
          <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.aiButton}>
            <MaterialCommunityIcons name="shimmer" size={20} color="#FFFFFF" />
            <Text style={styles.aiButtonText}>Start AI Search</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Subtext */}
        <Text style={styles.subtext}>Our AI will ask you a few questions to find your perfect match</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 24 },
  searchCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 16, color: '#374151' },
  micButton: { padding: 4 },
  aiButtonWrapper: { marginBottom: 12 },
  aiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  aiButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  subtext: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});
