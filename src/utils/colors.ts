import { QuestCategory } from '../types';

export const getCategoryColor = (category: QuestCategory) => {
  switch (category) {
    case 'Code/Debugging': return 'bg-[#818cf8] text-black border-2 border-black brutal-shadow-sm';
    case 'Hardware/Lab Tools': return 'bg-[#fbbf24] text-black border-2 border-black brutal-shadow-sm';
    case 'Design/Poster': return 'bg-[#f472b6] text-black border-2 border-black brutal-shadow-sm';
    case 'Printing/Notes': return 'bg-[#22d3ee] text-black border-2 border-black brutal-shadow-sm';
    case 'Quick Favors': return 'bg-[#34d399] text-black border-2 border-black brutal-shadow-sm';
    default: return 'bg-[#e2e8f0] text-black border-2 border-black brutal-shadow-sm';
  }
};

export const getCategoryHex = (category: QuestCategory) => {
  switch (category) {
    case 'Code/Debugging': return '#818cf8'; 
    case 'Hardware/Lab Tools': return '#fbbf24';
    case 'Design/Poster': return '#f472b6'; 
    case 'Printing/Notes': return '#22d3ee'; 
    case 'Quick Favors': return '#34d399'; 
    default: return '#e2e8f0'; 
  }
};

export const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'Critical': return 'bg-[#f43f5e] text-white border-2 border-black brutal-shadow-sm font-black';
    case 'High': return 'bg-[#fbbf24] text-black border-2 border-black brutal-shadow-sm font-black';
    case 'Medium': return 'bg-[#60a5fa] text-black border-2 border-black brutal-shadow-sm font-black';
    case 'Low': return 'bg-[#34d399] text-black border-2 border-black brutal-shadow-sm font-black';
    default: return 'bg-[#e2e8f0] text-black border-2 border-black brutal-shadow-sm font-black';
  }
};
