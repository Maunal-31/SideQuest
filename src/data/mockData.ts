import { Quest, UserProfile, Location } from '../types';

export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [[23.0200, 72.5200], [23.0500, 72.5700]];
export const CAMPUS_CENTER: [number, number] = [23.0338, 72.5445];

export const CAMPUS_ZONES: Record<string, Location> = {
  'Central Library': { lat: 23.0335, lng: 72.5445, name: 'Central Library' },
  'Hostel Blocks': { lat: 23.0320, lng: 72.5460, name: 'Hostel Blocks' },
  'Sports Complex': { lat: 23.0330, lng: 72.5470, name: 'Sports Complex' },
  'Student Section': { lat: 23.0340, lng: 72.5450, name: 'Student Section' },
  'Student Support System - NTF': { lat: 23.0342, lng: 72.5452, name: 'Student Support System - NTF' },
  'Industry Sponsored Labs': { lat: 23.0348, lng: 72.5455, name: 'Industry Sponsored Labs' },
  'Super Computing Facility': { lat: 23.0350, lng: 72.5460, name: 'Super Computing Facility' },
  'Campus Canteen': { lat: 23.0355, lng: 72.5440, name: 'Campus Canteen' },
  'Computer Engineering Dept': { lat: 23.0345, lng: 72.5450, name: 'Computer Engineering Dept' },
  'Information Technology Dept': { lat: 23.0337, lng: 72.5458, name: 'IT Dept (Annexe Building)' },
  'Annexe Building (IT Dept)': { lat: 23.0337, lng: 72.5458, name: 'Annexe Building (IT Dept)' },
  'Mechanical & Civil Block': { lat: 23.0330, lng: 72.5440, name: 'Mechanical & Civil Block' },
  'Electronics & EC Dept': { lat: 23.0340, lng: 72.5458, name: 'Electronics & EC Dept' },
  'Campus Facilities Main': { lat: 23.0338, lng: 72.5445, name: 'Campus Facilities Main' },
};

export const MOCK_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Need jumper wires & breadboard',
    description: 'Stuck in Electronics Lab. I am short of 5 male-to-male jumper wires and a mini breadboard for my IoT project evaluation in 30 mins!',
    category: 'Hardware/Lab Tools',
    location: CAMPUS_ZONES['Industry Sponsored Labs'],
    reward: { type: 'Coffee', amount: 1 },
    timeLimit: '30 mins',
    urgency: 'Critical',
    poster: {
      id: 'u2',
      name: 'Rohan Sharma',
      level: 12,
      badge: 'Hardware Wizard',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan'
    },
    status: 'Open',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    requiredSkills: ['Hardware', 'IoT']
  },
  {
    id: 'q2',
    title: 'Debug React state infinite loop',
    description: 'My useEffect is triggering an infinite re-render loop and my browser is crying. Need a React expert at the Computer Engg Dept immediately.',
    category: 'Code/Debugging',
    location: CAMPUS_ZONES['Computer Engineering Dept'],
    reward: { type: 'XP', amount: 500 },
    timeLimit: '2 hours',
    urgency: 'High',
    poster: {
      id: 'u3',
      name: 'Priya Patel',
      level: 8,
      badge: 'Frontend Novice',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
    },
    status: 'Open',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    requiredSkills: ['React', 'JavaScript', 'Debugging']
  },
  {
    id: 'q3',
    title: 'Urgent assignment printout delivery',
    description: 'Forgot to print my OS assignment. Can someone print the 5-page PDF (sent via DM) and drop it to Student Section?',
    category: 'Printing/Notes',
    location: CAMPUS_ZONES['Student Section'],
    reward: { type: 'Rupees', amount: 50 },
    timeLimit: '1 hour',
    urgency: 'Medium',
    poster: {
      id: 'u4',
      name: 'Amit Kumar',
      level: 5,
      badge: 'Procrastinator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
    },
    status: 'Open',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    requiredSkills: ['Printing']
  },
  {
    id: 'q4',
    title: 'Figma UI touchup for Hackathon',
    description: 'We are submitting our hackathon project in 4 hours but the UI looks like a potato. Need a design student to polish the colors and spacing.',
    category: 'Design/Poster',
    location: CAMPUS_ZONES['Central Library'],
    reward: { type: 'Coins', amount: 1000 },
    timeLimit: '4 hours',
    urgency: 'High',
    poster: {
      id: 'u5',
      name: 'Team Alpha',
      level: 15,
      badge: 'Hackathon Vet',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha'
    },
    status: 'Open',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    requiredSkills: ['Figma', 'UI/UX']
  },
  {
    id: 'q5',
    title: 'Bring me a sandwich from Canteen',
    description: 'Starving in the hostel but I have to finish studying for midsems. Please bring a grilled cheese sandwich.',
    category: 'Quick Favors',
    location: CAMPUS_ZONES['Hostel Blocks'],
    reward: { type: 'Rupees', amount: 80 },
    timeLimit: '45 mins',
    urgency: 'Low',
    poster: {
      id: 'u6',
      name: 'Neha Gupta',
      level: 3,
      badge: 'Hungry Soul',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha'
    },
    status: 'Open',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    requiredSkills: ['Food Delivery']
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'u1',
  name: 'Alex Hunter',
  level: 15,
  xp: 3450,
  nextLevelXp: 4000,
  coins: 1250,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  rank: 42,
  guildRank: 'Silver II',
  activeQuests: [],
  postedQuests: [],
  completedQuests: 28
};
