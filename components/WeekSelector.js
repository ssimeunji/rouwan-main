import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function WeekSelector({ value = [], onChange }) {
  function toggle(day) {
    const exists = value.includes(day);
    if (exists) onChange(value.filter(d => d !== day));
    else onChange([...value, day]);
  }

  return (
    <View style={styles.row}>
      {DAYS.map(d => (
        <TouchableOpacity key={d} onPress={() => toggle(d)} style={[styles.chip, value.includes(d) ? styles.active : {}]}>
          <Text style={value.includes(d) ? styles.activeText : {}}>{d}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { padding: 8, margin: 4, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  active: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  activeText: { color: '#fff' }
});
