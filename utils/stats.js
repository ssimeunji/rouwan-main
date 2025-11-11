import { getMonthDates, getWeekDates } from './dateUtils';

// 주간 달성률 계산: 주간 날짜 목록(ISO)와 습관 배열을 받아서 날짜별 달성 개수 반환
export function weeklyCompletion(habits, referenceDate = new Date()) {
  const week = getWeekDates(referenceDate);
  // 각 날짜별로 습관 중 완료한 수 계산
  const data = week.map(date => {
    const completed = habits.reduce((acc, h) => {
      if (h.records && h.records[date]) return acc + 1;
      return acc;
    }, 0);
    return { date, completed };
  });
  // percent는 (completed / totalHabitsForThatDay) *100
  const percent = data.map(({ date, completed }) => {
    // 해당 날짜에 수행해야 했던 습관 수
    const total = habits.filter(h => h.days.includes(new Date(date).toDateString().slice(0,3))).length || habits.length;
    const p = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { date, completed, total, percent: p };
  });
  return percent; // 배열
}

// 월간 달성률: 날짜별 평균/총합을 반환
export function monthlyCompletion(habits, referenceDate = new Date()) {
  const days = getMonthDates(referenceDate);
  const totalDays = days.length;
  let dayCompletions = days.map(date => {
    const completed = habits.reduce((acc, h) => (h.records && h.records[date] ? acc + 1 : acc), 0);
    return { date, completed };
  });
  // 전체 퍼센트: (전체 완료 횟수) / (총 기댓값) * 100
  const totalCompleted = dayCompletions.reduce((s, d) => s + d.completed, 0);
  const expected = habits.reduce((s, h) => s + h.days.length, 0); // rough expected per week scale; simple approach
  const percent = expected === 0 ? 0 : Math.round((totalCompleted / (expected * (totalDays/7))) * 100);
  return { totalCompleted, percent, days: dayCompletions };
}
