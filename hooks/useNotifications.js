import * as Notifications from 'expo-notifications';

// 권한 요청 및 토큰 할당
export async function requestPermissionsAsync() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.error('requestPermissionsAsync', e);
    return false;
  }
}

// 매일 같은 시간에 푸시 예약 (예: 20:00)
export async function scheduleDailyReminder(hour = 20, minute = 0, message = '오늘의 습관을 체크하세요!') {
  // 먼저 기존 예약을 모두 지우고 재설정합니다.
  await Notifications.cancelAllScheduledNotificationsAsync();
  const trigger = {
    hour,
    minute,
    repeats: true,
  };
  return Notifications.scheduleNotificationAsync({
    content: { title: 'Rouwan', body: message },
    trigger,
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
