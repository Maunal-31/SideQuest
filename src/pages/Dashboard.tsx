import React, { useState, useEffect } from 'react';
import MapEngine from '../components/MapEngine';
import QuestCard from '../components/QuestCard';
import QuestModal from '../components/QuestModal';
import { useSideQuest } from '../context/SideQuestContext';
import { Search, Plus, Compass, Loader2 } from 'lucide-react';
import { CAMPUS_ZONES } from '../data/mockData';
import { subscribeToQuests, Quest } from '../services/questService';

const Dashboard: React.FC = () => {
  const { activeMapPin, setActiveMapPin, setFlyToLocation } = useSideQuest();
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  // Task 3: Subscribe to real-time quests from Firestore on mount
  useEffect(() => {
    const unsubscribe = subscribeToQuests((liveQuests) => {
      setQuests(liveQuests);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredQuests = quests.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeQuest = quests.find(q => q.id === activeMapPin);

  const categories = ['All', 'Code/Debugging', 'Hardware/Lab Tools', 'Design/Poster', 'Printing/Notes', 'Quick Favors'];

  const handleZoneClick = (lat: number, lng: number) => {
    setFlyToLocation({ lat, lng });
  };

  return (
    <div className="flex h-screen pt-[72px] overflow-hidden bg-[var(--color-brand-bg)]">
      
      {/* Left Sidebar (Desktop) / Bottom Sheet (Mobile) */}
      <div className={`
        flex flex-col z-20 transition-transform duration-300 ease-in-out
        w-full md:w-2/5 lg:w-[500px] bg-[var(--color-brand-bg)] border-r-4 border-black
        absolute md:relative bottom-0 h-[65vh] md:h-full rounded-t-3xl md:rounded-none shadow-[0_-10px_0_0_rgba(0,0,0,1)] md:shadow-none
        ${isSheetExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-80px)] md:translate-y-0'}
      `}>
        
        {/* Mobile Drag Handle */}
        <div 
          className="md:hidden flex justify-center py-4 cursor-pointer"
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
        >
          <div className="w-16 h-2 bg-black rounded-full"></div>
        </div>

        <div className="p-4 md:p-8 flex-1 flex flex-col overflow-hidden relative">
          
          <div className="flex items-center justify-between mb-8 hidden md:flex">
            <h2 className="text-4xl font-black text-black flex items-center gap-3 uppercase">
              <Compass className="w-10 h-10 text-[#EA580C]" strokeWidth={3} />
              Radar
            </h2>
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('open-post-modal'))}
              className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center brutal-border brutal-shadow brutal-shadow-hover"
            >
              <Plus className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="w-6 h-6 text-black absolute left-4 top-3.5" strokeWidth={3} />
            <input 
              type="text" 
              placeholder="SEARCH BOUNTIES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white brutal-border brutal-shadow rounded-xl py-4 pl-12 pr-4 text-black font-bold focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-4 mb-2 -mx-4 px-4 md:mx-0 md:px-0 pt-2">
            {categories.map((cat, idx) => {
              const bgColors = ['bg-white', 'bg-[#C084FC]', 'bg-[#F472B6]', 'bg-[#60A5FA]', 'bg-[#EAB308]', 'bg-[#16A34A]'];
              const isActive = selectedCategory === cat;
              return (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-black uppercase transition-all brutal-border brutal-shadow-sm
                    ${isActive ? 'translate-y-[2px] translate-x-[2px] shadow-none bg-black text-white' : `${bgColors[idx]} text-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]`}
                  `}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Feed */}
          <div id="tour-feed" className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2 pb-24 md:pb-8 pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-black font-bold">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-[#EA580C]" strokeWidth={3} />
                <p className="text-lg uppercase">Scanning Campus Bounties...</p>
              </div>
            ) : filteredQuests.length === 0 ? (
              <div className="text-center text-black font-bold py-10 bg-white brutal-border brutal-shadow rounded-xl">
                <p className="text-2xl mb-2">No quests found!</p>
                <p>Try adjusting your search or post a new bounty.</p>
              </div>
            ) : (
              filteredQuests.map(quest => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest} 
                  onClick={() => quest.id && setActiveMapPin(quest.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Side Map */}
      <div id="tour-map" className="flex-1 relative border-l-4 border-black md:border-l-0">
        <MapEngine quests={quests as any} />
        
        {/* Floating Quick Filters overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-3 bg-white p-3 rounded-2xl brutal-border brutal-shadow">
          <span className="font-black uppercase text-sm mr-2">Zones:</span>
          {Object.entries(CAMPUS_ZONES).map(([key, zone]) => (
            <button
              key={key}
              onClick={() => handleZoneClick(zone.lat, zone.lng)}
              className="px-3 py-1.5 bg-[#F3F1EB] hover:bg-[#EAB308] text-black text-xs font-bold uppercase rounded-md brutal-border brutal-shadow-sm transition-colors"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Mobile FAB */}
        <button 
          onClick={() => document.dispatchEvent(new CustomEvent('open-post-modal'))}
          className="md:hidden absolute bottom-28 right-6 z-10 w-16 h-16 rounded-full bg-[#16A34A] text-white flex items-center justify-center brutal-border brutal-shadow hover:scale-110 transition-transform"
        >
          <Plus className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>

      {activeQuest && (
        <QuestModal quest={activeQuest} onClose={() => setActiveMapPin(null)} />
      )}

    </div>
  );
};

export default Dashboard;
