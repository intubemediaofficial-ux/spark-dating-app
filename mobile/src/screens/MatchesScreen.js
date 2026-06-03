import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NEW_MATCHES = [
  {
    matchId: 'nm1', user: { id: 'u5', name: 'Riya', photos: ['https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=200'] }
  },
  {
    matchId: 'nm2', user: { id: 'u6', name: 'Aisha', photos: ['https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200'] }
  },
  {
    matchId: 'nm3', user: { id: 'u7', name: 'Nisha', photos: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200'] }
  },
];

const DEMO_MATCHES = [
  {
    matchId: 'm1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: {
      id: 'u1',
      name: 'Priya Sharma',
      age: 24,
      photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=200'],
      city: 'New Delhi',
      isVerified: true,
    },
    lastMessage: {
      content: 'Hey! How are you? 😊',
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    unread: 2,
  },
  {
    matchId: 'm2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 'u2',
      name: 'Kavya Reddy',
      age: 22,
      photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'],
      city: 'Hyderabad',
      isVerified: true,
    },
    lastMessage: {
      content: 'That sounds amazing! Let\'s catch up sometime',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    unread: 0,
  },
  {
    matchId: 'm3',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    user: {
      id: 'u3',
      name: 'Meera Joshi',
      age: 26,
      photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200'],
      city: 'Bangalore',
      isVerified: true,
    },
    lastMessage: null,
    unread: 0,
  },
  {
    matchId: 'm4',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    user: {
      id: 'u4',
      name: 'Ananya Gupta',
      age: 23,
      photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'],
      city: 'New Delhi',
      isVerified: false,
    },
    lastMessage: {
      content: 'I love that place! Been there twice 😍',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    unread: 1,
  },
  {
    matchId: 'm5',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    user: {
      id: 'u8',
      name: 'Sneha Patel',
      age: 25,
      photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200'],
      city: 'Mumbai',
      isVerified: true,
    },
    lastMessage: {
      content: 'Haha, same! We should meet up',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    unread: 0,
  },
];

export default function MatchesScreen({ navigation }) {
  const [matches] = useState(DEMO_MATCHES);

  const renderNewMatch = ({ item }) => (
    <TouchableOpacity style={styles.newMatchItem} onPress={() => navigation.navigate('Chat', { match: item })}>
      <View style={styles.newMatchAvatarWrap}>
        <Image source={{ uri: item.user.photos[0] }} style={styles.newMatchAvatar} />
      </View>
      <Text style={styles.newMatchName}>{item.user.name}</Text>
    </TouchableOpacity>
  );

  const renderMatch = ({ item }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate('Chat', { match: item })}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.user.photos[0] }} style={styles.avatar} />
        <View style={styles.onlineDot} />
      </View>
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.user.name}, {item.user.age}</Text>
          {item.user.isVerified && <Text style={styles.verified}>✓</Text>}
        </View>
        {item.lastMessage ? (
          <Text style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]} numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
        ) : (
          <Text style={styles.newMatch}>New match! Say hello 👋</Text>
        )}
      </View>
      <View style={styles.matchRight}>
        <Text style={styles.time}>
          {getTimeAgo(item.lastMessage?.createdAt || item.createdAt)}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* New Matches Horizontal Scroll */}
      <View style={styles.newMatchesSection}>
        <Text style={styles.newMatchesTitle}>New Matches</Text>
        <FlatList
          horizontal
          data={NEW_MATCHES}
          renderItem={renderNewMatch}
          keyExtractor={(item) => item.matchId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newMatchesList}
        />
      </View>

      {/* Conversations */}
      <View style={styles.conversationsHeader}>
        <Text style={styles.conversationsTitle}>Conversations</Text>
        <Text style={styles.matchCount}>{matches.length} matches</Text>
      </View>

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.matchId}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#222' },
  filterBtn: { padding: 8 },
  filterIcon: { fontSize: 22 },
  newMatchesSection: { paddingLeft: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  newMatchesTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 12 },
  newMatchesList: { gap: 15 },
  newMatchItem: { alignItems: 'center', width: 72 },
  newMatchAvatarWrap: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: '#FF4458', padding: 2 },
  newMatchAvatar: { width: '100%', height: '100%', borderRadius: 32, backgroundColor: '#e0e0e0' },
  newMatchName: { fontSize: 13, color: '#333', marginTop: 6, fontWeight: '500' },
  conversationsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  conversationsTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
  matchCount: { fontSize: 14, color: '#999' },
  list: { paddingHorizontal: 10 },
  matchCard: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: '#f8f8f8',
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e0e0e0' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff' },
  matchInfo: { flex: 1, marginLeft: 15 },
  matchHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchName: { fontSize: 18, fontWeight: '600', color: '#222' },
  verified: { fontSize: 15, color: '#4FC3F7', fontWeight: 'bold' },
  lastMessage: { fontSize: 15, color: '#888', marginTop: 4 },
  unreadMessage: { color: '#333', fontWeight: '600' },
  newMatch: { fontSize: 15, color: '#FF4458', marginTop: 4, fontWeight: '500' },
  matchRight: { alignItems: 'flex-end', gap: 6 },
  time: { fontSize: 13, color: '#aaa' },
  unreadBadge: { backgroundColor: '#FF4458', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  unreadCount: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
