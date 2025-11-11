import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ICONS = ['💧','🚶','🧘','📖','💤','🏋️'];

export default function IconPicker({ value, onChange }) {
  return (
    <View style={styles.row}>
      {ICONS.map(ic => (
        <TouchableOpacity key={ic} style={[styles.item, value === ic ? styles.selected : null]} onPress={() => onChange(ic)}>
          <Text style={styles.icon}>{ic}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 8 },
  item: { padding: 10, marginRight: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  selected: { backgroundColor: '#eee' },
  icon: { fontSize: 20 }
});
