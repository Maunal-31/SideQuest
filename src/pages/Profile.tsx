import React, { useState } from 'react';
import { useSideQuest } from '../context/SideQuestContext';
import QuestCard from '../components/QuestCard';
import { Settings, Shield, Award, Zap, Coins } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, quests } = useSideQuest();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'posted'>('active');

  const activeQuestsList = quests.filter(q => currentUser.activeQuests.includes(q.id));
  const postedQuestsList = quests.filter(q => q.poster.id === currentUser.id);

  return (
    <div className="min-h-screen pt-[88px] pb-10 px-4 md:px-8 bg-[var(--color-brand-bg)]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: User Stats */}
        <div className="md:col-span-1 space-y-8">
          
          <div className="bg-[#60A5FA] rounded-2xl p-6 text-center relative brutal-border brutal-shadow">
            
            <button className="absolute top-4 right-4 z-10 p-2 text-black bg-white brutal-border brutal-shadow-sm hover:translate-y-1 hover:shadow-none transition-all rounded-full">
              <Settings className="w-5 h-5" strokeWidth={3} />
            </button>

            <div className="relative z-10 flex flex-col items-center pt-8">
              <div className="relative mb-4 group">
                <img src={currentUser.avatar} alt="Profile" className="w-28 h-28 rounded-full brutal-border bg-white brutal-shadow group-hover:-translate-y-2 transition-transform" />
                <div className="absolute -bottom-2 -right-2 bg-[#EAB308] text-black text-sm font-black px-3 py-1 rounded-full brutal-border brutal-shadow-sm">
                  Lvl {currentUser.level}
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-black mb-1 uppercase bg-white px-2 py-1 rounded brutal-border">{currentUser.name}</h2>
              <p className="text-black bg-[#C084FC] px-3 py-1 rounded-md brutal-border brutal-shadow-sm text-sm font-black uppercase mt-2 mb-6">{currentUser.guildRank}</p>

              <div className="w-full bg-white rounded-xl h-6 mb-2 brutal-border overflow-hidden relative">
                <div 
                  className="bg-[#16A34A] h-full transition-all duration-1000 border-r-2 border-black" 
                  style={{ width: `${(currentUser.xp / currentUser.nextLevelXp) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-black mix-blend-difference text-white">
                  {currentUser.xp} / {currentUser.nextLevelXp} XP
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="bg-white brutal-border brutal-shadow-sm rounded-xl p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <Coins className="w-8 h-8 text-[#EAB308] fill-[#EAB308] mb-2" strokeWidth={2} />
                  <span className="text-2xl font-black text-black leading-none mb-1">{currentUser.coins}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Coins</span>
                </div>
                <div className="bg-white brutal-border brutal-shadow-sm rounded-xl p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer">
                  <Shield className="w-8 h-8 text-[#16A34A] fill-[#16A34A] mb-2" strokeWidth={2} />
                  <span className="text-2xl font-black text-black leading-none mb-1">{currentUser.completedQuests}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Completed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white brutal-border brutal-shadow rounded-2xl p-6">
            <h3 className="text-xl uppercase tracking-wider text-black font-black mb-6 flex items-center gap-2 border-b-4 border-black pb-2">
              <Award className="w-6 h-6 fill-[#EAB308]" strokeWidth={2} /> Badges
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#F472B6] p-3 rounded-xl brutal-border brutal-shadow-sm hover:translate-x-1 transition-transform cursor-default">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center brutal-border">
                  <Zap className="w-6 h-6 text-black fill-yellow-400" />
                </div>
                <div>
                  <p className="font-black text-lg text-black uppercase">First Blood</p>
                  <p className="text-xs text-black font-medium">Completed first bounty</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#C084FC] p-3 rounded-xl brutal-border brutal-shadow-sm hover:translate-x-1 transition-transform cursor-default">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center brutal-border">
                  <Award className="w-6 h-6 text-black fill-blue-400" />
                </div>
                <div>
                  <p className="font-black text-lg text-black uppercase">Hardware Guru</p>
                  <p className="text-xs text-black font-medium">10 hardware bounties</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quests */}
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
              History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {activeTab === 'active' && (
              activeQuestsList.length > 0 ? (
                activeQuestsList.map(quest => (
                  <QuestCard key={quest.id} quest={quest} onClick={() => {}} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-black bg-white rounded-2xl brutal-border brutal-shadow">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" strokeWidth={2} />
                  <p className="text-2xl font-black uppercase mb-2">No Active Quests</p>
                  <p className="font-bold text-gray-500">Check the radar to find bounties to hunt!</p>
                </div>
              )
            )}
            
            {activeTab === 'posted' && (
              postedQuestsList.length > 0 ? (
                postedQuestsList.map(quest => (
                  <QuestCard key={quest.id} quest={quest} onClick={() => {}} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-black bg-white rounded-2xl brutal-border brutal-shadow">
                  <p className="text-2xl font-black uppercase mb-2">No Posted Quests</p>
                </div>
              )
            )}

            {activeTab === 'completed' && (
               <div className="col-span-full text-center py-20 text-black bg-white rounded-2xl brutal-border brutal-shadow">
                 <p className="text-2xl font-black uppercase mb-2">History Empty</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
