import React, { useState, useRef } from 'react';
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
  Alert,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const CARD_HEIGHT = height - 180;

const DEMO_PROFILES = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 24,
    bio: 'Coffee lover | Travel enthusiast | Dog person 🐕\nLooking for someone who can make me laugh and go on spontaneous adventures.',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1200&fit=crop',
    ],
    interests: ['Travel', 'Photography', 'Coffee', 'Dogs', 'Music', 'Yoga'],
    city: 'New Delhi',
    distance: 3,
    isVerified: true,
    job: 'Marketing Manager at Google',
    education: 'Delhi University',
  },
  {
    id: '2',
    name: 'Ananya Gupta',
    age: 23,
    bio: 'Graphic designer by day, dancer by night 💃\nSwipe right if you love art and good conversations.',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1200&fit=crop',
    ],
    interests: ['Art', 'Dance', 'Design', 'Netflix', 'Wine', 'Travel'],
    city: 'New Delhi',
    distance: 5,
    isVerified: true,
    job: 'Senior Designer at Zomato',
    education: 'NID Ahmedabad',
  },
  {
    id: '3',
    name: 'Sneha Patel',
    age: 25,
    bio: 'Doctor in making 🩺 | Love cooking | Bollywood movie buff\nIf you can quote Shah Rukh Khan dialogues, we are a match!',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&h=1200&fit=crop',
    ],
    interests: ['Medical', 'Cooking', 'Bollywood', 'Reading', 'Gym', 'Swimming'],
    city: 'Mumbai',
    distance: 12,
    isVerified: false,
    job: 'Resident Doctor at AIIMS',
    education: 'AIIMS Delhi',
  },
  {
    id: '4',
    name: 'Kavya Reddy',
    age: 22,
    bio: 'MBA student | Poetry writer ✍️ | Old Bollywood songs lover\nLet\'s discuss life over chai and samosas.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
    ],
    interests: ['Poetry', 'Business', 'Music', 'Writing', 'Chai', 'Books'],
    city: 'Hyderabad',
    distance: 8,
    isVerified: true,
    job: 'MBA Student at ISB',
    education: 'ISB Hyderabad',
  },
  {
    id: '5',
    name: 'Meera Joshi',
    age: 26,
    bio: 'Software engineer | Cat mom 🐱 | Weekend trekker 🏔️\nI write code all week and climb mountains on weekends.',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
    ],
    interests: ['Coding', 'Cats', 'Trekking', 'Photography', 'Gaming', 'Coffee'],
    city: 'Bangalore',
    distance: 15,
    isVerified: true,
    job: 'SDE at Microsoft',
    education: 'IIT Bombay',
  },
];

const DEMO_USER_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';

export default function DiscoverScreen() {
  const [profiles] = useState(DEMO_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
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
      Animated.spring(likeScale, { toValue: 1.2, friction: 3, useNativeDriver: true }),
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
    if (currentIndex >= profiles.length) return;
    const profile = profiles[currentIndex];

    if (direction === 'RIGHT') {
      triggerLikeAnimation(() => {
        if (currentIndex === 0 || currentIndex === 3) {
          setTimeout(() => triggerMatchAnimation(profile), 200);
        }
      });
    }

    if (direction === 'SUPERLIKE') {
      triggerLikeAnimation();
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
        Animated.timing(position, {
          toValue: { x: width + 100, y: gesture.dy },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          handleSwipe('RIGHT');
          position.setValue({ x: 0, y: 0 });
        });
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        Animated.timing(position, {
          toValue: { x: -width - 100, y: gesture.dy },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          handleSwipe('LEFT');
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 5, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const renderPhotoIndicators = (photos) => (
    <View style={styles.photoIndicators}>
      {photos.map((_, i) => (
        <View key={i} style={[styles.indicator, i === currentPhotoIndex && styles.activeIndicator]} />
      ))}
    </View>
  );

  const handlePhotoTap = (profile, side) => {
    const totalPhotos = profile.photos.length;
    if (side === 'right' && currentPhotoIndex < totalPhotos - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else if (side === 'left' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const renderCard = (profile, index) => {
    if (index < currentIndex) return null;
    const isCurrentCard = index === currentIndex;
    const cardStyle = isCurrentCard
      ? [styles.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]
      : [styles.card, { top: 8, transform: [{ scale: nextCardScale }], opacity: 0.9 }];

    const photoToShow = isCurrentCard ? currentPhotoIndex : 0;

    return (
      <Animated.View key={profile.id} style={cardStyle} {...(isCurrentCard ? panResponder.panHandlers : {})}>
        <Image source={{ uri: profile.photos[photoToShow] }} style={styles.cardImage} resizeMode="cover" />

        {isCurrentCard && (
          <View style={styles.tapZones}>
            <TouchableOpacity style={styles.tapLeft} onPress={() => handlePhotoTap(profile, 'left')} activeOpacity={1} />
            <TouchableOpacity style={styles.tapRight} onPress={() => handlePhotoTap(profile, 'right')} activeOpacity={1} />
          </View>
        )}

        {isCurrentCard && renderPhotoIndicators(profile.photos)}

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

        <View style={styles.gradient} />

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>{profile.age}</Text>
            {profile.isVerified && (
              <View style={styles.verifiedBadge}><Text style={styles.verifiedIcon}>✓</Text></View>
            )}
          </View>
          {profile.job && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💼</Text>
              <Text style={styles.infoText}>{profile.job}</Text>
            </View>
          )}
          {profile.education && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🎓</Text>
              <Text style={styles.infoText}>{profile.education}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{profile.city} • {profile.distance} km away</Text>
          </View>
          <Text style={styles.bio} numberOfLines={2}>{profile.bio}</Text>
          <View style={styles.interestRow}>
            {profile.interests.slice(0, 5).map((interest, i) => (
              <View key={i} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.logo}>🔥 Spark</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No More Profiles</Text>
          <Text style={styles.emptyText}>You've seen everyone nearby.{'\n'}Check back later for new people!</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => { setCurrentIndex(0); setCurrentPhotoIndex(0); }}>
            <Text style={styles.refreshBtnText}>Refresh Profiles</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>🔥 Spark</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardStack}>
        {profiles.slice(currentIndex, currentIndex + 2).reverse().map((profile, i) =>
          renderCard(profile, currentIndex + (1 - i))
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.rewindBtn]} onPress={() => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setCurrentPhotoIndex(0); } }}>
          <Text style={styles.actionIcon}>↩️</Text>
          <Text style={styles.actionLabel}>Rewind</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.nopeBtn]} onPress={() => {
          Animated.timing(position, { toValue: { x: -width - 100, y: 0 }, duration: 300, useNativeDriver: false }).start(() => { handleSwipe('LEFT'); position.setValue({ x: 0, y: 0 }); });
        }}>
          <Text style={[styles.actionIcon, { fontSize: 32 }]}>✕</Text>
          <Text style={styles.actionLabel}>Nope</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.superLikeBtn]} onPress={() => {
          Animated.timing(position, { toValue: { x: 0, y: -height }, duration: 300, useNativeDriver: false }).start(() => { handleSwipe('SUPERLIKE'); position.setValue({ x: 0, y: 0 }); });
        }}>
          <Text style={[styles.actionIcon, { fontSize: 28 }]}>⭐</Text>
          <Text style={styles.actionLabel}>Super</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.likeActionBtn]} onPress={() => {
          Animated.timing(position, { toValue: { x: width + 100, y: 0 }, duration: 300, useNativeDriver: false }).start(() => { handleSwipe('RIGHT'); position.setValue({ x: 0, y: 0 }); });
        }}>
          <Text style={[styles.actionIcon, { fontSize: 32 }]}>♥</Text>
          <Text style={styles.actionLabel}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.boostBtn]} onPress={() => Alert.alert('🚀 Boost Activated!', 'Your profile will be shown to more people for 30 minutes!')}>
          <Text style={styles.actionIcon}>⚡</Text>
          <Text style={styles.actionLabel}>Boost</Text>
        </TouchableOpacity>
      </View>

      {/* LIKE ANIMATION - Full screen heart */}
      {showLikeAnimation && (
        <View style={styles.likeAnimationOverlay} pointerEvents="none">
          <Animated.View style={[styles.likeAnimationHeart, { transform: [{ scale: likeScale }] }]}>
            <Text style={styles.likeAnimationIcon}>❤️</Text>
          </Animated.View>
        </View>
      )}

      {/* MATCH MODAL - Profiles collide animation */}
      <Modal visible={showMatchModal} transparent animationType="fade">
        <View style={styles.matchOverlay}>
          <Animated.View style={[styles.matchContent, { transform: [{ scale: matchScale }] }]}>
            {/* Spark/Lightning effect */}
            <Animated.View style={[styles.sparkContainer, { opacity: sparkOpacity }]}>
              <Text style={styles.sparkText}>⚡</Text>
              <Text style={[styles.sparkText, { position: 'absolute', top: -20, left: -30 }]}>✨</Text>
              <Text style={[styles.sparkText, { position: 'absolute', top: -15, right: -25 }]}>✨</Text>
              <Text style={[styles.sparkText, { position: 'absolute', bottom: -10, left: -20 }]}>💫</Text>
              <Text style={[styles.sparkText, { position: 'absolute', bottom: -15, right: -30 }]}>💫</Text>
            </Animated.View>

            <Text style={styles.matchTitle}>It's a Match! 🎉</Text>
            <Text style={styles.matchSubtitle}>You and {matchedProfile?.name} liked each other</Text>

            {/* Two profiles colliding */}
            <View style={styles.matchProfiles}>
              <Animated.View style={[styles.matchProfileLeft, { transform: [{ translateX: leftProfileX }] }]}>
                <Image source={{ uri: DEMO_USER_PHOTO }} style={styles.matchProfileImage} />
                <Text style={styles.matchProfileName}>You</Text>
              </Animated.View>

              {/* Heart in center */}
              <Animated.View style={[styles.matchHeart, { transform: [{ scale: heartScale }] }]}>
                <Text style={styles.matchHeartIcon}>❤️</Text>
              </Animated.View>

              <Animated.View style={[styles.matchProfileRight, { transform: [{ translateX: rightProfileX }] }]}>
                <Image source={{ uri: matchedProfile?.photos?.[0] }} style={styles.matchProfileImage} />
                <Text style={styles.matchProfileName}>{matchedProfile?.name}</Text>
              </Animated.View>
            </View>

            <TouchableOpacity style={styles.matchChatBtn} onPress={() => setShowMatchModal(false)}>
              <Text style={styles.matchChatBtnText}>Send a Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.matchKeepBtn} onPress={() => setShowMatchModal(false)}>
              <Text style={styles.matchKeepBtnText}>Keep Swiping</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
  logo: { fontSize: 28, fontWeight: '800', color: '#FF4458' },
  filterBtn: { padding: 8 },
  filterIcon: { fontSize: 22 },
  cardStack: { flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
  card: { position: 'absolute', width: width - 20, height: CARD_HEIGHT, borderRadius: 16, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  tapZones: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', zIndex: 10 },
  tapLeft: { flex: 1 },
  tapRight: { flex: 1 },
  photoIndicators: { position: 'absolute', top: 12, left: 10, right: 10, flexDirection: 'row', gap: 4, zIndex: 20 },
  indicator: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
  activeIndicator: { backgroundColor: '#fff' },
  stamp: { position: 'absolute', top: 80, zIndex: 30, borderWidth: 4, borderRadius: 8, padding: 10 },
  likeStamp: { left: 20, borderColor: '#4CAF50', transform: [{ rotate: '-15deg' }] },
  likeStampText: { fontSize: 36, fontWeight: '900', color: '#4CAF50' },
  nopeStamp: { right: 20, borderColor: '#FF4458', transform: [{ rotate: '15deg' }] },
  nopeStampText: { fontSize: 36, fontWeight: '900', color: '#FF4458' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.8))' },
  profileInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, zIndex: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { fontSize: 28, fontWeight: '800', color: '#fff' },
  age: { fontSize: 26, fontWeight: '400', color: '#fff' },
  verifiedBadge: { backgroundColor: '#4FC3F7', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  verifiedIcon: { fontSize: 13, color: '#fff', fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  infoIcon: { fontSize: 14 },
  infoText: { fontSize: 15, color: 'rgba(255,255,255,0.9)' },
  bio: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 20 },
  interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  interestTag: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  interestText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, paddingVertical: 15, paddingBottom: 25 },
  actionBtn: { alignItems: 'center', justifyContent: 'center', borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 4 },
  rewindBtn: { width: 48, height: 48, backgroundColor: '#fff', borderRadius: 24 },
  nopeBtn: { width: 60, height: 60, backgroundColor: '#fff', borderRadius: 30, borderWidth: 2, borderColor: '#FF4458' },
  superLikeBtn: { width: 48, height: 48, backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: '#29B6F6' },
  likeActionBtn: { width: 60, height: 60, backgroundColor: '#FF4458', borderRadius: 30 },
  boostBtn: { width: 48, height: 48, backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: '#9C27B0' },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: 10, color: '#666', marginTop: 2 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 70 },
  emptyTitle: { fontSize: 26, fontWeight: '800', color: '#333', marginTop: 20 },
  emptyText: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center', lineHeight: 24 },
  refreshBtn: { backgroundColor: '#FF4458', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 30, marginTop: 25 },
  refreshBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  // Like Animation
  likeAnimationOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  likeAnimationHeart: { alignItems: 'center', justifyContent: 'center' },
  likeAnimationIcon: { fontSize: 120 },

  // Match Modal
  matchOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  matchContent: { alignItems: 'center', padding: 30, width: '90%' },
  sparkContainer: { position: 'absolute', top: '35%', zIndex: 10 },
  sparkText: { fontSize: 40 },
  matchTitle: { fontSize: 34, fontWeight: '900', color: '#fff', marginBottom: 8 },
  matchSubtitle: { fontSize: 17, color: 'rgba(255,255,255,0.8)', marginBottom: 40 },
  matchProfiles: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 50, width: '100%' },
  matchProfileLeft: { alignItems: 'center' },
  matchProfileRight: { alignItems: 'center' },
  matchProfileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FF4458', backgroundColor: '#333' },
  matchProfileName: { fontSize: 16, color: '#fff', fontWeight: '600', marginTop: 10 },
  matchHeart: { position: 'absolute', zIndex: 10 },
  matchHeartIcon: { fontSize: 50 },
  matchChatBtn: { backgroundColor: '#FF4458', paddingHorizontal: 50, paddingVertical: 16, borderRadius: 30, marginBottom: 15, width: '100%', alignItems: 'center' },
  matchChatBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  matchKeepBtn: { paddingVertical: 12 },
  matchKeepBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
});
