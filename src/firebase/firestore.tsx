import { db } from "./firebaseconfig";
import { collection, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { User } from "firebase/auth"; // Import Firebase's User type

// Define Firestore user structure
export interface FirestoreUser {
  email: string;
  name: string;
  photoURL: string;
  uid: string;
  isAdmin: boolean;
  createdAt: string;
}

/**
 * Fetches the user from Firestore or creates a new one if they don't exist.
 * @param {User} user - The authenticated user object from Firebase Auth.
 * @returns {Promise<FirestoreUser | null>} - The Firestore user document data.
 */
export const getUser = async (user: User | null): Promise<FirestoreUser | null> => {
  if (!user || !user.email) return null;

  const userRef = doc(db, "Users", user.email); // Use email as document ID
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as FirestoreUser;
  } else {
    const newUser: FirestoreUser = {
      email: user.email,
      name: user.displayName || "Unknown",
      photoURL: user.photoURL || "",
      uid: user.uid,
      isAdmin: false, // Default new users to not be admins
      createdAt: new Date().toISOString(),
    };

    await setDoc(userRef, newUser); // Set the document with email as ID
    return newUser;
  }
};

// Define the Game data structure
export interface Game {
  id: string; // Firestore document ID
  name: string;
  cafe: string;
  location: string;
  category: string;
  age: string;
  players: string;
  playtime: string;
  imgurl: string;
  likedBy?: string[]; // List of user IDs who liked this game
}

/**
 * Fetches all games from the "Games" collection in Firestore.
 * @returns {Promise<Game[]>} - Array of games.
 */
export const getGames = async (): Promise<Game[]> => {
  const gamesCollection = collection(db, "Games");
  const gamesSnapshot = await getDocs(gamesCollection);

  const games: Game[] = gamesSnapshot.docs.map((doc) => {
    const gameData = doc.data();
    return {
      id: doc.id, // Explicitly setting the ID
      name: gameData.name || "",
      cafe: gameData.cafe || "",
      location: gameData.location || "",
      category: gameData.category || "",
      age: gameData.age || "",
      players: gameData.players || "",
      playtime: gameData.playtime || "",
      imgurl: gameData.imgurl || "",
      likedBy: gameData.likedBy || [],
    };
  }); // Debugging output
  return games;
};

/**
 * Fetches a single game from Firestore by its ID.
 * @param {string} gameId - The ID of the game to fetch.
 * @returns {Promise<Game | null>} - The game data or null if not found.
 */
export const getGameById = async (gameId: string): Promise<Game | null> => {
  const gameRef = doc(db, "Games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    return null;
  }

  const gameData = gameSnap.data();
  return {
    id: gameSnap.id,
    name: gameData.name || "",
    cafe: gameData.cafe || "",
    location: gameData.location || "",
    category: gameData.category || "",
    age: gameData.age || "",
    players: gameData.players || "",
    playtime: gameData.playtime || "",
    imgurl: gameData.imgurl || "",
    likedBy: gameData.likedBy || [],
  };
};



/**
 * Creates a new game in Firestore with an auto-generated ID.
 * @param {Omit<Game, "id">} game - The game object without an ID.
 * @returns {Promise<string>} - The generated document ID.
 */
export const createGame = async (game: Omit<Game, "id">): Promise<string> => {
  const gamesCollection = collection(db, "Games");
  const docRef = await addDoc(gamesCollection, game); // Firestore auto-generates ID
  return docRef.id;
};

/**
 * Updates an existing game in Firestore.
 * @param {string} gameId - The ID of the game to update.
 * @param {Partial<Game>} updatedData - The fields to update.
 * @returns {Promise<void>}
 */
export const updateGame = async (gameId: string, updatedData: Partial<Game>): Promise<void> => {
  const gameRef = doc(db, "Games", gameId);
  await setDoc(gameRef, updatedData, { merge: true }); // Merge keeps existing fields
};

/**
 * Deletes a game from Firestore.
 * @param {string} gameId - The ID of the game to delete.
 * @returns {Promise<void>}
 */
export const deleteGame = async (gameId: string): Promise<void> => {
  const gameRef = doc(db, "Games", gameId);
  await deleteDoc(gameRef);
};

/**
 * Adds a game to the user's favorites by updating the game's `likedBy` list.
 * @param {string} gameId - The ID of the game to like.
 * @param {string} userId - The ID of the user liking the game.
 * @returns {Promise<void>}
 */
export const addToFavorites = async (gameId: string, userId: string): Promise<void> => {
  const gameRef = doc(db, "Games", gameId);
  await updateDoc(gameRef, {
    likedBy: arrayUnion(userId),
  });
};

/**
 * Removes a game from the user's favorites by updating the game's `likedBy` list.
 * @param {string} gameId - The ID of the game to unlike.
 * @param {string} userId - The ID of the user unliking the game.
 * @returns {Promise<void>}
 */
export const removeFromFavorites = async (gameId: string, userId: string): Promise<void> => {
  const gameRef = doc(db, "Games", gameId);
  await updateDoc(gameRef, {
    likedBy: arrayRemove(userId),
  });
};
