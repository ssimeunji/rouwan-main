import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_KO = ['일','월','화','수','목','금','토'];

export default function WeekSelector({ value = [], onChange }) {
  function toggle(day) {
    const exists = value.includes(day);
    if (exists) onChange(value.filter(d => d !== day));
    else onChange([...value, day]);
  }

  return (
    <View style={styles.row}>
      {DAYS.map((d, index) => (
        <TouchableOpacity key={d} onPress={() => toggle(d)} style={[styles.chip, value.includes(d) ? styles.active : {}]}>
          <Text style={[styles.chipText, value.includes(d) ? styles.activeText : {}]}>{DAYS_KO[index]}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 4 },
  chip: { flex: 1, paddingVertical: 10, marginHorizontal: 2, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  chipText: {
    fontSize: 14,
  },
  activeText: { color: '#fff' },
});
