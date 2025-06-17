import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayers } from '../context/PlayersContext';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function MonedaScreen() {
  const { players } = usePlayers();
  const [emisor, setEmisor] = useState<string | null>(null);
  const [receptor, setReceptor] = useState<string | null>(null);
  const [resultado, setResultado] = useState<'se_dice' | 'no_se_dice' | null>(null);
  const [flipAnim] = useState(new Animated.Value(0));
  const [isFlipping, setIsFlipping] = useState(false);  const flipCoin = () => {
    if (players.length < 2) {
      alert('Se necesitan al menos 2 jugadores para este juego');
      return;
    }

    setIsFlipping(true);
    setResultado(null);

    // Seleccionar emisor y receptor aleatoriamente
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const newEmisor = shuffledPlayers[0];
    const newReceptor = shuffledPlayers[1];
    
    setEmisor(newEmisor);
    setReceptor(newReceptor);

    // Animar la moneda
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })    ]).start(() => {
      // Determinar resultado
      const isHeads = Math.random() < 0.5;
      const result = isHeads ? 'se_dice' : 'no_se_dice';
      setResultado(result);
      
      setIsFlipping(false);
    });
  };  const resetGame = () => {
    setEmisor(null);
    setReceptor(null);
    setResultado(null);
    flipAnim.setValue(0);
  };

  const flipInterpolation = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  return (
    <LinearGradient colors={['#ff9800', '#f57c00']} style={styles.container}>
      <View style={styles.coinContainer}>        <Animated.View 
          style={[
            styles.coin,
            { transform: [{ rotateY: flipInterpolation }] }
          ]}        >
          {resultado === 'se_dice' ? (
            <FontAwesome5 name="comment" size={60} color="#4caf50" />
          ) : resultado === 'no_se_dice' ? (
            <FontAwesome5 name="times-circle" size={60} color="#f44336" />
          ) : (
            <FontAwesome5 name="coins" size={60} color="#ffc107" />
          )}
        </Animated.View>
      </View>      <TouchableOpacity 
        style={[styles.flipButton, isFlipping && styles.flipButtonDisabled]}
        onPress={flipCoin}
        disabled={isFlipping}
      >
        <FontAwesome5 name="hand-rock" size={20} color="#fff" />
        <Text style={styles.flipButtonText}>
          {isFlipping ? 'Lanzando...' : 'Lanzar Moneda'}
        </Text>      </TouchableOpacity>

      {emisor && receptor && (
        <View style={styles.playersSelectedContainer}>
          <Text style={styles.emisorText}>
            <FontAwesome5 name="microphone" size={16} color="#fff" /> Emisor: {emisor}
          </Text>
          <Text style={styles.receptorText}>
            <FontAwesome5 name="user" size={16} color="#fff" /> Encuestado: {receptor}
          </Text>
        </View>
      )}

      {resultado && (<View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Resultado: {resultado === 'se_dice' ? 'SE DICE' : 'NO SE DICE'}
          </Text>
          <View style={styles.resultIconContainer}>
            {resultado === 'se_dice' ? (
              <FontAwesome5 name="comment" size={60} color="#4caf50" />
            ) : (
              <FontAwesome5 name="times-circle" size={60} color="#f44336" />
            )}
          </View>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <MaterialIcons name="refresh" size={20} color="#fff" />
          <Text style={styles.resetButtonText}>Nueva Partida</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Jugadores disponibles:</Text>
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
  },
  coinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  coin: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffd700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#ffb300',
  },
  coinText: {
    fontSize: 40,
  },  flipButton: {
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
  flipButtonDisabled: {
    backgroundColor: '#ccc',
  },  flipButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',  },
  playersSelectedContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  emisorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  receptorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultIconContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },resetButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },  resetButtonText: {
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
