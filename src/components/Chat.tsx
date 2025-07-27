import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const contacts = [
    { id: '1', name: 'Alice', avatar: '🧑‍🦰' },
    { id: '2', name: 'Bob', avatar: '🧑‍🦱' },
    { id: '3', name: 'Charlie', avatar: '🧑‍🦳' },
];

function Chat() {
    const { contactId } = useParams<{ contactId?: string }>();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [currentContact, setCurrentContact] = useState(contacts[0]);

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
            return currentUser.email.split('@')[0]; // Use part before @ as username
        }
        return 'User';
    };

    useEffect(() => {
        if (contactId) {
            const contact = contacts.find(c => c.id === contactId);
            if (contact) {
                setCurrentContact(contact);
            } else {
                // If contact not found, redirect to first contact
                navigate(`/chat/${contacts[0].id}`, { replace: true });
            }
        } else {
            // If no contactId in URL, redirect to first contact
            navigate(`/chat/${contacts[0].id}`, { replace: true });
        }
    }, [contactId, navigate]);

    const handleContactClick = (contact: typeof contacts[0]) => {
        navigate(`/chat/${contact.id}`);
    };

    return (
        <div className="w-full max-h-96 max-w-4xl mx-auto my-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-lg flex overflow-hidden">
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
                
                <h2 className="text-xl font-bold text-purple-700 mb-4">Chats</h2>
                <ul>
                    {contacts.map((contact) => (
                        <li
                            key={contact.id}
                            className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                                currentContact.id === contact.id 
                                    ? 'bg-purple-200 border-2 border-purple-400' 
                                    : 'bg-purple-50 hover:bg-purple-100'
                            }`}
                            onClick={() => handleContactClick(contact)}
                        >
                            <span className="text-2xl">{contact.avatar}</span>
                            <span className="font-semibold">{contact.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Chat Area */}
            <div className="w-2/3 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 bg-purple-600 text-white px-6 py-4 rounded-tr-3xl">
                    <span className="text-2xl">{currentContact.avatar}</span>
                    <span className="font-semibold text-lg">{currentContact.name}</span>
                </div>
                {/* Messages */}
                <div className="flex-1 bg-white rounded-xl shadow-inner p-6 mb-4 overflow-y-auto flex flex-col">
                    <p className="text-gray-500 text-center">
                        No messages yet. Start the conversation!
                    </p>
                </div>
                {/* Input */}
                <form className="w-full flex gap-2 px-6 pb-6">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    <button
                        type="button"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
