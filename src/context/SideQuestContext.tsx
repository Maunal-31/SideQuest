import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quest, UserProfile } from '../types';
import { MOCK_QUESTS, CURRENT_USER } from '../data/mockData';

interface SideQuestContextType {
  quests: Quest[];
  currentUser: UserProfile;
  addQuest: (quest: Quest) => void;
  updateQuestStatus: (id: string, status: Quest['status']) => void;
  activeMapPin: string | null;
  setActiveMapPin: (id: string | null) => void;
  flyToLocation: { lat: number; lng: number } | null;
  setFlyToLocation: (loc: { lat: number; lng: number } | null) => void;
}

const SideQuestContext = createContext<SideQuestContextType | undefined>(undefined);

export const SideQuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>(MOCK_QUESTS);
  const [currentUser] = useState<UserProfile>(CURRENT_USER);
  const [activeMapPin, setActiveMapPin] = useState<string | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<{ lat: number; lng: number } | null>(null);

  const addQuest = (quest: Quest) => {
    setQuests([quest, ...quests]);
  };

  const updateQuestStatus = (id: string, status: Quest['status']) => {
    setQuests(quests.map(q => q.id === id ? { ...q, status } : q));
  };

  return (
    <SideQuestContext.Provider value={{
      quests,
      currentUser,
      addQuest,
      updateQuestStatus,
      activeMapPin,
      setActiveMapPin,
      flyToLocation,
      setFlyToLocation
    }}>
      {children}
    </SideQuestContext.Provider>
  );
};

export const useSideQuest = () => {
  const context = useContext(SideQuestContext);
  if (context === undefined) {
    throw new Error('useSideQuest must be used within a SideQuestProvider');
  }
  return context;
};
