import { Alert, View } from 'react-native';
import HabitForm from '../components/HabitForm';
import { useHabits } from '../hooks/useHabits';

export default function EditHabitScreen({ navigation, route }) {
  const { updateHabit } = useHabits();
  const { habit } = route.params;

  async function handleSubmit(updatedHabit) {
    if (!updatedHabit) return;
    await updateHabit(updatedHabit);
    Alert.alert('완료', '습관이 수정되었습니다.');
    navigation.goBack();
  }

  return (
    <View style={{flex:1}}>
      <HabitForm onSubmit={handleSubmit} habit={habit} />
    </View>
  );
}