// src/components/PlantCard.js
import React from 'react';
import {
  View, Text, Image, StyleSheet,
  TouchableNativeFeedback, TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { plantImages } from '../utils/imageMap';

const DIFFICULTY_COLOR = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };
const TYPE_ICON = { vegetable: 'eco', herb: 'spa', flower: 'local-florist' };

// Variant: 'list'
const ListCard = ({ plant, onPress, isFavourite, onFavouriteToggle, nickname, personalName, colors, typography }) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(colors.primaryContainer, false)}
  >
    <View style={{
      flexDirection: 'row', backgroundColor: colors.card,
      borderRadius: 25, marginBottom: 12, overflow: 'hidden',
      height: 140,
      elevation: 2, shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(46, 125, 50, 0.15)',
    }}>
      {/* Left image */}
      <Image
        source={plantImages[plant.imageUrl] ? plantImages[plant.imageUrl] : { uri: plant.imageUrl }}
        style={{ width: 120, height: 140 }}
        resizeMode="cover"
        defaultSource={require('../assets/placeholder.png')}
      />
      {/* Right details */}
      <View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
        {/* personalName overrides the plant name if set */}
        <Text style={{ ...typography.h3, marginBottom: 2 }} numberOfLines={1}>
          {personalName || plant.name}
        </Text>
        {/* Show original name as subtitle if personalName is set */}
        {personalName ? (
          <Text style={{ ...typography.caption, color: colors.textSecondary, marginBottom: 2 }} numberOfLines={1}>
            {plant.name}
          </Text>
        ) : null}
        {nickname ? (
          <Text style={{ ...typography.caption, color: colors.primary, marginBottom: 4 }}>
            "{nickname}"
          </Text>
        ) : null}
        <Text style={{ ...typography.caption, color: colors.textSecondary, marginBottom: 4 }} numberOfLines={1}>
          {plant.scientificName ?? plant.type}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MaterialIcons name="water-drop" size={12} color={colors.primary} />
            <Text style={{ ...typography.caption, color: colors.textSecondary, paddingRight: 10 }}>
              {plant.watering ?? '—'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MaterialIcons name="wb-sunny" size={12} color={colors.primary} />
            <Text style={{ ...typography.caption, color: colors.textSecondary }} numberOfLines={1}>
              {plant.sunlight ?? '—'}
            </Text>
          </View>
        </View>
      </View>
      {/* Heart button */}
      {onFavouriteToggle && (
        <TouchableOpacity
          onPress={() => onFavouriteToggle(plant)}
          style={{
            position: 'absolute', top: 8, right: 8,
            borderRadius: 20, padding: 5,
            zIndex: 1,
          }}
        >
          <MaterialIcons
            name={isFavourite ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFavourite ? '#E53935' : colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  </TouchableNativeFeedback>
);

// Variant: 'compact' 
const CompactCard = ({ plant, onPress, isFavourite, onFavouriteToggle, nickname, personalName, colors, typography }) => (
  <View style={{
    width: 140, marginRight: 12, backgroundColor: colors.card,
    borderRadius: 25, overflow: 'hidden', elevation: 3,
    marginBottom: 5,
    shadowColor: colors.shadowColor, shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1, shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.15)',
  }}>
    <TouchableNativeFeedback
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple(colors.primaryContainer, false)}
    >
      <View>
        <Image
          source={plantImages[plant.imageUrl] ? plantImages[plant.imageUrl] : { uri: plant.imageUrl }}
          style={{ width: '100%', height: 130 }}
          resizeMode="cover"
          defaultSource={require('../assets/placeholder.png')}
        />
        <View style={{ padding: 2, paddingBottom: 25, paddingStart: 5 }}>
          <Text style={{ ...typography.h3, fontSize: typography.h3.fontSize - 2 }} numberOfLines={1}>
            {personalName || plant.name}
          </Text>
          {nickname ? (
            <Text style={{ ...typography.caption, color: colors.primary }} numberOfLines={1}>
              "{nickname}"
            </Text>
          ) : null}
          <Text style={{ ...typography.caption, color: colors.textSecondary }} numberOfLines={1}>
            {plant.scientificName ?? plant.type}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
    {/* Heart */}
    {onFavouriteToggle && (
      <TouchableOpacity
        onPress={() => onFavouriteToggle(plant)}
        style={{
          position: 'absolute', bottom: 0, right: 8,
          borderRadius: 20, padding: 5,
          zIndex: 1,
        }}
      >
        <MaterialIcons
          name={isFavourite ? 'favorite' : 'favorite-border'}
          size={18}
          color={isFavourite ? '#E53935' : colors.textSecondary}
        />
      </TouchableOpacity>
    )}
  </View>
);

// Variant: 'mini' 
const MiniCard = ({ plant, onPress, colors, typography }) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(colors.primaryContainer, false)}
  >
    <View style={{
      width: 120, height: 140, marginRight: 12, backgroundColor: colors.card,
      borderRadius: 25, overflow: 'hidden', elevation: 2, marginBottom: 5,
      shadowColor: colors.shadowColor, shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1, shadowRadius: 3, alignItems: 'center',
    }}>
      <Image
        source={plantImages[plant.imageUrl] ? plantImages[plant.imageUrl] : { uri: plant.imageUrl }}
        style={{ width: '100%', height: 110, backgroundColor: colors.surfaceVariant }}
        resizeMode="cover"
        defaultSource={require('../assets/placeholder.png')}
      />
      <Text
        style={{ ...typography.caption, fontWeight: 'bold', textAlign: 'center', padding: 6 }}
        numberOfLines={2}
      >
        {plant.name}
      </Text>
    </View>
  </TouchableNativeFeedback>
);

// Main export 
const PlantCard = ({
  plant, onPress, isFavourite, onFavouriteToggle,
  variant = 'list', compact = false, nickname, personalName,
}) => {
  const { colors, typography } = useTheme();
  const resolvedVariant = compact ? 'compact' : variant;

  if (resolvedVariant === 'compact') {
    return <CompactCard plant={plant} onPress={onPress} isFavourite={isFavourite} onFavouriteToggle={onFavouriteToggle} nickname={nickname} personalName={personalName} colors={colors} typography={typography} />;
  }
  if (resolvedVariant === 'mini') {
    return <MiniCard plant={plant} onPress={onPress} colors={colors} typography={typography} />;
  }
  return <ListCard plant={plant} onPress={onPress} isFavourite={isFavourite} onFavouriteToggle={onFavouriteToggle} nickname={nickname} personalName={personalName} colors={colors} typography={typography} />;
};

export default PlantCard;