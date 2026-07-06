// src/navigation/AppNavigator.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import PlantsScreen from '../screens/PlantsScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import WateringCalculatorScreen from '../screens/WateringCalculatorScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Bar 
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const s = StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: colors.tabBar,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: Math.max(insets.bottom, 6),
      paddingTop: 6,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
    },
    addTab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
    },
    addCircle: {
      width: 52,
      height: 45,
      borderRadius: 26,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -7,
      elevation: 4,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    },
    label: {
      ...typography.caption,
      fontSize: 10,
      marginTop: 2,
    },
  });

  return (
    <View style={s.bar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isAdd = route.name === 'AddPlant';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconColor = isFocused ? colors.tabIconActive : colors.tabIcon;
        const iconMap = {
          Home: 'home',
          Plants: 'local-florist',
          AddPlant: 'add',
          Favourites: 'favorite',
          Settings: 'settings',
        };

        if (isAdd) {
          return (
            <TouchableOpacity key={route.key} style={s.addTab} onPress={onPress} activeOpacity={0.8}>
              <View style={s.addCircle}>
                <MaterialIcons name="add" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} style={s.tab} onPress={onPress} activeOpacity={0.7}>
            <MaterialIcons name={iconMap[route.name] ?? 'circle'} size={24} color={iconColor} />
            <Text style={[s.label, { color: iconColor }]}>
              {options.tabBarLabel ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

//  Bottom Tab Navigator 
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // ── FIX: keyboard no longer pushes tab bar up ──
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'home' }} />
      <Tab.Screen name="Plants" component={PlantsScreen} options={{ tabBarLabel: 'plants' }} />
      <Tab.Screen name="AddPlant" component={AddPlantScreen} options={{ tabBarLabel: 'add' }} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} options={{ tabBarLabel: 'saved' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'settings' }} />
    </Tab.Navigator>
  );
};

//  Root Stack 
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="PlantDetail"
          component={PlantDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="WateringCalculator"
          component={WateringCalculatorScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="AddPlant"
          component={AddPlantScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;