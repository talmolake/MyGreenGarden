// src/hooks/useFavourites.js
import { useState, useEffect, useCallback } from 'react';
import { getFavouritesRef } from '../config/firebase';
import { onSnapshot, setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useFavourites = () => {
  const { stableUid } = useAuth();
  const uid = stableUid ?? null;

  const [favourites, setFavourites] = useState([]);
  const [nicknames, setNicknames] = useState({});
  const [personalNames, setPersonalNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setFavourites([]);
      setNicknames({});
      setPersonalNames({});
      setLoading(false);
      return;
    }

    const ref = getFavouritesRef(uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const ids = [];
        const nicks = {};
        const names = {};
        snap.docs.forEach(d => {
          ids.push(d.id);
          const data = d.data();
          if (data.nickname) nicks[d.id] = data.nickname;
          if (data.personalName) names[d.id] = data.personalName;
        });
        setFavourites(ids);
        setNicknames(nicks);
        setPersonalNames(names);
        setLoading(false);
      },
      (err) => {
        console.error('[useFavourites] Snapshot error:', err.code, err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const addFavourite = useCallback(async (plantId, nickname) => {
    if (!uid) return;
    const strId = String(plantId);
    await setDoc(doc(getFavouritesRef(uid), strId), {
      addedAt: new Date().toISOString(),
      ...(nickname ? { nickname: nickname.trim() } : {}),
    });
  }, [uid]);

  const removeFavourite = useCallback(async (plantId) => {
    if (!uid) return;
    await deleteDoc(doc(getFavouritesRef(uid), String(plantId)));
  }, [uid]);

  const updateFavouriteData = useCallback(async (plantId, { nickname, personalName }) => {
    if (!uid) return;
    const strId = String(plantId);
    const update = {};
    if (nickname !== undefined) update.nickname = nickname.trim();
    if (personalName !== undefined) update.personalName = personalName.trim();
    await updateDoc(doc(getFavouritesRef(uid), strId), update);
  }, [uid]);

  const isFavourite = useCallback(
    (plantId) => favourites.some(id => String(id) === String(plantId)),
    [favourites]
  );

  const getNickname = useCallback(
    (plantId) => nicknames[String(plantId)] ?? null,
    [nicknames]
  );

  const getPersonalName = useCallback(
    (plantId) => personalNames[String(plantId)] ?? null,
    [personalNames]
  );

  return {
    favourites,
    nicknames,
    personalNames,
    loading,
    addFavourite,
    removeFavourite,
    updateFavouriteData,
    isFavourite,
    getNickname,
    getPersonalName,
  };
};