// src/screens/PlantsScreen.js
import React, {useState, useMemo} from 'react';
import {View, FlatList, StyleSheet, Text, StatusBar} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {usePlants} from '../hooks/usePlants';
import {useFavourites} from '../hooks/useFavourites';
import { usePlantSearch } from '../hooks/usePlantSearch';
import PlantCard from '../components/PlantCard';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import CategoryChips from '../components/CategoryChips';
import SortPicker from '../components/SortPicker';
import FAB from '../components/FAB';
import AppHeader from '../components/AppHeader';

import { handleToggleFavourite } from '../utils/favActions';

const TYPE_FILTERS = [
  {label: 'All', value: null},
  {label: 'Vegetable', value: 'vegetable'},
  {label: 'Herb', value: 'herb'},
  {label: 'Flower', value: 'flower'},
];
const PlantsScreen = ({navigation}) => {
  const {colors, typography} = useTheme();
  const {plants, loading} = usePlants();
  const {isFavourite, addFavourite, removeFavourite} = useFavourites();


   const {
    query, setQuery,
    typeFilter, setTypeFilter,
    sunFilter, setSunFilter,
    diffFilter, setDiffFilter,
    filtered,
  } = usePlantSearch(plants); 


  const handleFavToggle = async plant => {
  handleToggleFavourite(
    plant,
    isFavourite(plant.id),
    { addFavourite, removeFavourite }
  );
  };

  const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    header: {backgroundColor: colors.background, elevation: 1},
    headerTitle: {...typography.h2, paddingHorizontal: 16, paddingBottom: 8},
    list: {paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100},
    empty: {alignItems: 'center', paddingTop: 60},
    emptyText: {...typography.body, color: colors.textSecondary},
    emptyIcon: {fontSize: 48, marginBottom: 12},
    resultCount: {...typography.caption, paddingHorizontal: 16, paddingBottom: 4, color: colors.textSecondary},
  });

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.surface} barStyle={colors.statusBar} />
      <View style={s.header}>
        <AppHeader/> 
        <SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} />
        {/*<FilterChips filters={TYPE_FILTERS} selected={typeFilter} onSelect={setTypeFilter} />
        <FilterChips filters={SUN_FILTERS} selected={sunFilter} onSelect={setSunFilter} />
        <FilterChips filters={DIFF_FILTERS} selected={diffFilter} onSelect={setDiffFilter} />*/}
        <CategoryChips filters={TYPE_FILTERS} selected={typeFilter} onSelect={setTypeFilter} />

 {/* Sort dropdown — sun + difficulty combined */}
        <SortPicker
          sunFilter={sunFilter}
          diffFilter={diffFilter}
          onSunChange={setSunFilter}
          onDiffChange={setDiffFilter}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({item}) => (
          <PlantCard
            plant={item}
            onPress={() => navigation.navigate('PlantDetail', {plant: item})}
            isFavourite={isFavourite(item.id)}
            onFavouriteToggle={handleFavToggle}
          />
        )}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>No plants match your filters :(</Text>
          </View>
        }
      />
       {/* FAB — add new plant */}
      <FAB onPress={() => navigation.navigate('AddPlant')} />
    </View>
  );
};

export default PlantsScreen;
