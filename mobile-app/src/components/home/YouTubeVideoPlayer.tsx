/**
 * gadizone Mobile App - YouTube Video Player (Sierra Ad)
 * Opens YouTube app/browser for reliable playback (embed blocked by YouTube policy)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH - 32) * (9 / 16);

const FEATURED_VIDEO = {
  id: 'MVYRGxM7NtU',
  title: 'Sierra | Glimpse 1 | The Comeback',
  channelName: 'Tata Motors Cars',
  thumbnail: 'https://img.youtube.com/vi/MVYRGxM7NtU/maxresdefault.jpg',
};

export default function YouTubeVideoPlayer({ videoId }: { videoId?: string }) {
  const video = { 
    ...FEATURED_VIDEO, 
    id: videoId || FEATURED_VIDEO.id, 
    thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : FEATURED_VIDEO.thumbnail 
  };

  const playVideo = async () => {
    // Try to open YouTube app first, fallback to browser
    const youtubeAppUrl = `youtube://www.youtube.com/watch?v=${video.id}`;
    const webUrl = `https://www.youtube.com/watch?v=${video.id}`;
    
    try {
      const canOpenApp = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpenApp) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      await Linking.openURL(webUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoCard}>
        <TouchableOpacity style={styles.thumbnailContainer} onPress={playVideo} activeOpacity={0.9}>
          <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.playButtonContainer}>
            <View style={styles.playButton}><Feather name="play" size={32} color="#DC2626" style={{ marginLeft: 4 }} /></View>
          </View>
          <View style={styles.adBadge}><Text style={styles.adBadgeText}>AD</Text></View>
          <View style={styles.titleOverlay}>
            <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
            <Text style={styles.channelName}>{video.channelName}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#F9FAFB' },
  videoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  thumbnailContainer: { height: VIDEO_HEIGHT, position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  playButtonContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  playButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  adBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#DC2626', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  adBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  titleOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.6)' },
  videoTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  channelName: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
});
