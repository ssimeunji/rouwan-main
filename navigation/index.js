import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddHabitScreen from '../screens/AddHabitScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import EditHabitScreen from '../screens/EditHabitScreen';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: '오늘의 할일',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Add')} style={{ marginRight: 15 }}>
                  <Text style={{ fontSize: 24, color: theme }}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Stats')} style={{ marginRight: 15 }}>
                  <Text style={{ fontSize: 22, color: theme }}>📊</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
                  <Text style={{ fontSize: 22, color: theme }}>⚙️</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen name="Add" component={AddHabitScreen} options={{ title: '습관 추가' }} />
        <Stack.Screen name="Edit" component={EditHabitScreen} options={{ title: '습관 수정' }} />
        <Stack.Screen name="Stats" component={StatsScreen} options={{ title: '통계' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '설정' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
