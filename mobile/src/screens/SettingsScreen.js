import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const LOOKING_FOR_OPTIONS = ['Women', 'Men', 'Everyone'];
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Punjabi'];

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();

  // Discovery
  const [lookingFor, setLookingFor] = useState('Women');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [maxDistance, setMaxDistance] = useState(50);
  const [location, setLocation] = useState(user.city || 'New Delhi');
  const [globalMode, setGlobalMode] = useState(false);

  // Privacy
  const [showOnline, setShowOnline] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [hideProfile, setHideProfile] = useState(false);

  // Notifications
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  // Account
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '+91 98765 43211');
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [facebookConnected, setFacebookConnected] = useState(false);

  // Modals
  const [showLookingForModal, setShowLookingForModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempPhone, setTempPhone] = useState(phoneNumber);

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

          {/* Looking For */}
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowLookingForModal(true)}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Looking For</Text>
              <Text style={styles.settingValue}>{lookingFor}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Age Range */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Age Range</Text>
              <Text style={styles.settingValue}>{minAge} - {maxAge} years</Text>
            </View>
          </View>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Min: {minAge}</Text>
            <View style={styles.sliderButtons}>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => minAge > 18 && setMinAge(minAge - 1)}>
                <Text style={styles.sliderBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${((minAge - 18) / 47) * 100}%` }]} />
              </View>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => minAge < maxAge - 1 && setMinAge(minAge + 1)}>
                <Text style={styles.sliderBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Max: {maxAge}</Text>
            <View style={styles.sliderButtons}>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => maxAge > minAge + 1 && setMaxAge(maxAge - 1)}>
                <Text style={styles.sliderBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${((maxAge - 18) / 47) * 100}%` }]} />
              </View>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => maxAge < 65 && setMaxAge(maxAge + 1)}>
                <Text style={styles.sliderBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Maximum Distance */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Maximum Distance</Text>
              <Text style={styles.settingValue}>{maxDistance} km</Text>
            </View>
          </View>
          <View style={styles.sliderRow}>
            <View style={styles.sliderButtons}>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => maxDistance > 5 && setMaxDistance(maxDistance - 5)}>
                <Text style={styles.sliderBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${(maxDistance / 200) * 100}%` }]} />
              </View>
              <TouchableOpacity style={styles.sliderBtn} onPress={() => maxDistance < 200 && setMaxDistance(maxDistance + 5)}>
                <Text style={styles.sliderBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location */}
          <TouchableOpacity style={styles.settingItem} onPress={() => { setTempLocation(location); setShowLocationModal(true); }}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Location</Text>
              <Text style={styles.settingValue}>📍 {location}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Global Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Global Mode</Text>
              <Text style={styles.settingDesc}>Match with people worldwide</Text>
            </View>
            <Switch
              value={globalMode}
              onValueChange={setGlobalMode}
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
            <Switch value={showOnline} onValueChange={setShowOnline} trackColor={{ true: '#FF4458', false: '#ddd' }} thumbColor="#fff" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Show Distance</Text>
              <Text style={styles.settingDesc}>Show how far you are from others</Text>
            </View>
            <Switch value={showDistance} onValueChange={setShowDistance} trackColor={{ true: '#FF4458', false: '#ddd' }} thumbColor="#fff" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Show Age</Text>
              <Text style={styles.settingDesc}>Display your age on profile</Text>
            </View>
            <Switch value={showAge} onValueChange={setShowAge} trackColor={{ true: '#FF4458', false: '#ddd' }} thumbColor="#fff" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Hide Profile</Text>
              <Text style={styles.settingDesc}>Temporarily invisible to others</Text>
            </View>
            <Switch value={hideProfile} onValueChange={setHideProfile} trackColor={{ true: '#FF4458', false: '#ddd' }} thumbColor="#fff" />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Blocked Users</Text>
              <Text style={styles.settingValue}>2 blocked</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
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
            <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ true: '#FF4458', false: '#ddd' }} thumbColor="#fff" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingDesc}>Weekly digest & updates</Text>
            </View>
            <Switch value={emailNotifications} onValueChange={setEmailNotifications} trackColor={{ true: '#FF4458', false: '#ddd' }} thumbColor="#fff" />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Use dark theme</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#FF4458', false: '#ddd' }} thumbColor="#fff" />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>{language}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Boost */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boost Your Profile</Text>
          <TouchableOpacity
            style={styles.boostCard}
            onPress={() => Alert.alert('🚀 Boost Activated!', 'Your profile is now visible to more people nearby for 30 minutes!')}
          >
            <View style={styles.boostCardLeft}>
              <Text style={styles.boostIcon}>🚀</Text>
              <View>
                <Text style={styles.boostTitle}>Activate Boost</Text>
                <Text style={styles.boostDesc}>Be seen by 10x more people for 30 minutes</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.boostFeatures}>
            <View style={styles.boostFeatureItem}><Text style={styles.boostFeatureIcon}>📍</Text><Text style={styles.boostFeatureText}>See active profiles nearby</Text></View>
            <View style={styles.boostFeatureItem}><Text style={styles.boostFeatureIcon}>❤️</Text><Text style={styles.boostFeatureText}>Send direct likes to active users</Text></View>
            <View style={styles.boostFeatureItem}><Text style={styles.boostFeatureIcon}>👀</Text><Text style={styles.boostFeatureText}>Your profile appears first</Text></View>
            <View style={styles.boostFeatureItem}><Text style={styles.boostFeatureIcon}>⏰</Text><Text style={styles.boostFeatureText}>30 minutes of priority visibility</Text></View>
          </View>
          <Text style={styles.boostNote}>1 free Boost/month. Extra Boosts with Spark Gold.</Text>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => { setTempPhone(phoneNumber); setShowPhoneModal(true); }}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Phone Number</Text>
              <Text style={styles.settingValue}>{phoneNumber}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Connected Accounts */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Instagram</Text>
              <Text style={styles.settingDesc}>{instagramConnected ? '✅ Connected' : 'Not connected'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.connectBtn, instagramConnected && styles.disconnectBtn]}
              onPress={() => {
                setInstagramConnected(!instagramConnected);
                Alert.alert(instagramConnected ? 'Disconnected' : '✅ Connected!', instagramConnected ? 'Instagram disconnected' : 'Instagram account connected successfully!');
              }}
            >
              <Text style={[styles.connectBtnText, instagramConnected && styles.disconnectBtnText]}>{instagramConnected ? 'Disconnect' : 'Connect'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Facebook</Text>
              <Text style={styles.settingDesc}>{facebookConnected ? '✅ Connected' : 'Not connected'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.connectBtn, facebookConnected && styles.disconnectBtn]}
              onPress={() => {
                setFacebookConnected(!facebookConnected);
                Alert.alert(facebookConnected ? 'Disconnected' : '✅ Connected!', facebookConnected ? 'Facebook disconnected' : 'Facebook account connected successfully!');
              }}
            >
              <Text style={[styles.connectBtnText, facebookConnected && styles.disconnectBtnText]}>{facebookConnected ? 'Disconnect' : 'Connect'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Subscription</Text>
              <Text style={[styles.settingValue, { color: '#FF4458' }]}>Free Plan</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Support</Text>
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingLabel}>Safety Center</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingLabel}>Report a Problem</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingLabel}>Help & FAQ</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingLabel}>Terms of Service</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingLabel}>Privacy Policy</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <TouchableOpacity style={styles.logoutItem} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteItem}
            onPress={() => Alert.alert('Delete Account', 'Are you sure? This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive' }])}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Spark v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Looking For Modal */}
      <Modal visible={showLookingForModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Looking For</Text>
            {LOOKING_FOR_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.modalOption, lookingFor === option && styles.modalOptionActive]}
                onPress={() => { setLookingFor(option); setShowLookingForModal(false); }}
              >
                <Text style={[styles.modalOptionText, lookingFor === option && styles.modalOptionTextActive]}>{option}</Text>
                {lookingFor === option && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowLookingForModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Language</Text>
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.modalOption, language === option && styles.modalOptionActive]}
                onPress={() => { setLanguage(option); setShowLanguageModal(false); }}
              >
                <Text style={[styles.modalOptionText, language === option && styles.modalOptionTextActive]}>{option}</Text>
                {language === option && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowLanguageModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Edit Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Location</Text>
            <TextInput
              style={styles.modalInput}
              value={tempLocation}
              onChangeText={setTempLocation}
              placeholder="Enter city name"
              autoFocus
            />
            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => { setLocation(tempLocation); setShowLocationModal(false); }}>
              <Text style={styles.modalSaveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowLocationModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Phone Number Modal */}
      <Modal visible={showPhoneModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Phone Number</Text>
            <TextInput
              style={styles.modalInput}
              value={tempPhone}
              onChangeText={setTempPhone}
              placeholder="+91 XXXXX XXXXX"
              keyboardType="phone-pad"
              autoFocus
            />
            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => { setPhoneNumber(tempPhone); setShowPhoneModal(false); Alert.alert('✅ Updated', 'Phone number updated successfully!'); }}>
              <Text style={styles.modalSaveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhoneModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backBtn: { padding: 5 },
  backIcon: { fontSize: 28, color: '#333' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#222' },
  content: { paddingBottom: 30 },
  section: { backgroundColor: '#fff', marginTop: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', paddingTop: 18, paddingBottom: 8 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  settingLeft: { flex: 1, paddingRight: 15 },
  settingLabel: { fontSize: 17, color: '#222', fontWeight: '500' },
  settingValue: { fontSize: 15, color: '#666', marginTop: 3 },
  settingDesc: { fontSize: 14, color: '#999', marginTop: 3 },
  chevron: { fontSize: 24, color: '#ccc' },
  sliderRow: { paddingVertical: 10, paddingHorizontal: 5 },
  sliderLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  sliderButtons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sliderBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  sliderBtnText: { fontSize: 22, color: '#333', fontWeight: '600' },
  sliderTrack: { flex: 1, height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, overflow: 'hidden' },
  sliderFill: { height: '100%', backgroundColor: '#FF4458', borderRadius: 3 },
  connectBtn: { backgroundColor: '#FF4458', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18 },
  connectBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  disconnectBtn: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  disconnectBtnText: { color: '#666' },
  logoutItem: { paddingVertical: 18, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  logoutText: { fontSize: 18, color: '#FF4458', fontWeight: '600' },
  deleteItem: { paddingVertical: 18, alignItems: 'center' },
  deleteText: { fontSize: 18, color: '#999' },
  version: { fontSize: 14, color: '#ccc', textAlign: 'center', marginTop: 20, paddingBottom: 10 },
  boostCard: { backgroundColor: '#F3E5F5', borderRadius: 16, padding: 18, marginTop: 10, borderWidth: 1, borderColor: '#CE93D8' },
  boostCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  boostIcon: { fontSize: 32 },
  boostTitle: { fontSize: 18, fontWeight: '700', color: '#6A1B9A' },
  boostDesc: { fontSize: 14, color: '#7B1FA2', marginTop: 3 },
  boostFeatures: { marginTop: 15, gap: 10 },
  boostFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  boostFeatureIcon: { fontSize: 18 },
  boostFeatureText: { fontSize: 15, color: '#444' },
  boostNote: { fontSize: 13, color: '#999', marginTop: 12, fontStyle: 'italic', paddingBottom: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 25, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 20 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 15 },
  modalOptionActive: { backgroundColor: '#FFF0F1' },
  modalOptionText: { fontSize: 17, color: '#333' },
  modalOptionTextActive: { color: '#FF4458', fontWeight: '600' },
  checkmark: { fontSize: 20, color: '#FF4458', fontWeight: '700' },
  modalCancel: { paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  modalCancelText: { fontSize: 17, color: '#888' },
  modalInput: { fontSize: 18, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 15, marginBottom: 15, color: '#222' },
  modalSaveBtn: { backgroundColor: '#FF4458', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  modalSaveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
