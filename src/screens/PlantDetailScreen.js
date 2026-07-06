// src/screens/PlantDetailScreen.js
import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, FlatList, Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../hooks/useFavourites';
import { MaterialIcons } from '@expo/vector-icons';
import { plantImages } from '../utils/imageMap';
import { handleToggleFavourite } from '../utils/favActions';
import AppHeader from '../components/AppHeader';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 40;
const IMAGE_HEIGHT = 220;

// Dot indicators 
const DotIndicators = ({ count, activeIndex }) => {
  if (count <= 1) return null;
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'center',
      alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 12,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{
          height: 7,
          width: i === activeIndex ? 22 : 7,
          borderRadius: 4,
          backgroundColor: i === activeIndex ? '#2E7D32' : '#C8E6C9',
        }} />
      ))}
    </View>
  );
};

// Care guide row 
const InfoRow = ({ icon, label, value, colors, typography }) => (
  <View style={{ marginBottom: 14 }}>
    {/* Label line: icon + label text side by side */}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
      <MaterialIcons name={icon} size={14} color="rgba(255,255,255,0.85)" />
      <Text style={{
        ...typography.caption,
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        fontSize: 11,
      }}>
        {label}
      </Text>
    </View>
    {/* Value sits below, indented to align with the label text */}
    <Text style={{
      ...typography.body,
      color: '#fff',
      fontWeight: '500',
      paddingLeft: 20, // icon(14) + gap(6) = 20
    }}>
      {value || '—'}
    </Text>
  </View>
);

// Main Screen 
const PlantDetailScreen = ({ route, navigation }) => {
  const { plant } = route.params;
  const { colors, typography } = useTheme();
  const { isFavourite, addFavourite, removeFavourite, getNickname, getPersonalName } = useFavourites();
  const fav = isFavourite(plant.id);
  const nickname = getNickname(plant.id);
  const personalName = getPersonalName(plant.id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imageList = plant.imageUrls?.length > 0
    ? plant.imageUrls
    : [plant.imageUrl];

  const handleFavToggle = () =>
    handleToggleFavourite(plant, fav, { addFavourite, removeFavourite });

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // Header 
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    backBtn: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },

    // Image card 
    imageCard: {
      marginHorizontal: 20,
      borderRadius: 20,
      backgroundColor: colors.card,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      overflow: 'hidden',
    },

    // Heart overlaid on top-right of image
    favOverlay: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 10,
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderRadius: 20,
      padding: 7,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },

    // Body 
    body: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4 },
    nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, gap: 10 },
    name: { ...typography.h1, flex: 1 },

    // Difficulty — plain red text, no badge
    difficultyText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#E53935',
    },

    nickname: { ...typography.bodySmall, color: colors.primary, marginBottom: 6 },

    typeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      backgroundColor: colors.chip,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginBottom: 14,
    },
    typeChipText: {
      ...typography.caption,
      color: colors.chipText,
      fontWeight: '600',
      textTransform: 'capitalize',
    },

    descText: {
      ...typography.body,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 20,
    },

    // Care guide card 
    careCard: {
      backgroundColor: colors.primary,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
      marginHorizontal: 1,
      marginBottom: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    careTitle: {
      ...typography.h3,
      color: '#fff',
      marginBottom: 16,
      fontWeight: 'bold',
    },

    // Fav button row 
    favButtonRow: {
      marginHorizontal: 20,
      marginBottom: 40,
    },
  });

  return (
    <View style={s.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <AppHeader/>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image card with overlapping heart */}
        <View style={s.imageCard}>
          {/* Heart absolutely positioned over the image */}
          <TouchableOpacity style={s.favOverlay} onPress={handleFavToggle} activeOpacity={0.8}>
            <MaterialIcons
              name={fav ? 'favorite' : 'favorite-border'}
              size={22}
              color={fav ? '#FF5252' : colors.text}
            />
          </TouchableOpacity>

          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={imageList}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / IMAGE_WIDTH);
              setActiveImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image
                source={plantImages[item] ? plantImages[item] : { uri: item }}
                style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                resizeMode="cover"
              />
            )}
          />
          <DotIndicators count={imageList.length} activeIndex={activeImageIndex} />
        </View>

        {/* ── Plant info ── */}
        <View style={s.body}>
          <View style={s.nameRow}>
            <Text style={s.name}>{personalName || plant.name}</Text>
            {plant.difficulty ? (
              <Text style={s.difficultyText}>
                Difficulty: {plant.difficulty.charAt(0).toUpperCase() + plant.difficulty.slice(1)}
              </Text>
            ) : null}
          </View>
           {/*Show original name as subtitle when personalName overrides it */}
          {personalName ? (
            <Text style={s.originalName}>{plant.name}</Text>
          ) : null}

          {nickname ? <Text style={s.nickname}>"{nickname}"</Text> : null}

          <View style={s.typeChip}>
            <MaterialIcons name="eco" size={13} color={colors.primary} />
            <Text style={s.typeChipText}>{plant.type}</Text>
          </View>

          {plant.description ? (
            <Text style={s.descText}>{plant.description}</Text>
          ) : null}
        </View>

        {/* ── Care Guide ── */}
        <View style={s.careCard}>
          <Text style={s.careTitle}>Care Guide</Text>
          <InfoRow icon="wb-sunny"     label="Sunlight"     value={plant.sunlight}  colors={colors} typography={typography} />
          <InfoRow icon="water-drop"   label="Watering"     value={plant.watering}  colors={colors} typography={typography} />
          <InfoRow icon="landscape"    label="Soil Type"    value={plant.soil}      colors={colors} typography={typography} />
          <InfoRow icon="location-on"  label="Location"     value={plant.location}  colors={colors} typography={typography} />
          <InfoRow icon="bug-report"   label="Common Pests" value={plant.pests}     colors={colors} typography={typography} />
        </View>

        {/* ── Favourite button ── */}
        <View style={s.favButtonRow}>
          <TouchableOpacity
            onPress={handleFavToggle}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: fav ? colors.error : colors.primary,
              borderRadius: 16,
              padding: 16,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons name={fav ? 'favorite' : 'favorite-border'} size={20} color="#fff" />
            <Text style={{ ...typography.button, color: '#fff' }}>
              {fav ? 'Remove from Favourites' : 'Add to Favourites'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default PlantDetailScreen;