# 💬 Chat Room - Real-time Chat Application

A modern, secure chat application built with React, TypeScript, Vite, and Firebase. Features user authentication, real-time messaging interface, and responsive design.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

## ✨ Features

- 🔐 **Secure Authentication** - Firebase Auth with email/password
- 👤 **User Profiles** - Display logged-in user information
- 💬 **Chat Interface** - Modern chat UI with contact selection
- 🔒 **Protected Routes** - Chat rooms accessible only to authenticated users
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Beautiful gradient design with Tailwind CSS
- ⚡ **Fast Development** - Powered by Vite for instant hot reload
- 🔄 **Dynamic Routing** - URL-based chat navigation with React Router

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arjunnn2004/chat-room.git
   cd chat-room
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Copy your Firebase config and update `src/lib/firebase.ts`

4. **Configure Firebase**
   ```typescript
   // src/lib/firebase.ts
   const firebaseConfig = {
  apiKey: "AIzaSyADcajt0qYSIqaucYX22ZA0o_yjXb3wGrM",
  authDomain: "chat-22a6e.firebaseapp.com",
  projectId: "chat-22a6e",
  storageBucket: "chat-22a6e.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh5678",
  measurementId: "G-XXXXXXXXXX"
  };
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Chat.tsx         # Main chat interface
│   ├── Login.tsx        # Login form
│   ├── Register.tsx     # Registration form
│   └── ProtectedRoute.tsx # Route protection
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── lib/                 # Utilities and configurations
│   └── firebase.ts      # Firebase configuration
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🛠️ Built With

- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Firebase Auth](https://firebase.google.com/products/auth)** - Authentication
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎯 Usage

### Authentication
1. **Register** - Create a new account with email/password
2. **Login** - Sign in with existing credentials
3. **Auto-redirect** - Authenticated users skip login/register pages

### Chat Features
1. **Contact Selection** - Click on contacts to start conversations
2. **URL Navigation** - Direct links to specific chats (`/chat/1`, `/chat/2`, etc.)
3. **User Profile** - View logged-in user info in sidebar
4. **Logout** - Quick logout from chat interface

### Route Structure
- `/` - Redirects to login
- `/login` - User authentication
- `/register` - User registration
- `/chat` - Protected chat interface
- `/chat/:contactId` - Specific chat conversations

## 🔒 Security Features

- **Protected Routes** - Chat accessible only to authenticated users
- **Firebase Auth** - Secure authentication with industry standards
- **Auto-logout** - Clean session management
- **Input Validation** - Form validation and error handling

## 🎨 UI/UX Features

- **Gradient Design** - Modern purple-blue gradient theme
- **Responsive Layout** - Adapts to different screen sizes
- **Interactive Elements** - Hover effects and transitions
- **User Feedback** - Loading states and error messages
- **Clean Typography** - Readable fonts and proper spacing

## 🚧 Roadmap

- [ ] Real-time messaging with Firebase Firestore
- [ ] File and image sharing
- [ ] Group chat functionality
- [ ] Message search and history
- [ ] Push notifications
- [ ] Dark mode toggle
- [ ] Emoji support
- [ ] Voice messages

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Arjun** - [@Arjunnn2004](https://github.com/Arjunnn2004)

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) for the amazing library
- [Firebase Team](https://firebase.google.com/) for authentication services
- [Vite Team](https://vitejs.dev/) for the lightning-fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

⭐ **Star this repository if you found it helpful!**
