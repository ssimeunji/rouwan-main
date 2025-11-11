import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../hooks/useHabits';
import { useNavigation } from '@react-navigation/native';

export default function HabitItem({ habit, date }) {
  const { toggleHabit, deleteHabit } = useHabits();
  const navigation = useNavigation();
  const done = habit.records && habit.records[date];

  function handleLongPress() {
    Alert.alert(
      '습관 관리',
      `'${habit.title}' 습관을 어떻게 할까요?`,
      [
        { text: '삭제', onPress: () => deleteHabit(habit.id), style: 'destructive' },
        { text: '수정', onPress: () => navigation.navigate('Edit', { habit }) },
        { text: '취소', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <View style={[styles.row, { backgroundColor: habit.color || '#fff' }]}>
        <View style={styles.left}>
          <Text style={styles.title}>{habit.icon} {habit.title}</Text>
          <Text style={styles.days}>{habit.days.join(', ')}</Text>
        </View>
        <TouchableOpacity
          accessibilityLabel={`toggle-${habit.id}`}
          style={[styles.check, done ? styles.checked : styles.unchecked]}
          onPress={() => toggleHabit(habit.id, date)}
        >
          <Text style={styles.checkText}>{done ? '완료' : '체크'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, marginBottom: 8 },
  left: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  days: { color: '#666', marginTop: 4 },
  check: { padding: 10, borderRadius: 8 },
  checked: { backgroundColor: '#4caf50' },
  unchecked: { backgroundColor: '#ddd' },
  checkText: { color: '#fff' }
});
