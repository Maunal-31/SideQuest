import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quest, UserProfile } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { subscribeToQuests, acceptQuest as acceptQuestService, updateQuestStatusInFirestore } from '../services/questService';

export interface LocationTarget {
  lat: number;
  lng: number;
  name?: string;
}

interface SideQuestContextType {
  quests: Quest[];
  currentUser: UserProfile;
  addQuest: (quest: Quest) => void;
  updateQuestStatus: (id: string, status: Quest['status']) => void;
  acceptQuest: (id: string, hunterIdOrName: string, hunterName?: string) => Promise<void>;
  activeMapPin: string | null;
  setActiveMapPin: (id: string | null) => void;
  flyToLocation: LocationTarget | null;
  setFlyToLocation: (loc: LocationTarget | null) => void;
}

const SideQuestContext = createContext<SideQuestContextType | undefined>(undefined);

export const SideQuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [currentUser] = useState<UserProfile>(CURRENT_USER);
  const [activeMapPin, setActiveMapPin] = useState<string | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<LocationTarget | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuests((liveQuests) => {
      setQuests(liveQuests as any);
    });
    return () => unsubscribe();
  }, []);

  const addQuest = (quest: Quest) => {
    setQuests([quest, ...quests]);
  };

  const updateQuestStatus = (id: string, status: Quest['status']) => {
    setQuests(quests.map(q => q.id === id ? { ...q, status } : q));
    updateQuestStatusInFirestore(id, status).catch(console.error);
  };

  const acceptQuest = async (id: string, hunterIdOrName: string, hunterName?: string) => {
    await acceptQuestService(id, hunterIdOrName, hunterName);
  };

  return (
    <SideQuestContext.Provider value={{
      quests,
      currentUser,
      addQuest,
      updateQuestStatus,
      acceptQuest,
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
