import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { 
  createChatRoom, 
  sendMessage, 
  subscribeToMessages
} from '../lib/chatService';
import { getUserContacts, createUserProfile } from '../lib/userService';
import type { Message } from '../lib/chatService';
import type { AppUser } from '../lib/userService';
import AddContact from './AddContact';

function Chat() {
    const { contactId } = useParams<{ contactId?: string }>();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [contacts, setContacts] = useState<AppUser[]>([]);
    const [currentContact, setCurrentContact] = useState<AppUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatRoomId, setChatRoomId] = useState('');
    const [showAddContact, setShowAddContact] = useState(false);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const profileInitialized = useRef(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    // Get user's display name or email
    const getUserDisplayName = () => {
        if (currentUser?.displayName) {
            return currentUser.displayName;
        }
        if (currentUser?.email) {
            return currentUser.email.split('@')[0];
        }
        return 'User';
    };

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Format timestamp
    const formatTime = (timestamp: unknown) => {
        if (!timestamp) return '';
        // Handle Firestore Timestamp
        if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
            return (timestamp as { toDate: () => Date }).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Handle regular Date or string
        const date = new Date(timestamp as string | number | Date);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Load user contacts
    const loadContacts = useCallback(async () => {
        if (!currentUser) return;
        
        try {
            setLoadingContacts(true);
            // Ensure user profile exists (only on first load)
            if (!profileInitialized.current) {
                await createUserProfile(currentUser);
                profileInitialized.current = true;
            }
            // Get user contacts
            const userContacts = await getUserContacts(currentUser.uid);
            // Ensure contacts have avatar property for UI
            const contactsWithAvatars = userContacts.map(contact => ({
                ...contact,
                avatar: contact.avatar || '👤'
            }));
            setContacts(contactsWithAvatars);
        } catch (error) {
            console.error('Error loading contacts:', error);
        } finally {
            setLoadingContacts(false);
        }
    }, [currentUser]);

    // Handle contact added
    const handleContactAdded = (newContact: AppUser) => {
        const contactWithAvatar = {
            ...newContact,
            avatar: newContact.avatar || '👤'
        };
        setContacts(prev => [...prev, contactWithAvatar]);
        navigate(`/chat/${contactWithAvatar.id}`);
        setShowAddContact(false);
    };

    // Initialize contacts
    useEffect(() => {
        if (currentUser) {
            loadContacts();
        }
    }, [currentUser, loadContacts]);

    useEffect(() => {
        if (contactId && contacts.length > 0) {
            const contact = contacts.find(c => c.id === contactId);
            if (contact) {
                setCurrentContact(contact);
            } else if (contacts.length > 0) {
                navigate(`/chat/${contacts[0].id}`, { replace: true });
            }
        } else if (contacts.length > 0) {
            navigate(`/chat/${contacts[0].id}`, { replace: true });
        }
    }, [contactId, navigate, contacts]);

    // Set up chat room and subscribe to messages
    useEffect(() => {
        if (!currentUser || !currentContact) return;

        const initializeChat = async () => {
            try {
                const roomId = await createChatRoom(
                    currentUser, 
                    currentContact.id, 
                    { 
                        name: currentContact.displayName || currentContact.name || 'User', 
                        email: currentContact.email 
                    }
                );
                setChatRoomId(roomId);

                // Subscribe to messages
                const unsubscribe = subscribeToMessages(roomId, (newMessages) => {
                    setMessages(newMessages);
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error initializing chat:', error);
            }
        };

        const unsubscribePromise = initializeChat();

        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (unsubscribe) unsubscribe();
            });
        };
    }, [currentUser, currentContact]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleContactClick = (contact: AppUser) => {
        navigate(`/chat/${contact.id}`);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !chatRoomId || loading || !currentContact) return;

        setLoading(true);
        try {
            await sendMessage(chatRoomId, newMessage.trim(), currentUser, currentContact.id);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loadingContacts) {
        return (
            <div className="w-full h-[600px] max-w-6xl mx-auto my-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-lg flex items-center justify-center">
                <div className="text-purple-600 text-lg">Loading contacts...</div>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <>
                <div className="w-full h-[600px] max-w-6xl mx-auto my-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-lg flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-purple-700 mb-4">No Contacts Yet</h2>
                        <p className="text-gray-600 mb-6">Add your first contact to start chatting!</p>
                        <button
                            onClick={() => setShowAddContact(true)}
                            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Add Contact
                        </button>
                    </div>
                </div>

                {/* Add Contact Modal */}
                {showAddContact && (
                    <AddContact 
                        onClose={() => setShowAddContact(false)}
                        onContactAdded={handleContactAdded}
                    />
                )}
            </>
        );
    }

    return (
        <div className="w-full h-[600px] max-w-6xl mx-auto my-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-lg flex overflow-hidden">
            {/* Contacts List */}
            <div className="w-1/3 bg-white rounded-l-3xl shadow-inner flex flex-col p-4 border-r">
                {/* User Profile Section */}
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-semibold">
                                {getUserDisplayName().charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{getUserDisplayName()}</p>
                                <p className="text-xs opacity-80">{currentUser?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                            title="Logout"
                        >
                            🚪
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-700">Chats</h2>
                    <button
                        onClick={() => setShowAddContact(true)}
                        className="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors relative z-10"
                        title="Add new contact"
                    >
                        + Add
                    </button>
                </div>
                <ul>
                    {contacts.map((contact) => (
                        <li
                            key={contact.id}
                            className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                                currentContact?.id === contact.id 
                                    ? 'bg-purple-200 border-2 border-purple-400' 
                                    : 'bg-purple-50 hover:bg-purple-100'
                            }`}
                            onClick={() => handleContactClick(contact)}
                            title={`User ID: ${contact.id}`}
                        >
                            <span className="text-2xl">{contact.avatar}</span>
                            <div className="flex-1">
                                <span className="font-semibold block">{contact.displayName || contact.name || contact.email?.split('@')[0] || 'User'}</span>
                                <span className="text-sm text-gray-500">{contact.email}</span>
                                <span className="text-xs text-gray-400 font-mono">ID: {contact.id.slice(0, 8)}...</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col h-full">
                {currentContact ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center gap-3 bg-purple-600 text-white px-6 py-4 rounded-tr-3xl">
                            <span className="text-2xl">{currentContact.avatar}</span>
                            <div>
                                <span className="font-semibold text-lg block">{currentContact.displayName || currentContact.name || currentContact.email?.split('@')[0] || 'User'}</span>
                                <span className="text-sm opacity-80">{currentContact.email}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 bg-white rounded-xl shadow-inner p-4 mb-4 overflow-y-auto flex flex-col">
                            {messages.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-gray-500 text-center">
                                        No messages yet. Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${
                                                message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                    message.senderId === currentUser?.uid
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-gray-200 text-gray-800'
                                                }`}
                                            >
                                                <p className="break-words">{message.text}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.senderId === currentUser?.uid
                                                        ? 'text-purple-100'
                                                        : 'text-gray-500'
                                                }`}>
                                                    {formatTime(message.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="w-full flex gap-2 px-6 pb-6">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                                disabled={loading || !newMessage.trim()}
                            >
                                {loading ? '...' : 'Send'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-500 text-lg mb-2">Select a contact to start chatting</p>
                            <p className="text-gray-400">or add new contacts to get started</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Add Contact Modal */}
            {showAddContact && (
                <AddContact 
                    onClose={() => setShowAddContact(false)}
                    onContactAdded={handleContactAdded}
                />
            )}
        </div>
    );
}

export default Chat;
