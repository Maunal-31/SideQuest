import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import PostQuestModal from './components/PostQuestModal';
import { SideQuestProvider } from './context/SideQuestContext';
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
      <div className="min-h-screen text-black font-sans selection:bg-[#EAB308]/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
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
    <SideQuestProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SideQuestProvider>
  );
}

export default App;
