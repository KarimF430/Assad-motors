/**
 * gadizone Mobile App - Favourite Cars Section
 * EXACT replica of web components/home/FavouriteCars.tsx
 * 
 * Features:
 * - Clear All button with X icon
 * - Smart Pick badge for auto-added cars
 * - Horizontal car cards scroll
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import CarCard, { CarCardData } from './CarCard';

interface FavouriteCarData extends CarCardData {
  isAutoAdded?: boolean;
}

interface FavouriteCarsProps {
  cars: FavouriteCarData[];
  onCarPress: (car: FavouriteCarData) => void;
  onClearAll: () => void;
}

export default function FavouriteCars({ cars, onCarPress, onClearAll }: FavouriteCarsProps) {
  if (cars.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header with Clear All */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Favourite Cars</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={onClearAll}
          activeOpacity={0.7}
        >
          <Feather name="x" size={16} color="#6B7280" />
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cars Horizontal Scroll */}
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            {/* Smart Pick Badge */}
            {item.isAutoAdded && (
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']} // from-purple-500 to-pink-500
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.smartPickBadge}
              >
                <Feather name="zap" size={12} color="#FFFFFF" />
                <Text style={styles.smartPickText}>Smart Pick</Text>
              </LinearGradient>
            )}
            <CarCard car={item} onPress={() => onCarPress(item)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardWrapper: {
    position: 'relative',
  },
  smartPickBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  smartPickText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
