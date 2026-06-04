import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const INTERESTS = [
  'Travel', 'Music', 'Food', 'Fitness', 'Movies', 'Books',
  'Photography', 'Art', 'Gaming', 'Dance', 'Cooking', 'Cricket',
  'Yoga', 'Hiking', 'Coffee', 'Dogs', 'Cats', 'Fashion',
  'Startups', 'Technology', 'Bollywood', 'Comedy', 'Netflix',
];

export default function RegisterScreen({ navigation, route }) {
  const initialPhone = route?.params?.phone || '';
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: initialPhone,
    age: '',
    gender: '',
    bio: '',
    interests: [],
    city: '',
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.age || !formData.gender) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18) {
        Alert.alert(
          'Age Restriction',
          'You must be at least 18 years old to use MatchKar. This is required by law and our Terms of Service.',
          [{ text: 'OK' }]
        );
        return;
      }
      if (age > 100) {
        Alert.alert('Error', 'Please enter a valid age');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleRegister = async () => {
    if (formData.interests.length < 3) {
      Alert.alert('Error', 'Please select at least 3 interests');
      return;
    }

    setLoading(true);
    try {
      const phone = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`;
      await register({
        ...formData,
        phone,
        age: parseInt(formData.age),
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
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

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Info</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <View style={styles.phoneInput}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.phoneField}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          maxLength={10}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Age (must be 18+)"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        value={formData.age}
        onChangeText={(text) => setFormData({ ...formData, age: text })}
        maxLength={2}
      />
      <Text style={{ fontSize: 12, color: '#999', marginTop: -8, marginBottom: 8, marginLeft: 5 }}>You must be 18 or older to use MatchKar</Text>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {['MALE', 'FEMALE', 'OTHER'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderBtn, formData.gender === g && styles.genderBtnActive]}
            onPress={() => setFormData({ ...formData, gender: g })}
          >
            <Text style={[styles.genderText, formData.gender === g && styles.genderTextActive]}>
              {g === 'MALE' ? '👨 Male' : g === 'FEMALE' ? '👩 Female' : '🧑 Other'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>About You</Text>
      <Text style={styles.stepSubtitle}>Add a bio and your city</Text>

      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="Write something about yourself..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={formData.bio}
        onChangeText={(text) => setFormData({ ...formData, bio: text })}
        maxLength={300}
      />
      <Text style={styles.charCount}>{formData.bio.length}/300</Text>

      <TextInput
        style={styles.input}
        placeholder="Your City (e.g., New Delhi, Mumbai)"
        placeholderTextColor="#999"
        value={formData.city}
        onChangeText={(text) => setFormData({ ...formData, city: text })}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Your Interests</Text>
      <Text style={styles.stepSubtitle}>Select at least 3 interests</Text>

      <View style={styles.interestsGrid}>
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.interestChip,
              formData.interests.includes(interest) && styles.interestChipActive,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text
              style={[
                styles.interestText,
                formData.interests.includes(interest) && styles.interestTextActive,
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedCount}>
        {formData.interests.length} selected
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Progress */}
          <View style={styles.progress}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[styles.progressDot, s <= step && styles.progressDotActive]}
              />
            ))}
          </View>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            {step > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.nextButton, loading && styles.buttonDisabled]}
              onPress={step === 3 ? handleRegister : handleNext}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>
                {step === 3 ? (loading ? 'Creating...' : 'Create Account') : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>

          {step === 1 && (
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  scrollContent: { padding: 30, paddingTop: 20 },
  progress: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, gap: 8 },
  progressDot: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0' },
  progressDotActive: { backgroundColor: '#FF4458' },
  stepContent: { marginBottom: 30 },
  stepTitle: { fontSize: 28, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  stepSubtitle: { fontSize: 15, color: '#666', marginBottom: 25 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 15, paddingVertical: 14, fontSize: 16,
    marginBottom: 15, backgroundColor: '#f8f8f8', color: '#333',
  },
  bioInput: { height: 100, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', color: '#999', fontSize: 12, marginTop: -10, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  genderBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#f8f8f8',
  },
  genderBtnActive: { borderColor: '#FF4458', backgroundColor: '#FFF0F1' },
  genderText: { fontSize: 14, color: '#666' },
  genderTextActive: { color: '#FF4458', fontWeight: '600' },
  phoneInput: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 15,
    marginBottom: 15, backgroundColor: '#f8f8f8',
  },
  countryCode: { fontSize: 16, fontWeight: '600', color: '#333', marginRight: 10, paddingRight: 10, borderRightWidth: 1, borderRightColor: '#ddd' },
  phoneField: { flex: 1, fontSize: 16, paddingVertical: 14, color: '#333' },
  interestsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  interestChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f8f8f8',
  },
  interestChipActive: { borderColor: '#FF4458', backgroundColor: '#FFF0F1' },
  interestText: { fontSize: 14, color: '#666' },
  interestTextActive: { color: '#FF4458', fontWeight: '600' },
  selectedCount: { textAlign: 'center', color: '#999', marginTop: 15 },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
  backButton: {
    flex: 1, paddingVertical: 16, borderRadius: 12,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  backButtonText: { fontSize: 16, color: '#666', fontWeight: '600' },
  nextButton: { flex: 2, paddingVertical: 16, borderRadius: 12, backgroundColor: '#FF4458', alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  nextButtonText: { fontSize: 16, color: '#fff', fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: '#666' },
  loginBold: { color: '#FF4458', fontWeight: '700' },
});
