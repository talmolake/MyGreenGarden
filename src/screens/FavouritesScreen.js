// src/screens/FavouritesScreen.js
import React, { useState, useMemo, useRef } from 'react';
import {
  View, FlatList, Text, StyleSheet, StatusBar, Alert,
  Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { usePlants } from '../hooks/usePlants';
import { useFavourites } from '../hooks/useFavourites';
import { usePlantSearch } from '../hooks/usePlantSearch';
import PlantCard from '../components/PlantCard';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import SortPicker from '../components/SortPicker';
import FAB from '../components/FAB';
import AppHeader from '../components/AppHeader';
import ConfirmModal from '../components/ConfirmModal';

const TYPE_FILTERS = [
  { label: 'All', value: null },
  { label: 'Vegetable', value: 'vegetable' },
  { label: 'Herb', value: 'herb' },
  { label: 'Flower', value: 'flower' },
];

// Edit Modal 
const EditModal = ({ visible, plant, currentNickname, currentPersonalName, onSave, onClose, colors, typography }) => {
  const [nickname, setNickname] = useState(currentNickname ?? '');
  const [personalName, setPersonalName] = useState(currentPersonalName ?? '');

  // Reset fields when modal opens for a new plant
  React.useEffect(() => {
    if (visible) {
      setNickname(currentNickname ?? '');
      setPersonalName(currentPersonalName ?? '');
    }
  }, [visible, currentNickname, currentPersonalName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal card — slides up from bottom */}
        <View style={{
          backgroundColor: colors.card,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 24,
          paddingBottom: 40,
          gap: 16,
        }}>
          {/* Handle bar */}
          <View style={{
            width: 40, height: 4, borderRadius: 2,
            backgroundColor: colors.border,
            alignSelf: 'center', marginBottom: 4,
          }} />

          <Text style={{ ...typography.h2, marginBottom: 4 }}>
            Edit "{plant?.name}"
          </Text>
          <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: -8 }}>
            These changes only apply to your garden, the original plant guide stays the same.
          </Text>

          {/* Personal name field */}
          <View style={{ gap: 6 }}>
            <Text style={{ ...typography.label, color: colors.text }}>
              Plant Name
            </Text>
            <TextInput
              value={personalName}
              onChangeText={setPersonalName}
              placeholder={plant?.name ?? 'e.g. My Basil'}
              placeholderTextColor={colors.textSecondary}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 30,
                padding: 12,
                ...typography.body,
                color: colors.text,
                backgroundColor: colors.background,
              }}
            />
            <Text style={{ ...typography.caption, color: colors.textSecondary }}>
              Leave blank to use the original name
            </Text>
          </View>

          {/* Nickname field */}
          <View style={{ gap: 6 }}>
            <Text style={{ ...typography.label, color: colors.text }}>
              Nickname
            </Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              placeholder='e.g. "Kitchen Buddy"'
              placeholderTextColor={colors.textSecondary}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 30,
                padding: 12,
                ...typography.body,
                color: colors.text,
                backgroundColor: colors.background,
              }}
            />
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1, padding: 14, borderRadius: 30,
                borderWidth: 1, borderColor: colors.border,
                alignItems: 'center',
              }}
            >
              <Text style={{ ...typography.button, color: colors.text }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSave({ nickname, personalName })}
              style={{
                flex: 2, padding: 14, borderRadius: 30,
                backgroundColor: colors.primary,
                alignItems: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Text style={{ ...typography.button, color: '#fff' }}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Swipeable Plant Card 
const SwipeablePlantRow = ({ item, onPress, onEdit, onRemove, isFavourite, nickname, personalName, colors, typography }) => {
  const swipeRef = useRef(null);

  const closeSwipe = () => swipeRef.current?.close();

  // Green edit action — revealed on swipe RIGHT
  const renderLeftActions = () => (
    <TouchableOpacity
      onPress={() => { closeSwipe(); onEdit(); }}
      style={{
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 25,
        marginBottom: 12,
        marginRight: 4,
      }}
    >
      <MaterialIcons name="edit" size={24} color="#fff" />
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', marginTop: 4 }}>Edit</Text>
    </TouchableOpacity>
  );

  // Red remove action — revealed on swipe LEFT
  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => { closeSwipe(); onRemove(); }}
      style={{
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 25,
        marginBottom: 12,
        marginLeft: 4,
      }}
    >
      <MaterialIcons name="favorite-border" size={24} color="#fff" />
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', marginTop: 4 }}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
      friction={2}
    >
      <PlantCard
        plant={item}
        onPress={onPress}
        isFavourite={isFavourite}
        onFavouriteToggle={onRemove}
        nickname={nickname}
        personalName={personalName}
      />
    </Swipeable>
  );
};

//  Main Screen 
const FavouritesScreen = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const { plants } = usePlants();
  const {
    favourites, isFavourite, removeFavourite,
    getNickname, getPersonalName, updateFavouriteData,
  } = useFavourites();

  //  Edit modal state 
  const [editingPlant, setEditingPlant] = useState(null);
  const editModalVisible = editingPlant !== null;

  const favPlants = useMemo(
    () => plants.filter(p => favourites.some(id => String(id) === String(p.id))),
    [plants, favourites]
  );

  const {
    query, setQuery,
    typeFilter, setTypeFilter,
    sunFilter, setSunFilter,
    diffFilter, setDiffFilter,
    filtered,
  } = usePlantSearch(favPlants);

  const handleRemove = (plant) => {
    Alert.alert(
      'Remove Favourite',
      `Remove ${getPersonalName(plant.id) ?? plant.name} from your garden?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavourite(plant.id),
        },
      ]
    );
  };

  const handleEditSave = async ({ nickname, personalName }) => {
    if (!editingPlant) return;
    await updateFavouriteData(editingPlant.id, { nickname, personalName });
    setEditingPlant(null);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.background, elevation: 0},
    headerTitle: { ...typography.h2, paddingHorizontal: 16, paddingBottom: 8 },
    list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
    empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { ...typography.h3, textAlign: 'center', marginBottom: 8 },
    emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
    count: { ...typography.caption, paddingHorizontal: 16, paddingBottom: 4, color: colors.textSecondary },
    // Swipe hint shown at top when there are plants
    swipeHint: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 6, paddingHorizontal: 16, marginBottom: 4,
    },
    swipeHintText: { ...typography.caption, color: colors.textSecondary, fontStyle: 'italic' },
  });

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.surface} barStyle={colors.statusBar} />

      <View style={s.header}>
        <AppHeader title = ""/> 
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search your plants..."
        />
        <CategoryChips filters={TYPE_FILTERS} selected={typeFilter} onSelect={setTypeFilter} />
        <SortPicker
          sunFilter={sunFilter}
          diffFilter={diffFilter}
          onSunChange={setSunFilter}
          onDiffChange={setDiffFilter}
        />
      </View>

          {/* Swipe hint — subtle, only shown when there are plants */}
          <View style={s.swipeHint}>
            <MaterialIcons name="swipe" size={14} color={colors.textSecondary} />
            <Text style={s.swipeHintText}>Swipe right to edit · left to remove</Text>
          </View>


      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <SwipeablePlantRow
            item={item}
            onPress={() => navigation.navigate('PlantDetail', { plant: item })}
            onEdit={() => setEditingPlant(item)}
            onRemove={() => handleRemove(item)}
            isFavourite={isFavourite(item.id)}
            nickname={getNickname(item.id)}
            personalName={getPersonalName(item.id)}
            colors={colors}
            typography={typography}
          />
        )}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No favourites yet</Text>
            <Text style={s.emptyText}>
              Browse the plant guides and tap the heart icon to save your favourite plants here.
            </Text>
          </View>
        }
      />

      <FAB onPress={() => navigation.navigate('AddPlant')} />

      {/*  Edit Modal  */}
      <EditModal
        visible={editModalVisible}
        plant={editingPlant}
        currentNickname={editingPlant ? getNickname(editingPlant.id) : ''}
        currentPersonalName={editingPlant ? getPersonalName(editingPlant.id) : ''}
        onSave={handleEditSave}
        onClose={() => setEditingPlant(null)}
        colors={colors}
        typography={typography}
      />
    </View>
  );
};

export default FavouritesScreen;