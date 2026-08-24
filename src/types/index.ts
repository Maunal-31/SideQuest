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
  category: QuestCategory | string;
  location?: Location;
  locationName?: string;
  locationZone?: string;
  lat?: number;
  lng?: number;
  reward?: {
    type: 'XP' | 'Coins' | 'Rupees' | 'Coffee' | string;
    amount: number;
  };
  rewardType?: string;
  rewardAmount?: number;
  timeLimit?: string;
  timeLimitStr?: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  poster?: {
    id: string;
    name: string;
    level: number;
    badge?: string;
    avatar?: string;
  };
  posterId?: string;
  posterName?: string;
  posterLevel?: number;
  hunterId?: string | null;
  hunterName?: string;
  status: QuestStatus;
  createdAt?: any;
  requiredSkills?: string[];
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
