/**
 * gadizone Mobile App - Home Screen (COMPLETE)
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl, FlatList, TouchableOpacity } from 'react-native';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Ad3DCarousel from '../components/ads/Ad3DCarousel';
import HeroSection from '../components/home/HeroSection';
import CarsByBudget from '../components/home/CarsByBudget';
import CarCard, { CarCardData } from '../components/home/CarCard';
import BrandSection from '../components/home/BrandSection';
import UpcomingCars from '../components/home/UpcomingCars';
import FavouriteCars from '../components/home/FavouriteCars';
import YouTubeVideoPlayer from '../components/home/YouTubeVideoPlayer';
import NewLaunches from '../components/home/NewLaunches';
import PopularComparison, { ComparisonData } from '../components/home/PopularComparison';
import LatestCarNews, { NewsArticle } from '../components/home/LatestCarNews';
import LatestVideos, { VideoData } from '../components/home/LatestVideos';
import { UpcomingCarData } from '../components/home/UpcomingCarCard';
import { useFavourites } from '../context/FavouritesContext';
import api, { Brand } from '../services/api';

const extractBrandName = (brandId: string): string => {
  if (!brandId) return 'Unknown';
  return brandId.replace('brand-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const SectionHeader = ({ title, onViewAll }: { title: string; onViewAll?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onViewAll && <TouchableOpacity onPress={onViewAll}><Text style={styles.viewAllText}>View All →</Text></TouchableOpacity>}
  </View>
);

export default function HomeScreen({ navigation }: any) {
  const [allCars, setAllCars] = useState<CarCardData[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [upcomingCars, setUpcomingCars] = useState<UpcomingCarData[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonData[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<VideoData | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAdBanner1, setShowAdBanner1] = useState(true);
  const [showAdBanner2, setShowAdBanner2] = useState(true);
  const { favourites, clearAllFavourites } = useFavourites();

  const fetchData = async () => {
    try {
      const [brandsData, modelsData, upcomingData, comparisonsData, newsData, videosData] = await Promise.all([
        api.getBrands(), api.getModelsWithPricing(100), api.getUpcomingCars(), api.getPopularComparisons(), api.getNews(6), api.getYouTubeVideos(),
      ]);

      const brandMap: { [key: string]: string } = {};
      if (Array.isArray(brandsData)) brandsData.forEach((b: Brand) => { brandMap[b.id] = b.name; });
      setBrands(Array.isArray(brandsData) ? brandsData : []);

      const models = Array.isArray(modelsData) ? modelsData : [];
      setAllCars(models.map((m: any) => ({
        id: m.id || String(Math.random()), name: m.name || 'Unknown', brand: m.brandId || '',
        brandName: brandMap[m.brandId] || extractBrandName(m.brandId), image: m.heroImage || '',
        startingPrice: m.lowestPrice || 0, fuelTypes: m.fuelTypes || ['Petrol'],
        transmissions: m.transmissions || ['Manual'], seating: m.seating || 5,
        launchDate: m.launchDate || 'Launched', slug: m.slug || '', isNew: m.isNew || false, isPopular: m.isPopular || false,
      })));

      // Comparisons
      const comps = Array.isArray(comparisonsData) ? comparisonsData : [];
      setComparisons(comps.slice(0, 10).map((c: any) => {
        const m1 = models.find((m: any) => m.id === c.model1Id);
        const m2 = models.find((m: any) => m.id === c.model2Id);
        return { id: c.id, model1: { id: m1?.id || '', name: m1?.name || 'Car 1', brand: brandMap[m1?.brandId] || '', heroImage: m1?.heroImage || '', startingPrice: m1?.lowestPrice || 0 },
          model2: { id: m2?.id || '', name: m2?.name || 'Car 2', brand: brandMap[m2?.brandId] || '', heroImage: m2?.heroImage || '', startingPrice: m2?.lowestPrice || 0 },
        };
      }).filter((c: ComparisonData) => c.model1.name !== 'Car 1'));

      setUpcomingCars((Array.isArray(upcomingData) ? upcomingData : []).map((c: any) => ({
        id: c.id || String(Math.random()), name: c.name || 'Unknown', brandId: c.brandId || '',
        brandName: c.brandName || extractBrandName(c.brandId), image: c.image || c.heroImage || '',
        expectedPriceMin: c.expectedPriceMin || 0, expectedPriceMax: c.expectedPriceMax || 0,
        fuelTypes: c.fuelTypes || ['Petrol'], expectedLaunchDate: c.expectedLaunchDate || '', isNew: true, isPopular: false,
      })));

      setNews((Array.isArray(newsData) ? newsData : []).map((n: any) => ({
        id: n.id, title: n.title, excerpt: n.excerpt, slug: n.slug, featuredImage: n.featuredImage,
        publishDate: n.publishDate, views: n.views || 0, likes: n.likes || 0, authorName: 'Haji Karim',
      })));

      // YouTube Videos (real data from API)
      setFeaturedVideo(videosData.featuredVideo);
      setRelatedVideos(videosData.relatedVideos);
    } catch (e) { console.error('Error:', e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };
  const getPopularCars = () => allCars.filter(c => c.isPopular).slice(0, 10);
  const getNewLaunches = () => allCars.filter(c => c.isNew).slice(0, 10);

  const handleCarPress = (car: CarCardData) => { navigation.navigate('Model', { brandSlug: car.brand.replace('brand-', ''), modelSlug: car.name.toLowerCase().replace(/\s+/g, '-') }); };
  const handleUpcomingCarPress = (car: UpcomingCarData) => { navigation.navigate('Model', { brandSlug: car.brandName.toLowerCase().replace(/\s+/g, '-'), modelSlug: car.name.toLowerCase().replace(/\s+/g, '-') }); };
  const handleBrandPress = (brand: Brand) => { navigation.navigate('Brand', { brandSlug: brand.name.toLowerCase().replace(/\s+/g, '-') }); };
  const handleNewsPress = (article: NewsArticle) => { navigation.navigate('News'); };
  const handleFooterNavigate = (screen: string) => { navigation.navigate(screen); };

  if (loading) {
    return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color="#DC2626" /><Text style={styles.loadingText}>Loading cars...</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header onSearchPress={() => navigation.navigate('Search')} navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC2626']} tintColor="#DC2626" />}>
        
        {showAdBanner1 && <Ad3DCarousel autoRotate rotateInterval={4000} onClose={() => setShowAdBanner1(false)} />}
        <HeroSection onSearchPress={() => navigation.navigate('Search')} onVoicePress={() => navigation.navigate('Search')} />
        <View style={styles.sectionGray}><CarsByBudget cars={allCars} onCarPress={handleCarPress} /></View>
        {showAdBanner2 && <Ad3DCarousel autoRotate rotateInterval={5000} onClose={() => setShowAdBanner2(false)} />}

        {getPopularCars().length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Popular Cars" onViewAll={() => navigation.navigate('Search')} />
            <FlatList data={getPopularCars()} keyExtractor={i => i.id} horizontal showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <CarCard car={item} onPress={() => handleCarPress(item)} />} />
          </View>
        )}

        <BrandSection brands={brands} onBrandPress={handleBrandPress} />
        {upcomingCars.length > 0 && <UpcomingCars cars={upcomingCars} onCarPress={handleUpcomingCarPress} />}
        {favourites.length > 0 && <FavouriteCars cars={favourites} onCarPress={handleCarPress} onClearAll={clearAllFavourites} />}
        <YouTubeVideoPlayer videoId="MVYRGxM7NtU" />
        {getNewLaunches().length > 0 && <NewLaunches cars={getNewLaunches()} onCarPress={handleCarPress} />}
        {comparisons.length > 0 && <PopularComparison comparisons={comparisons} onComparePress={() => navigation.navigate('Compare')} onCustomComparePress={() => navigation.navigate('Compare')} />}
        {news.length > 0 && <LatestCarNews news={news} onNewsPress={handleNewsPress} onViewAllPress={() => navigation.navigate('News')} />}

        {/* Latest Videos - Now fetching REAL data from API */}
        <LatestVideos featuredVideo={featuredVideo} relatedVideos={relatedVideos} />

        {/* Footer */}
        <Footer onNavigate={handleFooterNavigate} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  section: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  sectionGray: { backgroundColor: '#F9FAFB' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  viewAllText: { fontSize: 14, color: '#DC2626', fontWeight: '600' },
});
