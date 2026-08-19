import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Trophy, User, Crosshair } from 'lucide-react';
import { useSideQuest } from '../context/SideQuestContext';

const Navbar: React.FC = () => {
  const { currentUser } = useSideQuest();

  return (
    <nav className="fixed top-0 w-full z-40 px-4 md:px-8 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-2 brutal-card px-4 py-2 bg-[#EAB308] rotate-[-2deg] hover:rotate-0 transition-transform">
          <Sparkles className="w-6 h-6 text-black fill-white" />
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase">
            SideQuest
          </h1>
        </div>

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
            <User className="w-4 h-4" /> <span className="hidden md:inline">Profile</span>
          </NavLink>
        </div>

        {/* User Info & Post Action */}
        <div className="flex items-center gap-3">
          {/* We'll pass a custom event or just let Dashboard handle the modal, 
              but since Navbar is global, we can use a custom event or just style it. 
              Let's add a button here that triggers a document event for the modal. */}
          <button 
            onClick={() => document.dispatchEvent(new CustomEvent('open-post-modal'))}
            className="hidden md:flex items-center gap-2 bg-[#C084FC] hover:bg-black hover:text-white text-black px-4 py-2 rounded-xl brutal-border brutal-shadow-sm brutal-shadow-hover transition-all font-black uppercase text-sm rotate-1"
          >
            <Sparkles className="w-4 h-4" /> Post Task
          </button>
          
          <div className="flex items-center gap-4 brutal-card px-3 py-1.5 bg-white rotate-[1deg] hover:rotate-0 transition-transform">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-black">{currentUser.name}</span>
              <span className="text-xs text-[#EA580C] font-black">{currentUser.coins} Coins</span>
            </div>
            <div className="relative">
              <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-black bg-[#60A5FA]" />
              <div className="absolute -bottom-1 -right-1 bg-[#F472B6] w-4 h-4 rounded-full border border-black z-10 animate-pulse"></div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
