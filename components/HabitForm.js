import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Switch, Platform } from 'react-native';
import IconPicker from './IconPicker';
import { useTheme } from '../context/ThemeContext';
import WeekSelector from './WeekSelector';
import { Picker } from '@react-native-picker/picker';

const COLORS = ['#FFDDC1', '#FFABAB', '#FFC3A0', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFADAD'];

let DateTimePicker;
if (Platform.OS === 'android') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}
// 간단한 습관 추가 폼
export default function HabitForm({ onSubmit, habit: initialHabit }) {
  const [title, setTitle] = useState(initialHabit?.title || '');
  const [repeatMode, setRepeatMode] = useState('weekly'); // 'weekly', 'never', 'custom'
  const [repeatWeekly, setRepeatWeekly] = useState(true); // 매주 반복 여부
  const [endDate, setEndDate] = useState(initialHabit?.endDate ? new Date(initialHabit.endDate) : null); // 종료 날짜
  const [days, setDays] = useState(initialHabit?.days || ['Mon','Tue','Wed','Thu','Fri']);
  const [icon, setIcon] = useState(initialHabit?.icon || '💧');
  const [color, setColor] = useState(initialHabit?.color || COLORS[0]);
  const { theme } = useTheme();

  function handleSubmit() {
    if (!title.trim()) return;
    const habit = {
      id: initialHabit?.id || String(Date.now()), // Date.now()를 사용하여 임시 ID 생성
      repeatMode,
      repeatWeekly,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null, // ISO 형식으로 변환하여 저장
      title: title.trim(),
      startDate: new Date().toISOString().split('T')[0], // 습관 시작 날짜를 현재 날짜로 설정

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
      <View style={styles.repeatContainer}>
        <Text style={styles.label}>반복 모드</Text>
        <Picker
          selectedValue={repeatMode}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setRepeatMode(itemValue)}
        >
          <Picker.Item label="매주 반복" value="weekly" />
          <Picker.Item label="반복 안함" value="never" />
          <Picker.Item label="기간 설정" value="custom" />
        </Picker>
      </View>
      <Text style={styles.label}>종료 날짜 (선택 사항)</Text>




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
});
