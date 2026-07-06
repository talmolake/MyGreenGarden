// src/components/NicknameModal.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Keyboard, TouchableWithoutFeedback, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { _nicknameEmitter } from '../utils/favActions';

const NicknameModal = () => {
  const { colors, typography } = useTheme();
  const [visible, setVisible] = useState(false);
  const [plant, setPlant] = useState(null);
  const [nickname, setNickname] = useState('');
  const [onConfirm, setOnConfirm] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    const unsub = _nicknameEmitter.subscribe(({ plant, onConfirm }) => {
      setPlant(plant);
      setNickname('');
      setOnConfirm(() => onConfirm); // wrap in fn so useState doesn't call it
      setVisible(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      scaleAnim.setValue(0.85);
    }
  }, [visible]);

  const handleConfirm = () => {
    const trimmed = nickname.trim();
    setVisible(false);
    Keyboard.dismiss();
    if (onConfirm) onConfirm(trimmed || null);
  };

  const handleSkip = () => {
    setVisible(false);
    Keyboard.dismiss();
    if (onConfirm) onConfirm(null); // no nickname, just add
  };

  const handleCancel = () => {
    setVisible(false);
    Keyboard.dismiss();
    // onConfirm not called = cancelled entirely
  };

  if (!plant) return null;

  const s = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      width: '100%',
      maxWidth: 360,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
    },
    iconRow: {
      alignItems: 'center',
      marginBottom: 16,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...typography.h2,
      textAlign: 'center',
      marginBottom: 4,
    },
    plantName: {
      ...typography.body,
      color: colors.primary,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 4,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 18,
    },
    label: {
      ...typography.label,
      marginBottom: 6,
    },
    input: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 30,
      padding: 14,
      ...typography.body,
      backgroundColor: colors.inputBg,
      marginBottom: 8,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    hint: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    btnRow: {
      flexDirection: 'row',
      gap: 5,
    },
    btnCancel: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    btnCancelText: {
      ...typography.button,
      color: colors.textSecondary,
    },
    btnSkip: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal:1,
      borderRadius: 12,
      borderColor: colors.border,
      borderWidth:1,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
    },
    btnSkipText: {
      ...typography.button,
      color: colors.text,
    },
    btnAdd: {
      flex: 1.4,
      paddingVertical: 10,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    btnAddText: {
      ...typography.button,
      color: '#fff',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[s.card, { transform: [{ scale: scaleAnim }] }]}>
              
              <View style={s.iconRow}>
                  <MaterialIcons name="favorite" size={15} color={colors.primary} />
              </View>

              <Text style={s.title}>Add to Garden</Text>
              <Text style={s.plantName}>{plant.name}</Text>
              <Text style={s.subtitle}>
                Give your plant a personal nickname,{'\n'}or just add it as-is.
              </Text>

              <Text style={s.label}>Nickname (optional)</Text>
              <InputWithFocus
                inputRef={inputRef}
                style={s.input}
                focusedStyle={s.inputFocused}
                placeholder={`e.g. "My Kitchen Mint"`}
                placeholderTextColor={colors.textSecondary}
                value={nickname}
                onChangeText={setNickname}
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />
              <Text style={s.hint}>{nickname.trim().length}/30 characters</Text>

              <View style={s.btnRow}>
                <TouchableOpacity style={s.btnCancel} onPress={handleCancel}>
                  <Text style={s.btnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnSkip} onPress={handleSkip}>
                  <Text style={s.btnSkipText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnAdd} onPress={handleConfirm}>
                  <Text style={s.btnAddText}>
                    {nickname.trim() ? 'Add' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Small helper to track focus state for border highlight
const InputWithFocus = ({ inputRef, style, focusedStyle, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      ref={inputRef}
      style={[style, focused && focusedStyle]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
};

export default NicknameModal;