import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [player, setPlayer] = useState('');
  const [players, setPlayers] = useState([]);

  const addPlayer = () => {
    if (player.trim() !== '') {
      setPlayers([...players, player.trim()]);
      setPlayer('');
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <Text style={styles.title}>Toma o Toma</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre del jugador"
        value={player}
        onChangeText={setPlayer}
      />
      <Button title="Agregar jugador" onPress={addPlayer} color="#4caf50" />
      <FlatList
        data={players}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.player}>{item}</Text>}
      />      <Button
        title="Continuar"
        onPress={() => navigation.navigate('GameSelection', { players })}
        color="#2196f3"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, width: '80%', textAlign: 'center', backgroundColor: '#fff', borderRadius: 8 },
  player: { fontSize: 18, marginVertical: 4, color: '#333' },
});
