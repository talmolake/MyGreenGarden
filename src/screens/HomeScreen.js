// src/screens/HomeScreen.js
import React, {useState, useMemo} from 'react';
import {
  View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity,
  StatusBar, RefreshControl, Modal, TextInput, Alert,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {usePlants} from '../hooks/usePlants';
import {useFavourites} from '../hooks/useFavourites';
import { usePlantSearch } from '../hooks/usePlantSearch';
import PlantCard from '../components/PlantCard';
import { MaterialIcons } from '@expo/vector-icons'; 
import AppHeader from '../components/AppHeader';

import SearchBar from '../components/SearchBar';
import { handleToggleFavourite } from '../utils/favActions';

// Care Highlights Data
const CARE_HIGHLIGHTS = [
  {
    key: 'water',
    icon: 'water-drop',
    label: 'Water',
    tip: 'Keep soil evenly moist. Water every 2–3 days during hot/dry periods.',
    color: '#E3F2FD',
    iconColor: '#1565C0',
    labelColor: '#1565C0',
  },
  {
    key: 'sun',
    icon: 'wb-sunny',
    label: 'Sun',
    tip: 'Most plants need full sun (6–8 hrs). Avoid heavy shade.',
    color: '#FFF8E1',
    iconColor: '#F57F17',
    labelColor: '#F57F17',
  },
  {
    key: 'soil',
    icon: 'landscape',
    label: 'Soil',
    tip: 'Fertile, well-draining loamy soil enriched with compost. pH 6.0–6.8',
    color: '#F1F8E9',
    iconColor: '#33691E',
    labelColor: '#33691E',
  },
];

// Care Highlight Row 
const CareHighlightRow = ({ item, colors, typography, isLast }) => (
  <View>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 72,
      overflow: 'visible',
      marginHorizontal: 16, 
      marginBottom: 5,
      paddingVertical: 8,
    }}>
      {/* Coloured text area */}
      <View style={{
        position: 'absolute',
        left: 56,
        right: 0,
        height: 70, 
        alignSelf: 'center',
        backgroundColor: colors.primaryContainer,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        justifyContent: 'center',
        paddingLeft: 50,
        paddingRight: 14,
        paddingVertical: 14,
      }}>
        <Text style={{
          ...typography.bodySmall,
          color: colors.text,
          lineHeight: 15,
          fontWeight: 'bold',
        }}>
          {item.tip}
        </Text>
      </View>
      {/* Elevated icon box */}
      <View style={{
        width: 80,
        height: 80,        
        backgroundColor: colors.card,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 1,
        marginVertical: -8, 
        gap: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        zIndex: 1,
      }}>
        <MaterialIcons name={item.icon} size={22} color={item.iconColor} />
        <Text style={{ fontSize: 11, fontWeight: '700', color: item.labelColor }}>
          {item.label}
        </Text>
      </View>
    </View>
  </View>
);

// Watering Calculator
const WateringCalculator = ({colors, typography}) => {
  const [mlValue, setMlValue] = useState('');
  const [flozValue, setFlozValue] = useState('');
  const [direction, setDirection] = useState('ml_to_floz');
  const [error, setError] = useState('');

  const ML_TO_FLOZ = 0.033814;
  const FLOZ_TO_ML = 29.5735;

  const handleMlChange = val => {
    setMlValue(val);
    setError('');
    if (val === '' || val === '-') { setFlozValue(''); return; }
    const num = parseFloat(val);
    if (isNaN(num)) { setError('Enter a valid number'); setFlozValue(''); return; }
    if (num < 0) { setError('Value must be positive'); setFlozValue(''); return; }
    setFlozValue((num * ML_TO_FLOZ).toFixed(2));
    setDirection('ml_to_floz');
  };

  const handleFlozChange = val => {
    setFlozValue(val);
    setError('');
    if (val === '' || val === '-') { setMlValue(''); return; }
    const num = parseFloat(val);
    if (isNaN(num)) { setError('Enter a valid number'); setMlValue(''); return; }
    if (num < 0) { setError('Value must be positive'); setMlValue(''); return; }
    setMlValue((num * FLOZ_TO_ML).toFixed(2));
    setDirection('floz_to_ml');
  };

  const s = StyleSheet.create({
    card: {backgroundColor: colors.card, borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 24, elevation: 2},
    title: {...typography.h3, marginBottom: 4},
    subtitle: {...typography.caption, marginBottom: 16},
    row: {flexDirection: 'row', alignItems: 'center', gap: 10},
    inputWrap: {flex: 1},
    label: {...typography.label, marginBottom: 4},
    input: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 10,
      padding: 12, ...typography.body, backgroundColor: colors.inputBg,
      textAlign: 'center',
    },
    arrowWrap: {alignItems: 'center', justifyContent: 'center', paddingTop: 18},
    arrow: {fontSize: 22},
    error: {color: colors.error, ...typography.caption, marginTop: 6, textAlign: 'center'},
    hint: {...typography.caption, textAlign: 'center', marginTop: 8, color: colors.textSecondary},
  });

  return (
    <View style={s.card}>
      <Text style={s.title}>Watering Calculator</Text>
      <Text style={s.subtitle}>Convert ml ↔ fl oz instantly</Text>
      <View style={s.row}>
        <View style={s.inputWrap}>
          <Text style={s.label}>Millilitres (ml)</Text>
          <TextInput
            style={s.input} keyboardType="decimal-pad"
            value={mlValue} onChangeText={handleMlChange}
            placeholder="e.g. 934" placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={s.arrowWrap}>
          <Text style={s.arrow}>{direction === 'ml_to_floz' ? '→' : '←'}</Text>
        </View>
        <View style={s.inputWrap}>
          <Text style={s.label}>Fluid Ounces (fl oz)</Text>
          <TextInput
            style={s.input} keyboardType="decimal-pad"
            value={flozValue} onChangeText={handleFlozChange}
            placeholder="e.g. 31.6" placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}
      {!error && mlValue && flozValue ? (
        <Text style={s.hint}>{mlValue} ml = {flozValue} fl oz</Text>
      ) : null}
    </View>
  );
};

//Main Home Screen 
const HomeScreen = ({navigation}) => {
  const {colors, typography} = useTheme();
  const {plants, loading} = usePlants();
  const {favourites, isFavourite, addFavourite, removeFavourite, getNickname, getPersonalName} = useFavourites();
  const [refreshing, setRefreshing] = useState(false);

const { query, setQuery, filtered } = usePlantSearch(plants);
const [searchFocused, setSearchFocused] = useState(false);
const showSearchOverlay = searchFocused || query.length > 0;

const favouritePlants = useMemo(() => {
  return plants.filter(p => favourites.some(favId => String(favId) === String(p.id)));
}, [plants, favourites]);

  const handleFavToggle = (plant) => {
  handleToggleFavourite(
    plant, 
    isFavourite(plant.id), 
    { addFavourite, removeFavourite }
  );
  };

  const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    header: {
      paddingBottom: 2,
      paddingHorizontal: 20,
    },
    headerTitle: {...typography.h1, color: colors.text, fontSize: 30},
    section: {marginTop: 10},
    sectionHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', paddingHorizontal: 16, marginBottom: 10,
    },
    sectionTitle: {...typography.h3},
    seeAll: {...typography.caption, color: colors.primary, fontWeight: '700'},
    hList: {paddingLeft: 16, paddingRight: 4},
    emptyFav: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      marginHorizontal: 16,
      padding: 20,
      alignItems: 'center',
    },
    emptyFavText: {...typography.body, color: colors.textSecondary, textAlign: 'center'},
    emptyFavIcon: {fontSize: 36, marginBottom: 8},

    // ── Search overlay styles 
    overlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: colors.background,
      paddingTop: 130,
      zIndex: 99,
    },
    overlayHeader: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16, paddingBottom: 10,
    },
    overlayTitle: { ...typography.h3 },
    cancelBtn: { ...typography.caption, color: colors.primary, fontWeight: '700' },
    overlayEmpty: { alignItems: 'center', paddingTop: 60 },
    overlayEmptyIcon: { fontSize: 40, marginBottom: 12 },
    overlayEmptyText: { ...typography.body, color: colors.textSecondary },
    });

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

       <AppHeader
        left={<Text style={{ ...typography.h1, color: colors.text, fontSize: 28 }}>Hi!</Text>}
    />
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search plants..."
        />

  <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} colors={[colors.primary]} />}>

        {/* ── Care Highlights ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>General Care Highlights</Text>
            </View>
            <View style={{
              marginHorizontal: 16,
              borderRadius: 30,
              backgroundColor: colors.card,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              overflow: 'hidden',
              paddingVertical: 8,
            }}>
              {CARE_HIGHLIGHTS.map((item, index) => (
                <CareHighlightRow
                  key={item.key}
                  item={item}
                  colors={colors}
                  typography={typography}
                  isLast={index === CARE_HIGHLIGHTS.length - 1}
                />
              ))}
            </View>
          </View>

        {/*Favourites Section */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Your Favourites</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Favourites')}>
              <Text style={s.seeAll}>view more</Text>
            </TouchableOpacity>
          </View>

          {favouritePlants.length === 0 ? (
            <View style={s.emptyFav}>
              <Text style={s.emptyFavText}>
                No favourites yet.{'\n'}
              </Text>
            </View>
          ) : (
            <FlatList
              horizontal
              data={favouritePlants}
              keyExtractor={i => i.id}
              renderItem={({item}) => (
                <PlantCard
                  plant={item} compact
                  onPress={() => navigation.navigate('PlantDetail', {plant: item})}
                  isFavourite
                  onFavouriteToggle={handleFavToggle}
                  nickname={getNickname(item.id)}
                  personalName={getPersonalName(item.id)}
                />
              )}
              contentContainerStyle={s.hList}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        {/* Plant Guides Section */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Plant Guides</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Plants')}>
              <Text style={s.seeAll}>view more</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={query ? filtered : plants.slice(0, 10)}
            keyExtractor={i => i.id}
            renderItem={({item}) => (
              <PlantCard
                plant={item} variant='mini'
                onPress={() => navigation.navigate('PlantDetail', {plant: item})}
                isFavourite={isFavourite(item.id)}
                onFavouriteToggle={handleFavToggle}
              />
            )}
            contentContainerStyle={s.hList}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/*  Watering Calculator  */}
<View style={s.section}>
  <View style={s.sectionHeader}>
    <Text style={s.sectionTitle}>Tools</Text>
  </View>

  <View style={{
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
    marginBottom: 24,
  }}>

    {/* Elevated icon box — same as CareHighlightRow */}
    <View style={{
      width: 120, height: 130,
      backgroundColor: colors.card,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
      marginVertical: 10,
      gap: 4,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      zIndex: 1,
    }}>
      <MaterialIcons name="water-drop" size={24} color={colors.primary} />
    </View>

    {/* Text area — sits behind/beside icon */}
    <View style={{
      flex: 1,
      backgroundColor: colors.primaryContainer,
      marginLeft: -12,
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
      paddingLeft: 20,
      paddingRight: 14,
      paddingTop: 5,
      paddingBottom: 5,
      minHeight: 80,
      justifyContent: 'space-between',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    }}>
      <View>
        <Text style={{ ...typography.h3, color: colors.text, marginBottom: 4, fontWeight: 'bold' }}>
          Watering Calculator
        </Text>
        <Text style={{ ...typography.caption, color: colors.textSecondary, lineHeight: 18 }}>
          Convert ml to fluid ounces for watering measurements
        </Text>
      </View>

      {/* Open button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('WateringCalculator')}
        style={{
          alignSelf: 'flex-end',
          marginTop: 10,
          backgroundColor: colors.primary,
          borderRadius: 30,
          paddingVertical: 7,
          paddingHorizontal: 45,
          right: 20,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ height:20, color: '#fff', fontWeight: '700' }}>
          Open
        </Text>
      </TouchableOpacity>
    </View>

  </View>
</View>

      </ScrollView>

       {/*  Search overlay — slides over everything when focused/typing  */}
      {showSearchOverlay && (
        <View style={s.overlay}>
           <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,  // fills only the View below search bar
            backgroundColor: colors.background,
            zIndex: 99,
          }}>
          <View style={s.overlayHeader}>
            <Text style={s.overlayTitle}>
              {query.length > 0 ? `Results for "${query}"` : 'Search Plants'}
            </Text>
            <TouchableOpacity onPress={() => { setQuery(''); setSearchFocused(false); }}>
              <Text style={s.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
 
          <FlatList
            data={filtered}
            keyExtractor={i => i.id}
            renderItem={({item}) => (
              <PlantCard
                plant={item}
                onPress={() => {
                  setQuery('');
                  setSearchFocused(false);
                  navigation.navigate('PlantDetail', {plant: item});
                }}
                isFavourite={isFavourite(item.id)}
                onFavouriteToggle={handleFavToggle}
                nickname={getNickname(item.id)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={s.overlayEmpty}>
                <Text style={s.overlayEmptyIcon}>🌿</Text>
                <Text style={s.overlayEmptyText}>No plants match "{query}"</Text>
              </View>
            }
          />
        </View>
        </View>
      )}

    </View>
    </View>
  );
};

export default HomeScreen;
