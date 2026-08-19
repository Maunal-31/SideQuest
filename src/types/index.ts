export type QuestCategory = 'Code/Debugging' | 'Hardware/Lab Tools' | 'Design/Poster' | 'Printing/Notes' | 'Quick Favors';
export type QuestStatus = 'Open' | 'In Progress' | 'Submitted' | 'Verified & Released';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  location: Location;
  reward: {
    type: 'XP' | 'Coins' | 'Rupees' | 'Coffee';
    amount: number;
  };
  timeLimit: string; // e.g., '2 hours'
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  poster: {
    id: string;
    name: string;
    level: number;
    badge: string;
    avatar: string;
  };
  status: QuestStatus;
  createdAt: string;
  requiredSkills: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  avatar: string;
  rank: number;
  guildRank: string;
  activeQuests: string[];
  postedQuests: string[];
  completedQuests: number;
}
