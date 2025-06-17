import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const cartas = [
  { tipo: 'Pena', texto: 'Toma 2 shots extra.' },
  { tipo: 'Beneficio', texto: 'Elige a alguien para que tome por ti.' },
  { tipo: 'Evento', texto: 'Todos deben hablar como mudos por 1 minuto.' },
  { tipo: 'Pena Fuerte', texto: 'Escribe un mensaje a tu ex.' },
  { tipo: 'Pena Fuerte', texto: 'Muestra tu carpeta de ocultos por 3 segundos.' },
  // Agrega más cartas aquí...
];

export default function CartasScreen({ route }) {
  const { players } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const sacarCarta = () => {
    const randomIndex = Math.floor(Math.random() * cartas.length);
    setSelectedCard(cartas[randomIndex]);
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      fadeAnim.setValue(0);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turno de: {players[currentPlayerIndex]}</Text>
      <Button title="Sacar Carta" onPress={sacarCarta} />
      {selectedCard && (
        <LinearGradient
          colors={['#ff7f50', '#ff4500']}
          style={styles.cardContainer}
        >
          <Text style={styles.cardTipo}>{selectedCard.tipo}</Text>
          <Text style={styles.cardTexto}>{selectedCard.texto}</Text>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f0f8ff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  cardContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  cardTipo: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  cardTexto: { fontSize: 20, marginTop: 10, color: '#fff' },
});
