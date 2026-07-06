// src/hooks/usePlants.js
import { useState, useEffect } from 'react';
import { firestore, COLLECTIONS, getUserPlantsRef } from '../config/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const usePlants = () => {
  const { stableUid } = useAuth();
  const uid = stableUid ?? null;

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen to shared seed plants
    const sharedQuery = query(
      collection(firestore, COLLECTIONS.PLANTS),
      orderBy('createdAt', 'desc')
    );

    let userUnsub = () => {};
    let sharedPlants = [];
    let userPlants = [];

    const sharedUnsub = onSnapshot(sharedQuery,
      (snap) => {
        sharedPlants = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPlants([...sharedPlants, ...userPlants]);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Listen to user's own plants if uid is available
    if (uid) {
      const userQuery = query(
        getUserPlantsRef(uid),
        orderBy('createdAt', 'desc')
      );

      userUnsub = onSnapshot(userQuery,
        (snap) => {
          userPlants = snap.docs.map(d => ({ id: d.id, ...d.data(), isUserAdded: true }));
          setPlants([...sharedPlants, ...userPlants]);
          setLoading(false);
        },
        (err) => {
          console.error('[usePlants] User plants error:', err.message);
        }
      );
    }

    return () => {
      sharedUnsub();
      userUnsub();
    };
  }, [uid]);

  // Add plant to user's personal collection
  const addPlant = async (plantData) => {
    if (!uid) return;
    const ref = await addDoc(getUserPlantsRef(uid), {
      ...plantData,
      createdAt: serverTimestamp(),
      isUserAdded: true,
    });
    return ref.id;
  };

  const updatePlant = (id, data) =>
    updateDoc(doc(firestore, COLLECTIONS.PLANTS, id), data);

  const deletePlant = (id) =>
    deleteDoc(doc(firestore, COLLECTIONS.PLANTS, id));

  return { plants, loading, error, addPlant, updatePlant, deletePlant };
};