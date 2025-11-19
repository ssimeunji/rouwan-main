import { useEffect, useState } from 'react';
import { Switch, Text, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { cancelAllReminders, requestPermissionsAsync, scheduleDailyReminder } from '../hooks/useNotifications';
let DateTimePicker;
let DateTimePickerAndroid;
if (Platform.OS === 'android') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
  DateTimePickerAndroid = require('@react-native-community/datetimepicker').DateTimePickerAndroid;
}
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { theme, changeTheme, themes, isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    // 저장된 알림 설정 불러오기
    async function loadSettings() {
      const settingsStr = await AsyncStorage.getItem('notification_settings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        setEnabled(settings.enabled);
        setTime(new Date(settings.time));
      } else {
        // 기본값: 오후 8시
        const defaultTime = new Date();
        defaultTime.setHours(20, 0, 0, 0);
        setTime(defaultTime);
      }
    }
    loadSettings();
  }, [isDarkMode]);

  async function saveSettings(newEnabled, newTime) {
    const settings = { enabled: newEnabled, time: newTime.toISOString() };
    await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
    setEnabled(newEnabled);
    setTime(newTime);
  }

  async function toggle(v) {
    if (v) {
      const ok = await requestPermissionsAsync();
      if (!ok) return;
      await scheduleDailyReminder(time.getHours(), time.getMinutes());
    } else {
      await cancelAllReminders();
    }
    saveSettings(v, time);
  }

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(Platform.OS === 'ios');
    setTime(currentTime);

    if (selectedTime) {
      scheduleDailyReminder(currentTime.getHours(), currentTime.getMinutes());
      saveSettings(enabled, currentTime);
    }
  };

  const showTimepicker = () => {
    if (Platform.OS === 'android' && DateTimePickerAndroid) {
      DateTimePickerAndroid.open({
        value: time,
        onChange: (event, selectedTime) => {
          if (selectedTime) {
            onTimeChange(event, selectedTime);
          }
        },
        mode: 'time',
        is24Hour: false,
      });
    } else {
      setShowPicker(true);
    }
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>알림</Text>
      <View style={[styles.row, isDarkMode && styles.darkRow]}>
        <TouchableOpacity onPress={showTimepicker}>
          <Text style={[styles.rowLabel, isDarkMode && styles.darkText]}>매일 알림 ({time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })})</Text>
        </TouchableOpacity>
        <Switch value={enabled} onValueChange={toggle} />
      </View>
      {showPicker && Platform.OS === 'ios' && DateTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={onTimeChange}
        />
      )}

      <Text style={[styles.sectionTitle, { marginTop: 24 }, isDarkMode && styles.darkText]}>모드</Text>
      <View style={[styles.row, isDarkMode && styles.darkRow]}>
        <Text style={[styles.rowLabel, isDarkMode && styles.darkText]}>다크 모드</Text>
        <Switch
          trackColor={{ false: "#767577", true: theme }}
          thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          value={isDarkMode} // The value is controlled by the context's state
          onValueChange={toggleDarkMode}
        />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }, isDarkMode && styles.darkText]}>테마 색상</Text>
      <View style={[styles.colorsContainer, isDarkMode && styles.darkRow]}>
        {Object.entries(themes).map(([name, color]) => (
          <TouchableOpacity
            key={name}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              theme === color && styles.selectedColor,
            ]}
            onPress={() => changeTheme(color)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  darkText: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  darkRow: {
    backgroundColor: '#1E1E1E',
  },
  rowLabel: {
    fontSize: 16,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#8E8E93', // A neutral color for the selection border
  },
});
