import { ActivityIndicator, FlatList, Text, View, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HabitItem from '../components/HabitItem';
import { useHabits } from '../hooks/useHabits';
import { formatISODate, getMonthDates } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { useState } from 'react';

export default function HomeScreen() {
  const { habits, loading: habitsLoading, reorderHabits, toggleHabit, deleteHabit } = useHabits();
  const { theme, isDarkMode, weekStartDay } = useTheme();
  
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
    const grid = [];

    let leading;
    if (weekStartDay === 'Sun') {
      leading = first.getDay(); // 0 = Sunday ... 6 = Saturday
    } else { // 'Mon'
      leading = (first.getDay() + 6) % 7; // 0 = Monday ... 6 = Sunday
    }
    // add leading placeholders (null) so the 1st falls on correct weekday (Sunday-start)
    for (let i = 0; i < leading; i++) grid.push(null);
    // then push the actual dates
    monthDates.forEach(d => grid.push(d));
    return grid;
  };

  const monthGrid = getMonthGrid(selectedMonthDate);
  const weekDays = weekStartDay === 'Sun'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : ['월', '화', '수', '목', '금', '토', '일'];

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

  const goToToday = () => {
    setSelectedMonthDate(new Date());
    setSelectedDate(todayISO);
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
            isSelected && { backgroundColor: theme },
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
            isDarkMode ? styles.darkDayText : styles.lightDayText,
            isSelected && styles.selectedDayText,
            isSaturday && styles.saturdayText,
            isSunday && styles.sundayText,
            completion === -1 && !isSelected && styles.noHabitDayText,
          ]}>
            {item ? new Date(item).getDate() : ''}
          </Text>
          {isToday && (
            <View style={[styles.todayIndicator, { backgroundColor: isSelected ? '#fff' : theme }]} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (habitsLoading) return <ActivityIndicator style={{flex:1}} />;

  return (
    <SafeAreaView style={[{ flex: 1 }, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <Icon name="chevron-left" size={24} color={theme} />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToToday}>
              <Text style={[styles.monthTitle, isDarkMode && styles.darkText]}>
                {selectedMonthDate.toLocaleString('ko-KR', { month: 'long', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Icon name="chevron-right" size={24} color={theme} />
            </TouchableOpacity>
          </View>

          {/* weekday header starting Sunday */}
          <View style={styles.weekHeader}>
            {weekDays.map((w) => (
              <Text
                key={w}
                style={[
                  styles.weekHeaderText,
                  isDarkMode && styles.darkWeekHeaderText,
                  // Apply color based on the day, not index
                  (w === '일') && styles.sundayText,
                  (w === '토') && styles.saturdayText,
                ]}>{w}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {monthGrid.map((it, idx) => renderCalendarDay(it, idx))}
          </View>
        </View>
        <View style={styles.habitSection}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{new Date(selectedDate).toLocaleDateString('ko-KR')}의 할 일</Text>
          <FlatList
            data={habitsForSelectedDay} 
            keyExtractor={item => item.id}
            renderItem={({item}) => <HabitItem habit={item} date={selectedDate} />}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={[styles.card, styles.emptyContainer, isDarkMode && styles.darkCard]}>
                <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>오늘의 할 일이 없습니다.</Text>
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
    paddingHorizontal: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    // Shadow for light mode
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#272727',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  darkWeekHeaderText: {
    color: '#A0A0A0',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    // backgroundColor is set dynamically
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lightDayText: {
    color: '#333',
  },
  darkDayText: {
    color: '#E0E0E0',
  },
  dayText: { // Common styles for day text
    fontSize: 16,
    zIndex: 2,
  },
  todayIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 5,
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
    paddingHorizontal: 4, // To align with card content
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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

// Function to darken a color
function shadeColor(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);
  R = parseInt(String(R * (100 + percent) / 100));G = parseInt(String(G * (100 + percent) / 100));B = parseInt(String(B * (100 + percent) / 100));
  R = (R<255)?R:255;  G = (G<255)?G:255;  B = (B<255)?B:255;  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  return "#"+RR+GG+BB;}
