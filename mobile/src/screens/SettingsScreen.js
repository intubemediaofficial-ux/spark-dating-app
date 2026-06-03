import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { profileAPI, safetyAPI } from '../services/api';

export default function SettingsScreen({ navigation }) {
  const { user, updateUser, logout } = useAuth();
  const [preferences, setPreferences] = useState({
    minAge: user?.minAgePreference || 18,
    maxAge: user?.maxAgePreference || 50,
    maxDistance: user?.maxDistance || 50,
    genderPreference: user?.genderPreference || 'EVERYONE',
  });

  const handleSavePreferences = async () => {
    try {
      const response = await profileAPI.update({
        minAgePreference: preferences.minAge,
        maxAgePreference: preferences.maxAge,
        maxDistance: preferences.maxDistance,
        genderPreference: preferences.genderPreference,
      });
      updateUser(response.data.user);
      Alert.alert('Success', 'Preferences saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            logout();
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Discovery Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery Preferences</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show Me</Text>
            <View style={styles.genderOptions}>
              {['MALE', 'FEMALE', 'EVERYONE'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, preferences.genderPreference === g && styles.genderBtnActive]}
                  onPress={() => setPreferences({ ...preferences, genderPreference: g })}
                >
                  <Text style={[styles.genderBtnText, preferences.genderPreference === g && styles.genderBtnTextActive]}>
                    {g === 'EVERYONE' ? 'Everyone' : g === 'MALE' ? 'Men' : 'Women'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Age Range</Text>
            <Text style={styles.settingValue}>{preferences.minAge} - {preferences.maxAge}</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Max Distance</Text>
            <Text style={styles.settingValue}>{preferences.maxDistance} km</Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSavePreferences}>
            <Text style={styles.saveBtnText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>

        {/* Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Privacy</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Blocked Users</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <Text style={styles.menuItemText}>Logout</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.dangerItem]} onPress={handleDeleteAccount}>
            <Text style={styles.dangerText}>Delete Account</Text>
            <Text style={[styles.menuItemArrow, styles.dangerText]}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Spark Dating v1.0.0</Text>
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
  backText: { fontSize: 16, color: '#FF4458' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 15 },
  settingRow: { marginBottom: 20 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8 },
  settingValue: { fontSize: 15, color: '#666' },
  genderOptions: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1,
    borderColor: '#ddd', alignItems: 'center', backgroundColor: '#f8f8f8',
  },
  genderBtnActive: { borderColor: '#FF4458', backgroundColor: '#FFF0F1' },
  genderBtnText: { fontSize: 14, color: '#666' },
  genderBtnTextActive: { color: '#FF4458', fontWeight: '600' },
  saveBtn: { backgroundColor: '#FF4458', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  menuItemText: { fontSize: 16, color: '#333' },
  menuItemArrow: { fontSize: 20, color: '#ccc' },
  dangerItem: { borderBottomWidth: 0 },
  dangerText: { color: '#FF4458' },
  version: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 20 },
});
