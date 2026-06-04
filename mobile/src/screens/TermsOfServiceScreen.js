import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: June 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By creating a MatchKar account or using the MatchKar service, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our service.
        </Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 18 years old to use MatchKar. By using our service, you represent and warrant that:{'\n\n'}
          • You are at least 18 years of age{'\n'}
          • You have the legal capacity to enter into a binding agreement{'\n'}
          • You are not prohibited from using the service under applicable laws{'\n'}
          • You will comply with these Terms and all applicable laws
        </Text>

        <Text style={styles.sectionTitle}>3. Your Account</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You agree to:{'\n\n'}
          • Provide accurate and complete information{'\n'}
          • Maintain only one account{'\n'}
          • Not share your account with others{'\n'}
          • Notify us immediately of unauthorized access
        </Text>

        <Text style={styles.sectionTitle}>4. User Conduct</Text>
        <Text style={styles.paragraph}>
          You agree NOT to:{'\n\n'}
          • Post false, misleading, or deceptive content{'\n'}
          • Upload obscene, offensive, or illegal content{'\n'}
          • Harass, threaten, or abuse other users{'\n'}
          • Impersonate any person or entity{'\n'}
          • Use the service for commercial purposes or spam{'\n'}
          • Attempt to access other users' accounts{'\n'}
          • Use automated systems to access the service{'\n'}
          • Violate any applicable laws or regulations
        </Text>

        <Text style={styles.sectionTitle}>5. Content</Text>
        <Text style={styles.paragraph}>
          You retain ownership of content you post on MatchKar. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content within the service. We reserve the right to remove any content that violates these terms.
        </Text>

        <Text style={styles.sectionTitle}>6. Subscriptions & Payments</Text>
        <Text style={styles.paragraph}>
          MatchKar offers free and premium subscription plans:{'\n\n'}
          • <Text style={styles.bold}>Free Plan:</Text> Basic features with daily like limits{'\n'}
          • <Text style={styles.bold}>Gold Plan (₹199/month):</Text> Unlimited likes, see who liked you, boosts{'\n'}
          • <Text style={styles.bold}>Platinum Plan (₹399/month):</Text> All Gold features plus priority visibility{'\n\n'}
          Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period. Refunds are subject to applicable platform policies.
        </Text>

        <Text style={styles.sectionTitle}>7. Safety</Text>
        <Text style={styles.paragraph}>
          While we take measures to verify profiles and moderate content, we cannot guarantee the identity or behavior of other users. You are responsible for your own safety when meeting people in person. We recommend:{'\n\n'}
          • Meeting in public places{'\n'}
          • Telling a friend about your plans{'\n'}
          • Trusting your instincts{'\n'}
          • Reporting any suspicious behavior
        </Text>

        <Text style={styles.sectionTitle}>8. Termination</Text>
        <Text style={styles.paragraph}>
          We may suspend or terminate your account if you violate these terms, engage in harmful behavior, or for any other reason at our discretion. You may delete your account at any time through the app settings.
        </Text>

        <Text style={styles.sectionTitle}>9. Disclaimers</Text>
        <Text style={styles.paragraph}>
          MatchKar is provided "as is" without warranties of any kind. We do not guarantee that you will find a match or that the service will be uninterrupted or error-free.
        </Text>

        <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, MatchKar shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
        </Text>

        <Text style={styles.sectionTitle}>11. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of New Delhi, India.
        </Text>

        <Text style={styles.sectionTitle}>12. Contact Us</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms of Service:{'\n\n'}
          Email: legal@matchkar.com{'\n'}
          Website: https://matchkar.com/terms
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
