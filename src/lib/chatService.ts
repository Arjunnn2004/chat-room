import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  getDocs,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from 'firebase/auth';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  timestamp: Timestamp | null;
  chatRoomId: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantDetails: {
    [userId: string]: {
      name: string;
      email: string;
    };
  };
  lastMessage?: string;
  lastMessageTime?: Timestamp | null;
}

// Create or get a chat room between two users
export const createChatRoom = async (user1: User, user2Id: string, user2Details: { name: string; email: string }) => {
  const chatRoomId = [user1.uid, user2Id].sort().join('_');
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  
  const chatRoomData: Omit<ChatRoom, 'id'> = {
    participants: [user1.uid, user2Id],
    participantDetails: {
      [user1.uid]: {
        name: user1.displayName || user1.email?.split('@')[0] || 'User',
        email: user1.email || ''
      },
      [user2Id]: user2Details
    }
  };

  await setDoc(chatRoomRef, chatRoomData, { merge: true });
  return chatRoomId;
};

// Send a message
export const sendMessage = async (
  chatRoomId: string,
  text: string,
  sender: User,
  receiverId: string
) => {
  const messagesRef = collection(db, 'messages');
  
  const messageData = {
    text,
    senderId: sender.uid,
    senderName: sender.displayName || sender.email?.split('@')[0] || 'User',
    senderEmail: sender.email || '',
    receiverId,
    chatRoomId,
    timestamp: serverTimestamp()
  };

  await addDoc(messagesRef, messageData);
  
  // Update last message in chat room
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  await setDoc(chatRoomRef, {
    lastMessage: text,
    lastMessageTime: serverTimestamp()
  }, { merge: true });
};

// Listen to messages in real-time
export const subscribeToMessages = (
  chatRoomId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('chatRoomId', '==', chatRoomId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    callback(messages);
  });
};

// Get user's chat rooms
export const getUserChatRooms = async (userId: string) => {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(chatRoomsRef, where('participants', 'array-contains', userId));
  
  const snapshot = await getDocs(q);
  const chatRooms: ChatRoom[] = [];
  
  snapshot.forEach((doc) => {
    chatRooms.push({ id: doc.id, ...doc.data() } as ChatRoom);
  });
  
  return chatRooms;
};
