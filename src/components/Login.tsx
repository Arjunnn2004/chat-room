import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link, useNavigate } from "react-router";
import { useAuth } from '../contexts/AuthContext';
import { createUserProfile } from '../lib/userService';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/chat/1");
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Create/update user profile
      await createUserProfile(userCredential.user);
      navigate("/chat/1");
    } catch (firebaseError: unknown) {
      const errorMessage = firebaseError instanceof Error ? firebaseError.message : 'An error occurred';
      setError(errorMessage);
      console.error("Login error:", firebaseError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
          <input 
            type='email' 
            id='email' 
            className='w-full p-2 border border-gray-300 rounded' 
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
          <input 
            type='password' 
            id='password' 
            className='w-full p-2 border border-gray-300 rounded' 
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type='submit' 
          className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50'
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className='mt-4 text-sm text-center'>
          Don't have an account? <Link to='/register' className='text-blue-500 hover:underline'>Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login;