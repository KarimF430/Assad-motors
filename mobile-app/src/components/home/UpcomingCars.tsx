/**
 * gadizone Mobile App - Upcoming Cars Section
 * EXACT replica of web components/home/UpcomingCars.tsx
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import UpcomingCarCard, { UpcomingCarData } from './UpcomingCarCard';

interface UpcomingCarsProps {
  cars: UpcomingCarData[];
  onCarPress: (car: UpcomingCarData) => void;
}

export default function UpcomingCars({ cars, onCarPress }: UpcomingCarsProps) {
  if (cars.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming Cars</Text>
      
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <UpcomingCarCard car={item} onPress={() => onCarPress(item)} />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
});
