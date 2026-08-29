import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { createUserProfile } from '../services/userService';
import { Shield, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, { displayName: name });

      // 3. Automatically create User Profile document in Firestore users collection
      await createUserProfile(user, { name });

      // 4. Keep user logged in & redirect directly to main Dashboard
      toast.success(`Welcome to SideQuest, ${name}! 🚀`);
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Choose at least 6 characters.';
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await createUserProfile(result.user);
      }
      toast.success(`Welcome to SideQuest, ${result.user.displayName || 'Hunter'}! 🚀`);
      navigate('/');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex items-center justify-center p-4 pt-20">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 brutal-border shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
        
        {/* Animated Pixel Star Compass Logo Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4 group cursor-pointer">
            {/* Pulsating Radial Glow */}
            <div className="absolute inset-0 bg-[#EAB308]/40 rounded-3xl blur-lg animate-pulse"></div>
            
            <img 
              src="/side_quest_logo.png" 
              alt="SideQuest Pixel Compass Star Logo" 
              className="w-24 h-24 relative z-10 object-contain animate-logo-float group-hover:scale-105 transition-transform duration-300" 
            />
          </div>

          <h1 className="text-3xl font-black uppercase text-black tracking-tight">Join SideQuest</h1>
          <p className="text-xs font-black text-[#0097A7] uppercase tracking-widest mt-1.5 bg-teal-50 px-3.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            LDCE Hunter Guild • Game On
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting || isSubmitting}
          type="button"
          className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-black font-black rounded-xl brutal-border brutal-shadow brutal-shadow-hover flex items-center justify-center gap-3 transition-all mb-6 uppercase text-sm"
        >
          {isGoogleSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign up with Google
            </>
          )}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-1 bg-black"></div>
          <span className="font-black text-xs uppercase text-gray-500">OR EMAIL</span>
          <div className="flex-1 h-1 bg-black"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Alex Hunter"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl py-3.5 pl-11 pr-4 font-bold text-black focus:outline-none focus:bg-[#EAB308]/20 transition-all text-sm"
              />
              <User className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Campus Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="alex@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl py-3.5 pl-11 pr-4 font-bold text-black focus:outline-none focus:bg-[#EAB308]/20 transition-all text-sm"
              />
              <Mail className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl py-3.5 pl-11 pr-4 font-bold text-black focus:outline-none focus:bg-[#EAB308]/20 transition-all text-sm"
              />
              <Lock className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" strokeWidth={2.5} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full py-4 bg-[#60A5FA] hover:bg-black hover:text-white text-black font-black uppercase tracking-wider rounded-xl transition-all brutal-border brutal-shadow brutal-shadow-hover text-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t-4 border-black text-center">
          <p className="text-sm font-bold text-black">
            Already have an account?{' '}
            <Link to="/login" className="text-[#EA580C] hover:underline font-black uppercase">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
