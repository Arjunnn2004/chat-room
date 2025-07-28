import { 
  collection, 
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from 'firebase/auth';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp | Date;
  contacts: string[]; // Array of user IDs
  // Optional fields for UI
  name?: string;
  avatar?: string;
}

// Create or update user profile when they register/login
export const createUserProfile = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Only create if doesn't exist to avoid unnecessary writes
    if (!userSnap.exists()) {
      const userData: Omit<AppUser, 'id'> = {
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        createdAt: new Date(),
        contacts: []
      };

      await setDoc(userRef, userData);
      console.log('User profile created for:', user.email);
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<AppUser | null> => {
  try {
    console.log('🔍 getUserById called with:', userId);
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    console.log('📄 User document exists:', userSnap.exists());
    
    if (userSnap.exists()) {
      const userData = { id: userSnap.id, ...userSnap.data() } as AppUser;
      console.log('👤 Found user:', userData);
      return userData;
    }
    console.log('❌ No user found with ID:', userId);
    return null;
  } catch (error) {
    console.error('💥 Error getting user:', error);
    return null;
  }
};

// Search users by email
export const searchUserByEmail = async (email: string): Promise<AppUser | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as AppUser;
    }
    return null;
  } catch (error) {
    console.error('Error searching user:', error);
    return null;
  }
};

// Add user to contacts
export const addToContacts = async (currentUserId: string, contactUserId: string) => {
  try {
    console.log('➕ addToContacts called:', { currentUserId, contactUserId });
    
    const currentUserRef = doc(db, 'users', currentUserId);
    const contactUserRef = doc(db, 'users', contactUserId);
    
    // Check if contact already exists
    console.log('🔍 Checking if contact already exists...');
    const currentUserSnap = await getDoc(currentUserRef);
    if (currentUserSnap.exists()) {
      const userData = currentUserSnap.data() as AppUser;
      if (userData.contacts && userData.contacts.includes(contactUserId)) {
        console.log('❌ Contact already exists');
        return false; // Contact already exists
      }
    }
    
    console.log('📝 Adding to contact lists...');
    // Add to both users' contact lists
    await updateDoc(currentUserRef, {
      contacts: arrayUnion(contactUserId)
    });

    await updateDoc(contactUserRef, {
      contacts: arrayUnion(currentUserId)
    });
    
    console.log('✅ Contact added successfully');
    return true;
  } catch (error) {
    console.error('Error adding contact:', error);
    return false;
  }
};

// Get user's contacts
export const getUserContacts = async (userId: string): Promise<AppUser[]> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as AppUser;
      
      if (!userData.contacts || userData.contacts.length === 0) {
        return [];
      }
      
      // Get all contact details in parallel for better performance
      const contactPromises = userData.contacts.map(contactId => getUserById(contactId));
      const contactResults = await Promise.all(contactPromises);
      
      // Filter out any null results
      const contacts = contactResults.filter((contact): contact is AppUser => contact !== null);
      
      return contacts;
    }
    return [];
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
};
