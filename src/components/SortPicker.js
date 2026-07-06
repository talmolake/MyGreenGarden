// src/components/SortPicker.js
// A "Sort by" dropdown row that combines sun + difficulty filters
// into a single modal bottom sheet picker.
// Shows current active sort as a label next to the dropdown icon.
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SORT_OPTIONS = [
  { label: 'Sort by', sunFilter: null, diffFilter: null },
  { label: 'Full Sun', sunFilter: 'full sun', diffFilter: null },
  { label: 'Partial Shade', sunFilter: 'partial shade', diffFilter: null },
  { label: 'Easy', sunFilter: null, diffFilter: 'easy' },
  { label: 'Medium', sunFilter: null, diffFilter: 'medium' },
  { label: 'Hard', sunFilter: null, diffFilter: 'hard' },
];

const SortPicker = ({ sunFilter, diffFilter, onSunChange, onDiffChange }) => {
  const { colors, typography } = useTheme();
  const [open, setOpen] = useState(false);

const btnRef = useRef(null);
  const [btnLayout, setBtnLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Find the active label
  const active = SORT_OPTIONS.find(
    o => o.sunFilter === sunFilter && o.diffFilter === diffFilter
  );
  const activeLabel = active?.label ?? 'Sort by';
  const hasSort = sunFilter !== null || diffFilter !== null;

  const handleSelect = (opt) => {
    onSunChange(opt.sunFilter);
    onDiffChange(opt.diffFilter);
    setOpen(false);
  };

   const handleOpen = () => {
    btnRef.current?.measureInWindow((x, y, width, height) => {
      setBtnLayout({ x, y, width, height });
      setOpen(true);
    });
  };

  const s = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10 },
    btn: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: 20, borderWidth: 1.5,
      borderColor: hasSort ? colors.primary : colors.border,
      backgroundColor: hasSort ? colors.primaryContainer : colors.card,
      elevation: hasSort ? 3 : 1,
    },
    btnText: {
      ...typography.caption,
      color: hasSort ? colors.primary : colors.textSecondary,
      fontWeight: hasSort ? '700' : '500',
    },
    // Modal sheet
    overlay: { flex: 1},
    dropdown: {
      position: 'absolute',
      top: btnLayout.y + btnLayout.height + 4,
      left: btnLayout.x,
      minWidth: 200,
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
  });

  return (
       <View style={s.row}>
      {/* The trigger button — we measure its on-screen position */}
      <TouchableOpacity
        ref={btnRef}
        style={s.btn}
        onPress={handleOpen}
        activeOpacity={0.75}
      >
        <MaterialIcons
          name="sort"
          size={16}
          color={hasSort ? colors.primary : colors.textSecondary}
        />
        <Text style={s.btnText}>{activeLabel}</Text>
        <MaterialIcons
          name={open ? 'arrow-drop-up' : 'arrow-drop-down'}
          size={18}
          color={hasSort ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>
 
      {/* Full-screen transparent modal so tapping outside closes it */}
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={s.overlay}>
            {/* Stop tap propagation so tapping the dropdown itself doesn't close */}
            <TouchableWithoutFeedback>
              <View style={s.dropdown}>
                {SORT_OPTIONS.map((opt, i) => {
                  const isActive = opt.sunFilter === sunFilter && opt.diffFilter === diffFilter;
                  const isLast = i === SORT_OPTIONS.length - 1;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      style={[s.option, isLast && s.optionLast]}
                      onPress={() => handleSelect(opt)}
                    >
                      <Text style={[s.optionText, isActive && s.optionTextActive]}>
                        {opt.label}
                      </Text>
                      {isActive && (
                        <MaterialIcons name="check" size={18} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SortPicker;