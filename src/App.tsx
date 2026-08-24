import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostQuestModal from './components/PostQuestModal';
import ProtectedRoute from './components/ProtectedRoute';
import { SideQuestProvider } from './context/SideQuestContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setShowPostModal(true);
    document.addEventListener('open-post-modal', handleOpenModal);
    return () => document.removeEventListener('open-post-modal', handleOpenModal);
  }, []);

  return (
    <>
      <div className="min-h-screen text-black font-sans selection:bg-[#EAB308]/30 bg-[var(--color-brand-bg)]">
        <Navbar />
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (Require Authentication) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      
      {showPostModal && (
        <PostQuestModal onClose={() => setShowPostModal(false)} />
      )}
      
      <ToastContainer 
        position="bottom-right"
        theme="light"
        toastClassName="bg-white border-2 border-black rounded-xl brutal-shadow-sm font-bold text-black"
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SideQuestProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SideQuestProvider>
    </AuthProvider>
  );
}

export default App;
