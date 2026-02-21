/**
 * gadizone Mobile App - Header (EXACT match to web)
 * h-16 (64px) height, logo 40x40, text 2xl, Search/MapPin/Menu icons
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  onSearchPress?: () => void;
  navigation?: any;
}

export default function Header({ onSearchPress, navigation }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Compare Cars', screen: 'Compare' },
    { label: 'EMI Calculator', screen: 'EMI' },
    { label: 'Car News', screen: 'News' },
  ];

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* Logo */}
        <TouchableOpacity style={styles.logoContainer} onPress={() => navigation?.navigate('Home')} activeOpacity={0.8}>
          <Image source={require('../../../assets/gadizone-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandName}>gadizone</Text>
        </TouchableOpacity>

        {/* Right Icons */}
        <View style={styles.iconsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <Feather name="search" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation?.navigate('Location')}>
            <Feather name="map-pin" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setMenuOpen(true)}>
            <Feather name="menu" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Menu Modal */}
      <Modal visible={menuOpen} animationType="slide" transparent onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Feather name="x" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}
                onPress={() => { setMenuOpen(false); navigation?.navigate(item.screen); }}>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButtonWrapper} onPress={() => { setMenuOpen(false); navigation?.navigate('Login'); }}>
              <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 64, paddingHorizontal: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40 },
  brandName: { fontSize: 24, fontWeight: '700', color: '#111827', marginLeft: 8 },
  iconsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { padding: 8, borderRadius: 8 },
  // Menu Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  menuTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuItemText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  loginButtonWrapper: { marginTop: 16 },
  loginButton: { paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
