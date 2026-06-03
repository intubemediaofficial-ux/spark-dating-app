import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { swipeAPI } from '../services/api';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function DiscoverScreen() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await swipeAPI.getDiscovery();
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Load profiles error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    try {
      const response = await swipeAPI.swipe(profile.id, direction);
      if (response.data.isMatch) {
        Alert.alert('🎉 It\'s a Match!', `You and ${profile.name} liked each other!`);
      }
    } catch (error) {
      console.error('Swipe error:', error);
    }

    setCurrentIndex(currentIndex + 1);

    // Load more when running low
    if (currentIndex >= profiles.length - 3) {
      loadProfiles();
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        // Swipe Right - Like
        Animated.spring(position, {
          toValue: { x: width + 100, y: gesture.dy },
          useNativeDriver: false,
        }).start(() => {
          handleSwipe('RIGHT');
          position.setValue({ x: 0, y: 0 });
        });
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        // Swipe Left - Skip
        Animated.spring(position, {
          toValue: { x: -width - 100, y: gesture.dy },
          useNativeDriver: false,
        }).start(() => {
          handleSwipe('LEFT');
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        // Return to center
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderCard = (profile, index) => {
    if (index < currentIndex) return null;

    const isCurrentCard = index === currentIndex;
    const cardStyle = isCurrentCard
      ? [
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate },
            ],
          },
        ]
      : [styles.card, { top: 10 * (index - currentIndex), transform: [{ scale: 1 - 0.05 * (index - currentIndex) }] }];

    return (
      <Animated.View
        key={profile.id}
        style={cardStyle}
        {...(isCurrentCard ? panResponder.panHandlers : {})}
      >
        <Image
          source={{ uri: profile.photos?.[0] || 'https://via.placeholder.com/400x600' }}
          style={styles.cardImage}
        />

        {/* Like/Nope Labels */}
        {isCurrentCard && (
          <>
            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Text style={styles.likeLabelText}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeLabelText}>NOPE</Text>
            </Animated.View>
          </>
        )}

        {/* Profile Info */}
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.cardName}>{profile.name}, {profile.age}</Text>
            {profile.isVerified && <Text style={styles.verified}>✓</Text>}
          </View>
          {profile.city && <Text style={styles.cardCity}>📍 {profile.city}</Text>}
          {profile.distance && <Text style={styles.cardDistance}>{profile.distance} km away</Text>}
          {profile.bio && <Text style={styles.cardBio} numberOfLines={2}>{profile.bio}</Text>}
          {profile.interests?.length > 0 && (
            <View style={styles.interestRow}>
              {profile.interests.slice(0, 4).map((interest, i) => (
                <View key={i} style={styles.interestTag}>
                  <Text style={styles.interestTagText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  if (loading && profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF4458" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (currentIndex >= profiles.length && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptyText}>Check back later for new people near you</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadProfiles}>
            <Text style={styles.refreshBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔥 Spark</Text>
      </View>

      {/* Card Stack */}
      <View style={styles.cardStack}>
        {profiles.slice(currentIndex, currentIndex + 3).reverse().map((profile, i) =>
          renderCard(profile, currentIndex + (2 - i))
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.skipBtn]}
          onPress={() => {
            Animated.spring(position, {
              toValue: { x: -width - 100, y: 0 },
              useNativeDriver: false,
            }).start(() => {
              handleSwipe('LEFT');
              position.setValue({ x: 0, y: 0 });
            });
          }}
        >
          <Text style={styles.actionBtnText}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={() => {
            Animated.spring(position, {
              toValue: { x: width + 100, y: 0 },
              useNativeDriver: false,
            }).start(() => {
              handleSwipe('RIGHT');
              position.setValue({ x: 0, y: 0 });
            });
          }}
        >
          <Text style={styles.actionBtnText}>♥</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FF4458' },
  cardStack: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    width: width - 40,
    height: height * 0.62,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: '65%', backgroundColor: '#e0e0e0' },
  cardInfo: { padding: 15, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardName: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  verified: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold' },
  cardCity: { fontSize: 14, color: '#666', marginTop: 3 },
  cardDistance: { fontSize: 12, color: '#999', marginTop: 2 },
  cardBio: { fontSize: 14, color: '#444', marginTop: 6 },
  interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  interestTag: { backgroundColor: '#FFF0F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  interestTagText: { fontSize: 12, color: '#FF4458' },
  likeLabel: {
    position: 'absolute', top: 40, left: 20, borderWidth: 3,
    borderColor: '#4CAF50', borderRadius: 5, padding: 8, transform: [{ rotate: '-15deg' }],
  },
  likeLabelText: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50' },
  nopeLabel: {
    position: 'absolute', top: 40, right: 20, borderWidth: 3,
    borderColor: '#FF4458', borderRadius: 5, padding: 8, transform: [{ rotate: '15deg' }],
  },
  nopeLabelText: { fontSize: 28, fontWeight: 'bold', color: '#FF4458' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 30, paddingVertical: 20 },
  actionBtn: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  skipBtn: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#FF4458' },
  likeBtn: { backgroundColor: '#FF4458' },
  actionBtnText: { fontSize: 28 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 15 },
  emptyText: { fontSize: 15, color: '#666', marginTop: 8, textAlign: 'center' },
  refreshBtn: { backgroundColor: '#FF4458', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  refreshBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
