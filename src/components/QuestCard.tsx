import React from 'react';
import { Quest } from '../types';
import { getCategoryColor, getUrgencyColor } from '../utils/colors';
import { Clock, Navigation, Award } from 'lucide-react';
import { useSideQuest } from '../context/SideQuestContext';

interface QuestCardProps {
  quest: Quest;
  onClick: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClick }) => {
  const { setFlyToLocation } = useSideQuest();

  const handleLocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlyToLocation({ lat: quest.location.lat, lng: quest.location.lng });
  };

  const rotations = ['rotate-[1deg]', 'rotate-[-1deg]', 'rotate-[2deg]', 'rotate-[-2deg]', 'rotate-0'];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-4 cursor-pointer hover:-translate-y-2 transition-transform brutal-border brutal-shadow ${randomRotation} flex flex-col`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`text-[10px] uppercase tracking-wider px-2 py-1 ${getCategoryColor(quest.category)}`}>
          {quest.category}
        </div>
        <div className={`text-[10px] uppercase tracking-wider px-2 py-1 ${getUrgencyColor(quest.urgency)}`}>
          {quest.urgency}
        </div>
      </div>
      
      <h3 className="text-xl font-black text-black mb-2 uppercase leading-tight hover:underline decoration-4">
        {quest.title}
      </h3>
      
      <p className="text-gray-600 text-sm font-medium line-clamp-2 mb-4 bg-gray-50 p-2 rounded brutal-border">
        {quest.description}
      </p>
      
      <div className="flex flex-col gap-2 text-xs font-bold text-black mb-4 flex-1">
        <div className="flex items-center gap-2 bg-[#60A5FA] px-2 py-1.5 rounded brutal-border brutal-shadow-sm w-fit">
          <Clock className="w-4 h-4" strokeWidth={3} />
          {quest.timeLimit}
        </div>
        <button 
          onClick={handleLocate}
          className="flex items-center gap-2 bg-[#16A34A] text-white px-2 py-1.5 rounded brutal-border brutal-shadow-sm w-fit hover:translate-x-1 transition-transform"
        >
          <Navigation className="w-4 h-4" strokeWidth={3} />
          {quest.location.name}
        </button>
      </div>

      <div className="flex items-center justify-between pt-4 mt-auto border-t-4 border-black">
        <div className="flex items-center gap-2">
          <img src={quest.poster.avatar} alt="poster" className="w-8 h-8 rounded-full border-2 border-black bg-[#C084FC]" />
          <div className="flex flex-col">
            <span className="text-xs font-black text-black leading-none">{quest.poster.name}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Lvl {quest.poster.level}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#EAB308] px-3 py-1.5 rounded-lg brutal-border brutal-shadow-sm text-black text-sm font-black uppercase">
          <Award className="w-4 h-4" strokeWidth={3} />
          {quest.reward.amount} {quest.reward.type}
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
