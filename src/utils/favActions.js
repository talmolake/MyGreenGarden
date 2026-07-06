// src/utils/favActions.js
import { Alert, ToastAndroid } from 'react-native';
import React, { useState } from 'react';

const listeners = [];
export const _nicknameEmitter = {
  emit: (data) => listeners.forEach(fn => fn(data)),
  subscribe: (fn) => {
    listeners.push(fn);
    return () => {
      const i = listeners.indexOf(fn);
      if (i > -1) listeners.splice(i, 1);
    };
  },
};

export const handleToggleFavourite = async (plant, isFav, { addFavourite, removeFavourite }) => {
  if (isFav) {
    Alert.alert(
      'Remove Favourite',
      `Are you sure you want to remove ${plant.name} from your garden?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: async () => {
            await removeFavourite(plant.id);
            ToastAndroid.show('Removed from Favourites', ToastAndroid.SHORT);
          } 
        }
      ]
    );
  } else {
    _nicknameEmitter.emit({
      plant,
      onConfirm: async (nickname) => {
        await addFavourite(plant.id, nickname);
        ToastAndroid.show(
          nickname ? `${plant.name} added as "${nickname}" 🌱` : 'Added to Garden! 🌱',
          ToastAndroid.SHORT
        );
      },
    });
  }
};