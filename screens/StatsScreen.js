import { Dimensions, ScrollView, Text, View, StyleSheet, StatusBar, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../hooks/useHabits';
import { weeklyCompletion } from '../utils/stats';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { habits } = useHabits();
  const { theme, isDarkMode } = useTheme();
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

  // 총 습관 달성 횟수 계산
  const totalCompletionCount = habits.reduce((acc, habit) => {
    return acc + (habit.records ? Object.keys(habit.records).length : 0);
  }, 0);

  const formatKoreanDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const weeklyDateRange = weekly.length > 0
    ? `${formatKoreanDate(weekly[0].date)} ~ ${formatKoreanDate(weekly[weekly.length - 1].date)}`
    : '';


  // 주간 데이터
  const labels = weekly.map(w => {
    const date = new Date(w.date);
    const dayOfWeek = date.toLocaleString('ko-KR', { weekday: 'short' });
    return `${date.getDate()}(${dayOfWeek})`;
  });
  const data = weekly.map(w => w.percent);

  const baseChartConfig = {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
    backgroundGradientFrom: isDarkMode ? '#1E1E1E' : '#fff',
    backgroundGradientTo: isDarkMode ? '#1E1E1E' : '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => theme,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255,255,255, ${opacity})` : `rgba(0,0,0, ${opacity})`,
  };

  return (
    <SafeAreaView style={[{flex:1}, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.statCard, isDarkMode && styles.darkStatCard]}>
          <Text style={[styles.statLabel, isDarkMode && styles.darkText]}>총 달성 횟수</Text>
          <Text style={[styles.statValue, { color: theme }]}>{totalCompletionCount}회</Text>
        </View>

        <View style={[styles.chartCard, isDarkMode && styles.darkChartCard]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>주간 달성률</Text>
            <Text style={[styles.dateRangeText, isDarkMode && styles.darkText]}>{weeklyDateRange}</Text>
          </View>
          <LineChart
            data={{ labels, datasets: [{ data }] }}
            width={width - 64} // Adjusted for card padding
            height={220}
            yAxisSuffix="%"
            chartConfig={baseChartConfig}
            onDataPointClick={({ value, index }) => {
              Alert.alert(
                `${weekly[index].date}`,
                `달성률: ${value}%`
              );
            }}
            bezier
            style={styles.chartStyle}
          />
        </View>

        <View style={[styles.chartCard, isDarkMode && styles.darkChartCard]}>
          <Text style={[styles.title, { marginBottom: 8 }, isDarkMode && styles.darkText]}>월간 달성률</Text>
          <LineChart
            data={{ labels: monthlyLabels, datasets: [{ data: monthlyData }] }}
            width={width - 64} // Adjusted for card padding
            height={220}
            yAxisSuffix="%"
            chartConfig={baseChartConfig}
            onDataPointClick={({ value, index }) => {
              Alert.alert(
                `${monthly[index].month}`,
                `달성률: ${value}%`
              );
            }}
            style={styles.chartStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    // Shadow for light mode
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkStatCard: {
    backgroundColor: '#1E1E1E',
    elevation: 0, // Remove shadow in dark mode
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  darkStatLabel: {
    color: '#A0A0A0',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  darkText: {
    color: '#FFFFFF',
  },
  dateRangeText: {
    fontSize: 12,
    color: '#666',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    // Shadow for light mode
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkChartCard: {
    backgroundColor: '#1E1E1E',
  },
  chartStyle: {
    marginVertical: 8,
  },
});
