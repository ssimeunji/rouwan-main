import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = { // 파스텔톤 색상으로 변경
  blue: '#A7D1FF',   // 파스텔 블루
  green: '#C1FFC1',  // 파스텔 그린
  red: '#FFC0CB',    // 파스텔 핑크
  orange: '#FFE5B4', // 파스텔 오렌지
  purple: '#E0BBE4', // 파스텔 라벤더
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.blue);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme.', e);
      }
    };
    loadTheme();
  }, []);

  const changeTheme = async (newThemeColor) => {
    try {
      await AsyncStorage.setItem('app_theme', newThemeColor);
      setTheme(newThemeColor);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);