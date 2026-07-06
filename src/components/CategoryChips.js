// src/components/CategoryChips.js
// Fixed-width category filter chips with elevation on selection.
// Used on both PlantsScreen and FavouritesScreen.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CategoryChips = ({ filters, selected, onSelect }) => {
  const { colors, typography } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {filters.map(f => {
        const active = selected === f.value;
        return (
          <TouchableOpacity
            key={String(f.value)}
            onPress={() => onSelect(active ? null : f.value)}
            activeOpacity={0.75}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.card,
                borderColor: active ? colors.primary : colors.border,
                // Elevation only on active chip
                elevation: active ? 5 : 1,
                shadowColor: active ? colors.primary : '#000',
                shadowOffset: { width: 0, height: active ? 3 : 1 },
                shadowOpacity: active ? 0.35 : 0.08,
                shadowRadius: active ? 6 : 2,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: active ? '#fff' : colors.textSecondary,
                  fontWeight: active ? '700' : '500',
                  fontSize: typography.caption?.fontSize ?? 13,
                },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const CHIP_WIDTH = 82;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    width: CHIP_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  label: {
    textAlign: 'center',
  },
});

export default CategoryChips;