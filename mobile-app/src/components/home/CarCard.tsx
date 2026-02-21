/**
 * gadizone Mobile App - Car Card (PIXEL-PERFECT match to web)
 * Uses EXACT same icons as web: Fuel (gas pump), Gauge (speedometer)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFavourites } from '../../context/FavouritesContext';

const CARD_WIDTH = 260;
const IMAGE_HEIGHT = 160;

export interface CarCardData {
  id: string;
  name: string;
  brand: string;
  brandName: string;
  image: string;
  startingPrice: number;
  fuelTypes: string[];
  transmissions: string[];
  seating: number;
  launchDate: string;
  slug: string;
  isNew: boolean;
  isPopular: boolean;
}

interface CarCardProps {
  car: CarCardData;
  onPress: () => void;
  isLast?: boolean;
}

const formatPrice = (price: number): string => {
  if (!price || price === 0) return 'Price TBA';
  return `₹ ${(price / 100000).toFixed(2)} Lakh`;
};

const formatFuelType = (fuel: string): string => {
  const lower = fuel.toLowerCase();
  if (lower === 'cng') return 'CNG';
  if (lower === 'petrol') return 'Petrol';
  if (lower === 'diesel') return 'Diesel';
  if (lower === 'electric') return 'Electric';
  return fuel;
};

const formatTransmission = (t: string): string => {
  const lower = t.toLowerCase();
  if (lower === 'manual') return 'Manual';
  if (lower === 'automatic') return 'Automatic';
  if (lower === 'cvt') return 'CVT';
  return t.toUpperCase();
};

export default function CarCard({ car, onPress, isLast = false }: CarCardProps) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const isFav = isFavourite(car.id);

  const handleFavouritePress = () => {
    toggleFavourite(car);
  };

  return (
    <TouchableOpacity style={[styles.card, isLast && { marginRight: 0 }]} onPress={onPress} activeOpacity={0.95}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {car.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}

        {car.isPopular && !car.isNew && (
          <LinearGradient colors={['#F97316', '#DC2626']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.popularBadge}>
            <Text style={styles.badgeText}>POPULAR</Text>
          </LinearGradient>
        )}

        <TouchableOpacity
          style={[styles.heartButton, isFav && styles.heartButtonActive]}
          onPress={handleFavouritePress}
          activeOpacity={0.8}
        >
          <Feather name="heart" size={16} color={isFav ? '#FFFFFF' : '#9CA3AF'} />
        </TouchableOpacity>

        <Image
          source={{ uri: car.image || 'https://via.placeholder.com/260x160' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Car Info */}
      <View style={styles.content}>
        <Text style={styles.carTitle} numberOfLines={1}>{car.brandName} {car.name}</Text>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(car.startingPrice)}</Text>
            <Text style={styles.priceOnwards}>Onwards</Text>
          </View>
          <Text style={styles.priceLabel}>Ex-Showroom</Text>
        </View>

        {/* Specs - Using EXACT icons as web: Fuel (gas pump) & Gauge (speedometer) */}
        <View style={styles.specsContainer}>
          <View style={styles.specRow}>
            {/* Fuel icon - matches Lucide Fuel (gas pump) */}
            <MaterialCommunityIcons name="fuel" size={16} color="#9CA3AF" />
            <Text style={styles.specText} numberOfLines={1}>
              {(car.fuelTypes || ['Petrol']).map(f => formatFuelType(f)).join('/')}
            </Text>
          </View>
          <View style={styles.specRow}>
            {/* Gauge icon - matches Lucide Gauge (speedometer) */}
            <MaterialCommunityIcons name="gauge" size={16} color="#9CA3AF" />
            <Text style={styles.specText} numberOfLines={1}>
              {(car.transmissions || ['Manual']).map(t => formatTransmission(t)).join('/')}
            </Text>
          </View>
        </View>

        {/* View Details Button */}
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
          <LinearGradient
            colors={['#DC2626', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginRight: 12,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: '#F9FAFB',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    zIndex: 10,
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    zIndex: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  heartButtonActive: {
    backgroundColor: '#EF4444',
  },
  content: {
    padding: 16,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  priceOnwards: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  specsContainer: {
    marginBottom: 12,
    gap: 8,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  viewButton: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
