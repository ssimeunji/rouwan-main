import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = 'habits';

export async function getHabits() {
  const habitsJson = await AsyncStorage.getItem(HABITS_KEY);
  return habitsJson ? JSON.parse(habitsJson) : [];
}

export async function addHabit(habit) {
  const habits = await getHabits();
  const newHabits = [...habits, habit];
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
  return habit;
}

export async function updateHabit(updatedHabit) {
  const habits = await getHabits();
  const newHabits = habits.map(h => (h.id === updatedHabit.id ? updatedHabit : h));
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
  return updatedHabit;
}

export async function deleteHabit(id) {
  const habits = await getHabits();
  const newHabits = habits.filter(h => h.id !== id);
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
}