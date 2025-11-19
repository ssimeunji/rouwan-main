import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = {
  blue: '#A7D1FF',
  green: '#C1FFC1',
  red: '#FFC0CB',
  orange: '#FFE5B4',
  purple: '#E0BBE4',
};

export const DARK_THEMES = {
  blue: '#007AFF',
  green: '#32CD32',
  red: '#FF0000',
  orange: '#FFA500',
  purple: '#800080',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState('blue'); // 'blue', 'green', etc.

  // 다크모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔥 앱 시작 시 저장된 테마 / 다크모드 로드
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedThemeKey = await AsyncStorage.getItem('app_theme_key');
        const savedDarkMode = await AsyncStorage.getItem('dark_mode');
        const darkMode = savedDarkMode === 'true';
        setIsDarkMode(darkMode);

        if (savedThemeKey && THEMES[savedThemeKey]) {
          setThemeKey(savedThemeKey);
        }

      } catch (e) {
        console.error('Failed to load theme settings.', e);
      }
    };
    loadSettings();
  }, []);

  // 기존 색상 테마 변경
  const changeTheme = async (newThemeKey) => {
    try {
      await AsyncStorage.setItem('app_theme_key', newThemeKey);
      setThemeKey(newThemeKey);
    } catch (e) {
      console.error('Failed to save theme', error);
    }
  };

  // 🔥 다크모드 토글 기능
  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('dark_mode', newValue.toString());
    } catch (e) {
      console.error('Failed to toggle dark mode', e);
    }
  };

  const currentThemeSet = isDarkMode ? DARK_THEMES : THEMES;

  return (
    <ThemeContext.Provider
      value={{
        theme: currentThemeSet[themeKey],
        changeTheme,
        themes: isDarkMode ? DARK_THEMES : THEMES,
        isDarkMode,       // 🔥 추가됨
        toggleDarkMode,   // 🔥 추가됨
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
