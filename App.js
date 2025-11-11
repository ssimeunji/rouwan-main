import React, { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from "./context/ThemeContext";
import { HabitsProvider } from "./hooks/useHabits";
import AppNavigator from "./navigation";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, []);

  return (
    <ThemeProvider>
      <HabitsProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </HabitsProvider>
    </ThemeProvider>
  );
}
