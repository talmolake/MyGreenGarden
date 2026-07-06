// src/screens/WateringCalculatorScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, KeyboardAvoidingView, Platform,
  Animated, Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

const ML_TO_FLOZ = 0.033814;
const FLOZ_TO_ML = 29.5735;
const QUICK_VALS_ML = [100, 250, 500, 750, 1000];
const SCREEN_HEIGHT = Dimensions.get('window').height;

const WateringCalculatorScreen = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const [mlValue, setMlValue] = useState('');
  const [flozValue, setFlozValue] = useState('');
  const [lastDir, setLastDir] = useState('ml');
  const [error, setError] = useState('');

  // Animation values 
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Slide up + fade in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Slide down + fade out, then navigate back
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.goBack());
  };

  //  Conversion handlers 
  const handleMlChange = val => {
    const clean = val.replace(/[^0-9.]/g, '');
    setMlValue(clean);
    setError('');
    setLastDir('ml');
    if (clean === '') { setFlozValue(''); return; }
    const num = parseFloat(clean);
    if (isNaN(num)) { setError('Please enter a valid number'); setFlozValue(''); return; }
    setFlozValue((num * ML_TO_FLOZ).toFixed(1));
  };

  const handleFlozChange = val => {
    const clean = val.replace(/[^0-9.]/g, '');
    setFlozValue(clean);
    setError('');
    setLastDir('floz');
    if (clean === '') { setMlValue(''); return; }
    const num = parseFloat(clean);
    if (isNaN(num)) { setError('Please enter a valid number'); setMlValue(''); return; }
    setMlValue((num * FLOZ_TO_ML).toFixed(1));
  };

  // Convert button — re-runs calculation from whichever field was last edited
  const handleConvert = () => {
    setError('');
    if (lastDir === 'ml') {
      if (!mlValue) { setError('Enter a value to convert'); return; }
      const num = parseFloat(mlValue);
      if (isNaN(num)) { setError('Please enter a valid number'); return; }
      setFlozValue((num * ML_TO_FLOZ).toFixed(1));
    } else {
      if (!flozValue) { setError('Enter a value to convert'); return; }
      const num = parseFloat(flozValue);
      if (isNaN(num)) { setError('Please enter a valid number'); return; }
      setMlValue((num * FLOZ_TO_ML).toFixed(1));
    }
  };

  const setQuickMl = val => handleMlChange(String(val));
  const handleClear = () => { setMlValue(''); setFlozValue(''); setError(''); };

  const showResult = mlValue && flozValue && !error;

  const s = StyleSheet.create({
    root: { flex: 1, justifyContent: 'flex-end' },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      minHeight: '55%',
      paddingHorizontal: 24,
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
      paddingTop: 12,
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    handle: {
      width: 40, height: 4, borderRadius: 2,
      backgroundColor: colors.divider ?? colors.border,
      alignSelf: 'center', marginBottom: 16,
    },
    headerRow: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', marginBottom: 20,
    },
    title: { ...typography.h2 },
    closeBtn: {
      padding: 6, backgroundColor: colors.surfaceVariant ?? colors.chip,
      borderRadius: 20,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    inputWrap: { flex: 1 },
    label: { ...typography.label, marginBottom: 6 },
    input: {
      borderWidth: 1.5, borderColor: colors.border, borderRadius: 30,
      padding: 14, ...typography.h3,
      backgroundColor: colors.background,
      textAlign: 'center', color: colors.text,
    },
    inputActive: { borderColor: colors.primary },
    swapWrap: { alignItems: 'center', paddingTop: 20 },
    swapCircle: {
      padding: 8,
      backgroundColor: colors.primaryContainer,
      borderRadius: 20,
    },
    error: {
      ...typography.caption, color: colors.error,
      textAlign: 'center', marginBottom: 8,
    },
    resultRow: {
      backgroundColor: colors.primaryContainer,
      borderRadius: 12, padding: 12, marginBottom: 16,
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', gap: 8,
    },
    resultText: { ...typography.body, color: colors.primary, fontWeight: '700' },
    quickLabel: { ...typography.label, marginBottom: 8 },
    quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: {
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
      backgroundColor: colors.chip ?? colors.primaryContainer,
      borderWidth: 1, borderColor: colors.border,
    },
    chipText: { ...typography.caption, color: colors.chipText ?? colors.primary, fontWeight: '600' },
    clearBtn: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', gap: 6, paddingVertical: 8, marginBottom: 16,
    },
    clearText: { ...typography.caption, color: colors.textSecondary },
    // ── Convert button ────────────────────────────────────────────────────────
    convertBtn: {
      backgroundColor: colors.primary,
      borderRadius: 30,
      marginHorizontal: 50,
      padding: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      marginTop: 4,
    },
    convertBtnText: { ...typography.button, color: '#fff', fontWeight: '700' },
  });

  return (
    <View style={s.root}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />

      {/* ── Animated backdrop — tap to close ── */}
      <Animated.View style={[s.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClose} />
      </Animated.View>

      {/* ── Animated bottom sheet ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ justifyContent: 'flex-end' }}
      >
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Drag handle */}
          <View style={s.handle} />

          {/* Header */}
          <View style={s.headerRow}>
            <Text style={s.title}>Watering Calculator</Text>
            <TouchableOpacity style={s.closeBtn} onPress={handleClose}>
              <MaterialIcons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* ── Inputs ── */}
            <View style={s.row}>
              <View style={s.inputWrap}>
                <Text style={s.label}>Millilitres (ml)</Text>
                <TextInput
                  style={[s.input, lastDir === 'ml' && mlValue && s.inputActive]}
                  value={mlValue}
                  onChangeText={handleMlChange}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={s.swapWrap}>
                <View style={s.swapCircle}>
                  <MaterialIcons name="swap-horiz" size={20} color={colors.primary} />
                </View>
              </View>

              <View style={s.inputWrap}>
                <Text style={s.label}>Fluid Ounces (fl oz)</Text>
                <TextInput
                  style={[s.input, lastDir === 'floz' && flozValue && s.inputActive]}
                  value={flozValue}
                  onChangeText={handleFlozChange}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {error ? <Text style={s.error}>{error}</Text> : null}

            {/* ── Result pill ── */}
            {showResult && (
              <View style={s.resultRow}>
                <MaterialIcons name="check-circle" size={18} color={colors.primary} />
                <Text style={s.resultText}>{mlValue} ml = {flozValue} fl oz</Text>
              </View>
            )}

            {/* ── Quick select ── */}
            <Text style={s.quickLabel}>Quick Select (ml)</Text>
            <View style={s.quickRow}>
              {QUICK_VALS_ML.map(v => (
                <TouchableOpacity key={v} style={s.chip} onPress={() => setQuickMl(v)}>
                  <Text style={s.chipText}>{v} ml</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Clear ── */}
            <TouchableOpacity style={s.clearBtn} onPress={handleClear}>
              <MaterialIcons name="clear" size={16} color={colors.textSecondary} />
              <Text style={s.clearText}>Clear values</Text>
            </TouchableOpacity>

            {/* ── Convert button ── */}
            <TouchableOpacity style={s.convertBtn} onPress={handleConvert} activeOpacity={0.8}>
              <MaterialIcons name="swap-horiz" size={20} color="#fff" />
              <Text style={s.convertBtnText}>Convert</Text>
            </TouchableOpacity>

          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default WateringCalculatorScreen;