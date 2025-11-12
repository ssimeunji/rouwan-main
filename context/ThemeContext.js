import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = {
  blue: '#007AFF',
  green: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  purple: '#AF52DE',
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