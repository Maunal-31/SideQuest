import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "../firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  avatarUrl: string;
  level: number;
  xp: number;
  coins: number;
  guildRank: string;
  completedQuestsCount: number;
  department?: string;
  defaultZone?: string;
  notificationsEnabled?: boolean;
  badges?: string[];
  createdAt?: any;
}

/**
 * Automatically creates a User Profile document in Firestore if it doesn't already exist.
 */
export const createUserProfile = async (
  user: User,
  additionalData?: { name?: string }
): Promise<UserProfile> => {
  if (!user || !user.uid) {
    throw new Error("Invalid user provided for profile creation.");
  }

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const name = additionalData?.name || user.displayName || "Anonymous Hunter";
    const avatarUrl =
      user.photoURL ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const newProfile: Omit<UserProfile, "uid"> = {
      email: user.email || "",
      name,
      avatarUrl,
      level: 1,
      xp: 0,
      coins: 1000,
      guildRank: "Bronze I",
      completedQuestsCount: 0,
      department: "Computer Science",
      defaultZone: "Engineering Block / Canteen",
      notificationsEnabled: true,
      badges: ["First Blood", "Campus Hunter"],
      createdAt: serverTimestamp()
    };

    await setDoc(userRef, newProfile);
    return { uid: user.uid, ...newProfile };
  }

  return { uid: docSnap.id, ...(docSnap.data() as Omit<UserProfile, "uid">) };
};

/**
 * Updates specific fields on a user's profile document in Firestore.
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  if (!uid) throw new Error("UID is required to update profile.");
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
};

/**
 * Fetches a single user profile from Firestore by UID.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...(docSnap.data() as Omit<UserProfile, "uid">) };
  }
  return null;
};

/**
 * Real-time listener for a user profile document in Firestore.
 */
export const subscribeToUserProfile = (
  uid: string,
  callback: (profile: UserProfile | null) => void
) => {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ uid: docSnap.id, ...(docSnap.data() as Omit<UserProfile, "uid">) });
    } else {
      callback(null);
    }
  });
};
