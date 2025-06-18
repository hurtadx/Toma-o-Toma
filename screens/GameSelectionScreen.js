import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function GameSelectionScreen({ navigation, route }) {
  const { players } = route.params || { players: [] };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona un Juego</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.ruletaButton]} onPress={() => navigation.navigate('Ruleta', { players })}>
          <Text style={styles.buttonText}>Ruleta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.temporizadorButton]} onPress={() => navigation.navigate('Temporizador', { players })}>
          <Text style={styles.buttonText}>Temporizador</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.monedaButton]} onPress={() => navigation.navigate('Moneda', { players })}>
          <Text style={styles.buttonText}>Moneda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cartasButton]} onPress={() => navigation.navigate('Cartas', { players })}>
          <Text style={styles.buttonText}>Tome y Sufra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    padding: 16,
    backgroundColor: '#388e3c',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '90%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  ruletaButton: {
    backgroundColor: '#388e3c',
  },
  temporizadorButton: {
    backgroundColor: '#1976d2',
  },
  monedaButton: {
    backgroundColor: '#f57c00',
  },
  cartasButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
