// src/components/SearchBar.js
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SearchBar = ({ value, onChangeText, placeholder = 'Search plants...', onClear }) => {
  const { colors, typography } = useTheme();

  const s = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginVertical: 8,
      gap: 8,
    },
    inputWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBg,
      borderRadius: 30,
      paddingHorizontal: 12,
      height: 46,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopColor: 'rgba(0,0,0,0.15)',
      elevation: 0,
    },
    input: {
      flex: 1,
      ...typography.body,
      paddingVertical: 0,
      color: colors.text,
    },
    searchBtn: {
      width: 46,
      height: 46,
      borderRadius: 50,
      backgroundColor: colors.inputBg,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
    },
  });

  return (
    <View style={s.container}>
      {/* Input */}
      <View style={s.inputWrap}>
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
        />
        {value?.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <MaterialIcons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search button */}
      <TouchableOpacity style={s.searchBtn} activeOpacity={0.85}>
        <MaterialIcons name="search" size={22} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;