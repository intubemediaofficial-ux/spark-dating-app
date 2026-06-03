import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const CARD_HEIGHT = height - 160;
const DAILY_LIKE_LIMIT = 20;

const DEMO_PROFILES = [
  {
    id: '1', name: 'Priya Sharma', age: 24,
    bio: 'Coffee lover | Travel enthusiast | Dog person 🐕',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1200&fit=crop',
    ],
    interests: ['Travel', 'Photography', 'Coffee', 'Dogs'],
    city: 'New Delhi', distance: 3, isVerified: true,
    job: 'Marketing Manager at Google',
  },
  {
    id: '2', name: 'Ananya Gupta', age: 23,
    bio: 'Graphic designer by day, dancer by night 💃',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1200&fit=crop',
    ],
    interests: ['Art', 'Dance', 'Design', 'Netflix'],
    city: 'New Delhi', distance: 5, isVerified: true,
    job: 'Senior Designer at Zomato',
  },
  {
    id: '3', name: 'Sneha Patel', age: 25,
    bio: 'Doctor in making 🩺 | Bollywood buff',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&h=1200&fit=crop',
    ],
    interests: ['Medical', 'Cooking', 'Bollywood', 'Reading'],
    city: 'Mumbai', distance: 12, isVerified: false,
    job: 'Resident Doctor at AIIMS',
  },
  {
    id: '4', name: 'Kavya Reddy', age: 22,
    bio: 'MBA student | Poetry writer ✍️',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
    ],
    interests: ['Poetry', 'Business', 'Music', 'Chai'],
    city: 'Hyderabad', distance: 8, isVerified: true,
    job: 'MBA Student at ISB',
  },
  {
    id: '5', name: 'Meera Joshi', age: 26,
    bio: 'Software engineer | Cat mom 🐱 | Trekker 🏔️',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
    ],
    interests: ['Coding', 'Cats', 'Trekking', 'Photography'],
    city: 'Bangalore', distance: 15, isVerified: true,
    job: 'SDE at Microsoft',
  },
];

const DEMO_USER_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
const DISTANCE_OPTIONS = [10, 20, 50, 100];

export default function DiscoverScreen() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(50);
  const [likesUsed, setLikesUsed] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const filteredProfiles = useMemo(() => {
    return DEMO_PROFILES.filter((p) => p.distance <= selectedDistance);
  }, [selectedDistance]);
  const position = useRef(new Animated.ValueXY()).current;
  const likeScale = useRef(new Animated.Value(0)).current;
  const matchScale = useRef(new Animated.Value(0)).current;
  const leftProfileX = useRef(new Animated.Value(-width)).current;
  const rightProfileX = useRef(new Animated.Value(width)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const sparkOpacity = useRef(new Animated.Value(0)).current;

  const triggerLikeAnimation = (callback) => {
    setShowLikeAnimation(true);
    likeScale.setValue(0);
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(likeScale, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setShowLikeAnimation(false);
      if (callback) callback();
    });
  };

  const triggerMatchAnimation = (profile) => {
    setMatchedProfile(profile);
    setShowMatchModal(true);
    leftProfileX.setValue(-width);
    rightProfileX.setValue(width);
    heartScale.setValue(0);
    sparkOpacity.setValue(0);
    matchScale.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(leftProfileX, { toValue: -60, friction: 5, useNativeDriver: true }),
        Animated.spring(rightProfileX, { toValue: 60, friction: 5, useNativeDriver: true }),
        Animated.spring(matchScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(leftProfileX, { toValue: -30, friction: 8, useNativeDriver: true }),
        Animated.spring(rightProfileX, { toValue: 30, friction: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(heartScale, { toValue: 1, friction: 3, tension: 100, useNativeDriver: true }),
        Animated.timing(sparkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleSwipe = (direction) => {
    if (currentIndex >= filteredProfiles.length) return;
    const profile = filteredProfiles[currentIndex];

    if (direction === 'RIGHT') {
      if (likesUsed >= DAILY_LIKE_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      setLikesUsed(likesUsed + 1);
      triggerLikeAnimation(() => {
        if (currentIndex === 0 || currentIndex === 3) {
          setTimeout(() => triggerMatchAnimation(profile), 200);
        }
      });
    }

    setCurrentIndex(currentIndex + 1);
    setCurrentPhotoIndex(0);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        Animated.timing(position, { toValue: { x: width + 100, y: gesture.dy }, duration: 300, useNativeDriver: false }).start(() => {
          handleSwipe('RIGHT');
          position.setValue({ x: 0, y: 0 });
        });
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        Animated.timing(position, { toValue: { x: -width - 100, y: gesture.dy }, duration: 300, useNativeDriver: false }).start(() => {
          handleSwipe('LEFT');
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
      }
    },
  });

  const rotate = position.x.interpolate({ inputRange: [-width / 2, 0, width / 2], outputRange: ['-8deg', '0deg', '8deg'], extrapolate: 'clamp' });
  const likeOpacity = position.x.interpolate({ inputRange: [0, width / 5], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-width / 5, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const nextCardScale = position.x.interpolate({ inputRange: [-width / 2, 0, width / 2], outputRange: [1, 0.95, 1], extrapolate: 'clamp' });

  const handlePhotoTap = (profile, side) => {
    const total = profile.photos.length;
    if (side === 'right' && currentPhotoIndex < total - 1) setCurrentPhotoIndex(currentPhotoIndex + 1);
    else if (side === 'left' && currentPhotoIndex > 0) setCurrentPhotoIndex(currentPhotoIndex - 1);
  };

  const renderCard = (profile, index) => {
    if (index < currentIndex) return null;
    const isCurrentCard = index === currentIndex;
    const cardStyle = isCurrentCard
      ? [styles.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]
      : [styles.card, { top: 5, transform: [{ scale: nextCardScale }], opacity: 0.9 }];
    const photoToShow = isCurrentCard ? currentPhotoIndex : 0;

    return (
      <Animated.View key={profile.id} style={cardStyle} {...(isCurrentCard ? panResponder.panHandlers : {})}>
        <Image source={{ uri: profile.photos[photoToShow] }} style={styles.cardImage} resizeMode="cover" />

        {/* Tap zones for photo browsing */}
        {isCurrentCard && (
          <View style={styles.tapZones}>
            <TouchableOpacity style={styles.tapLeft} onPress={() => handlePhotoTap(profile, 'left')} activeOpacity={1} />
            <TouchableOpacity style={styles.tapRight} onPress={() => handlePhotoTap(profile, 'right')} activeOpacity={1} />
          </View>
        )}

        {/* Photo indicators */}
        {isCurrentCard && (
          <View style={styles.photoIndicators}>
            {profile.photos.map((_, i) => (
              <View key={i} style={[styles.indicator, i === currentPhotoIndex && styles.activeIndicator]} />
            ))}
          </View>
        )}

        {/* LIKE / NOPE stamps */}
        {isCurrentCard && (
          <>
            <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
              <Text style={styles.likeStampText}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeStampText}>NOPE</Text>
            </Animated.View>
          </>
        )}

        {/* Gradient */}
        <View style={styles.gradient} />

        {/* User info at bottom */}
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>{profile.age}</Text>
            {profile.isVerified && <View style={styles.verifiedBadge}><Text style={styles.verifiedIcon}>✓</Text></View>}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>📍 {profile.city} • {profile.distance} km away</Text>
          </View>
          {profile.job && <Text style={styles.jobText}>💼 {profile.job}</Text>}
        </View>
      </Animated.View>
    );
  };

  if (currentIndex >= filteredProfiles.length) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>{t('noMoreProfiles')}</Text>
          <Text style={styles.emptyText}>{t('checkBackLater')}</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => { setCurrentIndex(0); setCurrentPhotoIndex(0); }}>
            <Text style={styles.refreshBtnText}>{t('refresh')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top overlay - Logo + Distance filter */}
      <View style={styles.topOverlay}>
        <Text style={styles.logo}>🔥 Spark</Text>
        <TouchableOpacity style={styles.distanceBtn} onPress={() => setShowDistanceFilter(!showDistanceFilter)}>
          <Text style={styles.distanceBtnText}>📍 {selectedDistance} km</Text>
        </TouchableOpacity>
      </View>

      {/* Distance filter dropdown */}
      {showDistanceFilter && (
        <View style={styles.distanceDropdown}>
          {DISTANCE_OPTIONS.map((d) => (
            <TouchableOpacity key={d} style={[styles.distanceOption, selectedDistance === d && styles.distanceOptionActive]} onPress={() => { setSelectedDistance(d); setShowDistanceFilter(false); }}>
              <Text style={[styles.distanceOptionText, selectedDistance === d && styles.distanceOptionTextActive]}>{d} km</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Card Stack */}
      <View style={styles.cardStack}>
        {filteredProfiles.slice(currentIndex, currentIndex + 2).reverse().map((profile, i) =>
          renderCard(profile, currentIndex + (1 - i))
        )}
      </View>

      {/* Bottom Action Buttons - Skip & Like */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.skipBtn]} onPress={() => {
          Animated.timing(position, { toValue: { x: -width - 100, y: 0 }, duration: 300, useNativeDriver: false }).start(() => { handleSwipe('LEFT'); position.setValue({ x: 0, y: 0 }); });
        }}>
          <Text style={styles.skipIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.superBtn]} onPress={() => {
          triggerLikeAnimation();
          setCurrentIndex(currentIndex + 1);
          setCurrentPhotoIndex(0);
        }}>
          <Text style={styles.superIcon}>⭐</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={() => {
          Animated.timing(position, { toValue: { x: width + 100, y: 0 }, duration: 300, useNativeDriver: false }).start(() => { handleSwipe('RIGHT'); position.setValue({ x: 0, y: 0 }); });
        }}>
          <Text style={styles.likeIcon}>♥</Text>
        </TouchableOpacity>
      </View>

      {/* Like Animation Overlay */}
      {showLikeAnimation && (
        <View style={styles.likeOverlay} pointerEvents="none">
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <Text style={styles.bigHeart}>❤️</Text>
          </Animated.View>
        </View>
      )}

      {/* Match Modal */}
      <Modal visible={showMatchModal} transparent animationType="fade">
        <View style={styles.matchOverlay}>
          <Animated.View style={[styles.matchContent, { transform: [{ scale: matchScale }] }]}>
            <Animated.View style={[styles.sparkContainer, { opacity: sparkOpacity }]}>
              <Text style={styles.sparkText}>⚡</Text>
              <Text style={[styles.sparkText, { position: 'absolute', top: -20, left: -30 }]}>✨</Text>
              <Text style={[styles.sparkText, { position: 'absolute', top: -15, right: -25 }]}>✨</Text>
              <Text style={[styles.sparkText, { position: 'absolute', bottom: -10, left: -20 }]}>💫</Text>
              <Text style={[styles.sparkText, { position: 'absolute', bottom: -15, right: -30 }]}>💫</Text>
            </Animated.View>

            <Text style={styles.matchTitle}>It's a Match! 🎉</Text>
            <Text style={styles.matchSubtitle}>You and {matchedProfile?.name} liked each other</Text>

            <View style={styles.matchProfiles}>
              <Animated.View style={[styles.matchProfileItem, { transform: [{ translateX: leftProfileX }] }]}>
                <Image source={{ uri: DEMO_USER_PHOTO }} style={styles.matchProfileImage} />
                <Text style={styles.matchProfileName}>You</Text>
              </Animated.View>
              <Animated.View style={[styles.matchHeart, { transform: [{ scale: heartScale }] }]}>
                <Text style={styles.matchHeartIcon}>❤️</Text>
              </Animated.View>
              <Animated.View style={[styles.matchProfileItem, { transform: [{ translateX: rightProfileX }] }]}>
                <Image source={{ uri: matchedProfile?.photos?.[0] }} style={styles.matchProfileImage} />
                <Text style={styles.matchProfileName}>{matchedProfile?.name}</Text>
              </Animated.View>
            </View>

            <TouchableOpacity style={styles.matchChatBtn} onPress={() => setShowMatchModal(false)}>
              <Text style={styles.matchChatBtnText}>{t('sendMessage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.matchKeepBtn} onPress={() => setShowMatchModal(false)}>
              <Text style={styles.matchKeepBtnText}>{t('keepSwiping')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Like Limit Modal */}
      <Modal visible={showLimitModal} transparent animationType="slide">
        <View style={styles.limitOverlay}>
          <View style={styles.limitContent}>
            <Text style={styles.limitEmoji}>💔</Text>
            <Text style={styles.limitTitle}>{t('dailyLimitReached')}</Text>
            <Text style={styles.limitText}>{t('usedAllLikes', { count: DAILY_LIKE_LIMIT })}</Text>
            <Text style={styles.limitUpgrade}>{t('upgradeTo')} <Text style={{ color: '#FFB300', fontWeight: '800' }}>Spark Gold</Text> {t('forUnlimited')}</Text>
            <TouchableOpacity style={styles.limitUpgradeBtn} onPress={() => setShowLimitModal(false)}>
              <Text style={styles.limitUpgradeBtnText}>{t('upgradeNow')} - ₹199/mo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.limitWaitBtn} onPress={() => setShowLimitModal(false)}>
              <Text style={styles.limitWaitBtnText}>{t('waitTomorrow')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topOverlay: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 },
  logo: { fontSize: 26, fontWeight: '800', color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  distanceBtn: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  distanceBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  distanceDropdown: { position: 'absolute', top: 90, right: 20, backgroundColor: '#fff', borderRadius: 12, padding: 8, zIndex: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 10 },
  distanceOption: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  distanceOptionActive: { backgroundColor: '#FFF0F1' },
  distanceOptionText: { fontSize: 16, color: '#333' },
  distanceOptionTextActive: { color: '#FF4458', fontWeight: '700' },
  cardStack: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { position: 'absolute', width: width, height: CARD_HEIGHT, backgroundColor: '#222', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', position: 'absolute' },
  tapZones: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', zIndex: 10 },
  tapLeft: { flex: 1 },
  tapRight: { flex: 1 },
  photoIndicators: { position: 'absolute', top: 100, left: 15, right: 15, flexDirection: 'row', gap: 4, zIndex: 20 },
  indicator: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
  activeIndicator: { backgroundColor: '#fff' },
  stamp: { position: 'absolute', top: 140, zIndex: 30, borderWidth: 4, borderRadius: 8, padding: 10 },
  likeStamp: { left: 30, borderColor: '#4CAF50', transform: [{ rotate: '-15deg' }] },
  likeStampText: { fontSize: 40, fontWeight: '900', color: '#4CAF50' },
  nopeStamp: { right: 30, borderColor: '#FF4458', transform: [{ rotate: '15deg' }] },
  nopeStampText: { fontSize: 40, fontWeight: '900', color: '#FF4458' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.85))' },
  profileInfo: { position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { fontSize: 30, fontWeight: '800', color: '#fff' },
  age: { fontSize: 28, fontWeight: '400', color: '#fff' },
  verifiedBadge: { backgroundColor: '#4FC3F7', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  verifiedIcon: { fontSize: 14, color: '#fff', fontWeight: 'bold' },
  infoRow: { marginTop: 6 },
  infoText: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
  jobText: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 25, paddingVertical: 15, paddingBottom: 10, backgroundColor: '#000' },
  actionBtn: { justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  skipBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', borderWidth: 2, borderColor: '#FF4458' },
  skipIcon: { fontSize: 30, color: '#FF4458' },
  superBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', borderWidth: 2, borderColor: '#29B6F6' },
  superIcon: { fontSize: 24 },
  likeBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF4458' },
  likeIcon: { fontSize: 32, color: '#fff' },
  likeOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  bigHeart: { fontSize: 140 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 70 },
  emptyTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 20 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 10 },
  refreshBtn: { backgroundColor: '#FF4458', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 30, marginTop: 25 },
  refreshBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  matchOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  matchContent: { alignItems: 'center', padding: 30, width: '90%' },
  sparkContainer: { position: 'absolute', top: '35%', zIndex: 10 },
  sparkText: { fontSize: 40 },
  matchTitle: { fontSize: 34, fontWeight: '900', color: '#fff', marginBottom: 8 },
  matchSubtitle: { fontSize: 17, color: 'rgba(255,255,255,0.8)', marginBottom: 40 },
  matchProfiles: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 50, width: '100%' },
  matchProfileItem: { alignItems: 'center' },
  matchProfileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FF4458', backgroundColor: '#333' },
  matchProfileName: { fontSize: 16, color: '#fff', fontWeight: '600', marginTop: 10 },
  matchHeart: { position: 'absolute', zIndex: 10 },
  matchHeartIcon: { fontSize: 50 },
  matchChatBtn: { backgroundColor: '#FF4458', paddingHorizontal: 50, paddingVertical: 16, borderRadius: 30, marginBottom: 15, width: '100%', alignItems: 'center' },
  matchChatBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  matchKeepBtn: { paddingVertical: 12 },
  matchKeepBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  limitOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  limitContent: { backgroundColor: '#fff', borderRadius: 24, padding: 35, width: '85%', alignItems: 'center' },
  limitEmoji: { fontSize: 60, marginBottom: 15 },
  limitTitle: { fontSize: 24, fontWeight: '800', color: '#222', marginBottom: 10, textAlign: 'center' },
  limitText: { fontSize: 16, color: '#666', marginBottom: 15, textAlign: 'center' },
  limitUpgrade: { fontSize: 15, color: '#444', marginBottom: 25, textAlign: 'center' },
  limitUpgradeBtn: { backgroundColor: '#FFB300', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, marginBottom: 12, width: '100%', alignItems: 'center' },
  limitUpgradeBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  limitWaitBtn: { paddingVertical: 12 },
  limitWaitBtnText: { color: '#888', fontSize: 15 },
});
