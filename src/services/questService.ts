import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface Quest {
  id?: string;
  title: string;
  description: string;
  category: string;
  urgency: "Low" | "Medium" | "High" | "Critical" | string;
  status: "Open" | "In Progress" | "Submitted" | "Verified & Released";
  locationName: string;
  locationZone?: string;
  lat: number;
  lng: number;
  rewardType: string;
  rewardAmount: number;
  timeLimitStr: string;
  posterId: string;
  posterName: string;
  posterLevel: number;
  hunterId: string | null;
  hunterName?: string;
  proofUrl?: string;
  proofFileName?: string;
  createdAt?: any;

  // Convenience nested properties for UI components compatibility
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
 * Strict validation for Quest Data input
 */
export const validateQuestInput = (questData: Partial<Quest>) => {
  if (!questData.title || questData.title.trim().length < 5) {
    throw new Error("Quest title must be at least 5 informative characters long.");
  }
  if (!questData.description || questData.description.trim().length < 10) {
    throw new Error("Quest description must be at least 10 characters explaining what you need.");
  }
  if (!questData.rewardAmount || isNaN(Number(questData.rewardAmount)) || Number(questData.rewardAmount) <= 0) {
    throw new Error("Bounty reward amount must be a positive number greater than 0.");
  }
  if (!questData.locationName || questData.locationName.trim().length === 0) {
    throw new Error("Please select a valid LDCE campus location zone.");
  }
};

/**
 * Strict validation for Proof URL Submission
 */
export const validateProofUrl = (url: string) => {
  if (!url || !url.trim()) {
    throw new Error("Proof link cannot be empty.");
  }
  const cleanUrl = url.trim();
  const isValidUrl = cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://");
  if (!isValidUrl || cleanUrl.length < 10) {
    throw new Error("Please provide a valid public cloud link (starting with http:// or https://).");
  }
};

/**
 * 1. Create a new Quest document in Firestore "quests" collection with strict validation
 */
export const createQuest = async (questData: Omit<Quest, "id" | "createdAt">) => {
  // Enforce strict backend validation
  validateQuestInput(questData);

  const questsRef = collection(db, "quests");
  return await addDoc(questsRef, {
    title: questData.title.trim(),
    description: questData.description.trim(),
    category: questData.category,
    urgency: questData.urgency,
    status: questData.status || "Open",
    locationName: questData.locationName || questData.locationZone || "Campus",
    lat: questData.lat,
    lng: questData.lng,
    rewardType: questData.rewardType,
    rewardAmount: Number(questData.rewardAmount) || 0,
    timeLimitStr: questData.timeLimitStr,
    posterId: questData.posterId,
    posterName: questData.posterName,
    posterLevel: Number(questData.posterLevel) || 1,
    hunterId: questData.hunterId ?? null,
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
      const locationName = data.locationName ?? data.locationZone ?? data.location?.name ?? "Campus";
      const rewardType = data.rewardType ?? data.reward?.type ?? "Coins";
      const rewardAmount = data.rewardAmount ?? data.reward?.amount ?? 0;
      const timeLimitStr = data.timeLimitStr ?? data.timeLimit ?? "2 hours";
      const posterName = data.posterName ?? data.poster?.name ?? "Anonymous Student";
      const posterLevel = data.posterLevel ?? data.poster?.level ?? 1;
      const posterId = data.posterId ?? data.poster?.id ?? "";

      return {
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        category: data.category || "Quick Favors",
        urgency: data.urgency || "Medium",
        status: data.status || "Open",
        locationName,
        locationZone: locationName,
        lat,
        lng,
        rewardType,
        rewardAmount,
        timeLimitStr,
        posterId,
        posterName,
        posterLevel,
        hunterId: data.hunterId ?? null,
        hunterName: data.hunterName,
        proofUrl: data.proofUrl,
        proofFileName: data.proofFileName,
        createdAt: data.createdAt,

        // Backwards compatibility mappings for UI components
        location: {
          lat,
          lng,
          name: locationName
        },
        reward: {
          type: rewardType,
          amount: rewardAmount
        },
        timeLimit: timeLimitStr,
        poster: {
          id: posterId,
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
export const acceptQuest = async (questId: string, hunterIdOrName: string, hunterName?: string) => {
  if (!questId) throw new Error("Quest ID is required to accept quest.");
  const questDoc = doc(db, "quests", questId);
  const actualHunterId = hunterName ? hunterIdOrName : null;
  const actualHunterName = hunterName || hunterIdOrName;

  return await updateDoc(questDoc, {
    status: "In Progress",
    hunterId: actualHunterId,
    hunterName: actualHunterName
  });
};

/**
 * 4. Convert local File to Data URL string (No paid Firebase Storage needed)
 */
export const convertFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * 5. Submit proof URL/Link directly to Firestore quest document with strict URL validation
 */
export const submitQuestProofInFirestore = async (
  questId: string,
  proofUrl: string,
  proofFileName: string
) => {
  if (!questId) throw new Error("Quest ID is required.");
  
  // Enforce strict URL validation
  validateProofUrl(proofUrl);

  const questDoc = doc(db, "quests", questId);
  return await updateDoc(questDoc, {
    status: "Submitted",
    proofUrl: proofUrl.trim(),
    proofFileName,
    submittedAt: serverTimestamp()
  });
};

/**
 * 6. Helper to update quest status in Firestore
 */
export const updateQuestStatusInFirestore = async (questId: string, status: Quest["status"]) => {
  if (!questId) throw new Error("Quest ID is required.");
  const questDoc = doc(db, "quests", questId);
  return await updateDoc(questDoc, { status });
};
