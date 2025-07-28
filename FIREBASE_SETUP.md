# Firebase Setup Guide

## 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it "chat-app" or similar
4. Enable Google Analytics (optional)
5. Wait for project creation

## 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Choose your preferred location
5. Click "Done"

## 4. Register Web App
1. In Project Overview, click the "</>" icon
2. Give your app a nickname (e.g., "chat-web-app")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the firebaseConfig object
6. Replace the config in src/lib/firebase.ts

## 5. Update Firestore Rules (for production)
Go to Firestore Database → Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other users for contacts
    }
    
    // Chat rooms - users can read/write if they're participants
    match /chatRooms/{chatRoomId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
    }
    
    // Messages - users can read/write if they're in the chat room
    match /chatRooms/{chatRoomId}/messages/{messageId} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## 6. Test Connection
Run your app and check the browser console for any Firebase errors.
