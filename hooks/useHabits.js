import { createContext, useContext, useEffect, useState } from 'react';
import { addHabit as addHabitStorage, getHabits, updateHabit as updateHabitStorage, deleteHabit as deleteHabitStorage } from '../storage/habitStorage';
import { formatISODate } from '../utils/dateUtils';

const HabitsContext = createContext();

// Provider는 앱 전체에서 습관 상태를 관리합니다.
export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const h = await getHabits();
      setHabits(h);
      setLoading(false);
    })();
  }, []);

  // 새로운 습관 추가
  async function addHabit(habit) {
    const saved = await addHabitStorage(habit);
    setHabits(prev => [...prev, saved]);
    return saved;
  }

  // 습관 업데이트
  async function updateHabit(habit) {
    const updated = await updateHabitStorage(habit);
    setHabits(prev => prev.map(h => (h.id === habit.id ? updated : h)));
    return updated;
  }

  // 특정 날짜에 대한 완료 기록을 토글합니다.
  async function toggleHabit(habitId, date) {
    const h = habits.find(x => x.id === habitId);
    if (!h) return;
    const records = { ...(h.records || {}) };
    records[date] = !records[date];
    const updated = { ...h, records };
    await updateHabitStorage(updated);
    setHabits(prev => prev.map(item => (item.id === habitId ? updated : item)));
    return updated;
  }

  // 습관 삭제
  async function deleteHabit(id) {
    await deleteHabitStorage(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  return (
    <HabitsContext.Provider value={{ habits, loading, addHabit, updateHabit, toggleHabit, deleteHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  return useContext(HabitsContext);
}
