import { View } from 'react-native';
import { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function RuletaScreen({ route }) {
  const { players } = route.params;
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [spinAnim] = useState(new Animated.Value(0));

  const spinWheel = () => {
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      setSelectedPlayer(players[randomIndex]);

      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        spinAnim.setValue(0);
      });
    }
  };

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Juego de la Ruleta</Text>
      </View>
      <Text style={styles.rules}>
        🎯 Reglas: Gira la ruleta y el jugador seleccionado debe realizar el reto o acción indicada.
      </Text>
      <Animated.View
        style={[
          styles.wheel,
          { transform: [{ rotate: spinInterpolation }] },
        ]}
      >
        <Text style={styles.wheelText}>Ruleta</Text>
      </Animated.View>
      <TouchableOpacity style={styles.spinButton} onPress={spinWheel}>
        <Text style={styles.spinButtonText}>Girar Ruleta</Text>
      </TouchableOpacity>
      {selectedPlayer && (
        <Text style={styles.result}>¡{selectedPlayer} debe tomar!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    padding: 16,
    backgroundColor: '#0288d1',
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
  rules: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0288d1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  wheelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  spinButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0288d1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  spinButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  result: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0288d1',
  },
});
