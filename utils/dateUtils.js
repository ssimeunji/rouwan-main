// 날짜 관련 유틸리티
export function formatISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDayName(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DAY_NAMES[d.getDay()];
}

// 주(7일) 범위 - referenceDate 포함된 주의 7일(일~토)
export function getWeekDates(referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const day = ref.getDay(); // 0-6, Sun-Sat
  const start = new Date(ref);
  start.setDate(ref.getDate() - day);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(formatISODate(d));
  }
  return days;
}

// 월(해당 달의 날짜 목록)
export function getMonthDates(referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  for (let d = first; d <= last; d.setDate(d.getDate() + 1)) {
    days.push(formatISODate(new Date(d)));
  }
  return days;
}
