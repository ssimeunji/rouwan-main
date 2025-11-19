import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = {
  blue: '#A7D1FF',   // 파스텔 블루
  green: '#C1FFC1',  // 파스텔 그린
  red: '#FFC0CB',    // 파스텔 핑크
  orange: '#FFE5B4', // 파스텔 오렌지
  purple: '#E0BBE4', // 파스텔 라벤더
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.blue);

  // 🔥 추가된 부분: 다크모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔥 앱 시작 시 저장된 테마 / 다크모드 로드
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        const savedDarkMode = await AsyncStorage.getItem('dark_mode');

        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
          setTheme(savedTheme);
        }

        if (savedDarkMode !== null) {
          setIsDarkMode(savedDarkMode === 'true');
        }

      } catch (e) {
        console.error('Failed to load theme settings.', e);
      }
    };
    loadSettings();
  }, []);

  // 기존 색상 테마 변경
  const changeTheme = async (newThemeColor) => {
    try {
      await AsyncStorage.setItem('app_theme', newThemeColor);
      setTheme(newThemeColor);
    } catch (error) {
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

  return (
    <ThemeContext.Provider 
      value={{
        theme,
        changeTheme,
        themes: THEMES,
        isDarkMode,       // 🔥 추가됨
        toggleDarkMode,   // 🔥 추가됨
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
