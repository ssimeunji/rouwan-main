import { Dimensions, ScrollView, Text, View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../hooks/useHabits';
import { weeklyCompletion } from '../utils/stats';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { habits } = useHabits();
  const { theme } = useTheme();
  const weekly = weeklyCompletion(habits);

  // 월별 달성률 계산 (지난 6개월)
  const getMonthlyCompletion = (habits, numMonths = 6) => {
    const results = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < numMonths; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();

      let totalPossible = 0;
      let totalCompleted = 0;

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dayName = dayNames[currentDate.getDay()];
        const isoDate = currentDate.toISOString().slice(0, 10);

        habits.forEach(habit => {
          if (habit.days.includes(dayName)) {
            totalPossible++;
            if (habit.records && habit.records[isoDate]) {
              totalCompleted++;
            }
          }
        });
      }

      const percent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
      results.push({
        month: `${month + 1}월`,
        percent: percent,
      });
    }

    return results.reverse(); // 오래된 월부터 표시
  };

  const monthly = getMonthlyCompletion(habits);

  const monthlyLabels = monthly.map(m => m.month);
  const monthlyData = monthly.map(m => m.percent);

  // 주간 데이터
  const labels = weekly.map(w => w.date.slice(5));
  const data = weekly.map(w => w.percent);

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView contentContainerStyle={{padding:16}}>
        <Text style={{fontSize:18,fontWeight:'700'}}>주간 달성률</Text>
        <LineChart
          data={{ labels, datasets: [{ data }] }}
          width={width - 32}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76,175,80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />

        <Text style={{fontSize:18,fontWeight:'700', marginTop: 24}}>월간 달성률</Text>
        <LineChart
          data={{ labels: monthlyLabels, datasets: [{ data: monthlyData }] }}
          width={width - 32}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => theme,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
