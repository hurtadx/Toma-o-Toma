import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayers } from '../context/PlayersContext';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const cartas = [
  { tipo: 'Reto', contenido: 'Imita a 3 animales diferentes' },
  { tipo: 'Castigo', contenido: 'Haz 15 flexiones' },
  { tipo: 'Reto', contenido: 'Canta una canción completa' },
  { tipo: 'Premio', contenido: 'Elige a alguien más para que haga tu próximo reto' },
  { tipo: 'Castigo', contenido: 'Cuenta una historia embarazosa tuya' },
  { tipo: 'Reto', contenido: 'Baila por 2 minutos sin parar' },
  { tipo: 'Castigo', contenido: 'Di 5 trabalenguas seguidos' },
  { tipo: 'Premio', contenido: 'Saltate tu próximo turno' },
  { tipo: 'Reto', contenido: 'Haz mímica de una película hasta que la adivinen' },
  { tipo: 'Castigo', contenido: 'Habla como bebé por 3 minutos' },
  { tipo: 'Reto', contenido: 'Haz stand-up comedy por 2 minutos' },
  { tipo: 'Premio', contenido: 'Todos los demás deben hacer 10 flexiones' },
  { tipo: 'Castigo', contenido: 'Imita a cada persona del grupo' },
  { tipo: 'Reto', contenido: 'Cuenta hasta 100 saltando números pares' },
  { tipo: 'Castigo', contenido: 'Come algo picante o amargo' },
  { tipo: 'Premio', contenido: 'Elige el próximo juego' },
  { tipo: 'Reto', contenido: 'Haz beatbox por 1 minuto' },
  { tipo: 'Castigo', contenido: 'Actúa como un zombie por 2 minutos' },
  { tipo: 'Reto', contenido: 'Di el abecedario al revés' },
  { tipo: 'Premio', contenido: 'Todos deben darte un cumplido' }
];

export default function CartasScreen() {
  const { players } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [drawnCard, setDrawnCard] = useState<typeof cartas[0] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));
  const [usedCards, setUsedCards] = useState<number[]>([]);

  const drawCard = () => {
    if (players.length === 0) {
      alert('No hay jugadores disponibles');
      return;
    }

    // Verificar si quedan cartas
    if (usedCards.length >= cartas.length) {
      alert('¡Se acabaron las cartas! Mezclando el mazo...');
      setUsedCards([]);
    }

    setIsDrawing(true);
    
    // Seleccionar jugador aleatorio
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    setSelectedPlayer(players[randomPlayerIndex]);

    // Seleccionar carta que no haya sido usada
    let availableCards = cartas
      .map((_, index) => index)
      .filter(index => !usedCards.includes(index));
    
    if (availableCards.length === 0) {
      availableCards = cartas.map((_, index) => index);
      setUsedCards([]);
    }

    const randomCardIndex = availableCards[Math.floor(Math.random() * availableCards.length)];
    
    // Animación de voltear carta
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setDrawnCard(cartas[randomCardIndex]);
      setUsedCards(prev => [...prev, randomCardIndex]);
      setIsDrawing(false);
    });
  };

  const resetGame = () => {
    setSelectedPlayer(null);
    setDrawnCard(null);
    setUsedCards([]);
    flipAnim.setValue(0);
  };

  const getCardColor = (tipo: string) => {
    switch (tipo) {
      case 'Reto': return '#4caf50';
      case 'Castigo': return '#f44336';
      case 'Premio': return '#ffd700';
      default: return '#9e9e9e';
    }
  };

  const flipInterpolation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  return (
    <LinearGradient colors={['#f44336', '#d32f2f']} style={styles.container}>
      <View style={styles.deckContainer}>
        <Text style={styles.deckInfo}>
          Cartas restantes: {cartas.length - usedCards.length}
        </Text>        <Animated.View 
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: flipInterpolation }] }
          ]}
        >
          <FontAwesome5 name="layer-group" size={60} color="#D2691E" />
        </Animated.View>
      </View>      <TouchableOpacity 
        style={[styles.drawButton, isDrawing && styles.drawButtonDisabled]}
        onPress={drawCard}
        disabled={isDrawing}
      >
        <FontAwesome5 name="layer-group" size={20} color="#fff" />
        <Text style={styles.drawButtonText}>
          {isDrawing ? 'Sacando carta...' : 'Sacar Carta'}
        </Text>
      </TouchableOpacity>      {selectedPlayer && drawnCard && (
        <View style={styles.resultContainer}>
          <Text style={styles.playerText}>
            <FontAwesome5 name="user" size={16} color="#fff" /> Jugador: {selectedPlayer}
          </Text>
          
          <View style={[styles.drawnCard, { backgroundColor: getCardColor(drawnCard.tipo) }]}>
            <View style={styles.cardIconContainer}>
              {drawnCard.tipo === 'Reto' && <FontAwesome5 name="trophy" size={40} color="#fff" />}
              {drawnCard.tipo === 'Castigo' && <MaterialIcons name="sentiment-dissatisfied" size={40} color="#fff" />}
              {drawnCard.tipo === 'Premio' && <FontAwesome5 name="gift" size={40} color="#fff" />}
            </View>
            <Text style={styles.cardType}>{drawnCard.tipo.toUpperCase()}</Text>
            <Text style={styles.cardContent}>{drawnCard.contenido}</Text>
          </View>
        </View>
      )}      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <MaterialIcons name="refresh" size={20} color="#fff" />
          <Text style={styles.resetButtonText}>Mezclar Mazo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Jugadores:</Text>
        <Text style={styles.playersText}>{players.join(', ')}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Aumentar margen inferior para navegación
    alignItems: 'center',
    justifyContent: 'space-around',
  },deckContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  deckInfo: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  card: {
    width: 120,
    height: 160,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBack: {
    backgroundColor: '#8B4513',
    borderWidth: 3,
    borderColor: '#A0522D',  },
  drawButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawButtonDisabled: {
    backgroundColor: '#ccc',
  },
  drawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  playerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  drawnCard: {
    width: 200,
    height: 250,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,  },
  cardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },  cardContent: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardIconContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },resetButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  playersContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  playersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  playersText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});
