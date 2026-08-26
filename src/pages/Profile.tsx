import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSideQuest } from '../context/SideQuestContext';
import QuestCard from '../components/QuestCard';
import QuestModal from '../components/QuestModal';
import Settings from './Settings';
import AnimatedEmptyState from '../components/AnimatedEmptyState';
import { Settings as SettingsIcon, Shield, Award, Zap, Coins, Building, MapPin } from 'lucide-react';
import { Quest } from '../types';

const Profile: React.FC = () => {
  const { currentUser: authUser, userProfile } = useAuth();
  const { quests } = useSideQuest();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'posted'>('active');
  const [selectedQuestModal, setSelectedQuestModal] = useState<Quest | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const userId = authUser?.uid || '';
  const userName = userProfile?.name || authUser?.displayName || authUser?.email?.split('@')[0] || 'Hunter';
  const userLevel = userProfile?.level ?? 1;
  const userXp = userProfile?.xp ?? 0;
  const nextLevelXp = userLevel * 500;
  const userCoins = userProfile?.coins ?? 1000;
  const guildRank = userProfile?.guildRank || 'Bronze I';
  const completedCount = userProfile?.completedQuestsCount ?? 0;
  const avatarUrl =
    userProfile?.avatarUrl ||
    authUser?.photoURL ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;

  // Badges stored in user profile or fallback defaults
  const userBadges =
    userProfile?.badges && userProfile.badges.length > 0
      ? userProfile.badges
      : ['First Blood', 'Campus Hunter'];

  // 1. Posted Quests: where posterId matches current user's UID
  const postedQuestsList = quests.filter(
    (q) => q.posterId === userId || (q.poster && q.poster.id === userId)
  );

  // 2. Active Quests: where hunterId matches current user's UID and status is 'In Progress' or 'Submitted'
  const activeQuestsList = quests.filter(
    (q) =>
      (q.hunterId === userId || q.hunterName === userName) &&
      (q.status === 'In Progress' || q.status === 'Submitted')
  );

  // 3. History (Completed) Quests: status is 'Verified & Released' where user is hunter or poster
  const completedQuestsList = quests.filter(
    (q) =>
      q.status === 'Verified & Released' &&
      (q.hunterId === userId || q.hunterName === userName || q.posterId === userId)
  );

  return (
    <div className="min-h-screen pt-[88px] pb-10 px-4 md:px-8 bg-[var(--color-brand-bg)]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Real User Profile Stats & Badges Showcase */}
        <div className="md:col-span-1 space-y-8">
          
          {/* User Card */}
          <div className="bg-[#60A5FA] rounded-2xl p-6 text-center relative brutal-border brutal-shadow">
            
            {/* Gear Icon to open Settings - z-30 ensures clickability above sibling containers */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSettingsModal(true);
              }}
              title="Open Settings"
              className="absolute top-4 right-4 z-30 p-2.5 text-black bg-white brutal-border brutal-shadow-sm hover:translate-y-1 hover:shadow-none transition-all rounded-full cursor-pointer pointer-events-auto"
            >
              <SettingsIcon className="w-5 h-5 text-black" strokeWidth={3} />
            </button>

            <div className="relative flex flex-col items-center pt-8">
              <div className="relative mb-4 group">
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-full brutal-border bg-white brutal-shadow group-hover:-translate-y-2 transition-transform object-cover" 
                />
                <div className="absolute -bottom-2 -right-2 bg-[#EAB308] text-black text-sm font-black px-3 py-1 rounded-full brutal-border brutal-shadow-sm">
                  Lvl {userLevel}
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-black mb-1 uppercase bg-white px-3 py-1 rounded brutal-border">
                {userName}
              </h2>
              
              <p className="text-black bg-[#C084FC] px-3 py-1 rounded-md brutal-border brutal-shadow-sm text-sm font-black uppercase mt-2 mb-2">
                {guildRank}
              </p>

              {/* Department Tag & Default Zone Tag (Clickable to open Settings) */}
              <div className="flex flex-col gap-1.5 items-center mb-4">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(true)}
                  title="Click to edit department in settings"
                  className="text-[11px] font-black uppercase bg-white hover:bg-black hover:text-white text-black px-2.5 py-1 rounded brutal-border flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5 text-[#EA580C]" strokeWidth={3} />
                  {userProfile?.department || "Set your department in settings"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowSettingsModal(true)}
                  title="Click to edit zone in settings"
                  className="text-[10px] font-bold text-black/90 bg-yellow-200 hover:bg-black hover:text-white px-2.5 py-1 rounded border border-black flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" strokeWidth={3} />
                  {userProfile?.defaultZone || "Set your zone"}
                </button>
              </div>

              {/* XP Progress Bar */}
              <div className="w-full bg-white rounded-xl h-6 mb-2 brutal-border overflow-hidden relative">
                <div 
                  className="bg-[#16A34A] h-full transition-all duration-1000 border-r-2 border-black" 
                  style={{ width: `${Math.min(100, Math.max(5, (userXp / nextLevelXp) * 100))}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-black mix-blend-difference text-white">
                  {userXp} / {nextLevelXp} XP
                </div>
              </div>

              {/* Coins & Completed Stats */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="bg-white brutal-border brutal-shadow-sm rounded-xl p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <Coins className="w-8 h-8 text-[#EAB308] fill-[#EAB308] mb-2" strokeWidth={2} />
                  <span className="text-2xl font-black text-black leading-none mb-1">{userCoins}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Coins</span>
                </div>
                <div className="bg-white brutal-border brutal-shadow-sm rounded-xl p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <Shield className="w-8 h-8 text-[#16A34A] fill-[#16A34A] mb-2" strokeWidth={2} />
                  <span className="text-2xl font-black text-black leading-none mb-1">{completedCount || completedQuestsList.length}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Showcase Section */}
          <div className="bg-white brutal-border brutal-shadow rounded-2xl p-6">
            <h3 className="text-xl uppercase tracking-wider text-black font-black mb-6 flex items-center gap-2 border-b-4 border-black pb-2">
              <Award className="w-6 h-6 fill-[#EAB308]" strokeWidth={2} /> Badges Showcase
            </h3>
            <div className="space-y-4">
              {userBadges.map((badgeName, idx) => {
                const bgColors = ['bg-[#F472B6]', 'bg-[#C084FC]', 'bg-[#60A5FA]', 'bg-[#EAB308]'];
                const colorClass = bgColors[idx % bgColors.length];

                return (
                  <div 
                    key={badgeName} 
                    className={`flex items-center gap-4 ${colorClass} p-3 rounded-xl brutal-border brutal-shadow-sm hover:translate-x-1 transition-transform cursor-default`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center brutal-border">
                      {idx % 2 === 0 ? (
                        <Zap className="w-6 h-6 text-black fill-yellow-400" />
                      ) : (
                        <Award className="w-6 h-6 text-black fill-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-lg text-black uppercase">{badgeName}</p>
                      <p className="text-xs text-black font-medium">Earned by solving campus bounties</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Quests Tabs */}
        <div className="md:col-span-2">
          <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl brutal-border brutal-shadow">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 text-sm font-black uppercase rounded-xl transition-all brutal-border ${activeTab === 'active' ? 'bg-black text-white brutal-shadow-sm' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
            >
              Active ({activeQuestsList.length})
            </button>
            <button 
              onClick={() => setActiveTab('posted')}
              className={`flex-1 py-3 text-sm font-black uppercase rounded-xl transition-all brutal-border ${activeTab === 'posted' ? 'bg-black text-white brutal-shadow-sm' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
            >
              Posted ({postedQuestsList.length})
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 text-sm font-black uppercase rounded-xl transition-all brutal-border ${activeTab === 'completed' ? 'bg-black text-white brutal-shadow-sm' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
            >
              History ({completedQuestsList.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {activeTab === 'active' && (
              activeQuestsList.length > 0 ? (
                activeQuestsList.map(quest => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onClick={() => setSelectedQuestModal(quest)} 
                  />
                ))
              ) : (
                <AnimatedEmptyState 
                  title="No Active Quests" 
                  subtitle="Check the radar to find bounties to hunt!" 
                />
              )
            )}
            
            {activeTab === 'posted' && (
              postedQuestsList.length > 0 ? (
                postedQuestsList.map(quest => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onClick={() => setSelectedQuestModal(quest)} 
                  />
                ))
              ) : (
                <AnimatedEmptyState 
                  title="No Posted Quests" 
                  subtitle="Post a new bounty using the + button or navbar!" 
                />
              )
            )}

            {activeTab === 'completed' && (
              completedQuestsList.length > 0 ? (
                completedQuestsList.map(quest => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onClick={() => setSelectedQuestModal(quest)} 
                  />
                ))
              ) : (
                <AnimatedEmptyState 
                  title="History Empty!" 
                  subtitle="Completed bounties will show up here once verified." 
                />
              )
            )}
          </div>
        </div>

      </div>

      {/* Quest Details Modal */}
      {selectedQuestModal && (
        <QuestModal 
          quest={selectedQuestModal} 
          onClose={() => setSelectedQuestModal(null)} 
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <Settings 
          isModal={true} 
          onClose={() => setShowSettingsModal(false)} 
        />
      )}
    </div>
  );
};

export default Profile;
