// src/components/FAB.js
// Floating Action Button — WhatsApp/Material style, bottom-right.
// Usage: <FAB onPress={() => navigation.navigate('AddPlant')} />
import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const FAB = ({ onPress, icon = 'add', style }) => {
  const { colors, dark } = useTheme();
  console.log('FAB dark:', dark);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 30 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

    // Light mode: white background, black icon + border
    // Dark mode:  black (surface) background, white icon + border
    const bgColor    = dark ? '#121212' : '#fff';
    const iconColor  = dark ? '#fff' : '#121212';
    const borderColor = dark ? '#333' : '#e0e0e0';

  return (
    <Animated.View
      style={[
        s.wrapper,
        { transform: [{ scale }] },
        style,
      ]}
    >
      <TouchableOpacity
         onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.85}
        style={[s.btn, { backgroundColor: bgColor, borderColor }]}
      >
        <MaterialIcons name={icon} size={28} color={iconColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    zIndex: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btn: {
    width: 56,
    height: 46,
    borderRadius: 20,
    borderWidth: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default FAB;