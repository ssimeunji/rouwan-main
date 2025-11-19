import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ICONS = ['','💧','🚶','🧘','📖','💤','🏋️'];

export default function IconPicker({ value, onChange }) {
  const { theme, isDarkMode } = useTheme();
  return (
    <View style={styles.row}>
      {ICONS.map(ic => (
        <TouchableOpacity key={ic} style={[styles.item, isDarkMode && styles.darkItem, value === ic ? [styles.selected, { borderColor: theme }] : null]} onPress={() => onChange(ic)}>
          <Text style={styles.icon}>{ic === '' ? '🚫' : ic}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 8 },
  item: { padding: 10, marginRight: 8, borderWidth: 2, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff' },
  darkItem: {
    borderColor: '#555',
    backgroundColor: '#333',
  },
  selected: {
    borderWidth: 2,
  },
  icon: { fontSize: 20 }
});
