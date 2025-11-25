import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useHabits } from '../hooks/useHabits';
import HabitItem from '../components/HabitItem';
import { useTheme } from '../context/ThemeContext';

export default function ManageHabitsScreen() {
  const { habits, reorderHabits } = useHabits(); 
  const { isDarkMode } = useTheme();

  const renderItem = ({ item, drag, isActive }) => {
    return (
      // HabitItem에 drag prop을 전달하여 드래그 핸들러로 사용
      <HabitItem habit={item} drag={drag} isActive={isActive} />
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={styles.title}>습관 순서 변경</Text>
      </View>
      <DraggableFlatList
        data={habits}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => reorderHabits(data)}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});