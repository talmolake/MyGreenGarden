// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity,
  Animated, Dimensions, Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

// One reusable organic blob shape 
const Blob = ({ size = 200, color, style }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    style={[{ position: 'absolute' }, style]}
  >
    <Path
      fill={color}
      d="M44.7,-67.2C56.3,-61.4,62.4,-45.5,68.1,-30C73.8,-14.5,79.1,0.6,76.3,14.3C73.5,28,62.6,40.3,50.5,49.9C38.4,59.5,25.1,66.4,9.8,70.3C-5.5,74.2,-22.8,75.1,-36.2,68.2C-49.6,61.3,-59.1,46.6,-65.3,31C-71.5,15.4,-74.4,-1.1,-70.3,-15.7C-66.2,-30.3,-55.1,-43,-42.4,-49.2C-29.7,-55.4,-15.3,-55.1,1.2,-56.8C17.7,-58.5,33.1,-73,44.7,-67.2Z"
      transform="translate(100 100)"
    />
  </Svg>
);

const SplashScreen = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const { loading } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
    content: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingBottom: 48,
    },
    logoContainer: {
      width: 220, height: 260, borderRadius: 15,
      backgroundColor: colors.background,
      opacity: 0.85,
      justifyContent: 'center', 
      alignItems: 'center',
      marginBottom: 32,
      borderWidth: 0.5,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    logoImage: { 
      width: 350, 
      height: 350, 
      resizeMode: 'contain' },
    appName: {
      ...typography.h1, 
      color: colors.text,
      fontSize: 43, 
      letterSpacing: 0.5, 
      textAlign: 'center', 
      marginBottom: 8,
    },
    tagline: {
      ...typography.body, 
      color: colors.textSecondary,
      textAlign: 'center', 
      lineHeight: 22, 
      marginBottom: 52,
    },
    btn: {
      backgroundColor: '#2E7D32',
      borderRadius: 30, paddingVertical: 16, paddingHorizontal: 90,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      bottom: 10
    },
    btnText: {
      ...typography.button, 
      color: '#fff',
      fontSize: 17, fontWeight: '700',
    }
  });

  if (loading) return <View style={s.container} />;

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/*  Blob decorations — same shape, different size/color/position  */}
      <Blob size={260} color="#2E7D32"        style={{ top: -100, left: -80 }} />
      <Blob size={250} color="#66BB6A"  style={{ top: 190, left: -30 }} />
      <Blob size={220} color="#2E7D32"        style={{ top:40, right: -80 }} />
      <Blob size={180} color="#66BB6A"  style={{ bottom: 250, left: 200 }} />      
      <Blob size={300} color="#2E7D32"        style={{ bottom: -120, left: -100 }} />
      <Blob size={180} color="#66BB6A"  style={{ bottom: -20, right: -90 }} />
      <Blob size={200} color="#2E7D32"  style={{ bottom: 150, left: 10 }} />

      {/* Main content */}
      <Animated.View style={[s.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Spacer — controls how far down the top group sits */}
  <View style={{ flex: 1 }} />

      {/* Top group */}
      <View style={{ alignItems: 'center', flex: 2 }}>
        <Text style={s.appName}>MyGreenGarden</Text>
        <Text style={s.tagline}>Your personal plant care companion</Text>
        <View style={s.logoContainer}>
          <Image source={require('../assets/logo.png')} style={s.logoImage} />
        </View>
      </View>

      {/* Button pinned to bottom */}
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 50 }}>
        <TouchableOpacity style={s.btn} onPress={() => navigation.replace('Main')} activeOpacity={0.85}>
          <Text style={s.btnText}>Start Here</Text>
        </TouchableOpacity>
      </View>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;