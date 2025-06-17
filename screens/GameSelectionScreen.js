import { LinearGradient } from 'expo-linear-gradient';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function GameSelectionScreen({ navigation, route }) {
  const { players } = route.params || { players: [] };

  return (
    <LinearGradient colors={['#ff7f50', '#ff4500']} style={styles.container}>
      <Text style={styles.title}>Selecciona un Juego</Text>
      <View style={styles.buttonContainer}>
        <Button title="Ruleta" onPress={() => navigation.navigate('Ruleta', { players })} color="#4caf50" />
        <Button title="Temporizador" onPress={() => navigation.navigate('Temporizador', { players })} color="#2196f3" />
        <Button title="Moneda" onPress={() => navigation.navigate('Moneda', { players })} color="#ff9800" />
        <Button title="Tome y Sufra" onPress={() => navigation.navigate('Cartas', { players })} color="#f44336" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  buttonContainer: { marginTop: 20, width: '80%', justifyContent: 'space-between', height: 200 },
});
