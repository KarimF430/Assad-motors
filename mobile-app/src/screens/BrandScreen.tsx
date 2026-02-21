/**
 * gadizone Mobile App - Brand Screen
 * Section 1: Header + Ad Carousel + Brand Title + Description + Price List
 * Section 2: Filter Pills + Cars List
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import Ad3DCarousel from '../components/ads/Ad3DCarousel';
import UpcomingCarCard, { UpcomingCarData } from '../components/home/UpcomingCarCard';
import LatestVideos, { VideoData } from '../components/home/LatestVideos';
import Footer from '../components/common/Footer';
import api, { Brand, BrandDetails } from '../services/api';

interface BrandScreenProps {
  route: { params: { brandSlug: string } };
  navigation: any;
}

interface ModelData {
  id: string;
  name: string;
  lowestPrice: number;
  slug: string;
  image: string;
  fuelTypes: string[];
  transmissions: string[];
  isNew: boolean;
  isPopular: boolean;
  variants: number;
}



interface BrandInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription: string;
  priceRange: { min: number; max: number };
}

const formatBrandName = (slug: string): string => {
  if (slug === 'maruti-suzuki') return 'Maruti Suzuki';
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatPrice = (price: number): string => (price / 100000).toFixed(2);

const getCurrentMonthYear = (): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
};

// Brand descriptions
const brandData: { [key: string]: { description: string; fullDescription: string } } = {
  'hyundai': {
    description: 'Hyundai Motor India Limited (HMIL) is the second-largest car manufacturer in India by market share and the largest passenger car exporter from India. Established in 1996, Hyundai has consistently delivered feature-rich vehicles with modern design, advanced technology, and excellent build quality.',
    fullDescription: 'The company is known for introducing global technologies to the Indian market, offering comprehensive warranty coverage, and maintaining high customer satisfaction levels. Hyundai\'s manufacturing facility in Chennai is one of the most advanced automotive plants in India, producing cars not only for the domestic market but also for export to over 85 countries worldwide.',
  },
  'tata': {
    description: 'Tata Motors is India\'s largest automobile company with a portfolio that covers a wide range of cars, SUVs, trucks, buses, and defence vehicles. Known for their build quality and 5-star safety ratings, Tata cars are trusted by millions of Indian families.',
    fullDescription: 'The company has been at the forefront of electric vehicle innovation in India with models like Nexon EV and Tigor EV. Tata Motors is committed to providing safe, sustainable, and smart mobility solutions.',
  },
  'maruti-suzuki': {
    description: 'Maruti Suzuki India Limited is India\'s largest passenger car company, accounting for around 50% of the domestic car market. Known for reliable, fuel-efficient vehicles with excellent resale value.',
    fullDescription: 'Maruti Suzuki has been India\'s favorite car brand for decades with an unmatched service network of over 4,000 workshops across the country, making it the most accessible car brand in India.',
  },
  'mahindra': {
    description: 'Mahindra & Mahindra is one of India\'s leading automobile manufacturers, renowned for its robust SUVs and utility vehicles. With a legacy spanning over seven decades, Mahindra has established itself as a symbol of power and performance.',
    fullDescription: 'Mahindra is known for building tough, capable vehicles that can handle Indian road conditions. The brand has a strong presence in rural India and is now expanding into electric vehicles.',
  },
  'kia': {
    description: 'Kia India Private Limited is a South Korean automobile manufacturer that entered the Indian market in 2019. Known for feature-rich vehicles with premium styling and advanced technology.',
    fullDescription: 'Kia has quickly become one of the most popular car brands in India with models like Seltos, Sonet, and Carens offering segment-leading features and premium build quality.',
  },
};

// Filter pills
const fuelFilters = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const transmissionFilters = ['Manual', 'Automatic'];

export default function BrandScreen({ route, navigation }: BrandScreenProps) {
  const { brandSlug } = route.params;
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(true);
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [upcomingCars, setUpcomingCars] = useState<UpcomingCarData[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [featuredVideo, setFeaturedVideo] = useState<VideoData | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  const fetchBrandData = async () => {
    try {
      // First get the brand info to get the brandId
      const brands = await api.getBrands();
      setAllBrands(brands); // Store all brands for Alternative Brands section
      const brand = brands.find((b: any) => b.slug === brandSlug || b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug);

      const brandId = brand?.id || '';
      const brandName = brand?.name || formatBrandName(brandSlug);

      // Fetch brand details including FAQs
      if (brandId) {
        const brandDetails = await api.getBrandById(brandId);
        if (brandDetails?.faqs && brandDetails.faqs.length > 0) {
          setFaqs(brandDetails.faqs);
        }
      }

      // Fetch models using brandId
      let modelsData: any[] = [];
      if (brandId) {
        modelsData = await api.getModelsByBrand(brandId);
      } else {
        // Fallback: try using brand name as filter
        const allModels = await api.getModelsWithPricing();
        modelsData = allModels.filter((m: any) =>
          m.brandId === brandSlug ||
          m.brandSlug === brandSlug ||
          m.brand?.toLowerCase().replace(/\s+/g, '-') === brandSlug
        );
      }

      const brandModels = modelsData
        .filter((m: any) => m.lowestPrice && m.lowestPrice > 0)
        .sort((a: any, b: any) => a.lowestPrice - b.lowestPrice)
        .map((m: any) => ({
          id: m.id,
          name: m.name,
          lowestPrice: m.lowestPrice,
          slug: m.name.toLowerCase().replace(/\s+/g, '-'),
          image: m.heroImage || 'https://via.placeholder.com/128x96',
          fuelTypes: m.fuelTypes || ['Petrol'],
          transmissions: m.transmissions || ['Manual'],
          isNew: m.isNew || false,
          isPopular: m.isPopular || false,
          variants: m.variantCount || 0,
        }));

      setModels(brandModels);

      // Fetch upcoming cars for this brand
      if (brandId) {
        const upcomingData = await api.getUpcomingCarsByBrand(brandId);
        const brandUpcoming = upcomingData.map((car: any) => ({
          id: car.id,
          name: car.name,
          brandId: brandId,
          brandName: brandName,
          image: car.heroImage || 'https://via.placeholder.com/280x160',
          expectedPriceMin: car.expectedPriceMin || 0,
          expectedPriceMax: car.expectedPriceMax || 0,
          fuelTypes: car.fuelTypes || ['Petrol'],
          expectedLaunchDate: car.expectedLaunchDate || 'Coming Soon',
          isNew: true,
          isPopular: false,
        }));
        setUpcomingCars(brandUpcoming);
      }

      // Fetch YouTube videos filtered by brand name (server-side filtering)
      try {
        const videoData = await api.getYouTubeVideosByBrand(brandName);
        if (videoData.featuredVideo) {
          setFeaturedVideo(videoData.featuredVideo as VideoData);
          setRelatedVideos((videoData.relatedVideos || []).slice(0, 3) as VideoData[]);
        }
      } catch (e) {
        console.error('Error fetching videos:', e);
      }

      const data = brandData[brandSlug] || { description: `Explore all ${brandName} cars.`, fullDescription: '' };

      const prices = brandModels.map((m: ModelData) => m.lowestPrice);

      setBrandInfo({
        id: brand?.id || brandSlug,
        name: brandName,
        slug: brandSlug,
        description: data.description,
        fullDescription: data.fullDescription,
        priceRange: { min: prices.length > 0 ? Math.min(...prices) : 0, max: prices.length > 0 ? Math.max(...prices) : 0 },
      });
    } catch (error) {
      console.error('Error fetching brand data:', error);
      setBrandInfo({
        id: brandSlug,
        name: formatBrandName(brandSlug),
        slug: brandSlug,
        description: `Explore all ${formatBrandName(brandSlug)} cars.`,
        fullDescription: '',
        priceRange: { min: 0, max: 0 },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBrandData(); }, [brandSlug]);

  const onRefresh = () => { setRefreshing(true); fetchBrandData(); };

  const toggleFilter = (type: 'fuel' | 'transmission', value: string) => {
    if (type === 'fuel') {
      setSelectedFuel(prev => prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]);
    } else {
      setSelectedTransmission(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
    }
  };

  // Apply filters
  const filteredModels = models.filter(model => {
    if (selectedFuel.length > 0) {
      const hasFuel = selectedFuel.some(fuel => model.fuelTypes.some(f => f.toLowerCase() === fuel.toLowerCase()));
      if (!hasFuel) return false;
    }
    if (selectedTransmission.length > 0) {
      const hasTransmission = selectedTransmission.some(trans => model.transmissions.some(t => t.toLowerCase().includes(trans.toLowerCase())));
      if (!hasTransmission) return false;
    }
    return true;
  });

  const top5Models = models.slice(0, 5);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Loading {formatBrandName(brandSlug)} cars...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header onSearchPress={() => navigation.navigate('Search')} navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC2626']} tintColor="#DC2626" />}>
        {/* Section 1: Ad Carousel */}
        {showAdBanner && <Ad3DCarousel autoRotate rotateInterval={4000} onClose={() => setShowAdBanner(false)} />}

        {/* Section 1: Brand Title & Description */}
        <View style={styles.brandSection}>
          <Text style={styles.brandTitle}>{brandInfo?.name} Cars</Text>

          <Text style={styles.description}>
            {!isExpanded ? (
              <>{brandInfo?.description.split(' ').slice(0, 30).join(' ')}<Text style={styles.readMore} onPress={() => setIsExpanded(true)}>{'  '}...read more</Text></>
            ) : brandInfo?.description}
          </Text>

          {isExpanded && brandInfo && (
            <View style={styles.expandedContent}>
              {brandInfo.fullDescription && <Text style={styles.fullDescription}>{brandInfo.fullDescription}</Text>}
              <Text style={styles.priceListTitle}>{brandInfo.name} Cars Price List ({getCurrentMonthYear()}) in India</Text>
              <Text style={styles.priceSummary}>
                {brandInfo.name} car price starts at Rs. {formatPrice(brandInfo.priceRange.min)} Lakh and goes upto Rs. {formatPrice(brandInfo.priceRange.max)} Lakh (Avg. ex-showroom).
                {top5Models.length > 0 && <Text> The prices for the top {top5Models.length} popular {brandInfo.name} Cars are: </Text>}
                {top5Models.map((model, index) => (
                  <Text key={model.id}>
                    <Text style={styles.modelLink}>{brandInfo.name} {model.name} Price</Text>
                    <Text> is Rs. {formatPrice(model.lowestPrice)} Lakh</Text>
                    {index < top5Models.length - 2 && <Text>, </Text>}
                    {index === top5Models.length - 2 && <Text> and </Text>}
                    {index === top5Models.length - 1 && <Text>.</Text>}
                  </Text>
                ))}
              </Text>

              {models.length > 0 && (
                <View style={styles.priceTable}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>MODEL</Text>
                    <Text style={styles.tableHeaderText}>PRICE</Text>
                  </View>
                  {models.map((model) => (
                    <TouchableOpacity key={model.id} style={styles.tableRow} onPress={() => navigation.navigate('Model', { brandSlug, modelSlug: model.slug })}>
                      <Text style={styles.tableModelName}>{brandInfo.name} {model.name}</Text>
                      <Text style={styles.tableModelPrice}>Rs. {formatPrice(model.lowestPrice)} Lakh</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.collapseButton} onPress={() => setIsExpanded(false)}>
                <Text style={styles.collapseText}>Collapse</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section 2: Filter Pills */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {fuelFilters.map(fuel => (
              <TouchableOpacity key={fuel} onPress={() => toggleFilter('fuel', fuel)} activeOpacity={0.8}>
                {selectedFuel.includes(fuel) ? (
                  <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.filterPillActive}>
                    <Text style={styles.filterPillTextActive}>{fuel}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterPill}><Text style={styles.filterPillText}>{fuel}</Text></View>
                )}
              </TouchableOpacity>
            ))}
            {transmissionFilters.map(trans => (
              <TouchableOpacity key={trans} onPress={() => toggleFilter('transmission', trans)} activeOpacity={0.8}>
                {selectedTransmission.includes(trans) ? (
                  <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.filterPillActive}>
                    <Text style={styles.filterPillTextActive}>{trans}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterPill}><Text style={styles.filterPillText}>{trans}</Text></View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* Section 2: Car Cards List */}
        <View style={styles.carsList}>
          {filteredModels.length === 0 ? (
            <View style={styles.emptyState}><Text style={styles.emptyText}>No models found for {brandInfo?.name}</Text></View>
          ) : (
            filteredModels.map(car => (
              <TouchableOpacity key={car.id} style={styles.carCard} onPress={() => navigation.navigate('Model', { brandSlug, modelSlug: car.slug })} activeOpacity={0.95}>
                <View style={styles.carImageContainer}>
                  {car.isNew && <View style={styles.newBadge}><Text style={styles.badgeText}>NEW</Text></View>}
                  {car.isPopular && !car.isNew && <View style={styles.popularBadge}><Text style={styles.badgeText}>POPULAR</Text></View>}
                  <Image source={{ uri: car.image }} style={styles.carImage} resizeMode="contain" />
                </View>
                <View style={styles.carDetails}>
                  <View style={styles.titleRow}>
                    <Text style={styles.carName} numberOfLines={1}><Text style={styles.brandNameText}>{brandInfo?.name} </Text>{car.name}</Text>
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                  <View style={styles.ratingRow}>
                    <Feather name="star" size={16} color="#22C55E" />
                    <Text style={styles.ratingText}>4.5/5</Text>
                    <Text style={styles.reviewsText}>1247 Ratings</Text>
                  </View>
                  <Text style={styles.variantsText}>{car.variants} Variants</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceSymbol}>₹</Text>
                    <Text style={styles.priceValue}>{formatPrice(car.lowestPrice)}</Text>
                    <Text style={styles.priceLakh}>Lakh</Text>
                    <Text style={styles.onwards}>Onwards</Text>
                  </View>
                  <Text style={styles.priceLabel}>Ex-Showroom</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Section 3: Ad Carousel + Upcoming Cars */}
        <Ad3DCarousel autoRotate rotateInterval={4000} />

        {upcomingCars.length > 0 && (
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>{brandInfo?.name} Upcoming Cars</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.upcomingScroll}>
              {upcomingCars.map((car) => (
                <UpcomingCarCard
                  key={car.id}
                  car={car}
                  onPress={() => navigation.navigate('Model', { brandSlug, modelSlug: car.name.toLowerCase().replace(/\s+/g, '-') })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Section 4: Ad Carousel + Alternative Brands */}
        <Ad3DCarousel autoRotate rotateInterval={4000} />

        <View style={styles.altBrandsSection}>
          <Text style={styles.altBrandsTitle}>Alternative Brands</Text>
          <View style={styles.brandsGrid}>
            {allBrands
              .filter(b => b.id !== brandInfo?.id && b.name.toLowerCase().replace(/\s+/g, '-') !== brandSlug)
              .slice(0, showAllBrands ? undefined : 6)
              .map((brand) => (
                <TouchableOpacity
                  key={brand.id}
                  style={styles.brandCard}
                  onPress={() => navigation.navigate('Brand', { brandSlug: brand.name.toLowerCase().replace(/\s+/g, '-') })}
                  activeOpacity={0.7}
                >
                  <View style={styles.brandLogoContainer}>
                    {brand.logo ? (
                      <Image source={{ uri: brand.logo }} style={styles.brandLogo} resizeMode="contain" />
                    ) : (
                      <LinearGradient colors={['#DC2626', '#EA580C']} style={styles.brandLogoFallback}>
                        <Text style={styles.brandInitials}>{brand.name.split(' ').map(w => w[0]).join('').toUpperCase()}</Text>
                      </LinearGradient>
                    )}
                  </View>
                  <Text style={styles.brandCardName} numberOfLines={2}>{brand.name}</Text>
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setShowAllBrands(!showAllBrands)} activeOpacity={0.9}>
              <LinearGradient colors={['#DC2626', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.showAllButton}>
                <Feather name={showAllBrands ? 'chevron-up' : 'chevron-down'} size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.showAllButtonText}>{showAllBrands ? 'Show Less' : `Show All ${allBrands.length} Brands`}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 5: Brand Videos */}
        {featuredVideo && (
          <LatestVideos
            title={`${brandInfo?.name} Videos`}
            featuredVideo={featuredVideo}
            relatedVideos={relatedVideos}
          />
        )}

        {/* Section 6: Ad Carousel + Brand FAQ */}
        <Ad3DCarousel autoRotate rotateInterval={4000} />

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>{brandInfo?.name} FAQ</Text>
          <Text style={styles.faqSubtitle}>{faqs.length} questions about {brandInfo?.name} cars</Text>

          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => setOpenFAQ(openFAQ === index ? null : index)}
              activeOpacity={0.8}
            >
              <View style={styles.faqQuestion}>
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Feather name={openFAQ === index ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7280" />
              </View>
              {openFAQ === index && (
                <View style={styles.faqAnswer}>
                  <View style={styles.faqDivider} />
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 7: Owner Reviews */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>{brandInfo?.name} Owner Reviews</Text>

          {/* Rating Summary Card */}
          <View style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => <Feather key={i} name="star" size={20} color={i <= 4 ? '#F59E0B' : '#D1D5DB'} style={i <= 4 ? { color: '#F59E0B' } : {}} />)}
              </View>
              <Text style={styles.ratingNumber}>4.2</Text>
              <Text style={styles.ratingCount}>(1,543 reviews)</Text>
            </View>

            <Text style={styles.breakdownTitle}>Rating Breakdown</Text>
            {[{ star: 5, count: 856 }, { star: 4, count: 324 }, { star: 3, count: 189 }, { star: 2, count: 26 }, { star: 1, count: 13 }].map(item => (
              <View key={item.star} style={styles.breakdownRow}>
                <Text style={styles.breakdownStar}>{item.star}★</Text>
                <View style={styles.breakdownBarBg}>
                  <View style={[styles.breakdownBarFill, { width: `${(item.count / 856) * 100}%` }]} />
                </View>
                <Text style={styles.breakdownCount}>{item.count}</Text>
              </View>
            ))}

            {/* Filter & Sort */}
            <View style={styles.filterRow}>
              <View>
                <Text style={styles.filterLabel}>Filter by rating:</Text>
                <View style={styles.filterDropdown}>
                  <Text style={styles.filterText}>All Ratings</Text>
                  <Feather name="chevron-down" size={16} color="#6B7280" />
                </View>
              </View>
              <View>
                <Text style={styles.filterLabel}>Sort by:</Text>
                <View style={styles.filterDropdown}>
                  <Text style={styles.filterText}>Most Recent</Text>
                  <Feather name="chevron-down" size={16} color="#6B7280" />
                </View>
              </View>
            </View>
          </View>

          {/* Review Cards */}
          {[
            { id: 1, name: 'Rajesh Kumar', date: '15/01/2024', rating: 5, title: 'Excellent car with great mileage', text: 'I have been using this car for 6 months now. The mileage is excellent in city conditions. Build quality is good and maintenance cost is reasonable.', likes: 24, dislikes: 2, verified: true },
            { id: 2, name: 'Priya Sharma', date: '12/01/2024', rating: 4, title: 'Good family car', text: 'Perfect for family use. Spacious interior and comfortable seats. Only issue is the road noise at high speeds.', likes: 18, dislikes: 1, verified: true },
          ].map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}><Text style={styles.reviewAvatarText}>{review.name[0]}</Text></View>
                <View style={styles.reviewInfo}>
                  <View style={styles.reviewNameRow}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    {review.verified && <View style={styles.verifiedBadge}><Feather name="check" size={10} color="#FFFFFF" /></View>}
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <View style={styles.reviewStarsRow}>
                {[1, 2, 3, 4, 5].map(i => <Feather key={i} name="star" size={14} color={i <= review.rating ? '#F59E0B' : '#D1D5DB'} />)}
              </View>
              <Text style={styles.reviewTitle}>{review.title}</Text>
              <Text style={styles.reviewText}>{review.text}</Text>
              <View style={styles.reviewActions}>
                <View style={styles.reviewAction}><Feather name="thumbs-up" size={14} color="#6B7280" /><Text style={styles.reviewActionText}>{review.likes}</Text></View>
                <View style={styles.reviewAction}><Feather name="message-circle" size={14} color="#6B7280" /><Text style={styles.reviewActionText}>{review.dislikes}</Text></View>
              </View>
            </View>
          ))}

          {/* Read More Link */}
          <TouchableOpacity style={styles.readMoreButton} activeOpacity={0.7}>
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>

          {/* Write a Review CTA */}
          <View style={styles.writeReviewCard}>
            <Text style={styles.writeReviewTitle}>Own a {brandInfo?.name?.toLowerCase()} car? Share your experience!</Text>
            <Text style={styles.writeReviewSubtitle}>Help other buyers make informed decisions by sharing your honest review</Text>
            <TouchableOpacity style={styles.writeReviewButton} activeOpacity={0.9}>
              <Text style={styles.writeReviewButtonText}>Write a Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Footer onNavigate={(screen: string) => navigation.navigate(screen as never)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },

  // Brand Section
  brandSection: { paddingHorizontal: 16, paddingVertical: 20, backgroundColor: '#FFFFFF' },
  brandTitle: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 16 },
  description: { fontSize: 15, color: '#374151', lineHeight: 24 },
  readMore: { color: '#DC2626', fontWeight: '500' },
  expandedContent: { marginTop: 16 },
  fullDescription: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: 20 },
  priceListTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  priceSummary: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: 16 },
  modelLink: { color: '#2563EB', fontWeight: '500' },
  priceTable: { marginTop: 8 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#D1D5DB' },
  tableHeaderText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8 },
  tableModelName: { fontSize: 14, color: '#374151', fontWeight: '500' },
  tableModelPrice: { fontSize: 14, color: '#DC2626', fontWeight: '700' },
  collapseButton: { alignItems: 'flex-end', marginTop: 16, paddingVertical: 8 },
  collapseText: { fontSize: 14, color: '#2563EB', fontWeight: '500' },

  // Section 2: Filters
  filtersContainer: { paddingTop: 8, paddingBottom: 16 },
  filtersScroll: { paddingHorizontal: 16, gap: 10 },
  filterPill: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  filterPillActive: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  filterPillText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  filterPillTextActive: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 16 },

  // Section 2: Cars List
  carsList: { paddingHorizontal: 16, paddingVertical: 16 },
  emptyState: { paddingVertical: 80, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#6B7280' },

  // Car Card
  carCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden', height: 144, marginBottom: 12 },
  carImageContainer: { width: 128, height: '100%', backgroundColor: '#F9FAFB', position: 'relative', alignItems: 'center', justifyContent: 'center' },
  carImage: { width: '100%', height: '100%' },
  newBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#22C55E', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, zIndex: 10 },
  popularBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#EA580C', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, zIndex: 10 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  carDetails: { flex: 1, padding: 12, justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  carName: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  brandNameText: { color: '#4B5563', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '600', color: '#111827' },
  reviewsText: { fontSize: 14, color: '#6B7280' },
  variantsText: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  priceSymbol: { fontSize: 18, fontWeight: '700', color: '#DC2626' },
  priceValue: { fontSize: 20, fontWeight: '700', color: '#DC2626', marginLeft: 2 },
  priceLakh: { fontSize: 16, fontWeight: '600', color: '#DC2626', marginLeft: 4 },
  onwards: { fontSize: 14, color: '#6B7280', marginLeft: 6 },
  priceLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Section 3: Upcoming Cars
  upcomingSection: { paddingVertical: 20, backgroundColor: '#FFFFFF' },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16, paddingHorizontal: 16 },
  upcomingScroll: { paddingHorizontal: 16 },
  upcomingCard: { width: 280, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, overflow: 'hidden', marginRight: 16 },
  upcomingImageContainer: { height: 160, backgroundColor: '#F9FAFB', position: 'relative', alignItems: 'center', justifyContent: 'center' },
  upcomingImage: { width: '100%', height: '100%' },
  upcomingBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#EA580C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, zIndex: 10 },
  upcomingBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  upcomingHeart: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, zIndex: 10 },
  upcomingContent: { padding: 16 },
  upcomingTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  upcomingPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  upcomingPrice: { fontSize: 20, fontWeight: '700', color: '#DC2626' },
  upcomingOnwards: { fontSize: 14, color: '#6B7280', marginLeft: 8 },
  upcomingLabel: { fontSize: 12, color: '#6B7280', marginBottom: 12 },
  upcomingSpecRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  upcomingSpecText: { fontSize: 14, color: '#4B5563' },
  upcomingButton: { paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  upcomingButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  // Section 4: Alternative Brands (same as home page BrandSection)
  altBrandsSection: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#F9FAFB' },
  altBrandsTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 24 },
  brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  brandCard: { width: '30%', backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, alignItems: 'center', marginBottom: 16, marginRight: '3.33%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  brandLogoContainer: { height: 64, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  brandLogo: { width: 48, height: 48 },
  brandLogoFallback: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  brandInitials: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  brandCardName: { fontSize: 14, fontWeight: '500', color: '#111827', textAlign: 'center' },
  buttonContainer: { alignItems: 'center' },
  showAllButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  showAllButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  // Section 5: Videos
  videosSection: { backgroundColor: '#FFFFFF' },
  videosHeader: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },

  // Section 6: FAQ
  faqSection: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  faqTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6 },
  faqSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  faqItem: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, minHeight: 56 },
  faqQuestionText: { fontSize: 15, fontWeight: '500', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16 },
  faqDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
  faqAnswerText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },

  // Section 7: Owner Reviews
  reviewsSection: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  reviewsTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 20 },
  ratingCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 20, marginBottom: 16 },
  ratingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  starsRow: { flexDirection: 'row', marginRight: 8 },
  ratingNumber: { fontSize: 32, fontWeight: '700', color: '#111827', marginRight: 8 },
  ratingCount: { fontSize: 14, color: '#6B7280' },
  breakdownTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  breakdownStar: { fontSize: 14, color: '#6B7280', width: 30 },
  breakdownBarBg: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginHorizontal: 8 },
  breakdownBarFill: { height: 8, backgroundColor: '#F59E0B', borderRadius: 4 },
  breakdownCount: { fontSize: 14, color: '#6B7280', width: 40, textAlign: 'right' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  filterLabel: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  filterDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  filterText: { fontSize: 14, color: '#111827', marginRight: 8 },
  reviewCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reviewAvatarText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  reviewInfo: { flex: 1 },
  reviewNameRow: { flexDirection: 'row', alignItems: 'center' },
  reviewName: { fontSize: 15, fontWeight: '600', color: '#111827', marginRight: 6 },
  verifiedBadge: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  reviewDate: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  reviewStarsRow: { flexDirection: 'row', marginBottom: 8 },
  reviewTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 6 },
  reviewText: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 12 },
  reviewActions: { flexDirection: 'row' },
  reviewAction: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  reviewActionText: { fontSize: 13, color: '#6B7280', marginLeft: 4 },
  readMoreButton: { alignItems: 'center', paddingVertical: 16 },
  readMoreText: { fontSize: 15, fontWeight: '600', color: '#DC2626' },
  writeReviewCard: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 24, alignItems: 'center', marginTop: 16 },
  writeReviewTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 },
  writeReviewSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  writeReviewButton: { backgroundColor: '#DC2626', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  writeReviewButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
