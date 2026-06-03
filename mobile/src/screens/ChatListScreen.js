import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONVERSATIONS = [
  {
    id: 'c1',
    user: { id: 'u1', name: 'Priya Sharma', photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=200'], isOnline: true },
    lastMessage: 'Hey! How are you? 😊',
    time: '2m ago',
    unread: 2,
  },
  {
    id: 'c2',
    user: { id: 'u2', name: 'Ananya Gupta', photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'], isOnline: true },
    lastMessage: 'That sounds amazing! Let\'s catch up',
    time: '1h ago',
    unread: 0,
  },
  {
    id: 'c3',
    user: { id: 'u3', name: 'Kavya Reddy', photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'], isOnline: false },
    lastMessage: 'I love that place! Been there twice 😍',
    time: '3h ago',
    unread: 1,
  },
  {
    id: 'c4',
    user: { id: 'u4', name: 'Sneha Patel', photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200'], isOnline: false },
    lastMessage: 'Haha, same! We should meet up',
    time: '1d ago',
    unread: 0,
  },
  {
    id: 'c5',
    user: { id: 'u5', name: 'Meera Joshi', photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200'], isOnline: true },
    lastMessage: 'Sure, see you this weekend!',
    time: '2d ago',
    unread: 0,
  },
];

export default function ChatListScreen({ navigation }) {
  const [conversations] = useState(CONVERSATIONS);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatConversation', { match: { user: item.user, matchId: item.id } })}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.user.photos[0] }} style={styles.avatar} />
        {item.user.isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.user.name}</Text>
        <Text style={[styles.chatMessage, item.unread > 0 && styles.unreadMsg]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <View style={styles.chatRight}>
        <Text style={styles.chatTime}>{item.time}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No Conversations Yet</Text>
          <Text style={styles.emptyText}>Match with someone and start chatting!</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingVertical: 18 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#222' },
  list: { paddingHorizontal: 15 },
  chatItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#e0e0e0' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff' },
  chatInfo: { flex: 1, marginLeft: 14 },
  chatName: { fontSize: 17, fontWeight: '600', color: '#222' },
  chatMessage: { fontSize: 15, color: '#888', marginTop: 3 },
  unreadMsg: { color: '#333', fontWeight: '600' },
  chatRight: { alignItems: 'flex-end', gap: 6 },
  chatTime: { fontSize: 13, color: '#aaa' },
  unreadBadge: { backgroundColor: '#FF4458', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  unreadCount: { color: '#fff', fontSize: 12, fontWeight: '700' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 60 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginTop: 15 },
  emptyText: { fontSize: 15, color: '#888', marginTop: 8 },
});
