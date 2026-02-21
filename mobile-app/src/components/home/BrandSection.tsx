/**
 * gadizone Mobile App - Brand Section
 * EXACT replica of web components/home/BrandSection.tsx
 * 
 * Web specs:
 * - Title: text-xl sm:text-2xl font-bold gray-900
 * - Grid: grid-cols-3 gap-4
 * - Card: bg-white rounded-lg border-gray-200 p-4
 * - Logo: h-16, w-12 h-12 (48px)
 * - Fallback: gradient square with initials
 * - Show All button: gradient, px-5 py-2.5
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Brand } from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 3 columns with gap-4 (16px gaps)
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 32) / 3; // 32px container padding + 32px gaps

interface BrandSectionProps {
  brands: Brand[];
  onBrandPress: (brand: Brand) => void;
}

// Brand Card Component
const BrandCard = ({
  brand,
  onPress,
}: {
  brand: Brand;
  onPress: () => void;
}) => {
  const [logoError, setLogoError] = useState(false);
  
  // Get initials for fallback
  const initials = brand.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity
      style={styles.brandCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Logo Container - h-16 = 64px */}
      <View style={styles.logoContainer}>
        {brand.logo && !logoError ? (
          <Image
            source={{ uri: brand.logo }}
            style={styles.brandLogo}
            resizeMode="contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          // Fallback gradient with initials
          <LinearGradient
            colors={['#DC2626', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoFallback}
          >
            <Text style={styles.logoInitials}>{initials}</Text>
          </LinearGradient>
        )}
      </View>
      
      {/* Brand Name - text-sm font-medium */}
      <Text style={styles.brandName} numberOfLines={1}>
        {brand.name}
      </Text>
    </TouchableOpacity>
  );
};

export default function BrandSection({ brands, onBrandPress }: BrandSectionProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  
  if (brands.length === 0) return null;

  const displayedBrands = showAllBrands ? brands : brands.slice(0, 6);

  return (
    <View style={styles.container}>
      {/* Title - text-xl sm:text-2xl font-bold */}
      <Text style={styles.sectionTitle}>Popular Brands</Text>

      {/* Brands Grid - grid-cols-3 gap-4 */}
      <View style={styles.brandsGrid}>
        {displayedBrands.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            onPress={() => onBrandPress(brand)}
          />
        ))}
      </View>

      {/* Show All Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setShowAllBrands(!showAllBrands)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#DC2626', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.showAllButton}
          >
            <Feather
              name={showAllBrands ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {showAllBrands ? 'Show Less' : `Show All ${brands.length} Brands`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB', // gray-50
  },
  // Title - text-xl = 20px, font-bold, mb-6 = 24px
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827', // gray-900
    marginBottom: 24,
  },
  // Grid - grid-cols-3 gap-4
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24, // mb-8
  },
  // Card - rounded-lg border-gray-200 p-4
  brandCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: '#E5E7EB', // border-gray-200
    padding: 16, // p-4
    alignItems: 'center',
    marginBottom: 16, // gap-4
    // hover:shadow-lg
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  // Logo container - h-16 = 64px, mb-3 = 12px
  logoContainer: {
    height: 64,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  // Logo - w-12 h-12 = 48px
  brandLogo: {
    width: 48,
    height: 48,
  },
  // Fallback - gradient rounded-lg
  logoFallback: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Initials - text-sm font-bold white
  logoInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Name - text-sm font-medium gray-900
  brandName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  // Button container - text-center
  buttonContainer: {
    alignItems: 'center',
  },
  // Button - px-5 py-2.5 = 20/10px, rounded-lg
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 6, // mr-1.5
  },
  // Button text - text-sm font-semibold white
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
