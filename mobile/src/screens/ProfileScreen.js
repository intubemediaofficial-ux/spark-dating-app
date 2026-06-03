import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <Image
            source={{ uri: user?.photos?.[0] || 'https://via.placeholder.com/150' }}
            style={styles.profilePhoto}
          />
          <Text style={styles.name}>{user?.name}, {user?.age}</Text>
          {user?.city && <Text style={styles.city}>📍 {user.city}</Text>}
        </View>

        {/* Bio */}
        {user?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        )}

        {/* Interests */}
        {user?.interests?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsRow}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Photos Gallery */}
        {user?.photos?.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {user.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.galleryPhoto} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsBtnText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  photoSection: { alignItems: 'center', marginBottom: 25 },
  profilePhoto: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#e0e0e0', marginBottom: 12 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  city: { fontSize: 14, color: '#666', marginTop: 4 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },
  bio: { fontSize: 15, color: '#555', lineHeight: 22 },
  interestsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  interestChip: { backgroundColor: '#FFF0F1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 },
  interestText: { fontSize: 13, color: '#FF4458', fontWeight: '500' },
  galleryPhoto: { width: 100, height: 100, borderRadius: 12, marginRight: 10, backgroundColor: '#e0e0e0' },
  actions: { gap: 12, marginTop: 10 },
  editBtn: { backgroundColor: '#FF4458', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  settingsBtn: { backgroundColor: '#f5f5f5', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  settingsBtnText: { color: '#333', fontSize: 16, fontWeight: '600' },
  logoutBtn: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  logoutBtnText: { color: '#FF4458', fontSize: 16, fontWeight: '600' },
});
