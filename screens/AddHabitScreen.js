import { Alert, View } from 'react-native';
import HabitForm from '../components/HabitForm';
import { useHabits } from '../hooks/useHabits';

export default function AddHabitScreen({ navigation }) {
  const { addHabit } = useHabits();

  // HabitForm passes a full habit object (id, title, days, icon, color, records)
  async function handleSubmit(habit) {
    if (!habit) return;
    await addHabit(habit);
    Alert.alert('완료', '할일이 추가되었습니다.');
    navigation.goBack();
  }

  return (
    <View style={{flex:1}}>
      <HabitForm onSubmit={handleSubmit} />
    </View>
  );
}
