import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, addToContacts } from '../lib/userService';
import type { AppUser } from '../lib/userService';

interface AddContactProps {
  onContactAdded: (contact: AppUser) => void;
  onClose: () => void;
}

function AddContact({ onContactAdded, onClose }: AddContactProps) {
  const [userIdInput, setUserIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser } = useAuth();

  console.log('AddContact component rendered with currentUser:', currentUser?.uid);

  const copyUserIdToClipboard = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setSuccess('User ID copied to clipboard!');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleAddContact = async () => {
    console.log('➕ Starting add contact process:', { userIdInput: userIdInput.trim(), currentUser: currentUser?.uid });
    
    if (!userIdInput.trim()) {
      setError('Please enter a User ID');
      return;
    }
    
    if (!currentUser) {
      setError('You must be logged in to add contacts');
      return;
    }

    if (userIdInput.trim() === currentUser.uid) {
      setError("You can't add yourself as a contact!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Test Firebase connection first
      console.log('🔥 Testing Firebase connection...');
      setSuccess('Testing Firebase connection...');

      // First, check if the user exists
      console.log('🔍 Looking up user by ID...');
      const foundUser = await getUserById(userIdInput.trim());
      
      if (!foundUser) {
        setError('User not found. Please check the User ID and try again.');
        setLoading(false);
        return;
      }

      console.log('👤 Found user:', foundUser);

      // Add to contacts
      console.log('🔄 Adding to contacts...');
      const success = await addToContacts(currentUser.uid, foundUser.id);
      console.log('📝 Add contacts result:', success);
      
      if (success) {
        console.log('✅ Contact added successfully!');
        setSuccess('Contact added successfully!');
        onContactAdded(foundUser);
        setTimeout(() => {
          console.log('🔄 Closing modal...');
          onClose();
        }, 1500);
      } else {
        console.log('❌ Failed to add contact');
        setError('Contact already exists or failed to add');
      }
    } catch (err) {
      console.error('🔥 FIREBASE ERROR DETAILS:', err);
      
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        // Check for specific Firebase errors
        if (err.message.includes('index') || err.message.includes('requires an index')) {
          setError('❌ DATABASE INDEX ERROR: Firebase needs indexes created. Check console for details.');
          console.error('🔥 MISSING INDEX ERROR - Create these indexes in Firebase Console:');
          console.error('📌 INDEX 1: Collection: users, Field: email (Ascending)');
          console.error('📌 INDEX 2: Collection: messages, Fields: chatRoomId (Ascending), timestamp (Descending)');
          console.error('📌 INDEX 3: Collection: messages, Fields: chatRoomId (Ascending), senderId (Ascending)');
          console.error('🔗 Direct link: https://console.firebase.google.com/project/chat-22a6e/firestore/indexes');
          console.error('⏱️ Indexes take 5-15 minutes to build after creation');
        } else if (err.message.includes('permission-denied')) {
          setError('❌ PERMISSION DENIED: Check Firebase Security Rules');
          console.error('🔥 PERMISSION ERROR - Firebase security rules may be blocking the request');
        } else if (err.message.includes('network') || err.message.includes('offline')) {
          setError('❌ NETWORK ERROR: Check your internet connection');
        } else if (err.message.includes('auth')) {
          setError('❌ AUTHENTICATION ERROR: Please try logging out and back in');
        } else if (err.message.includes('not-found')) {
          setError('❌ USER NOT FOUND: The User ID does not exist');
        } else if (err.message.includes('unavailable')) {
          setError('❌ FIREBASE UNAVAILABLE: Service temporarily down');
        } else {
          setError(`❌ FIREBASE ERROR: ${err.message}`);
        }
      } else {
        setError('❌ UNKNOWN ERROR: Something unexpected happened');
        console.error('🔥 Non-Error object thrown:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg p-6 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
          style={{ zIndex: 10000 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Add Contact</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Your User ID Display */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your User ID (share this with others):</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white border rounded text-sm font-mono break-all">
                {currentUser?.uid || 'Loading...'}
              </code>
              <button
                onClick={copyUserIdToClipboard}
                className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
                disabled={!currentUser?.uid}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* User ID Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter User ID to Add
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter the User ID of the person to add"
                onKeyPress={(e) => e.key === 'Enter' && handleAddContact()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button
                onClick={handleAddContact}
                disabled={loading || !userIdInput.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ask the person for their User ID to add them as a contact
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-2">How to add contacts:</p>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Copy your User ID from above and share it with your friend</li>
              <li>2. Ask your friend for their User ID</li>
              <li>3. Enter their User ID in the field above and click "Add"</li>
              <li>4. Start chatting!</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddContact;
