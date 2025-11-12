import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const HabitsContext = createContext();

const HABITS_STORAGE_KEY = 'app_habits';

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const savedHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
      } catch (e) {
        console.error('Failed to load habits.', e);
      } finally {
        setLoading(false);
      }
    };
    loadHabits();
  }, []);

  const saveHabits = async (newHabits) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (e) {
      console.error('Failed to save habits.', e);
    }
  };

  const addHabit = async (habit) => {
    const newHabit = { ...habit, id: uuidv4(), records: {} };
    const newHabits = [...habits, newHabit];
    await saveHabits(newHabits);
  };

  const updateHabit = async (updatedHabit) => {
    const newHabits = habits.map(h => (h.id === updatedHabit.id ? updatedHabit : h));
    await saveHabits(newHabits);
  };

  const deleteHabit = async (habitId) => {
    const newHabits = habits.filter(h => h.id !== habitId);
    await saveHabits(newHabits);
  };

  const toggleHabit = async (habitId, date) => {
    const newHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newRecords = { ...habit.records };
        if (newRecords[date]) {
          delete newRecords[date];
        } else {
          newRecords[date] = true;
        }
        return { ...habit, records: newRecords };
      }
      return habit;
    });
    await saveHabits(newHabits);
  };

  const reorderHabits = async (newOrder) => {
    // newOrder is the full list of habits in the new order
    await saveHabits(newOrder);
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        loading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        reorderHabits,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => useContext(HabitsContext);