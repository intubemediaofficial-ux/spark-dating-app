import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const DEMO_MESSAGES = [
  { id: '1', senderId: 'u1', content: 'Hey! I saw we matched 😊', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', senderId: 'demo-user-1', content: 'Hi! Yes, nice to meet you! How are you?', createdAt: new Date(Date.now() - 3500000).toISOString() },
  { id: '3', senderId: 'u1', content: 'I\'m great! I loved your bio. You\'re into fitness too?', createdAt: new Date(Date.now() - 3400000).toISOString() },
  { id: '4', senderId: 'demo-user-1', content: 'Yes! I workout 5 days a week. What about you?', createdAt: new Date(Date.now() - 3300000).toISOString() },
  { id: '5', senderId: 'u1', content: 'That\'s awesome! I do yoga mostly. Maybe we could workout together sometime? 💪', createdAt: new Date(Date.now() - 3200000).toISOString() },
  { id: '6', senderId: 'demo-user-1', content: 'Sounds like a plan! Where do you usually go?', createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: '7', senderId: 'u1', content: 'Hey! How are you? 😊', createdAt: new Date(Date.now() - 300000).toISOString() },
];

export default function ChatScreen({ route, navigation }) {
  const { match } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [text, setText] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setText('');

    // Simulate reply
    setTimeout(() => {
      const replies = ['That sounds great! 😄', 'Haha, I love that!', 'Tell me more about it...', 'Same here! 🙌', 'Let\'s plan something this weekend!'];
      const reply = {
        id: (Date.now() + 1).toString(),
        senderId: match.user.id,
        content: replies[Math.floor(Math.random() * replies.length)],
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === user.id;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe && styles.myMessageText]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: match.user.photos[0] }}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{match.user.name}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreBtnText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!text.trim()}
          >
            <Text style={styles.sendBtnText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backBtn: { padding: 5, marginRight: 10 },
  backBtnText: { fontSize: 24, color: '#333' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e0e0' },
  headerInfo: { flex: 1, marginLeft: 12 },
  headerName: { fontSize: 16, fontWeight: '600', color: '#222' },
  headerStatus: { fontSize: 12, color: '#4CAF50' },
  moreBtn: { padding: 5 },
  moreBtnText: { fontSize: 24, color: '#666' },
  messagesList: { padding: 15, flexGrow: 1 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 18, marginBottom: 8 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#FF4458', borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, color: '#333', lineHeight: 20 },
  myMessageText: { color: '#fff' },
  messageTime: { fontSize: 11, color: '#999', marginTop: 4, alignSelf: 'flex-end' },
  myMessageTime: { color: 'rgba(255,255,255,0.7)' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 15,
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 18,
    paddingVertical: 10, fontSize: 15, maxHeight: 100, color: '#333',
  },
  sendBtn: { marginLeft: 10, backgroundColor: '#FF4458', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#ccc' },
  sendBtnText: { fontSize: 18, color: '#fff' },
});
