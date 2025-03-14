// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebaseConfig"

const AuthContext = createContext();

const adminEmails = ["admin1@gmail.com", "admin2@gmail.com"]; // Replace with actual admin emails

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsAdmin(adminEmails.includes(user.email));
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
      setUser(result.user);
      setIsAdmin(adminEmails.includes(result.user.email));
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

export const useAuth = () => useContext(AuthContext);
