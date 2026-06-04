import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const SUBSCRIPTION_PLANS = [
  { id: 'free', name: 'Free', price: '₹0', period: '/month', features: ['5 likes/day', 'Basic matching', 'Limited rewinds'], color: '#888', current: true },
  { id: 'gold', name: 'Gold', price: '₹199', period: '/month', features: ['Unlimited likes', 'See who liked you', '5 Super Likes/day', 'Rewind', '1 Boost/month'], color: '#FFB300', current: false },
  { id: 'platinum', name: 'Platinum', price: '₹399', period: '/month', features: ['All Gold features', 'Priority likes', 'Message before match', 'Unlimited Boosts', 'Profile highlights'], color: '#9C27B0', current: false },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.photos?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user.name}, {user.age}</Text>
            <Text style={styles.profileCity}>📍 {user.city}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.quickActionIcon}>⚙️</Text>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('🚀 Boost', 'Your profile will be visible to 10x more people nearby for 30 minutes!')}>
            <Text style={styles.quickActionIcon}>🚀</Text>
            <Text style={styles.quickActionText}>Boost</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('📢 Promote', 'Your profile will be promoted to users outside your normal distance range!')}>
            <Text style={styles.quickActionIcon}>📢</Text>
            <Text style={styles.quickActionText}>Promote</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.quickActionIcon}>📷</Text>
            <Text style={styles.quickActionText}>Photos</Text>
          </TouchableOpacity>
        </View>

        {/* Subscription Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <View style={styles.plansRow}>
            {SUBSCRIPTION_PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, plan.current && styles.planCardCurrent, { borderColor: plan.color }]}
                onPress={() => !plan.current && Alert.alert(`Upgrade to ${plan.name}`, `Get premium features for ${plan.price}${plan.period}`)}
              >
                {plan.current && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View>}
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
                {plan.features.map((f, i) => (
                  <Text key={i} style={styles.planFeature}>• {f}</Text>
                ))}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Discovery Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery Preferences</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📍</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>City</Text>
              <Text style={styles.menuValue}>{user.city || 'Auto-detect'}</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📏</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Distance Range</Text>
              <Text style={styles.menuValue}>{user.maxDistance || 50} km</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👤</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Looking For</Text>
              <Text style={styles.menuValue}>{user.genderPreference === 'FEMALE' ? 'Women' : user.genderPreference === 'MALE' ? 'Men' : 'Everyone'}</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🎂</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Age Range</Text>
              <Text style={styles.menuValue}>{user.minAgePreference || 18} - {user.maxAgePreference || 35}</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* My Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Photos</Text>
            <Text style={styles.photoCountText}>{(user.photos || []).length}/6</Text>
          </View>
          <View style={styles.photosGrid}>
            {Array.from({ length: 6 }).map((_, i) => {
              const photos = user.photos || [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
              ];
              if (i < photos.length) {
                return (
                  <View key={i} style={styles.photoSlot}>
                    <Image source={{ uri: photos[i] }} style={styles.photoImage} />
                    {i === 0 && <View style={styles.mainBadge}><Text style={styles.mainBadgeText}>Main</Text></View>}
                  </View>
                );
              }
              return (
                <TouchableOpacity key={i} style={styles.photoSlotEmpty}>
                  <Text style={styles.addIcon}>+</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.menuIcon}>✏️</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Edit Profile</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔒</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Change Password</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📷</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Update Photos</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.menuIcon}>🔔</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Notifications & Privacy</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.version}>MatchKar v1.0.0</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  profileImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0e0e0', borderWidth: 3, borderColor: '#FF4458' },
  profileDetails: { flex: 1, marginLeft: 15 },
  profileName: { fontSize: 22, fontWeight: '800', color: '#222' },
  profileCity: { fontSize: 15, color: '#666', marginTop: 4 },
  editBtn: { backgroundColor: '#FF4458', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  editBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 18, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  quickAction: { alignItems: 'center', gap: 6 },
  quickActionIcon: { fontSize: 26 },
  quickActionText: { fontSize: 12, color: '#555', fontWeight: '500' },
  section: { backgroundColor: '#fff', marginTop: 12, padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#222', marginBottom: 15 },
  photoCountText: { fontSize: 14, color: '#999' },
  plansRow: { flexDirection: 'row', gap: 10 },
  planCard: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 2, alignItems: 'center', position: 'relative' },
  planCardCurrent: { backgroundColor: '#f9f9f9' },
  currentBadge: { position: 'absolute', top: -10, backgroundColor: '#4CAF50', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  currentBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  planName: { fontSize: 16, fontWeight: '800', marginTop: 5 },
  planPrice: { fontSize: 22, fontWeight: '800', color: '#222', marginTop: 6 },
  planPeriod: { fontSize: 12, color: '#888' },
  planFeature: { fontSize: 11, color: '#555', marginTop: 4, textAlign: 'center' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 16, color: '#222', fontWeight: '500' },
  menuValue: { fontSize: 14, color: '#888', marginTop: 2 },
  menuChevron: { fontSize: 22, color: '#ccc' },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoSlot: { width: (width - 60) / 3, height: (width - 60) / 3, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  photoImage: { width: '100%', height: '100%', backgroundColor: '#e0e0e0' },
  mainBadge: { position: 'absolute', bottom: 5, left: 5, backgroundColor: '#FF4458', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  mainBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  photoSlotEmpty: { width: (width - 60) / 3, height: (width - 60) / 3, borderRadius: 12, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addIcon: { fontSize: 28, color: '#999' },
  logoutBtn: { paddingVertical: 16, alignItems: 'center' },
  logoutText: { fontSize: 17, color: '#FF4458', fontWeight: '600' },
  version: { fontSize: 13, color: '#ccc', textAlign: 'center', marginTop: 10 },
});
