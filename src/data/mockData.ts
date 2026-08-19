import { Quest, UserProfile, Location } from '../types';

export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [[23.0305, 72.5420], [23.0375, 72.5510]];
export const CAMPUS_CENTER: [number, number] = [23.0338, 72.5464];

export const CAMPUS_ZONES: Record<string, Location> = {
  'IT Dept': { lat: 23.0345, lng: 72.5468, name: 'IT/Computer Dept' },
  'Library': { lat: 23.0335, lng: 72.5455, name: 'Central Library' },
  'Hostel': { lat: 23.0320, lng: 72.5480, name: 'Hostel Blocks' },
  'Canteen': { lat: 23.0355, lng: 72.5450, name: 'Canteen/Annexe' },
  'Lab 3': { lat: 23.0340, lng: 72.5472, name: 'Lab 3 (Electronics)' },
  'Block B': { lat: 23.0330, lng: 72.5460, name: 'Block B' },
};

export const MOCK_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Need jumper wires & breadboard',
    description: 'Stuck in Lab 3. I am short of 5 male-to-male jumper wires and a mini breadboard for my IoT project evaluation in 30 mins!',
    category: 'Hardware/Lab Tools',
    location: CAMPUS_ZONES['Lab 3'],
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
    description: 'My useEffect is triggering an infinite re-render loop and my browser is crying. Need a React expert at the IT Dept immediately.',
    category: 'Code/Debugging',
    location: CAMPUS_ZONES['IT Dept'],
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
    description: 'Forgot to print my OS assignment. Can someone print the 5-page PDF (sent via DM) and drop it to Block B Room 204?',
    category: 'Printing/Notes',
    location: CAMPUS_ZONES['Block B'],
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
    location: CAMPUS_ZONES['Library'],
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
    location: CAMPUS_ZONES['Hostel'],
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
  },
  {
    id: 'q6',
    title: 'Python Script for Data Scraping',
    description: 'Need help writing a quick BeautifulSoup script to scrape some data for my project. Sitting in Library.',
    category: 'Code/Debugging',
    location: CAMPUS_ZONES['Library'],
    reward: { type: 'XP', amount: 300 },
    timeLimit: '1 day',
    urgency: 'Low',
    poster: {
      id: 'u7',
      name: 'Vikas Singh',
      level: 10,
      badge: 'Data Miner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikas'
    },
    status: 'In Progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    requiredSkills: ['Python', 'Web Scraping']
  },
  {
    id: 'q7',
    title: 'Borrow Scientific Calculator',
    description: 'Have my Maths exam in 1 hour and forgot my Casio. Need to borrow one urgently at IT Dept!',
    category: 'Hardware/Lab Tools',
    location: CAMPUS_ZONES['IT Dept'],
    reward: { type: 'Coffee', amount: 1 },
    timeLimit: '1 hour',
    urgency: 'Critical',
    poster: {
      id: 'u8',
      name: 'Sneha Desai',
      level: 4,
      badge: 'Forgetful',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha'
    },
    status: 'Open',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    requiredSkills: ['Calculator']
  },
  {
    id: 'q8',
    title: 'Create Poster for Tech Fest',
    description: 'Need a creative poster for the upcoming coding competition. Will be printed in A3.',
    category: 'Design/Poster',
    location: CAMPUS_ZONES['Hostel'],
    reward: { type: 'Coins', amount: 500 },
    timeLimit: '2 days',
    urgency: 'Medium',
    poster: {
      id: 'u9',
      name: 'Tech Club',
      level: 20,
      badge: 'Event Organizer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechClub'
    },
    status: 'Open',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    requiredSkills: ['Photoshop', 'Illustrator']
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
  activeQuests: ['q6'],
  postedQuests: [],
  completedQuests: 28
};
