import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, database, ref, set, onDisconnect } from "../firebase";
import { createContext } from "react";


export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        const userStatusRef = ref(database, `/status/${user.uid}`);
        set(userStatusRef, { online: true });

        onDisconnect(userStatusRef).set({ online: false });
      }
    });

    return () => {
      if (currentUser) {
        const userStatusRef = ref(database, `/status/${currentUser.uid}`);
        set(userStatusRef, { online: false });
      }
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = createContext();
