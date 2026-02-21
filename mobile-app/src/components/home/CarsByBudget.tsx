/**
 * gadizone Mobile App - Cars by Budget Section
 * EXACT replica of web components/home/CarsByBudget.tsx
 * 
 * Web specs from screenshot:
 * - "Cars by Budget" title: text-xl sm:text-2xl font-bold gray-900
 * - Budget tabs: grid layout with rounded-full pills
 * - Active tab: gradient from-red-600 to-orange-500
 * - Inactive tab: bg-gray-100 text-gray-700 with border
 * - Car cards: horizontal scroll with CarCard component
 */

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CarCard, { CarCardData } from './CarCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarsByBudgetProps {
    cars: CarCardData[];
    onCarPress: (car: CarCardData) => void;
}

// Budget ranges matching web exactly (hiding Above ₹50 Lakh per user request)
const budgetRanges = [
    { id: 'under-8', label: 'Under ₹8 Lakh', max: 800000 },
    { id: 'under-15', label: 'Under ₹15 Lakh', min: 800000, max: 1500000 },
    { id: 'under-25', label: 'Under ₹25 Lakh', min: 1500000, max: 2500000 },
    { id: 'under-50', label: 'Under ₹50 Lakh', min: 2500000, max: 5000000 },
];

// Budget Tab Component - matching web exactly
const BudgetTab = ({
    label,
    isActive,
    onPress,
}: {
    label: string;
    isActive: boolean;
    onPress: () => void;
}) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.tabWrapper}>
        {isActive ? (
            <LinearGradient
                colors={['#DC2626', '#EA580C']} // from-red-600 to-orange-500
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabActive}
            >
                <Text style={styles.tabTextActive}>{label}</Text>
            </LinearGradient>
        ) : (
            <View style={styles.tabInactive}>
                <Text style={styles.tabTextInactive}>{label}</Text>
            </View>
        )}
    </TouchableOpacity>
);

export default function CarsByBudget({ cars, onCarPress }: CarsByBudgetProps) {
    const [selectedBudget, setSelectedBudget] = useState('under-8');

    // Filter cars by budget - matching web logic exactly
    const filteredCars = useMemo(() => {
        const range = budgetRanges.find(r => r.id === selectedBudget);
        if (!range) return [];

        return cars.filter(car => {
            if (selectedBudget === 'under-8') {
                return car.startingPrice > 0 && car.startingPrice <= (range.max || Infinity);
            } else if (selectedBudget === 'above-50') {
                return car.startingPrice > (range.min || 0);
            } else {
                return car.startingPrice > (range.min || 0) && car.startingPrice <= (range.max || Infinity);
            }
        });
    }, [cars, selectedBudget]);

    return (
        <View style={styles.container}>
            {/* Section Title - matches web text-xl sm:text-2xl font-bold */}
            <Text style={styles.sectionTitle}>Cars by Budget</Text>

            {/* Budget Tabs - flex-wrap grid layout */}
            <View style={styles.tabsContainer}>
                {budgetRanges.map((range) => (
                    <BudgetTab
                        key={range.id}
                        label={range.label}
                        isActive={selectedBudget === range.id}
                        onPress={() => setSelectedBudget(range.id)}
                    />
                ))}
            </View>

            {/* Cars List - horizontal scroll */}
            {filteredCars.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No cars found in this budget range.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredCars.slice(0, 10)}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carsList}
                    renderItem={({ item }) => (
                        <CarCard car={item} onPress={() => onCarPress(item)} />
                    )}
                />
            )}
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
        fontSize: 22, // text-xl sm:text-2xl
        fontWeight: '700', // font-bold
        color: '#111827', // text-gray-900
        marginBottom: 16, // mb-4 sm:mb-6
    },
    // Tab styles - flex-wrap grid
    tabsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8, // gap-2 sm:gap-3
        marginBottom: 24, // mb-6 sm:mb-8
    },
    tabWrapper: {
        marginBottom: 4,
    },
    tabActive: {
        paddingHorizontal: 24, // px-6
        paddingVertical: 12, // py-3
        borderRadius: 9999, // rounded-full
        // shadow-md
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    tabInactive: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 9999,
        backgroundColor: '#F3F4F6', // bg-gray-100
        borderWidth: 1,
        borderColor: '#E5E7EB', // border to match screenshot
    },
    tabTextActive: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#FFFFFF',
    },
    tabTextInactive: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151', // text-gray-700
    },
    // Cars list
    carsList: {
        paddingLeft: 0,
    },
    emptyState: {
        paddingVertical: 48,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280', // text-gray-500
    },
});
