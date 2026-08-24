import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-bg)] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl brutal-border shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-[#EA580C] animate-spin mb-4" strokeWidth={3} />
          <h2 className="text-2xl font-black uppercase text-black">Authenticating Hunter...</h2>
          <p className="text-sm font-bold text-gray-500 mt-1">Verifying campus security clearance</p>
        </div>
      </div>
    );
  }

  // If no user is logged in -> Redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated -> Allow access to protected routes
  return <>{children}</>;
};

export default ProtectedRoute;
