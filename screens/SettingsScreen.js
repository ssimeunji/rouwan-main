import { useEffect, useState } from 'react';
import { Switch, Text, View, TouchableOpacity, Platform, StyleSheet, Alert, DevSettings } from 'react-native';
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

  const handleResetData = () => {
    Alert.alert(
      "모든 데이터 초기화",
      "정말 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      [
        {
          text: "취소",
          style: "cancel"
        },
        { 
          text: "초기화", 
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert("완료", "모든 데이터가 초기화되었습니다. 앱을 다시 시작합니다.", [
              { text: "확인", onPress: () => DevSettings.reload() }
            ]);
          },
          style: 'destructive' 
        }
      ]
    );
  };

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
      <View style={[styles.colorsContainer, isDarkMode && styles.darkRow ]}>
        {Object.entries(themes).map(([name, color]) => (
          <TouchableOpacity
            key={name}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              theme === color && styles.selectedColor,
            ]}
            onPress={() => changeTheme(name)}
          />

        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24, color: '#FF3B30' }]}>위험 구역</Text>
      <View style={[styles.row, isDarkMode && styles.darkRow]}>
        <TouchableOpacity onPress={handleResetData} style={{width: '100%'}}>
          <Text style={[styles.rowLabel, { color: '#FF3B30', textAlign: 'center' }]}>모든 데이터 초기화</Text>
        </TouchableOpacity>
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
