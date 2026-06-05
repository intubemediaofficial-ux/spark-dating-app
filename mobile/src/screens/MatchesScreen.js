import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;

const DEMO_MATCHES = [
  { id: '1', name: 'Priya', age: 24, photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400', city: 'New Delhi', isNew: true, isOnline: true },
  { id: '2', name: 'Kavya', age: 22, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', city: 'Hyderabad', isNew: true, isOnline: false },
  { id: '3', name: 'Ananya', age: 23, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', city: 'New Delhi', isNew: false, isOnline: true },
  { id: '4', name: 'Meera', age: 26, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', city: 'Bangalore', isNew: false, isOnline: true },
  { id: '5', name: 'Sneha', age: 25, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', city: 'Mumbai', isNew: false, isOnline: false },
  { id: '6', name: 'Riya', age: 21, photo: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400', city: 'Pune', isNew: false, isOnline: false },
];

export default function MatchesScreen({ navigation }) {
  const [matches] = useState(DEMO_MATCHES);

  const renderMatch = ({ item }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate('ChatConversation', { match: { user: { id: item.id, name: item.name, photos: [item.photo] }, matchId: item.id } })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.photo }} style={styles.matchPhoto} />
      {item.isOnline && <View style={styles.onlineDot} />}
      {item.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <View style={styles.matchOverlay}>
        <Text style={styles.matchName}>{item.name}, {item.age}</Text>
        <Text style={styles.matchCity}>📍 {item.city}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.matchCount}>{matches.length} matches</Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptyText}>Keep swiping to find your perfect match!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#222' },
  matchCount: { fontSize: 14, color: '#FF4458', fontWeight: '600' },
  grid: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  matchCard: { width: CARD_WIDTH, height: CARD_WIDTH * 1.4, borderRadius: 16, overflow: 'hidden', backgroundColor: '#e0e0e0', position: 'relative' },
  matchPhoto: { width: '100%', height: '100%' },
  onlineDot: { position: 'absolute', top: 12, right: 12, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff' },
  newBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FF4458', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  newBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  matchOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.5)' },
  matchName: { fontSize: 17, fontWeight: '700', color: '#fff' },
  matchCity: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 60 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginTop: 15 },
  emptyText: { fontSize: 15, color: '#888', marginTop: 8, textAlign: 'center' },
});
