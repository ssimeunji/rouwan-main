import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Switch, Platform } from 'react-native';
import IconPicker from './IconPicker';
import { useTheme } from '../context/ThemeContext';
import WeekSelector from './WeekSelector';
import { Picker } from '@react-native-picker/picker';

let DateTimePicker;
if (Platform.OS === 'android') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}
// 간단한 습관 추가 폼
const COLORS = ['', '#FFDDC1', '#FFABAB', '#FFC3A0', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF'];

export default function HabitForm({ onSubmit, habit: initialHabit }) {
  const [title, setTitle] = useState(initialHabit?.title || '');
  const [repeatMode, setRepeatMode] = useState(initialHabit?.repeatMode || 'weekly'); // 'weekly', 'never', 'custom'
  const [repeatWeekly, setRepeatWeekly] = useState(true); // 매주 반복 여부
  const [endDate, setEndDate] = useState(initialHabit?.endDate ? new Date(initialHabit.endDate) : null); // 종료 날짜
  const [days, setDays] = useState(initialHabit?.days || []);
  const [icon, setIcon] = useState(initialHabit?.icon || '');
  const [color, setColor] = useState(initialHabit?.color || '');
  const { theme } = useTheme();

  function handleSubmit() {
    if (!title.trim()) return;

    let habitStartDate = new Date().toISOString().split('T')[0];
    let habitEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

    if (repeatMode === 'never') {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      habitStartDate = startOfWeek.toISOString().split('T')[0];
      habitEndDate = endOfWeek.toISOString().split('T')[0];
    }

    const habit = {
      id: initialHabit?.id || String(Date.now()), // Date.now()를 사용하여 임시 ID 생성
      title: title.trim(),
      days,
      icon,
      color,
      records: initialHabit?.records || {},
      repeatMode,
      startDate: habitStartDate,
      endDate: habitEndDate,
    };
    onSubmit(habit);
  }





  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="예: 물 2L 마시기"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        // ensure IME composition works on Android
      />
      <Text style={styles.label}>요일</Text>
      <WeekSelector value={days} onChange={setDays} />
      <View style={styles.repeatContainer}>
        <Text style={styles.label}>반복 모드</Text>
        <Picker
          selectedValue={repeatMode}
          style={{ height: 60, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setRepeatMode(itemValue)}
        >
          <Picker.Item label="매주 반복" value="weekly" />
          <Picker.Item label="반복 안함" value="never" />
          <Picker.Item label="기간 설정" value="custom" />
        </Picker>
      </View>




      <Text style={styles.label}>아이콘</Text>
      <IconPicker value={icon} onChange={setIcon} />
      <Text style={styles.label}>색상</Text>
      <View style={styles.colorsContainer}>
        {COLORS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.colorOption,
              c !== '' ? { backgroundColor: c } : styles.noColorOptionStyle,
              color === c && [styles.selectedColor, { borderColor: theme }]]}
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
  repeatContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
  noColorOptionStyle: {
    backgroundColor: '#f0f0f0', // Light grey background for 'none'
    borderWidth: 1,
    borderColor: '#ccc', // Slightly darker border
    justifyContent: 'center',
    alignItems: 'center',
  },
  noColorText: {
    fontSize: 18, // Make the '🚫' a bit larger
    color: '#666',
  },
});
