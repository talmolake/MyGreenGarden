// src/context/ThemeContext.js
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';

// Constants & Palettes 
export const TYPEFACES = [
  { value: 'Roboto',            label: 'Roboto',            system: true  },
  { value: 'Inter',             label: 'Inter',             system: false },
  { value: 'Lato',              label: 'Lato',              system: false },
  { value: 'Poppins',           label: 'Poppins',           system: false },
  { value: 'Nunito',            label: 'Nunito',            system: false },
  { value: 'Oswald',            label: 'Oswald',            system: false },
  { value: 'Merriweather',      label: 'Merriweather',      system: false },
  { value: 'Playfair Display',  label: 'Playfair Display',  system: false },
  { value: 'Source Serif Pro',  label: 'Source Serif Pro',  system: false },
  { value: 'serif',             label: 'Serif (system)',     system: true  },
  { value: 'monospace',         label: 'Monospace',         system: true  },
  { value: 'sans-serif-condensed', label: 'Condensed',      system: true  },
];

export const FONT_SIZES = {small: 13, medium: 15, large: 17, xlarge: 20};
const STORAGE_KEY = '@mgg_prefs';

const PALETTES = {
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    primary: '#4CAF50',
    primaryContainer: '#1B5E20',
    onPrimary: '#FFFFFF',
    secondary: '#A5D6A7',
    text: '#E8F5E9',
    textSecondary: '#9E9E9E',
    border: '#333333',
    card: '#1E1E1E',
    error: '#CF6679',
    chip: '#2E2E2E',
    chipText: '#A5D6A7',
    tabBar: '#1A1A1A',
    tabIcon: '#757575',
    tabIconActive: '#4CAF50',
    inputBg: '#2A2A2A',
    divider: '#2E2E2E',
    shadow: 'rgba(0,0,0,0.5)',
    statusBar: 'light-content',
  },
  light: {
    background: '#F1F8E9',
    surface: '#FFFFFF',
    surfaceVariant: '#F9FBE7',
    primary: '#2E7D32',
    primaryContainer: '#C8E6C9',
    onPrimary: '#FFFFFF',
    secondary: '#558B2F',
    text: '#1B2E1B',
    textSecondary: '#555555',
    border: '#DCEDC8',
    card: '#FFFFFF',
    error: '#B00020',
    chip: '#DCEDC8',
    chipText: '#2E7D32',
    tabBar: '#FFFFFF',
    tabIcon: '#9E9E9E',
    tabIconActive: '#2E7D32',
    inputBg: '#F9FBE7',
    divider: '#E8F5E9',
    shadow: 'rgba(0,0,0,0.08)',
    statusBar: 'dark-content',
  },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({children}) => {
  const [ready, setReady] = useState(false);
  const systemScheme = useColorScheme() ?? 'light';
  
  // User Preference States
  const [colorMode, setColorMode] = useState('system'); 
  const [fontSize, setFontSize] = useState('medium');
  const [typeface, setTypeface] = useState('Roboto');

  // 1. Load saved preferences on mount
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.colorMode) setColorMode(saved.colorMode);
          if (saved.fontSize) setFontSize(saved.fontSize);
          if (saved.typeface) setTypeface(saved.typeface);
        }
      } catch (err) {
        console.warn('Failed to load theme prefs:', err);
      } finally {
        setReady(true);
      }
    };
    loadPrefs();
  }, []);

  // 2. Persist preferences whenever they change
  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({colorMode, fontSize, typeface}));
    }
  }, [colorMode, fontSize, typeface, ready]);

  // 3. Resolve Theme Values
  const isDark =
    colorMode === 'dark' ||
    (colorMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? PALETTES.dark : PALETTES.light;
  const baseFontSize = FONT_SIZES[fontSize] || 15;

  const typography = {
    h1: {fontFamily: typeface, fontSize: baseFontSize + 11, fontWeight: '700', color: colors.text},
    h2: {fontFamily: typeface, fontSize: baseFontSize + 7, fontWeight: '700', color: colors.text},
    h3: {fontFamily: typeface, fontSize: baseFontSize + 4, fontWeight: '600', color: colors.text},
    body: {fontFamily: typeface, fontSize: baseFontSize, color: colors.text},
    bodySmall: {fontFamily: typeface, fontSize: baseFontSize - 1, color: colors.textSecondary},
    caption: {fontFamily: typeface, fontSize: baseFontSize - 2, color: colors.textSecondary},
    button: {fontFamily: typeface, fontSize: baseFontSize, fontWeight: '600', color: colors.onPrimary},
    label: {fontFamily: typeface, fontSize: baseFontSize - 1, fontWeight: '500', color: colors.text},
  };

  if (!ready) {
    return null; 
  }

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colorMode,
        setColorMode,
        fontSize,
        setFontSize,
        typeface,
        setTypeface,
        colors,
        typography,
        baseFontSize,
        dark:isDark
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return ctx;
};