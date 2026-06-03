import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [showOnline, setShowOnline] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Discovery Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Looking For</Text>
              <Text style={styles.settingValue}>{user.genderPreference === 'FEMALE' ? 'Women' : user.genderPreference === 'MALE' ? 'Men' : 'Everyone'}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Age Range</Text>
              <Text style={styles.settingValue}>{user.minAgePreference || 18} - {user.maxAgePreference || 35} years</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Maximum Distance</Text>
              <Text style={styles.settingValue}>{user.maxDistance || 50} km</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Location</Text>
              <Text style={styles.settingValue}>📍 {user.city || 'Auto-detect'}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Global Mode</Text>
              <Text style={styles.settingDesc}>Match with people worldwide</Text>
            </View>
            <Switch
              value={false}
              trackColor={{ true: '#FF4458', false: '#ddd' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Show Online Status</Text>
              <Text style={styles.settingDesc}>Others can see when you're active</Text>
            </View>
            <Switch
              value={showOnline}
              onValueChange={setShowOnline}
              trackColor={{ true: '#FF4458', false: '#ddd' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Show Distance</Text>
              <Text style={styles.settingDesc}>Show how far you are from others</Text>
            </View>
            <Switch
              value={showDistance}
              onValueChange={setShowDistance}
              trackColor={{ true: '#FF4458', false: '#ddd' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Show Age</Text>
              <Text style={styles.settingDesc}>Display your age on profile</Text>
            </View>
            <Switch
              value={showAge}
              onValueChange={setShowAge}
              trackColor={{ true: '#FF4458', false: '#ddd' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Blocked Users</Text>
              <Text style={styles.settingValue}>2 blocked</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Hide Profile</Text>
              <Text style={styles.settingDesc}>Temporarily invisible to others</Text>
            </View>
            <Switch
              value={false}
              trackColor={{ true: '#FF4458', false: '#ddd' }}
              thumbColor="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Matches, messages, likes</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: '#FF4458', false: '#ddd' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingValue}>Weekly digest</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Use dark theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ true: '#FF4458', false: '#ddd' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>English</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Safety Center</Text>
              <Text style={styles.settingDesc}>Tips for safe dating</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Report a Problem</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Help & FAQ</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Phone Number</Text>
              <Text style={styles.settingValue}>{user.phone || '+91 98765 43211'}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Connected Accounts</Text>
              <Text style={styles.settingValue}>Google, Instagram</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Subscription</Text>
              <Text style={[styles.settingValue, { color: '#FF4458' }]}>Free Plan</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <TouchableOpacity style={styles.logoutItem} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteItem}
            onPress={() => Alert.alert('Delete Account', 'Are you sure? This action cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive' },
            ])}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Spark v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backBtn: { padding: 5 },
  backIcon: { fontSize: 28, color: '#333' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#222' },
  content: { paddingBottom: 30 },
  section: { backgroundColor: '#fff', marginTop: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', paddingTop: 18, paddingBottom: 8 },
  settingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  settingLeft: { flex: 1, paddingRight: 15 },
  settingLabel: { fontSize: 17, color: '#222', fontWeight: '500' },
  settingValue: { fontSize: 15, color: '#666', marginTop: 3 },
  settingDesc: { fontSize: 14, color: '#999', marginTop: 3 },
  chevron: { fontSize: 24, color: '#ccc' },
  logoutItem: { paddingVertical: 18, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  logoutText: { fontSize: 18, color: '#FF4458', fontWeight: '600' },
  deleteItem: { paddingVertical: 18, alignItems: 'center' },
  deleteText: { fontSize: 18, color: '#999' },
  version: { fontSize: 14, color: '#ccc', textAlign: 'center', marginTop: 20, paddingBottom: 10 },
});
