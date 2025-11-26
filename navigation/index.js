import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddHabitScreen from '../screens/AddHabitScreen';
import EditHabitScreen from '../screens/EditHabitScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme, isDarkMode } = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
          },
          headerTintColor: isDarkMode ? '#fff' : '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: '오늘의 할 일',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Add')} style={{ marginRight: 15 }}>
                  <Icon name="plus" size={24} color={theme} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Stats')} style={{ marginRight: 15 }}>
                  <Icon name="bar-chart-2" size={22} color={theme} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
                  <Icon name="settings" size={22} color={theme} />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen name="Add" component={AddHabitScreen} options={{ title: '할 일 추가' }} />
        <Stack.Screen name="Edit" component={EditHabitScreen} options={{ title: '할 일 수정' }} />
        <Stack.Screen name="Stats" component={StatsScreen} options={{ title: '통계' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '설정' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
