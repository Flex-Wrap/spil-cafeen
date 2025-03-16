import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebaseconfig";
import { User as FirebaseUser } from "firebase/auth";
import { getUser, FirestoreUser } from "./firestore";

// Define the shape of our authentication context
interface AuthContextType {
  user: FirestoreUser | null;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const firestoreUser = await getUser(firebaseUser);
        
        if (firestoreUser) {
          setUser(firestoreUser);
          setIsAdmin(firestoreUser.isAdmin ?? false); // Default to false if isAdmin is undefined
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firestoreUser = await getUser(result.user);

      if (firestoreUser) {
        setUser(firestoreUser);
        setIsAdmin(firestoreUser.isAdmin ?? false);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
