import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface Quest {
  id?: string;
  title: string;
  category: string;
  locationZone: string;
  lat: number;
  lng: number;
  rewardType: string;
  rewardAmount: number;
  urgency: "Low" | "Medium" | "High" | "Critical";
  timeLimitStr: string;
  description: string;
  status: "Open" | "In Progress" | "Submitted" | "Verified & Released";
  posterName: string;
  posterLevel: number;
  createdAt?: any;
  hunterName?: string;

  // Nested convenience properties for UI components compatibility
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  reward?: {
    type: string;
    amount: number;
  };
  timeLimit?: string;
  poster?: {
    id?: string;
    name: string;
    level: number;
    badge?: string;
    avatar?: string;
  };
  requiredSkills?: string[];
}

/**
 * 1. Create a new Quest document in Firestore "quests" collection
 */
export const createQuest = async (questData: Omit<Quest, "id" | "createdAt">) => {
  const questsRef = collection(db, "quests");
  return await addDoc(questsRef, {
    ...questData,
    status: questData.status || "Open",
    createdAt: serverTimestamp()
  });
};

/**
 * 2. Real-time listener for Quests collection ordered by createdAt desc
 */
export const subscribeToQuests = (callback: (quests: Quest[]) => void) => {
  const questsRef = collection(db, "quests");
  const q = query(questsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const quests: Quest[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const lat = data.lat ?? data.location?.lat ?? 23.0338;
      const lng = data.lng ?? data.location?.lng ?? 72.5464;
      const locationZone = data.locationZone ?? data.location?.name ?? "Campus";
      const rewardType = data.rewardType ?? data.reward?.type ?? "Coins";
      const rewardAmount = data.rewardAmount ?? data.reward?.amount ?? 0;
      const timeLimitStr = data.timeLimitStr ?? data.timeLimit ?? "2 hours";
      const posterName = data.posterName ?? data.poster?.name ?? "Anonymous Student";
      const posterLevel = data.posterLevel ?? data.poster?.level ?? 1;

      return {
        id: docSnap.id,
        title: data.title || "",
        category: data.category || "Quick Favors",
        locationZone,
        lat,
        lng,
        rewardType,
        rewardAmount,
        urgency: data.urgency || "Medium",
        timeLimitStr,
        description: data.description || "",
        status: data.status || "Open",
        posterName,
        posterLevel,
        createdAt: data.createdAt,
        hunterName: data.hunterName,

        // Backwards compatibility mappings for UI components
        location: {
          lat,
          lng,
          name: locationZone
        },
        reward: {
          type: rewardType,
          amount: rewardAmount
        },
        timeLimit: timeLimitStr,
        poster: {
          id: data.poster?.id || "u0",
          name: posterName,
          level: posterLevel,
          badge: data.poster?.badge || "Student",
          avatar: data.poster?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(posterName)}`
        },
        requiredSkills: data.requiredSkills || []
      };
    });
    callback(quests);
  });
};

/**
 * 3. Accept a quest document in Firestore
 */
export const acceptQuest = async (questId: string, hunterName: string) => {
  const questDoc = doc(db, "quests", questId);
  return await updateDoc(questDoc, {
    status: "In Progress",
    hunterName: hunterName
  });
};

/**
 * 4. Helper to update quest status in Firestore
 */
export const updateQuestStatusInFirestore = async (questId: string, status: Quest["status"]) => {
  const questDoc = doc(db, "quests", questId);
  return await updateDoc(questDoc, { status });
};
