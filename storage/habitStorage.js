import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'ROUWAN_HABITS_V1';

// 모든 습관을 가져옵니다.
export async function getHabits() {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('getHabits error', e);
    return [];
  }
}

// 전체를 덮어쓰기 저장합니다.
export async function saveHabits(habits) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(habits));
    return true;
  } catch (e) {
    console.error('saveHabits error', e);
    return false;
  }
}

// 습관 추가
export async function addHabit(habit) {
  const habits = await getHabits();
  habits.push(habit);
  await saveHabits(habits);
  return habit;
}

// 습관 업데이트(예: records 추가)
export async function updateHabit(updated) {
  const habits = await getHabits();
  const idx = habits.findIndex(h => h.id === updated.id);
  if (idx >= 0) {
    habits[idx] = updated;
    await saveHabits(habits);
  }
  return updated;
}

// 습관 삭제
export async function deleteHabit(id) {
  const habits = await getHabits();
  const filtered = habits.filter(h => h.id !== id);
  await saveHabits(filtered);
  return filtered;
}
