import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [player, setPlayer] = useState('');
  const [players, setPlayers] = useState([]);

  const addPlayer = () => {
    if (player.trim() !== '') {
      setPlayers([...players, player.trim()]);
      setPlayer('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toma o Toma</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre del jugador"
        value={player}
        onChangeText={setPlayer}
      />
      <Button title="Agregar jugador" onPress={addPlayer} />
      <FlatList
        data={players}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.player}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10 },
  player: { fontSize: 18, marginVertical: 4 },
});
