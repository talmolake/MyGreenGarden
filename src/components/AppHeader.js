// src/components/AppHeader.js
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TouchableWithoutFeedback, Dimensions, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ConfirmModal from './ConfirmModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ROOT_SCREENS = ['Home', 'Plants', 'Favourites', 'Settings', 'AddPlant'];

const AppHeader = ({ title, left, showBack, tintColor }) => {
    const { colors, typography } = useTheme();
    const { signOut } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuBtnRef = useRef(null);
    const [menuLayout, setMenuLayout] = useState({ top: 0, right: 0 });
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const isRoot = ROOT_SCREENS.includes(route.name);
    const shouldShowBack = showBack !== undefined ? showBack : !isRoot;
    const textColor = tintColor ?? colors.text;

    const handleMenuOpen = () => {
    menuBtnRef.current?.measureInWindow((x, y, w, h) => {
      setMenuLayout({ top: y + h + 4, right: SCREEN_WIDTH - x - w });
      setMenuOpen(true);
    });
  };

  const handleWateringCalc = () => {
    setMenuOpen(false);
    navigation.navigate('WateringCalculator');
  };

  const handleSignOut = () => {
  setMenuOpen(false);
  setLogoutModalVisible(true);
  
};

  const s = StyleSheet.create({
    header: {
      backgroundColor: colors.background,
      paddingTop: insets.top + 4,
      paddingBottom: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 0,
      shadowOpacity: 0
    },
    leftWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backBtn: {
      marginRight: 8,
    },
    title: {
      ...typography.h3,
      color: textColor,
    },
    rightWrap: {
      width: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    overlay: { flex: 1 },
    dropdown: {
      position: 'absolute',
      top: menuLayout.top,
      right: menuLayout.right,
      minWidth: 220,
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    menuItemLast: { borderBottomWidth: 0 },
    menuItemText: { ...typography.body },
    menuItemTextDanger: { ...typography.body, color: colors.error },
  });

  return (
    <>
      <View style={s.header}>

        {/* Left — back button + title or custom left content */}
        <View style={s.leftWrap}>
          {shouldShowBack && (
            <TouchableOpacity
              style={s.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
          )}
          {left
            ? left
            : title
              ? <Text style={s.title} numberOfLines={1}>{title}</Text>
              : null
          }
        </View>

        {/* Right — menu button */}
        <View style={s.rightWrap}>
          <TouchableOpacity
            ref={menuBtnRef}
            onPress={handleMenuOpen}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="more-vert" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

      </View>

      {/* Dropdown menu */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={s.overlay}>
            <TouchableWithoutFeedback>
              <View style={s.dropdown}>
                <TouchableOpacity style={s.menuItem} onPress={handleWateringCalc}>
                  <Text style={s.menuItemText}>Watering Calculator</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.menuItem, s.menuItemLast]} onPress={handleSignOut}>
                  <MaterialIcons name="logout" size={20} color={colors.error} />
                  <Text style={s.menuItemTextDanger}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
        <ConfirmModal
        visible={logoutModalVisible}
        title="Log Out"
        message="Logging out will create a new session and you will lose access to your current favourites."
        confirmText="Log Out"
        cancelText="Cancel"
        confirmDestructive
        icon="logout"
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={async () => {
            setLogoutModalVisible(false);
            await signOut();
            navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
        }}
        />

    </>
  );
};

export default AppHeader;