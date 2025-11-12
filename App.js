import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { HabitsProvider, useHabits } from "./hooks/useHabits";
import AppNavigator from "./navigation";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { loading: habitsLoading } = useHabits();
  const { loading: themeLoading } = useTheme();

  useEffect(() => {
    if (!habitsLoading && !themeLoading) {
      SplashScreen.hideAsync();
    }
  }, [habitsLoading, themeLoading]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HabitsProvider>
          <AppContent />
          <StatusBar style="auto" />
        </HabitsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
