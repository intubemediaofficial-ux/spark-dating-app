import React, { useState, useEffect, useRef } from 'react';
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
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

export default function ChatScreen({ route, navigation }) {
  const { match } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    loadMessages();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const setupSocket = () => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', user.id);

    socketRef.current.on('newMessage', (message) => {
      if (message.matchId === match.matchId) {
        setMessages(prev => [...prev, message]);
      }
    });
  };

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getMessages(match.matchId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageText = text.trim();
    setText('');

    try {
      // Send via socket for real-time
      socketRef.current?.emit('sendMessage', {
        matchId: match.matchId,
        content: messageText,
        senderId: user.id,
        receiverId: match.user.id,
      });

      // Also send via API as backup
      const response = await chatAPI.sendMessage(match.matchId, messageText);
      setMessages(prev => [...prev, response.data.message]);
    } catch (error) {
      console.error('Send message error:', error);
    }
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
          source={{ uri: match.user.photos?.[0] || 'https://via.placeholder.com/40' }}
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
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>Say hello to start the conversation! 👋</Text>
            </View>
          }
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
  emptyChat: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyChatText: { fontSize: 16, color: '#999' },
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
