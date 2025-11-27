import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useHabits } from '../hooks/useHabits';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

export default function HabitItem({ habit, date, drag, isActive }) {
  const { toggleHabit } = useHabits();
  const { isDarkMode, theme } = useTheme();
  const isCompleted = habit.records && habit.records[date];

  const handleToggle = () => {
    // 'drag' prop이 있으면 토글 기능을 비활성화 (순서 변경 화면)
    if (drag) return;
    toggleHabit(habit.id, date);
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      onLongPress={drag}
      delayLongPress={100}
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
        isActive && styles.active,
      ]}
      activeOpacity={drag ? 0.7 : 0.5}
    >
      <View style={styles.leftContainer}>
        <Text style={styles.icon}>{habit.icon}</Text>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{habit.title}</Text>
      </View>

      {drag ? (
        <Icon name="menu" size={24} color={isDarkMode ? '#888' : '#ccc'} />
      ) : (
        <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
          {isCompleted ? (
            <Icon name="check-square" size={24} color={theme} />
          ) : (
            <Icon name="square" size={24} color={isDarkMode ? '#555' : '#ccc'} />
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  lightContainer: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#272727',
  },
  active: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.2,
    elevation: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1, // Allow text to shrink if needed
  },
  darkText: {
    color: '#E0E0E0',
  },
  checkbox: {
    padding: 4, // Increase touchable area
  },
});