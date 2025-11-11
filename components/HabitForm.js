import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import IconPicker from './IconPicker';
import { useTheme } from '../context/ThemeContext';
import WeekSelector from './WeekSelector';

const COLORS = ['#FFDDC1', '#FFABAB', '#FFC3A0', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFADAD'];

// 간단한 습관 추가 폼
export default function HabitForm({ onSubmit, habit: initialHabit }) {
  const [title, setTitle] = useState(initialHabit?.title || '');
  const [days, setDays] = useState(initialHabit?.days || ['Mon','Tue','Wed','Thu','Fri']);
  const [icon, setIcon] = useState(initialHabit?.icon || '💧');
  const [color, setColor] = useState(initialHabit?.color || COLORS[0]);
  const { theme } = useTheme();

  function handleSubmit() {
    if (!title.trim()) return;
    const habit = {
      id: initialHabit?.id || String(Date.now()),
      title: title.trim(),
      days,
      icon,
      color,
      records: initialHabit?.records || {},
    };
    onSubmit(habit);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="예: 물 2L 마시기" />
      <Text style={styles.label}>요일</Text>
      <WeekSelector value={days} onChange={setDays} />
      <Text style={styles.label}>아이콘</Text>
      <IconPicker value={icon} onChange={setIcon} />
      <Text style={styles.label}>색상</Text>
      <View style={styles.colorsContainer}>
        {COLORS.map(c => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              color === c && [styles.selectedColor, { borderColor: theme }],
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>
      <Button title="추가" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginTop: 8, marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 4,
  },
  selectedColor: {
    borderWidth: 3,
  },
});
