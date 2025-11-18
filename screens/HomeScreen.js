import { ActivityIndicator, FlatList, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HabitItem from '../components/HabitItem';
import { useHabits } from '../hooks/useHabits';
import { formatISODate, getMonthDates } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function HomeScreen() {
  const { habits, loading: habitsLoading, reorderHabits, toggleHabit, deleteHabit } = useHabits();
  const { theme } = useTheme();
  
  const today = new Date();
  const todayISO = formatISODate(today);

  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO);

  const dayName = new Date(selectedDate).toLocaleString('en-US', { weekday: 'short' }); // Mon...
  const habitsForSelectedDay = habits.filter(h => {
    if (!h.days.includes(dayName)) return false;

    // 시작 날짜와 종료 날짜를 확인하여 해당 기간에만 습관을 표시
    if (h.startDate && selectedDate < h.startDate) return false;
    if (h.endDate && selectedDate > h.endDate) return false;

    return true;
  });




  // generate grid items for the selected month such that week starts on Sunday
  const getMonthGrid = (refDate) => {
    const monthDates = getMonthDates(refDate); // ISO strings for each day of month
    const first = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
    const leading = first.getDay(); // 0 = Sunday ... 6 = Saturday
    const grid = [];
    // add leading placeholders (null) so the 1st falls on correct weekday (Sunday-start)
    for (let i = 0; i < leading; i++) grid.push(null);
    // then push the actual dates
    monthDates.forEach(d => grid.push(d));
    return grid;
  };

  const monthGrid = getMonthGrid(selectedMonthDate);

  // 날짜별 달성률 계산
  const completionRates = monthGrid.reduce((acc, isoDate) => {
    if (!isoDate) return acc;

    const dayName = new Date(isoDate).toLocaleString('en-US', { weekday: 'short' });
    const habitsForDay = habits.filter(h => {
      if (!h.days.includes(dayName)) return false;
      // 시작 날짜와 종료 날짜를 확인하여 해당 기간에만 습관을 포함
      if (h.startDate && isoDate < h.startDate) return false;
      if (h.endDate && isoDate > h.endDate) return false;
      return true;
    });

    if (habitsForDay.length === 0) {
      acc[isoDate] = -1; // 습관 없는 날
      return acc;
    }

    const completedCount = habitsForDay.filter(h => h.records && h.records[isoDate]).length;
    const percentage = Math.round((completedCount / habitsForDay.length) * 100);
    acc[isoDate] = percentage;
    return acc;
  }, {});



  const prevMonth = () => {
    const d = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() - 1, 1);
    setSelectedMonthDate(d);
  };

  const nextMonth = () => {
    const d = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1, 1);
    setSelectedMonthDate(d);
  };

  const renderCalendarDay = (item, idx) => {
    if (!item) {
      // placeholder
      return <View key={`empty-${idx}`} style={styles.calendarDay} />;
    }
    const isSelected = item === selectedDate;
    const isToday = item === todayISO;
    const completion = completionRates[item];
    
    const date = new Date(item);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;

    return (
      <View key={item || `empty-${idx}`} style={styles.calendarDay}>
        <TouchableOpacity 
          onPress={() => item && setSelectedDate(item)} 
          style={[
            styles.dayButton,
            isSelected && styles.selectedDay,
            isToday && { borderColor: theme, borderWidth: 2 }
          ]}
        >
          {typeof completion === 'number' && completion >= 0 && (
            <View style={[
              styles.completionFill,
              { height: `${completion}%`, opacity: completion / 100 * 0.8 + 0.2, backgroundColor: theme }
            ]} />
          )}
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayText,
            isSaturday && styles.saturdayText,
            isSunday && styles.sundayText,
            completion === -1 && styles.noHabitDayText,
          ]}>
            {item ? new Date(item).getDate() : ''}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (habitsLoading) return <ActivityIndicator style={{flex:1}} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <Text style={styles.navText}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {selectedMonthDate.toLocaleString('ko-KR', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Text style={styles.navText}>{'›'}</Text>
            </TouchableOpacity>
          </View>

          {/* weekday header starting Sunday */}
          <View style={styles.weekHeader}>
            {['일', '월', '화', '수', '목', '금', '토'].map((w, index) => (
              <Text
                key={w}
                style={[
                  styles.weekHeaderText,
                  index === 0 && styles.sundayText, // '일'요일 (index 0)
                  index === 6 && styles.saturdayText, // '토'요일 (index 6)
                ]}>{w}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {monthGrid.map((it, idx) => renderCalendarDay(it, idx))}
          </View>
        </View>
        <View style={styles.habitSection}>
          <Text style={styles.sectionTitle}>{new Date(selectedDate).toLocaleDateString('ko-KR')}의 할 일</Text>
          <FlatList
            data={habitsForSelectedDay}
            keyExtractor={item => item.id}
            renderItem={({item}) => <HabitItem habit={item} date={selectedDate} />}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={[styles.emptyContainer, { backgroundColor: '#fff' }]}>
                <Text style={styles.emptyText}>오늘의 습관이 없습니다.</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    padding: 16,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 22,
    color: '#007AFF',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingVertical: 4,
    marginBottom: 6,
  },
  weekHeaderText: {
    width: '14.28%',
    textAlign: 'center',
    color: '#666',
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    width: '85%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedDay: {
    backgroundColor: '#fff',
    borderColor: '#efefef',
    borderWidth: 1,
  },
  selectedDayText: {
    color: '#333',
  },
  dayText: {
    fontSize: 16,
    color: '#000', // 기본 텍스트 색상을 검은색으로 명시
    zIndex: 2, // 텍스트가 채우기 색상 위에 오도록 설정
  },
  todayText: {
    fontWeight: 'bold'
  },
  saturdayText: {
    color: '#007AFF', // 파란색
  },
  sundayText: {
    color: '#FF3B30', // 빨간색
  },
  noHabitDayText: {
    opacity: 0.3,
  },
  habitSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
  completionFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    borderRadius: 999,
  },
});
