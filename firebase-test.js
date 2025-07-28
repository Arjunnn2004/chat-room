// Firebase Connection Test
// Run this in browser console to test Firebase connectivity

import { auth, db } from './src/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Test function
async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...');
  
  // Check auth
  console.log('👤 Current user:', auth.currentUser);
  
  if (!auth.currentUser) {
    console.log('❌ No user logged in - please log in first');
    return;
  }
  
  try {
    // Test Firestore read
    console.log('📖 Testing Firestore read...');
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firestore read successful, docs:', snapshot.size);
    
    // Test Firestore write
    console.log('📝 Testing Firestore write...');
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Connection test',
      timestamp: new Date(),
      userId: auth.currentUser.uid
    });
    console.log('✅ Firestore write successful, doc ID:', testDoc.id);
    
    console.log('🎉 Firebase connection is working perfectly!');
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.log('🔧 Please check your Firestore security rules');
  }
}

// Export for manual testing
window.testFirebaseConnection = testFirebaseConnection;
