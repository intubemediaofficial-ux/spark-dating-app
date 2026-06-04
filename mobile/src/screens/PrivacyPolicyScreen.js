import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: June 2026</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          When you use MatchKar, we collect the following information:{'\n\n'}
          • <Text style={styles.bold}>Profile Information:</Text> Name, age, gender, photos, bio, interests, city, and preferences you provide during registration.{'\n\n'}
          • <Text style={styles.bold}>Location Data:</Text> With your permission, we collect your device's GPS location to show you nearby users and calculate distances.{'\n\n'}
          • <Text style={styles.bold}>Usage Data:</Text> Information about how you use the app, including swipes, matches, messages, and time spent.{'\n\n'}
          • <Text style={styles.bold}>Device Information:</Text> Device type, operating system, app version, and unique device identifiers.{'\n\n'}
          • <Text style={styles.bold}>Communications:</Text> Messages you send to other users through the app.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:{'\n\n'}
          • Provide and improve the MatchKar dating service{'\n'}
          • Show you relevant profiles based on your preferences and location{'\n'}
          • Enable matches and messaging between users{'\n'}
          • Send you notifications about matches, messages, and app updates{'\n'}
          • Ensure safety and prevent fraud or abuse{'\n'}
          • Comply with legal obligations
        </Text>

        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information. We may share your information with:{'\n\n'}
          • <Text style={styles.bold}>Other Users:</Text> Your profile information (name, age, photos, bio, interests) is visible to other users.{'\n\n'}
          • <Text style={styles.bold}>Service Providers:</Text> We use third-party services for hosting, storage, analytics, and payment processing.{'\n\n'}
          • <Text style={styles.bold}>Law Enforcement:</Text> When required by law or to protect safety.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your data, including encryption of data in transit and at rest, secure server infrastructure, and regular security audits.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:{'\n\n'}
          • Access your personal data{'\n'}
          • Correct inaccurate data{'\n'}
          • Delete your account and associated data{'\n'}
          • Opt out of marketing communications{'\n'}
          • Withdraw consent for location tracking
        </Text>

        <Text style={styles.sectionTitle}>6. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your data as long as your account is active. When you delete your account, we remove your personal data within 30 days, except where retention is required by law.
        </Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          MatchKar is strictly for users aged 18 and above. We do not knowingly collect information from anyone under 18. If we discover that a user is under 18, we will immediately delete their account.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any material changes through the app or by email.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:{'\n\n'}
          Email: privacy@matchkar.com{'\n'}
          Website: https://matchkar.com/privacy
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backBtn: { padding: 5 },
  backIcon: { fontSize: 28, color: '#333' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#222' },
  content: { flex: 1, paddingHorizontal: 20 },
  lastUpdated: { fontSize: 14, color: '#888', marginTop: 15, marginBottom: 20, fontStyle: 'italic' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 25, marginBottom: 10 },
  paragraph: { fontSize: 15, color: '#444', lineHeight: 24 },
  bold: { fontWeight: '700', color: '#222' },
});
