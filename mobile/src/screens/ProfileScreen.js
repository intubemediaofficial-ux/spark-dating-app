import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.photos?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }}
              style={styles.profileImage}
            />
            <View style={styles.verifiedBadgeLg}>
              <Text style={styles.verifiedIconLg}>✓</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user.name}, {user.age}</Text>
          <Text style={styles.profileCity}>📍 {user.city}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>27</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>152</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
        </View>

        {/* Premium Banner */}
        <TouchableOpacity style={styles.premiumBanner}>
          <View style={styles.premiumLeft}>
            <Text style={styles.premiumIcon}>👑</Text>
            <View>
              <Text style={styles.premiumTitle}>Upgrade to Spark Gold</Text>
              <Text style={styles.premiumSubtitle}>See who likes you, unlimited swipes</Text>
            </View>
          </View>
          <Text style={styles.premiumArrow}>→</Text>
        </TouchableOpacity>

        {/* Photos Grid - 6 slots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Photos</Text>
            <Text style={styles.photoCount}>{(user.photos || []).length}/6</Text>
          </View>
          <View style={styles.photosGrid}>
            {Array.from({ length: 6 }).map((_, i) => {
              const photos = user.photos || [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
              ];
              if (i < photos.length) {
                return (
                  <View key={i} style={styles.gridPhotoContainer}>
                    <Image source={{ uri: photos[i] }} style={styles.gridPhoto} />
                    {i === 0 && <View style={styles.mainPhotoBadge}><Text style={styles.mainPhotoText}>Main</Text></View>}
                  </View>
                );
              }
              return (
                <TouchableOpacity key={i} style={styles.addPhotoBtn}>
                  <Text style={styles.addPhotoIcon}>+</Text>
                  <Text style={styles.addPhotoText}>Add</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.photoHint}>Add up to 6 photos. First photo is your main profile pic.</Text>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.interestsWrap}>
            {(user.interests || []).map((interest, i) => (
              <View key={i} style={styles.interestChip}>
                <Text style={styles.interestChipText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Share My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#222' },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 24 },
  profileCard: { alignItems: 'center', paddingVertical: 20 },
  profileImageContainer: { position: 'relative' },
  profileImage: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#e0e0e0', borderWidth: 3, borderColor: '#FF4458' },
  verifiedBadgeLg: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#4FC3F7', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  verifiedIconLg: { fontSize: 15, color: '#fff', fontWeight: 'bold' },
  profileName: { fontSize: 26, fontWeight: '800', color: '#222', marginTop: 15 },
  profileCity: { fontSize: 16, color: '#666', marginTop: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, marginHorizontal: 20, backgroundColor: '#f8f8f8', borderRadius: 16, marginTop: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#FF4458' },
  statLabel: { fontSize: 13, color: '#666', marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: '#e0e0e0' },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20, padding: 18, backgroundColor: '#FFF8E1', borderRadius: 16, borderWidth: 1, borderColor: '#FFD54F' },
  premiumLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  premiumIcon: { fontSize: 28 },
  premiumTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  premiumSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  premiumArrow: { fontSize: 22, color: '#FFB300' },
  section: { marginHorizontal: 20, marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#222' },
  editLink: { fontSize: 15, color: '#FF4458', fontWeight: '600' },
  photoCount: { fontSize: 14, color: '#999', fontWeight: '500' },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridPhotoContainer: { position: 'relative' },
  gridPhoto: { width: (width - 60) / 3, height: (width - 60) / 3, borderRadius: 12, backgroundColor: '#e0e0e0' },
  mainPhotoBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: '#FF4458', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  mainPhotoText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  addPhotoBtn: { width: (width - 60) / 3, height: (width - 60) / 3, borderRadius: 12, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addPhotoIcon: { fontSize: 30, color: '#999' },
  addPhotoText: { fontSize: 12, color: '#999', marginTop: 4 },
  photoHint: { fontSize: 13, color: '#999', marginTop: 10, fontStyle: 'italic' },
  bioText: { fontSize: 16, color: '#444', lineHeight: 24 },
  interestsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  interestChip: { backgroundColor: '#FFF0F1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  interestChipText: { fontSize: 14, color: '#FF4458', fontWeight: '500' },
  actionsSection: { marginHorizontal: 20, marginTop: 30, gap: 12 },
  editProfileBtn: { backgroundColor: '#FF4458', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  editProfileBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  shareBtn: { backgroundColor: '#f5f5f5', paddingVertical: 16, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  shareBtnText: { color: '#333', fontSize: 17, fontWeight: '600' },
  logoutBtn: { paddingVertical: 16, alignItems: 'center' },
  logoutBtnText: { color: '#999', fontSize: 16 },
});
