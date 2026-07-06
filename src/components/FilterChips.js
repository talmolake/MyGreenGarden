// src/components/FilterChips.js
import React from 'react';
import {ScrollView, TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const FilterChips = ({filters, selected, onSelect}) => {
  const {colors, typography, typeface} = useTheme();

  if (!colors || !typography) return null;

  const s = React.useMemo(() => StyleSheet.create({
    scroll: { paddingHorizontal: 16, paddingVertical: 8 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
    },
    chipText: { ...typography.caption, fontFamily: typeface, fontWeight: '600' },
  }), [colors, typography, typeface])

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
      {filters.map(f => {
        const active = selected === f.value;
        return (
          <TouchableOpacity
            key={f.value}
            style={[
              s.chip,
              {
                backgroundColor: active ? colors.primary : colors.chip,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(active ? null : f.value)}
            activeOpacity={0.7}>
            <Text style={[s.chipText, {color: active ? '#fff' : colors.chipText}]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FilterChips;
