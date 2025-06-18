import React, { useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';

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
      <View style={styles.header}>
        <Text style={styles.title}>Turno de: {players[currentPlayerIndex]}</Text>
      </View>
      <TouchableOpacity style={styles.cardButton} onPress={sacarCarta}>
        <Text style={styles.cardButtonText}>Sacar Carta</Text>
      </TouchableOpacity>
      {selectedCard && (
        <View style={styles.cardContainer}>
          <Text style={styles.cardTipo}>{selectedCard.tipo}</Text>
          <Text style={styles.cardTexto}>{selectedCard.texto}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fce4ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    padding: 16,
    backgroundColor: '#d81b60',
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
  cardButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#d81b60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContainer: {
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#f8bbd0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  cardTipo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d81b60',
    marginBottom: 10,
  },
  cardTexto: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});
