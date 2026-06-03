import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { swipeAPI } from '../services/api';

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await swipeAPI.getMatches();
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Load matches error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const renderMatch = ({ item }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate('Chat', { match: item })}
    >
      <Image
        source={{ uri: item.user.photos?.[0] || 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.user.name}, {item.user.age}</Text>
          {item.user.isVerified && <Text style={styles.verified}>✓</Text>}
        </View>
        {item.user.city && <Text style={styles.matchCity}>📍 {item.user.city}</Text>}
        {item.lastMessage ? (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
        ) : (
          <Text style={styles.newMatch}>New match! Say hello 👋</Text>
        )}
      </View>
      <Text style={styles.time}>
        {getTimeAgo(item.lastMessage?.createdAt || item.createdAt)}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF4458" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.matchCount}>{matches.length} matches</Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>
            Keep swiping to find your perfect match!
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.matchId}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF4458" />
          }
        />
      )}
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
  loader: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  matchCount: { fontSize: 13, color: '#999', marginTop: 2 },
  list: { padding: 10 },
  matchCard: {
    flexDirection: 'row', alignItems: 'center', padding: 15,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e0e0e0' },
  matchInfo: { flex: 1, marginLeft: 15 },
  matchHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  matchName: { fontSize: 16, fontWeight: '600', color: '#222' },
  verified: { fontSize: 14, color: '#4CAF50', fontWeight: 'bold' },
  matchCity: { fontSize: 12, color: '#999', marginTop: 2 },
  lastMessage: { fontSize: 14, color: '#666', marginTop: 4 },
  newMatch: { fontSize: 14, color: '#FF4458', marginTop: 4, fontStyle: 'italic' },
  time: { fontSize: 12, color: '#999' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 15 },
  emptyText: { fontSize: 15, color: '#666', marginTop: 8, textAlign: 'center' },
});
