/**
 * gadizone Mobile App - New Launches Section
 * Shows newly launched cars with green NEW badge
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CarCard, { CarCardData } from './CarCard';

interface NewLaunchesProps {
  cars: CarCardData[];
  onCarPress: (car: CarCardData) => void;
}

export default function NewLaunches({ cars, onCarPress }: NewLaunchesProps) {
  if (cars.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>New Launches</Text>
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CarCard car={item} onPress={() => onCarPress(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 },
});
