import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, User as UserIcon, Crosshair, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
  const { currentUser: authUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Logged out successfully.');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = userProfile?.name || authUser?.displayName || authUser?.email?.split('@')[0] || 'Hunter';
  const userCoins = userProfile?.coins ?? 0;
  const avatarUrl = userProfile?.avatarUrl || authUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <nav className="fixed top-0 w-full z-40 px-4 md:px-8 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 brutal-card px-4 py-2 bg-[#EAB308]">
          <Sparkles className="w-6 h-6 text-black fill-white" />
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase">
            SideQuest
          </h1>
        </Link>

        {/* Nav Links */}
        <div className="flex bg-white p-1 rounded-xl brutal-border brutal-shadow brutal-shadow-hover">
          <NavLink 
            to="/" 
            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${isActive ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
          >
            <Crosshair className="w-4 h-4" /> <span className="hidden md:inline">Radar</span>
          </NavLink>
          <NavLink 
            to="/leaderboard" 
            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${isActive ? 'bg-[#EA580C] text-white' : 'text-black hover:bg-gray-100'}`}
          >
            <Trophy className="w-4 h-4" /> <span className="hidden md:inline">Rankings</span>
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${isActive ? 'bg-[#16A34A] text-white' : 'text-black hover:bg-gray-100'}`}
          >
            <UserIcon className="w-4 h-4" /> <span className="hidden md:inline">Profile</span>
          </NavLink>
        </div>

        {/* User Info & Post Action */}
        <div className="flex items-center gap-3">
          {authUser ? (
            <>
              <button 
                onClick={() => document.dispatchEvent(new CustomEvent('open-post-modal'))}
                className="hidden md:flex items-center gap-2 bg-[#C084FC] hover:bg-black hover:text-white text-black px-4 py-2 rounded-xl brutal-border brutal-shadow-sm brutal-shadow-hover transition-all font-black uppercase text-sm"
              >
                <Sparkles className="w-4 h-4" /> Post Task
              </button>
              
              <div className="flex items-center gap-3 brutal-card px-3 py-1.5 bg-white">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-black">{displayName}</span>
                  <span className="text-xs text-[#EA580C] font-black">{userCoins} Coins</span>
                </div>
                <div className="relative">
                  <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-black bg-[#60A5FA] object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-[#16A34A] w-4 h-4 rounded-full border border-black z-10"></div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 bg-red-100 hover:bg-red-500 hover:text-white text-black rounded-lg brutal-border transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login"
                className="px-4 py-2 bg-white hover:bg-black hover:text-white text-black font-black uppercase text-sm rounded-xl brutal-border brutal-shadow-sm transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="hidden sm:flex px-4 py-2 bg-[#16A34A] text-white hover:bg-black font-black uppercase text-sm rounded-xl brutal-border brutal-shadow-sm transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
