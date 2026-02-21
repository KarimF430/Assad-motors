/**
 * gadizone Mobile App - Latest Car News Section
 * Shows news articles with image, badge, title, author, date, stats
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 260;

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  publishDate: string;
  views: number;
  likes: number;
  authorName?: string;
}

interface LatestCarNewsProps {
  news: NewsArticle[];
  onNewsPress: (article: NewsArticle) => void;
  onViewAllPress: () => void;
}

// Format date like "28 Nov"
const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return dateStr; }
};

// News Card
const NewsCard = ({ article, onPress }: { article: NewsArticle; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    {/* Image */}
    <View style={styles.imageContainer}>
      <Image source={{ uri: article.featuredImage || 'https://via.placeholder.com/260x140?text=News' }}
        style={styles.image} resizeMode="cover" />
      {/* News Badge */}
      <View style={styles.newsBadge}>
        <Text style={styles.badgeText}>News</Text>
      </View>
    </View>

    {/* Content */}
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
      <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>

      {/* Author & Date */}
      <View style={styles.metaRow}>
        <Text style={styles.authorName}>{article.authorName || 'Haji Karim'}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Feather name="calendar" size={12} color="#6B7280" />
        <Text style={styles.date}>{formatDate(article.publishDate)}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Feather name="clock" size={12} color="#6B7280" />
          <Text style={styles.statText}>1 min read</Text>
        </View>
        <View style={styles.statItem}>
          <Feather name="eye" size={12} color="#6B7280" />
          <Text style={styles.statText}>{article.views.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Feather name="message-circle" size={12} color="#6B7280" />
          <Text style={styles.statText}>{article.likes}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function LatestCarNews({ news, onNewsPress, onViewAllPress }: LatestCarNewsProps) {
  if (news.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Latest Car News</Text>
        <TouchableOpacity onPress={onViewAllPress} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Feather name="arrow-right" size={14} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <NewsCard article={item} onPress={() => onNewsPress(item)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { fontSize: 14, color: '#DC2626', fontWeight: '500', marginRight: 4 },
  card: {
    width: CARD_WIDTH, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    overflow: 'hidden', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  imageContainer: { height: 140, position: 'relative' },
  image: { width: '100%', height: '100%' },
  newsBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#3B82F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  content: { padding: 12 },
  title: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 6, lineHeight: 20 },
  excerpt: { fontSize: 12, color: '#6B7280', marginBottom: 8, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  authorName: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  metaDot: { fontSize: 11, color: '#6B7280', marginHorizontal: 6 },
  date: { fontSize: 11, color: '#6B7280', marginLeft: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  statText: { fontSize: 11, color: '#6B7280', marginLeft: 4 },
});
