/**
 * gadizone Mobile App - Popular Comparison Section
 * Shows car comparisons with VS badge between two cars
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 320;

interface ComparisonModel {
  id: string;
  name: string;
  brand: string;
  heroImage: string;
  startingPrice: number;
}

export interface ComparisonData {
  id: string;
  model1: ComparisonModel;
  model2: ComparisonModel;
}

interface PopularComparisonProps {
  comparisons: ComparisonData[];
  onComparePress: (comparison: ComparisonData) => void;
  onCustomComparePress: () => void;
}

// Comparison Card
const ComparisonCard = ({ comparison, onPress }: { comparison: ComparisonData; onPress: () => void }) => (
  <View style={styles.card}>
    <View style={styles.carsRow}>
      {/* Model 1 */}
      <View style={styles.carSection}>
        <Image source={{ uri: comparison.model1.heroImage || 'https://via.placeholder.com/150x100' }}
          style={styles.carImage} resizeMode="contain" />
        <Text style={styles.brandName}>{comparison.model1.brand}</Text>
        <Text style={styles.modelName} numberOfLines={1}>{comparison.model1.name}</Text>
        <Text style={styles.price}>₹ {(comparison.model1.startingPrice / 100000).toFixed(2)} Lakh</Text>
        <Text style={styles.priceLabel}>Ex-Showroom</Text>
      </View>

      {/* VS Badge */}
      <View style={styles.vsBadgeContainer}>
        <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </LinearGradient>
      </View>

      {/* Model 2 */}
      <View style={styles.carSection}>
        <Image source={{ uri: comparison.model2.heroImage || 'https://via.placeholder.com/150x100' }}
          style={styles.carImage} resizeMode="contain" />
        <Text style={styles.brandName}>{comparison.model2.brand}</Text>
        <Text style={styles.modelName} numberOfLines={1}>{comparison.model2.name}</Text>
        <Text style={styles.price}>₹ {(comparison.model2.startingPrice / 100000).toFixed(2)} Lakh</Text>
        <Text style={styles.priceLabel}>Ex-Showroom</Text>
      </View>
    </View>

    {/* Compare Now Button */}
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.compareButton}>
        <Text style={styles.compareButtonText}>Compare Now</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

export default function PopularComparison({ comparisons, onComparePress, onCustomComparePress }: PopularComparisonProps) {
  if (comparisons.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Comparison</Text>

      <FlatList
        data={comparisons}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ComparisonCard comparison={item} onPress={() => onComparePress(item)} />
        )}
      />

      {/* Compare Cars of Your Choice Button */}
      <TouchableOpacity style={styles.customCompareButton} onPress={onCustomComparePress} activeOpacity={0.8}>
        <Text style={styles.customCompareText}>Compare Cars of Your Choice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: {
    width: CARD_WIDTH, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    padding: 12, marginRight: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  carsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  carSection: { flex: 1, alignItems: 'flex-start' },
  carImage: { width: '100%', height: 80, marginBottom: 8 },
  brandName: { fontSize: 12, color: '#6B7280' },
  modelName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  price: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
  priceLabel: { fontSize: 12, color: '#6B7280' },
  vsBadgeContainer: { width: 32, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  vsBadge: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3
  },
  vsText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  compareButton: { paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  compareButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  customCompareButton: {
    marginTop: 16, borderWidth: 2, borderColor: '#DC2626', borderRadius: 8, paddingVertical: 14, alignItems: 'center',
  },
  customCompareText: { color: '#DC2626', fontSize: 14, fontWeight: '600' },
});
