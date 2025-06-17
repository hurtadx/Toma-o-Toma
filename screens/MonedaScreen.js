import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';

export default function MonedaScreen({ route }) {
  const { players } = route.params;
  const [emisor, setEmisor] = useState(null);
  const [receptor, setReceptor] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const jugarMoneda = () => {
    if (players.length >= 2) {
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      setEmisor(shuffledPlayers[0]);
      setReceptor(shuffledPlayers[1]);

      const coinResult = Math.random() < 0.5 ? 'Callar' : 'Decir';
      setResultado(coinResult);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(0);
      });
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <Text style={styles.title}>Juego de la Moneda</Text>
      <Button title="Lanzar Moneda" onPress={jugarMoneda} />
      {emisor && receptor && resultado && (
        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
          <Text style={styles.result}>Emisor: {emisor}</Text>
          <Text style={styles.result}>Receptor: {receptor}</Text>
          <Text style={styles.result}>Resultado: {resultado}</Text>
          {resultado === 'Decir' ? (
            <Text style={styles.action}>Los demás jugadores deben beber.</Text>
          ) : (
            <Text style={styles.action}>Solo el emisor y receptor beben.</Text>
          )}
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffffaa',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  result: { fontSize: 24, marginVertical: 4, color: '#333' },
  action: { fontSize: 20, marginTop: 10, color: 'red' },
});
