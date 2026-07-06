// src/components/ConfirmModal.js
import React from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, TouchableWithoutFeedback, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ConfirmModal = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmDestructive = false,
  icon,
  iconColor,
  onConfirm,
  onCancel,
}) => {
  const { colors, typography } = useTheme();

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
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: colors.primaryContainer,
      justifyContent: 'center', alignItems: 'center',
    },
    title: {
      ...typography.h2,
      textAlign: 'center',
      marginBottom: 8,
    },
    message: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    btnRow: {
      flexDirection: 'row',
      gap: 10,
    },
    btnCancel: {
      flex: 1, paddingVertical: 13,
      borderRadius: 30, borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    btnCancelText: {
      ...typography.button,
      color: colors.textSecondary,
    },
    btnConfirm: {
      flex: 1.4, paddingVertical: 13,
      borderRadius: 30,
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    btnConfirmText: {
      ...typography.button,
      color: '#fff',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={s.overlay}>
          <TouchableWithoutFeedback>
            <View style={s.card}>
            
              <Text style={s.title}>{title}</Text>
              {message ? <Text style={s.message}>{message}</Text> : null}
              <View style={s.btnRow}>
                <TouchableOpacity style={s.btnCancel} onPress={onCancel}>
                  <Text style={s.btnCancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.btnConfirm, {
                    backgroundColor: confirmDestructive ? colors.error : colors.primary,
                  }]}
                  onPress={onConfirm}
                >
                  <Text style={s.btnConfirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmModal;