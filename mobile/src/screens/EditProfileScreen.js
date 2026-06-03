import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

const INTERESTS = [
  'Travel', 'Music', 'Food', 'Fitness', 'Movies', 'Books',
  'Photography', 'Art', 'Gaming', 'Dance', 'Cooking', 'Cricket',
  'Yoga', 'Hiking', 'Coffee', 'Dogs', 'Cats', 'Fashion',
  'Startups', 'Technology', 'Bollywood', 'Comedy', 'Netflix',
];

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
    city: user?.city || '',
    age: user?.age?.toString() || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await profileAPI.update({
        ...formData,
        age: parseInt(formData.age),
      });
      updateUser(response.data.user);
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('photo', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
        const response = await profileAPI.uploadPhoto(formDataUpload);
        updateUser(response.data.user);
        Alert.alert('Success', 'Photo uploaded!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload photo');
      }
    }
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveText, saving && { opacity: 0.5 }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {user?.photos?.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.photoThumb} />
            ))}
            <TouchableOpacity style={styles.addPhotoBtn} onPress={handlePickImage}>
              <Text style={styles.addPhotoText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
            numberOfLines={4}
            maxLength={300}
            placeholder="Write something about yourself..."
            placeholderTextColor="#999"
          />
          <Text style={styles.charCount}>{formData.bio.length}/300</Text>
        </View>

        {/* City */}
        <View style={styles.section}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="Your city"
            placeholderTextColor="#999"
          />
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.label}>Interests</Text>
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[styles.chip, formData.interests.includes(interest) && styles.chipActive]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[styles.chipText, formData.interests.includes(interest) && styles.chipTextActive]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  cancelText: { fontSize: 16, color: '#666' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
  saveText: { fontSize: 16, color: '#FF4458', fontWeight: '700' },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 15,
    paddingVertical: 12, fontSize: 16, backgroundColor: '#f8f8f8', color: '#333',
  },
  bioInput: { height: 100, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', color: '#999', fontSize: 12, marginTop: 5 },
  photoThumb: { width: 80, height: 100, borderRadius: 10, marginRight: 10, backgroundColor: '#e0e0e0' },
  addPhotoBtn: {
    width: 80, height: 100, borderRadius: 10, borderWidth: 2, borderStyle: 'dashed',
    borderColor: '#ddd', justifyContent: 'center', alignItems: 'center',
  },
  addPhotoText: { fontSize: 30, color: '#999' },
  interestsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f8f8f8' },
  chipActive: { borderColor: '#FF4458', backgroundColor: '#FFF0F1' },
  chipText: { fontSize: 13, color: '#666' },
  chipTextActive: { color: '#FF4458', fontWeight: '600' },
});
