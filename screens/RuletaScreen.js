import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Animated, Button, StyleSheet, Text } from 'react-native';

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
    <LinearGradient colors={['#ff7f50', '#ff4500']} style={styles.container}>
      <Text style={styles.title}>Juego de la Ruleta</Text>
      
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
      <Button title="Girar Ruleta" onPress={spinWheel} />
      {selectedPlayer && (
        <Text style={styles.result}>¡{selectedPlayer} debe tomar!</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  wheelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  result: {
    fontSize: 24,
    marginTop: 20,
    color: 'red',
  },
});
