import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayers } from '../context/PlayersContext';

const tiemposPredefinidos = [10, 30, 60, 120]; // en segundos

const retos = [
  "Di todos los nombres de tus compañeros sin parar",
  "Haz una rutina de ejercicios",
  "Cuenta una historia sin pausas",
  "Nombra todos los países que puedas",
  "Haz beatbox",
  "Imita diferentes sonidos de animales",
  "Di el abecedario al revés",
  "Nombra películas de un género específico",
  "Haz una sesión de stand-up comedy",
  "Canta sin parar"
];

export default function TemporizadorScreen() {
  const { players } = usePlayers();
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedReto, setSelectedReto] = useState<string | null>(null);
  useEffect(() => {
    let interval: any;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      Alert.alert('¡Tiempo agotado!', `${selectedPlayer} debe parar ahora`, [
        { text: 'OK', onPress: () => {} }
      ]);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, selectedPlayer]);

  const startTimer = () => {
    if (players.length === 0) {
      alert('No hay jugadores disponibles');
      return;
    }

    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const randomRetoIndex = Math.floor(Math.random() * retos.length);
    
    setSelectedPlayer(players[randomPlayerIndex]);
    setSelectedReto(retos[randomRetoIndex]);
    setTimeLeft(selectedTime);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setSelectedPlayer(null);
    setSelectedReto(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <LinearGradient colors={['#2196f3', '#1976d2']} style={styles.container}>
      <View style={styles.timeSelectionContainer}>
        <Text style={styles.sectionTitle}>Selecciona el tiempo:</Text>
        <View style={styles.timeButtonsContainer}>
          {tiemposPredefinidos.map((tiempo) => (
            <TouchableOpacity
              key={tiempo}
              style={[
                styles.timeButton,
                selectedTime === tiempo && styles.timeButtonSelected
              ]}
              onPress={() => setSelectedTime(tiempo)}
              disabled={isRunning}
            >
              <Text style={[
                styles.timeButtonText,
                selectedTime === tiempo && styles.timeButtonTextSelected
              ]}>
                {tiempo < 60 ? `${tiempo}s` : `${Math.floor(tiempo / 60)}m`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft || selectedTime)}</Text>
        <View style={styles.timerControls}>
          {!isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startTimer}>
              <Text style={styles.buttonText}>▶️ Iniciar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
              <Text style={styles.buttonText}>⏹️ Detener</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Text style={styles.buttonText}>🔄 Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedPlayer && selectedReto && (
        <View style={styles.challengeContainer}>
          <Text style={styles.playerText}>🎯 Jugador: {selectedPlayer}</Text>
          <View style={styles.retoContainer}>
            <Text style={styles.retoTitle}>Tu reto:</Text>
            <Text style={styles.retoText}>{selectedReto}</Text>
          </View>
        </View>
      )}

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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  timeSelectionContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  timeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeButtonSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeButtonTextSelected: {
    color: '#2196f3',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 15,
  },
  startButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  challengeContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
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
  retoContainer: {
    alignItems: 'center',
  },
  retoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  retoText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
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
