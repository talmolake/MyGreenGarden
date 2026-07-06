// src/config/firebase.js
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, collection, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCosW6OrA2DAuyJ1BaSf2SZZUq_rvAPBiE",
  authDomain: "my-plant-care-app-ef53a.firebaseapp.com",
  projectId: "my-plant-care-app-ef53a",
  storageBucket: "my-plant-care-app-ef53a.firebasestorage.app",
  messagingSenderId: "148159291009",
  appId: "1:148159291009:web:77dc4a6d4afe4585a87780",
  measurementId: "G-KG030J0BMH"
};

// 1. Initialize App safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Auth — try initializeAuth FIRST (sets up persistence),
//    fall back to getAuth only if it's already been initialized
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // Already initialized — just grab the existing instance
  auth = getAuth(app);
}

// 3. Initialize Firestore safely
let firestore;
try {
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (e) {
  firestore = getFirestore(app);
}

const storage = getStorage(app);

export { auth, firestore, storage };

export const COLLECTIONS = {
  PLANTS: 'plants',
  FAVOURITES: 'favourites',
  USERS: 'users',
};

export const getUserPlantsRef = (uid) =>
  collection(doc(firestore, COLLECTIONS.USERS, uid), COLLECTIONS.PLANTS);

export const getFavouritesRef = (uid) =>
  collection(doc(firestore, COLLECTIONS.USERS, uid), COLLECTIONS.FAVOURITES);