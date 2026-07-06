// src/context/AuthContext.js
import React, {createContext, useContext, useState, useEffect} from 'react';
import {auth} from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  onAuthStateChanged,
  signInAnonymously as fbSignInAnonymously,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const AuthContext = createContext(null);
const STORED_UID_KEY = 'app_user_uid';

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stableUid, setStableUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Check if we have a stored UID already
        const storedUid = await AsyncStorage.getItem(STORED_UID_KEY);
        if (!storedUid) {
          // First time — save this UID permanently
          await AsyncStorage.setItem(STORED_UID_KEY, u.uid);
          setStableUid(u.uid);
        } else {
          // Always use the stored UID
          setStableUid(storedUid);
        }
        setUser(u);
        setLoading(false);
      } else {
        fbSignInAnonymously(auth)
          .catch((err) => {
            console.error('Anonymous sign-in failed:', err.code, err.message);
            setLoading(false);
          });
      }
    });

    return unsubscribe;
  }, []);

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signOut = () => fbSignOut(auth);

  const signInAnonymously = () => fbSignInAnonymously(auth);

  return (
    <AuthContext.Provider value={{user, stableUid, loading, signIn, signUp, signOut, signInAnonymously}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};