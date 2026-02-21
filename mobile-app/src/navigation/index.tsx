/**
 * gadizone Mobile App - Navigation Setup
 * Bottom tabs + stack navigation matching web structure
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import BrandScreen from '../screens/BrandScreen';
import ModelScreen from '../screens/ModelScreen';

// Placeholder screens (will be built out)
const PlaceholderScreen = ({ route }: any) => (
    <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>{route.name}</Text>
        <Text style={styles.placeholderSubtext}>Coming soon...</Text>
    </View>
);

// Tab Icon Component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
    const icons: { [key: string]: string } = {
        Home: '🏠',
        Compare: '⚖️',
        Search: '🔍',
        News: '📰',
        Profile: '👤',
    };

    return (
        <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
            {icons[name] || '📱'}
        </Text>
    );
};

// Stack Navigators
const HomeStack = createNativeStackNavigator();
const CompareStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const NewsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNavigator() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStack.Screen name="HomeMain" component={HomeScreen} />
            <HomeStack.Screen name="Brand" component={BrandScreen} />
            <HomeStack.Screen name="Model" component={ModelScreen} />
            <HomeStack.Screen name="Variant" component={PlaceholderScreen} />
        </HomeStack.Navigator>
    );
}

function CompareStackNavigator() {
    return (
        <CompareStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <CompareStack.Screen name="CompareMain" component={PlaceholderScreen} />
            <CompareStack.Screen name="CompareDetail" component={PlaceholderScreen} />
        </CompareStack.Navigator>
    );
}

function SearchStackNavigator() {
    return (
        <SearchStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <SearchStack.Screen name="SearchMain" component={PlaceholderScreen} />
        </SearchStack.Navigator>
    );
}

function NewsStackNavigator() {
    return (
        <NewsStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <NewsStack.Screen name="NewsList" component={PlaceholderScreen} />
            <NewsStack.Screen name="NewsDetail" component={PlaceholderScreen} />
        </NewsStack.Navigator>
    );
}

function ProfileStackNavigator() {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <ProfileStack.Screen name="ProfileMain" component={PlaceholderScreen} />
            <ProfileStack.Screen name="Login" component={PlaceholderScreen} />
            <ProfileStack.Screen name="Signup" component={PlaceholderScreen} />
        </ProfileStack.Navigator>
    );
}

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }: { route: any }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <TabIcon name={route.name} focused={focused} />
                    ),
                    tabBarActiveTintColor: colors.primary.red,
                    tabBarInactiveTintColor: colors.gray[500],
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.tabLabel,
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStackNavigator}
                    options={{ title: 'Home' }}
                />
                <Tab.Screen
                    name="Compare"
                    component={CompareStackNavigator}
                    options={{ title: 'Compare' }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchStackNavigator}
                    options={{ title: 'Search' }}
                />
                <Tab.Screen
                    name="News"
                    component={NewsStackNavigator}
                    options={{ title: 'News' }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileStackNavigator}
                    options={{ title: 'Profile' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray[50],
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    placeholderSubtext: {
        fontSize: 16,
        color: colors.text.secondary,
    },
    tabBar: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        paddingTop: 8,
        paddingBottom: 8,
        height: 65,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
    },
    tabIcon: {
        fontSize: 24,
    },
    tabIconFocused: {
        transform: [{ scale: 1.1 }],
    },
});
