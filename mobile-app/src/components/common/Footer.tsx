/**
 * gadizone Mobile App - Footer
 * Dark themed footer with logo, links, brands, and contact info
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FooterProps {
  onNavigate: (screen: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const socialLinks = [
    { icon: 'facebook' as const, url: 'https://facebook.com/gadizone' },
    { icon: 'twitter' as const, url: 'https://twitter.com/gadizone' },
    { icon: 'instagram' as const, url: 'https://instagram.com/gadizone' },
    { icon: 'youtube' as const, url: 'https://youtube.com/@gadizone' },
  ];

  const quickLinks = ['New Cars', 'Compare Cars', 'Car Brands', 'EMI Calculator', 'Car News'];
  const popularBrands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia'];

  return (
    <View style={styles.container}>
      {/* Logo & Description */}
      <View style={styles.logoSection}>
        <View style={styles.logoRow}>
          <Image source={require('../../../assets/gadizone-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandName}>gadizone</Text>
        </View>
        <Text style={styles.description}>
          Your trusted partner for finding the perfect new car in India. Compare prices, specifications, reviews, and get the best deals from authorized dealers.
        </Text>

        {/* Social Icons */}
        <View style={styles.socialRow}>
          {socialLinks.map((link, i) => (
            <TouchableOpacity key={i} style={styles.socialIcon} onPress={() => Linking.openURL(link.url)}>
              <Feather name={link.icon} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        {quickLinks.map((link, i) => (
          <TouchableOpacity key={i} onPress={() => onNavigate(link.replace(/\s/g, ''))} style={styles.linkItem}>
            <Text style={styles.linkText}>{link}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popular Brands */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Brands</Text>
        {popularBrands.map((brand, i) => (
          <TouchableOpacity key={i} onPress={() => onNavigate('Brand')} style={styles.linkItem}>
            <Text style={styles.linkText}>{brand}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactItem}>
          <Feather name="mail" size={16} color="#9CA3AF" />
          <Text style={styles.contactText}>info@gadizone.com</Text>
        </View>
        <View style={styles.contactItem}>
          <Feather name="phone" size={16} color="#9CA3AF" />
          <Text style={styles.contactText}>+91 98765 43210</Text>
        </View>
        <View style={styles.contactItem}>
          <Feather name="map-pin" size={16} color="#9CA3AF" />
          <Text style={styles.contactText}>gadizone Technologies Pvt. Ltd.{'\n'}Cyber City, Gurgaon, Haryana 122002</Text>
        </View>
      </View>

      {/* Copyright */}
      <View style={styles.copyright}>
        <Text style={styles.copyrightText}>© 2024 gadizone. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111827', paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24 },
  logoSection: { marginBottom: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: { width: 40, height: 40, marginRight: 10 },
  brandName: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  description: { fontSize: 14, color: '#9CA3AF', lineHeight: 22, marginBottom: 16 },
  socialRow: { flexDirection: 'row' },
  socialIcon: { marginRight: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  linkItem: { marginBottom: 8 },
  linkText: { fontSize: 14, color: '#D1D5DB' },
  contactItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  contactText: { fontSize: 14, color: '#D1D5DB', marginLeft: 10, flex: 1 },
  copyright: { borderTopWidth: 1, borderTopColor: '#374151', paddingTop: 20, marginTop: 8 },
  copyrightText: { fontSize: 13, color: '#6B7280', textAlign: 'center' },
});
