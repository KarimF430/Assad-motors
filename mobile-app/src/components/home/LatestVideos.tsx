/**
 * gadizone Mobile App - Latest Videos Section
 * Opens YouTube app/browser for reliable playback (embed blocked by YouTube policy)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  publishedAt: string;
  channelName: string;
}

interface LatestVideosProps {
  featuredVideo: VideoData | null;
  relatedVideos: VideoData[];
  title?: string; // Optional custom title, defaults to 'Latest Videos'
}

export default function LatestVideos({ featuredVideo, relatedVideos, title = 'Latest Videos' }: LatestVideosProps) {
  if (!featuredVideo) return null;

  const playVideo = async (videoId: string) => {
    // Try YouTube app first, fallback to browser
    const youtubeAppUrl = `youtube://www.youtube.com/watch?v=${videoId}`;
    const webUrl = `https://www.youtube.com/watch?v=${videoId}`;

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.visitChannel} onPress={() => Linking.openURL('https://www.youtube.com/@gadizone')}>
          <Text style={styles.visitText}>Visit Channel</Text>
          <Feather name="external-link" size={14} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Featured Video */}
      <TouchableOpacity style={styles.featuredCard} onPress={() => playVideo(featuredVideo.id)} activeOpacity={0.9}>
        <View style={styles.featuredImageContainer}>
          <Image source={{ uri: featuredVideo.thumbnail }} style={styles.featuredImage} resizeMode="cover" />
          <View style={styles.playButtonOverlay}>
            <View style={styles.playButton}><Feather name="play" size={28} color="#DC2626" style={{ marginLeft: 3 }} /></View>
          </View>
          <View style={styles.durationBadge}><Text style={styles.durationText}>{featuredVideo.duration}</Text></View>
          <View style={styles.titleOverlay}><Text style={styles.overlayTitle} numberOfLines={2}>{featuredVideo.title}</Text></View>
        </View>
        <View style={styles.featuredInfo}>
          <View style={styles.channelRow}>
            <Text style={styles.channelName}>{featuredVideo.channelName}</Text>
            <Text style={styles.publishedAt}>{featuredVideo.publishedAt}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Feather name="eye" size={14} color="#6B7280" /><Text style={styles.statText}>{featuredVideo.views} views</Text></View>
            <View style={styles.statItem}><Feather name="thumbs-up" size={14} color="#6B7280" /><Text style={styles.statText}>{featuredVideo.likes} likes</Text></View>
            <View style={styles.statItem}><Feather name="clock" size={14} color="#6B7280" /><Text style={styles.statText}>{featuredVideo.duration}</Text></View>
          </View>
        </View>
      </TouchableOpacity>

      {/* More Videos */}
      {relatedVideos.length > 0 && (
        <>
          <Text style={styles.moreVideosTitle}>More Videos</Text>
          {relatedVideos.map(video => (
            <TouchableOpacity key={video.id} style={styles.moreVideoItem} onPress={() => playVideo(video.id)} activeOpacity={0.8}>
              <View style={styles.moreVideoThumbContainer}>
                <Image source={{ uri: video.thumbnail }} style={styles.moreVideoThumb} resizeMode="cover" />
                <View style={styles.smallPlayButton}><Feather name="play" size={12} color="#FFFFFF" /></View>
                <View style={styles.smallDuration}><Text style={styles.smallDurationText}>{video.duration}</Text></View>
              </View>
              <View style={styles.moreVideoInfo}>
                <Text style={styles.moreVideoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.moreVideoChannel}>{video.channelName}</Text>
                <Text style={styles.moreVideoStats}>{video.views} views  •  {video.likes} likes</Text>
              </View>
              <Text style={styles.moreVideoDate}>{video.publishedAt}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Subscribe Section */}
      <View style={styles.subscribeContainer}>
        <Text style={styles.subscribeTitle}>Subscribe to gadizone</Text>
        <Text style={styles.subscribeSubtext}>Get the latest car reviews, comparisons, and buying guides</Text>
        <TouchableOpacity style={styles.subscribeButton} onPress={() => Linking.openURL('https://www.youtube.com/@gadizone?sub_confirmation=1')} activeOpacity={0.9}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          <Feather name="external-link" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  visitChannel: { flexDirection: 'row', alignItems: 'center' },
  visitText: { fontSize: 14, color: '#DC2626', fontWeight: '500', marginRight: 4 },
  featuredCard: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', marginBottom: 24 },
  featuredImageContainer: { height: 200, position: 'relative' },
  featuredImage: { width: '100%', height: '100%' },
  playButtonOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  playButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  durationText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  titleOverlay: { position: 'absolute', bottom: 0, left: 0, right: 50, padding: 12, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  featuredInfo: { padding: 12 },
  channelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  channelName: { fontSize: 14, color: '#DC2626', fontWeight: '500' },
  publishedAt: { fontSize: 12, color: '#6B7280' },
  statsRow: { flexDirection: 'row' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  statText: { fontSize: 12, color: '#6B7280', marginLeft: 4 },
  moreVideosTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  moreVideoItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', padding: 8 },
  moreVideoThumbContainer: { width: 128, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  moreVideoThumb: { width: '100%', height: '100%' },
  smallPlayButton: { position: 'absolute', top: '50%', left: '50%', marginLeft: -12, marginTop: -12, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  smallDuration: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 },
  smallDurationText: { color: '#FFFFFF', fontSize: 10, fontWeight: '500' },
  moreVideoInfo: { flex: 1, marginLeft: 12 },
  moreVideoTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4, lineHeight: 18 },
  moreVideoChannel: { fontSize: 12, color: '#DC2626', marginBottom: 2 },
  moreVideoStats: { fontSize: 11, color: '#6B7280' },
  moreVideoDate: { fontSize: 11, color: '#6B7280', marginLeft: 4 },
  subscribeContainer: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 8 },
  subscribeTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subscribeSubtext: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 16, lineHeight: 22 },
  subscribeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DC2626', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, gap: 8 },
  subscribeButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
