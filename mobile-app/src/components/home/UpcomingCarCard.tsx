/**
 * gadizone Mobile App - UpcomingCarCard Component
 * EXACT replica of web components/home/UpcomingCarCard.tsx
 * 
 * Key differences from regular CarCard:
 * - UPCOMING badge (red-pink gradient)
 * - Calendar icon with expected launch date
 * - Expected price range
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';

const CARD_WIDTH = 260;

export interface UpcomingCarData {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  image: string;
  expectedPriceMin: number;
  expectedPriceMax: number;
  fuelTypes: string[];
  expectedLaunchDate: string;
  isNew: boolean;
  isPopular: boolean;
}

interface UpcomingCarCardProps {
  car: UpcomingCarData;
  onPress: () => void;
}

// Format fuel type
const formatFuelType = (fuel: string): string => {
  const lower = fuel.toLowerCase();
  if (lower === 'cng') return 'CNG';
  if (lower === 'petrol') return 'Petrol';
  if (lower === 'diesel') return 'Diesel';
  if (lower === 'electric') return 'Electric';
  return fuel;
};

// Format expected launch date (YYYY-MM -> "Expected Jun 2025")
const formatExpectedLaunchDate = (dateString: string): string => {
  if (!dateString) return 'Expected Soon';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  try {
    const parts = dateString.split('-');
    if (parts.length === 2) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `Expected ${months[monthIndex]} ${year}`;
      }
    }
    return `Expected ${dateString}`;
  } catch (e) {
    return `Expected ${dateString}`;
  }
};

export default function UpcomingCarCard({ car, onPress }: UpcomingCarCardProps) {
  const displayPrice = car.expectedPriceMin;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={styles.card}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {/* UPCOMING Badge - red to pink gradient */}
        <LinearGradient
          colors={['#EF4444', '#EC4899']} // from-red-500 to-pink-600
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badge}
        >
          <Text style={styles.badgeText}>UPCOMING</Text>
        </LinearGradient>

        {/* Wishlist Button */}
        <TouchableOpacity style={styles.wishlistButton}>
          <Feather name="heart" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Car Image */}
        <Image
          source={{ uri: car.image || 'https://via.placeholder.com/300x200?text=Coming+Soon' }}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View>

      {/* Car Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.carName} numberOfLines={1}>
          {car.brandName} {car.name}
        </Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹ {(displayPrice / 100000).toFixed(2)} Lakh</Text>
            <Text style={styles.priceOnwards}>Onwards</Text>
          </View>
          <Text style={styles.priceLabel}>Ex-Showroom</Text>
        </View>

        {/* Specs - Calendar and Fuel */}
        <View style={styles.specsContainer}>
          <View style={styles.specRow}>
            <Feather name="calendar" size={16} color="#9CA3AF" style={styles.specIcon} />
            <Text style={styles.specText} numberOfLines={1}>
              {formatExpectedLaunchDate(car.expectedLaunchDate)}
            </Text>
          </View>
          <View style={styles.specRow}>
            <Ionicons name="water-outline" size={16} color="#9CA3AF" style={styles.specIcon} />
            <Text style={styles.specText} numberOfLines={1}>
              {(car.fuelTypes || ['Petrol']).map(formatFuelType).join('/')}
            </Text>
          </View>
        </View>

        {/* View Details Button */}
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <LinearGradient
            colors={['#DC2626', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.viewDetailsButton}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    height: 160,
    backgroundColor: '#F9FAFB',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  carName: {
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
    marginTop: 4,
  },
  specsContainer: {
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specIcon: {
    marginRight: 8,
    width: 20,
  },
  specText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  viewDetailsButton: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
