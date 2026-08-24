import React, { useState } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, LogOut, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const VerifyEmail: React.FC = () => {
  const { currentUser, reloadUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success('Verification email sent! Please check your inbox & spam folder.', { autoClose: 5000 });
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many email requests. Please wait a few minutes before trying again.');
      } else {
        toast.error('Failed to send verification email. Please try again later.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      await reloadUser();
      if (auth.currentUser?.emailVerified) {
        toast.success('Email verified successfully! Access granted. 🚀');
        window.location.reload();
      } else {
        toast.info('Email not verified yet. Please click the link in your email and click refresh.', { autoClose: 4000 });
      }
    } catch (error) {
      console.error('Error reloading user status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex items-center justify-center p-4 pt-20">
      <div className="bg-white w-full max-w-lg rounded-2xl p-8 brutal-border shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-center relative">
        
        {/* Banner Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-300 opacity-90 border border-black z-20 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"></div>

        <div className="w-20 h-20 bg-[#EAB308] rounded-3xl brutal-border brutal-shadow mx-auto mb-6 flex items-center justify-center mt-2">
          <Mail className="w-10 h-10 text-black" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-black uppercase text-black mb-3">Please Verify Your Email Address</h1>
        
        <div className="bg-amber-50 brutal-border p-4 rounded-xl mb-6 text-left flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" strokeWidth={3} />
          <div className="text-sm font-bold text-black leading-relaxed">
            We sent a verification link to <span className="bg-black text-white px-2 py-0.5 rounded font-mono">{currentUser?.email}</span>. Please click the link in the email to unlock your SideQuest dashboard.
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="w-full py-4 bg-[#16A34A] hover:bg-black hover:text-white text-white font-black uppercase tracking-wider rounded-xl transition-all brutal-border brutal-shadow brutal-shadow-hover text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Checking Verification Status...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                I've Verified! Refresh Status
              </>
            )}
          </button>

          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full py-3.5 bg-white hover:bg-gray-100 text-black font-black uppercase tracking-wider rounded-xl transition-all brutal-border brutal-shadow brutal-shadow-hover text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isResending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Email...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" strokeWidth={2.5} />
                Resend Verification Email
              </>
            )}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full py-3 bg-gray-100 hover:bg-red-500 hover:text-white text-black font-bold uppercase rounded-xl transition-all brutal-border text-sm flex items-center justify-center gap-2 mt-4"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            Sign Out / Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
