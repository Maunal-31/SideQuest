import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostQuestModal from './components/PostQuestModal';
import ProtectedRoute from './components/ProtectedRoute';
import { SideQuestProvider } from './context/SideQuestContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startFrogTutorial } from './utils/useOnboarding';

function AppContent() {
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenFrogTour');
    if (!hasSeenTutorial) {
      setTimeout(() => {
        startFrogTutorial();
        localStorage.setItem('hasSeenFrogTour', 'true');
      }, 500);
    }
  }, []);

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
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {showPostModal && (
        <PostQuestModal onClose={() => setShowPostModal(false)} />
      )}

      {/* Persistent Replay Tour FAB */}
      <button
        onClick={startFrogTutorial}
        className="fixed z-[5000] bottom-[20px] right-[20px] w-16 h-16 bg-[#C084FC] rounded-full brutal-border brutal-shadow hover:scale-110 hover:-translate-y-1 transition-transform flex items-center justify-center group"
      >
        {/* Tooltip */}
        <div className="absolute right-[110%] bg-black text-white px-3 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none brutal-border">
          Replay Tour
          {/* Tooltip Arrow */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-black rotate-45"></div>
        </div>
        <img src="/bot-wave.png" alt="Replay Tour" className="w-14 h-14 object-cover rounded-full" />
      </button>

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
