// src/screens/AddPlantScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar, Alert, ActivityIndicator,
  Image, Modal, TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePlants } from '../hooks/usePlants';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import AppHeader from '../components/AppHeader'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DROPDOWN_ITEM_HEIGHT = 48;
const MAX_DROPDOWN_HEIGHT = 240;

const InlineDropdown = ({ label, value, options, onSelect, error, colors, typography }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [layout, setLayout] = useState({ top: 0 });
  const active = options.find(o => o.value === value);

  const handleOpen = () => {
    btnRef.current?.measureInWindow((x, y, w, h) => {
      const dropdownHeight = Math.min(options.length * DROPDOWN_ITEM_HEIGHT, MAX_DROPDOWN_HEIGHT);
      const spaceBelow = SCREEN_HEIGHT - (y + h);
      const fitsBelow = spaceBelow >= dropdownHeight;
      setLayout({ top: fitsBelow ? y + h + 4 : Math.max(y - dropdownHeight - 4, 8), x });
      setOpen(true);
    });
  };

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ ...typography.caption, color: colors.textSecondary, marginBottom: 5, fontWeight: '600' }}>
        {label}
      </Text>
      <TouchableOpacity
        ref={btnRef} onPress={handleOpen} activeOpacity={0.75}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 12, paddingVertical: 11,
          borderRadius: 30, borderWidth: 0.5,
          borderColor: error ? colors.error : (open ? colors.primary : colors.border),
          backgroundColor: colors.card, elevation: 5,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.85, shadowRadius: 8, overflow: 'hidden',
        }}
      >
        <Text style={{ ...typography.body, color: active ? colors.text : colors.textSecondary, flex: 1 }}>
          {active?.label ?? `Select ${label}`}
        </Text>
        <MaterialIcons name={open ? 'arrow-drop-up' : 'arrow-drop-down'} size={22} color={colors.textSecondary} />
      </TouchableOpacity>
      {error ? <Text style={{ ...typography.caption, color: colors.error, marginTop: 3 }}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback>
              <View style={{
                position: 'absolute', top: layout.top, left: layout.x, right: 16,
                maxHeight: MAX_DROPDOWN_HEIGHT, backgroundColor: colors.card,
                borderRadius: 12, borderWidth: 1, borderColor: colors.border,
                elevation: 12, shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8,
                overflow: 'hidden',
              }}>
                <ScrollView bounces={false} nestedScrollEnabled showsVerticalScrollIndicator>
                  {options.map((opt, i) => {
                    const isActive = opt.value === value;
                    const isLast = i === options.length - 1;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => { onSelect(opt.value); setOpen(false); }}
                        style={{
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                          paddingHorizontal: 16, paddingVertical: 13,
                          borderBottomWidth: isLast ? 0 : 1, borderBottomColor: colors.divider,
                          backgroundColor: isActive ? colors.primaryContainer : 'transparent',
                        }}
                      >
                        <Text style={{
                          ...typography.body,
                          color: isActive ? colors.primary : colors.text,
                          fontWeight: isActive ? '700' : '400',
                        }}>
                          {opt.label}
                        </Text>
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
    </View>
  );
};

const Field = ({ label, error, children, colors, typography, half = false }) => (
  <View style={{ marginBottom: 14, ...(half && { flex: 1 }) }}>
    <Text style={{ ...typography.caption, color: colors.textSecondary, marginBottom: 5, fontWeight: '600' }}>
      {label}
    </Text>
    {children}
    {error ? <Text style={{ ...typography.caption, color: colors.error, marginTop: 3 }}>{error}</Text> : null}
  </View>
);

const AddPlantScreen = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const { addPlant } = usePlants();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', type: '', sunlight: '',
    difficulty: '', watering: '', soil: '',
    location: '', pests: '', description: '', imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setImages(prev => [...prev, ...uris].slice(0, 5));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Plant name is required';
    if (!form.type) e.type = 'Select a plant type';
    if (!form.difficulty) e.difficulty = 'Select a difficulty';
    if (!form.watering.trim()) e.watering = 'Watering schedule is required';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await addPlant({
        name: form.name.trim(),
        type: form.type,
        sunlight: form.sunlight,
        difficulty: form.difficulty,
        watering: form.watering.trim(),
        soil: form.soil.trim(),
        location: form.location.trim(),
        pests: form.pests.trim(),
        description: form.description.trim(),
        imageUrl: images[0] ?? 'https://via.placeholder.com/400x300?text=Plant',
        imageUrls: images, // all images saved as local URIs
      });
      Alert.alert('✅ Saved!', `${form.name} has been added.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.surface, elevation: 2,
      paddingBottom: 12, paddingHorizontal: 16,
      flexDirection: 'row', alignItems: 'center', gap: 12,
    },
    headerTitle: { ...typography.h2 },
    scroll: { padding: 16, paddingBottom: 40 },
    card: {
      backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 30,
      elevation: 5, shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
      borderWidth: 1, borderColor: colors.divider,
      borderTopColor: colors.border, borderLeftColor: colors.border,
    },
    cardTitle: {
      ...typography.label, color: colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
    },
    input: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 30,
      paddingHorizontal: 12, paddingVertical: 11,
      ...typography.body, backgroundColor: colors.background,
      elevation: 2, shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
    },
    inputError: { borderColor: colors.error },
    textarea: { minHeight: 80, textAlignVertical: 'top' },
    row: { flexDirection: 'row', gap: 12 },
    imageRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 10 },
    addImageLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    saveBtn: {
      width: 170, backgroundColor: colors.primary, borderRadius: 30,
      padding: 10, alignItems: 'center', flexDirection: 'row',
      justifyContent: 'center', gap: 8, margin: 32, alignSelf: 'center',
      elevation: 5, shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
    },
    saveBtnText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  });

  const typeOptions = [
    { label: 'Vegetable', value: 'vegetable' },
    { label: 'Herb', value: 'herb' },
    { label: 'Flower', value: 'flower' },
  ];
  const sunOptions = [
    { label: 'Full Sun', value: 'full sun' },
    { label: 'Partial Shade', value: 'partial shade' },
    { label: 'Full Shade', value: 'full shade' },
  ];
  const diffOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.surface} barStyle={colors.statusBar} />
      <AppHeader/>
      <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled">

        <Text style={s.cardTitle}>Add New Plant</Text>
        <View style={s.card}>
          <Field label="Plant Name *" error={errors.name} colors={colors} typography={typography}>
            <TextInput
              style={[s.input, errors.name && s.inputError]}
              value={form.name} onChangeText={v => update('name', v)}
              placeholder="e.g. Tomato" placeholderTextColor={colors.textSecondary}
            />
          </Field>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <InlineDropdown
                label="Plant Type" value={form.type} options={typeOptions}
                onSelect={v => update('type', v)}
                error={errors.type} colors={colors} typography={typography}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InlineDropdown
                label="Sunlight" value={form.sunlight} options={sunOptions}
                onSelect={v => update('sunlight', v)}
                colors={colors} typography={typography}
              />
            </View>
          </View>

          <InlineDropdown
            label="Difficulty" value={form.difficulty} options={diffOptions}
            onSelect={v => update('difficulty', v)}
            error={errors.difficulty} colors={colors} typography={typography}
          />

          <Field label="Watering Schedule *" error={errors.watering} colors={colors} typography={typography}>
            <TextInput
              style={[s.input, errors.watering && s.inputError]}
              value={form.watering} onChangeText={v => update('watering', v)}
              placeholder="e.g. Every 2–3 days" placeholderTextColor={colors.textSecondary}
            />
          </Field>

          <View style={s.row}>
            <Field label="Soil Type" colors={colors} typography={typography} half>
              <TextInput
                style={s.input} value={form.soil} onChangeText={v => update('soil', v)}
                placeholder="e.g. Loamy" placeholderTextColor={colors.textSecondary}
              />
            </Field>
            <Field label="Location" colors={colors} typography={typography} half>
              <TextInput
                style={s.input} value={form.location} onChangeText={v => update('location', v)}
                placeholder="e.g. Garden bed" placeholderTextColor={colors.textSecondary}
              />
            </Field>
          </View>

          <Field label="Common Pests" colors={colors} typography={typography}>
            <TextInput
              style={s.input} value={form.pests} onChangeText={v => update('pests', v)}
              placeholder="e.g. Aphids, whitefly" placeholderTextColor={colors.textSecondary}
            />
          </Field>

          <Field label="Description / Notes" colors={colors} typography={typography}>
            <TextInput
              style={[s.input, s.textarea]}
              value={form.description} onChangeText={v => update('description', v)}
              placeholder="Care tips, observations..." placeholderTextColor={colors.textSecondary}
              multiline numberOfLines={4}
            />
          </Field>
        </View>

        {/* ── Images Section ── */}
        <Text style={s.cardTitle}>Add Images</Text>
        <Text style={{ ...typography.caption, color: colors.textSecondary, marginBottom: 4 }}>
          Add up to 5 images — first one becomes the cover
        </Text>
        <View style={s.imageRow}>
          {images.map((uri, i) => (
            <View key={uri} style={{
              width: 72, height: 72, borderRadius: 12,
              backgroundColor: colors.card, elevation: 4,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15, shadowRadius: 4,
              borderWidth: 1, borderColor: 'rgba(46, 125, 50, 0.2)',
            }}>
              <View style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
                <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                {i === 0 && (
                  <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', paddingVertical: 2,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>COVER</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => removeImage(i)}
                style={{
                  position: 'absolute', top: -5, right: -5,
                  backgroundColor: colors.error, borderRadius: 10, padding: 2,
                  elevation: 3, zIndex: 1,
                }}
              >
                <MaterialIcons name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {images.length < 5 && (
            <TouchableOpacity
              onPress={pickImage} activeOpacity={0.75}
              style={{
                width: 72, height: 72, borderRadius: 12,
                borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed',
                backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
                elevation: 2, shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3,
              }}
            >
              <MaterialIcons name="add-photo-alternate" size={26} color={colors.textSecondary} />
              <Text style={s.addImageLabel}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
          {saving ? <ActivityIndicator color="#fff" /> : (
            <Text style={s.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default AddPlantScreen;