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
  };  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#6B73FF']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>⏰ Temporizador</Text>
            <Text style={styles.subtitle}>Retos contra el tiempo</Text>
          </View>
        </View>        <View style={styles.timeSelectionContainer}>
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
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
    opacity: 0.9,
  },  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  timeSelectionContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  timeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  timeButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'rgba(255,255,255,0.9)',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  timeButtonTextSelected: {
    color: '#667eea',
    textShadowColor: 'transparent',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  timerText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 25,
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },  timerControls: {
    flexDirection: 'row',
    gap: 20,
  },
  startButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stopButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  challengeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  playerText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  retoContainer: {
    alignItems: 'center',
  },
  retoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  retoText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 22,
  },
  playersContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playersText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
