// src/screens/SettingsScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity,
  ScrollView, Switch, TextInput, Alert, Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme, TYPEFACES, FONT_SIZES } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Dimensions } from 'react-native';
import AppHeader from '../components/AppHeader';

// Reusable inline dropdown (same pattern as SortPicker)
const SettingsPicker = ({ label, value, options, onSelect, colors, typography }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [btnLayout, setBtnLayout] = useState({ x: 0, y: 0, width: 0, height: 0, top: 0  });

  const activeOption = options.find(o => o.value === value);

  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const DROPDOWN_ITEM_HEIGHT = 54;
  const MAX_DROPDOWN_HEIGHT = 280;

  const handleOpen = () => {
    btnRef.current?.measureInWindow((x, y, width, height) => {
    const dropdownHeight = Math.min(
            options.length * DROPDOWN_ITEM_HEIGHT,
            MAX_DROPDOWN_HEIGHT
          );    
    const spaceBelow = SCREEN_HEIGHT - (y + height);
    const spaceAbove = y;

    // If not enough space below, render above the button
    const fitsBelow = spaceBelow >= dropdownHeight;
    const top = fitsBelow
      ? y + height + 4
      : Math.max(y - dropdownHeight - 4, 8); // 8px min from top of screen

      setBtnLayout({ x, y, width, height, top });
      setOpen(true);
    });
  };

  const s = StyleSheet.create({
    row: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 13, paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1, borderBottomColor: colors.divider,
    },
    rowLabel: { ...typography.body, flex: 1 },
    btn: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
    },
    btnValue: { ...typography.body, color: colors.primary, fontWeight: '600' },
    overlay: { flex: 1 },
    dropdown: {
      position: 'absolute',
      top: btnLayout.top, 
      right: 16,
      minWidth: 180,
      maxHeight: 280,  
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    option: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 13,
      borderBottomWidth: 1, borderBottomColor: colors.divider,
    },
    optionLast: { borderBottomWidth: 0 },
    optionText: { ...typography.body },
    optionTextActive: { color: colors.primary, fontWeight: '700' },
    optionSubtext: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  });

  return (
    <>
      <TouchableOpacity
        ref={btnRef}
        onPress={handleOpen}
        activeOpacity={0.75}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginHorizontal: 50, marginVertical: 1,
          paddingHorizontal: 14, paddingVertical: 8,
          borderRadius: 20, borderWidth: 0,
          backgroundColor: colors.card,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ ...typography.caption, color: colors.textSecondary, fontWeight: '500' }}>
            {label}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ ...typography.caption, color: colors.primary, fontWeight: '700' }}>
            {activeOption?.label ?? ''}
          </Text>
          <MaterialIcons
            name={open ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={20}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={s.overlay}>
            <TouchableWithoutFeedback>
              <View style={s.dropdown}>
                 <ScrollView
                  bounces={false}
                  showsVerticalScrollIndicator
                  nestedScrollEnabled
                >
                {options.map((opt, i) => {
                  const isActive = opt.value === value;
                  const isLast = i === options.length - 1;
                  return (
                    <TouchableOpacity
                      key={String(opt.value)}
                      style={[s.option, isLast && s.optionLast]}
                      onPress={() => { onSelect(opt.value); setOpen(false); }}
                    >
                      <View>
                        <Text style={[s.optionText, isActive && s.optionTextActive]}>
                          {opt.label}
                        </Text>
                        {opt.subtitle ? (
                          <Text style={[s.optionSubtext, { fontFamily: opt.fontFamily }]}>
                            {opt.subtitle}
                          </Text>
                        ) : null}
                      </View>
                      {isActive && <MaterialIcons name="check" size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

// Section label 
const SectionHeader = ({ title, colors, typography }) => (
  <Text style={{
    ...typography.caption,
    textTransform: 'uppercase', letterSpacing: 1.2,
    color: colors.textSecondary, fontWeight: '700',
    paddingHorizontal: 16, paddingTop: 28, paddingBottom: 10,
  }}>
    {title}
  </Text>
);

// Appearance toggle
const AppearanceRow = ({ label, subtitle, value, colorMode, setColorMode, colors, typography}) => {
  const isOn = colorMode === value;
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 30,
      borderBottomColor: colors.divider,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{ ...typography.body }}>{label}</Text>
        {subtitle ? (
          <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Switch
        value={isOn}
        onValueChange={(v) => setColorMode(v ? value : 'system')}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
};

// Main Screen 
const SettingsScreen = ({ navigation }) => {
  const {
    colorMode, setColorMode,
    fontSize, setFontSize,
    typeface, setTypeface,
    colors, typography,
  } = useTheme();

  const { user } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.displayName ?? (user?.isAnonymous ? 'Anonymous User' : 'User')
  );
  const [email, setEmail] = useState(
    user?.email ?? (user?.isAnonymous ? 'No email (anonymous)' : '')
  );

  const handleSaveProfile = () => {
    setEditingProfile(false);
    Alert.alert('Saved', 'Profile updated.');
  };

  // Build font size options from FONT_SIZES constant
  const fontSizeOptions = Object.keys(FONT_SIZES).map(key => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  // Build typeface options from TYPEFACES constant
  const typefaceOptions = TYPEFACES.map(tf => ({
    value: tf.value,
    label: tf.label,
    subtitle: 'The quick brown fox jumps over the lazy dog',
    fontFamily: tf.value,
  }));

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingBottom: 14, paddingHorizontal: 16,
    },
    headerTitle: { ...typography.h2 },
    profileCard: {
      backgroundColor: colors.card,
      marginHorizontal: 30, marginTop: 20,
      borderRadius: 25, padding: 16, paddingVertical: 25, elevation: 7,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08, shadowRadius: 6,
    },
    profileCardTop: {
      flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    },
    avatarCircle: {
      width: 52, height: 52, borderRadius: 26,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    },
    profileName: { ...typography.h3, marginBottom: 2 },
    profileEmail: { ...typography.caption, color: colors.textSecondary },
    inputLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 12, marginBottom: 4 },
    input: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 30,
      padding: 11, ...typography.body, backgroundColor: colors.inputBg,
    },
    saveBtn: {
      marginTop: 14, backgroundColor: colors.primary,
      borderRadius: 30, padding: 12, alignItems: 'center',
      elevation: 7,
      marginHorizontal: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    saveBtnText: { ...typography.button, color: '#fff' },
    cancelBtn: { marginTop: 8, alignItems: 'center', padding: 8 },
    cancelBtnText: { ...typography.caption, color: colors.textSecondary },
    row: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 13, paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1, borderBottomColor: colors.divider,
    },
    rowLabel: { ...typography.body, flex: 1 },
    version: {
      ...typography.caption, textAlign: 'center',
      paddingVertical: 28, color: colors.textSecondary,
    },
  });

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.surface} barStyle={colors.statusBar} />
      <AppHeader/>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/*Profile Card*/}
        <View style={s.profileCard}>
          <View style={s.profileCardTop}>
            <View style={s.avatarCircle}>
              <MaterialIcons name="person" size={28} color={colors.primary} />
            </View>
            {!editingProfile && (
              <TouchableOpacity onPress={() => setEditingProfile(true)} style={{ padding: 4 }}>
                <MaterialIcons name="edit" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {editingProfile ? (
            <>
              <Text style={s.inputLabel}>Display name</Text>
              <TextInput
                style={s.input} value={displayName} onChangeText={setDisplayName}
                placeholder="Your name" placeholderTextColor={colors.textSecondary}
              />
              <Text style={s.inputLabel}>Email</Text>
              <TextInput
                style={s.input} value={email} onChangeText={setEmail}
                placeholder="email@example.com" placeholderTextColor={colors.textSecondary}
                keyboardType="email-address" autoCapitalize="none"
              />
              <TouchableOpacity style={s.saveBtn} onPress={handleSaveProfile}>
                <Text style={s.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setEditingProfile(false)}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={s.profileName}>{displayName}</Text>
              <Text style={s.profileEmail}>{email}</Text>
            </>
          )}
        </View>

        {/*Display / Appearance*/}
        <Text style={{ ...typography.h2, paddingHorizontal: 16, paddingTop: 20,}}>
          Preferences
        </Text>

        <SectionHeader title="Display" colors={colors} typography={typography} />
        <AppearanceRow
          label="System Auto" subtitle="Follow device setting"
          value="system" colorMode={colorMode} setColorMode={setColorMode}
          colors={colors} typography={typography}
        />
        <AppearanceRow
          label="Light Mode" value="light"
          colorMode={colorMode} setColorMode={setColorMode}
          colors={colors} typography={typography}
        />
        <AppearanceRow
          label="Dark Mode" value="dark"
          colorMode={colorMode} setColorMode={setColorMode}
          colors={colors} typography={typography} isLast
        />

        {/*Font Size*/}
        <SectionHeader title="Font Size Control" colors={colors} typography={typography} />
        <View>
          <SettingsPicker
            label="Size"
            value={fontSize}
            options={fontSizeOptions}
            onSelect={setFontSize}
            colors={colors}
            typography={typography}
          />
        </View>

        {/*Typeface SortPicker style*/}
        <SectionHeader title="Typeface Selection" colors={colors} typography={typography} />
        <View>
          <SettingsPicker
            label="Typeface"
            value={typeface}
            options={typefaceOptions}
            onSelect={setTypeface}
            colors={colors}
            typography={typography}
          />
        </View>

      </ScrollView>
    </View>
  );
};

export default SettingsScreen;