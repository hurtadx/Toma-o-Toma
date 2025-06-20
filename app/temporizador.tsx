import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppColors } from '../constants/Colors';

export default function TemporizadorScreen() {
  const [seconds, setSeconds] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && !isPaused && timeLeft && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev ? prev - 1 : 0);
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
        ]).start();
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsPaused(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, isPaused, timeLeft]);

  const startTimer = () => {
    const parsedSeconds = parseInt(seconds, 10);
    if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
      setTimeLeft(parsedSeconds);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const startQuickTimer = (time: number) => {
    setTimeLeft(time);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(null);
  };
  return (
    <LinearGradient
      colors={[AppColors.backgroundDark, AppColors.backgroundDarker]}
      style={styles.container}
    >
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color={AppColors.textWhite} />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Temporizador</Text>
      </View>
      
      <View style={styles.contentContainer}>
        
        {!isRunning && (
          <>
            {/* Tiempos predeterminados */}
            <View style={styles.quickTimersContainer}>
              <Text style={styles.subtitle}>Tiempos rápidos:</Text>
              <View style={styles.quickButtonsRow}>
                <TouchableOpacity 
                  style={[styles.quickButton, { backgroundColor: AppColors.temporizador }]}
                  onPress={() => startQuickTimer(30)}
                >
                  <Text style={styles.quickButtonText}>30s</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickButton, { backgroundColor: AppColors.temporizador }]}
                  onPress={() => startQuickTimer(60)}
                >
                  <Text style={styles.quickButtonText}>1m</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickButton, { backgroundColor: AppColors.temporizador }]}
                  onPress={() => startQuickTimer(120)}
                >
                  <Text style={styles.quickButtonText}>2m</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.quickButton, { backgroundColor: AppColors.temporizador }]}
                  onPress={() => startQuickTimer(300)}
                >
                  <Text style={styles.quickButtonText}>5m</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Input personalizado */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tiempo personalizado (segundos):</Text>
              <TextInput
                style={styles.input}
                value={seconds}
                onChangeText={setSeconds}
                placeholder="Ej: 120"
                placeholderTextColor={AppColors.textPlaceholder}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.startButton} onPress={startTimer}>
                <Text style={styles.startButtonText}>Comenzar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Display del temporizador */}
        {isRunning && timeLeft !== null && (
          <View style={styles.timerContainer}>
            <Animated.View style={[styles.timerDisplay, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.timerText}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Text>              <Text style={styles.timerStatus}>
                {isPaused ? 'Pausado' : 'Corriendo'}
              </Text>
            </Animated.View>
            
            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                <FontAwesome5 
                  name={isPaused ? "play" : "pause"} 
                  size={24} 
                  color={AppColors.textWhite} 
                />
                <Text style={styles.pauseButtonText}>
                  {isPaused ? 'Reanudar' : 'Pausar'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                <FontAwesome5 name="stop" size={24} color={AppColors.textWhite} />
                <Text style={styles.resetButtonText}>Detener</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    flex: 1,
    textAlign: 'center',
    marginRight: 60, // Para compensar el espacio del botón de volver
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  quickTimersContainer: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textWhite,
    textAlign: 'center',
    marginBottom: 15,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  quickButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    marginVertical: 5,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickButtonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: AppColors.container,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputLabel: {
    fontSize: 16,
    color: AppColors.textWhite,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: AppColors.textWhite,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: AppColors.textDark,
  },
  startButton: {
    backgroundColor: AppColors.temporizador,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: AppColors.temporizador,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: AppColors.textWhite,
    fontSize: 18,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerDisplay: {
    backgroundColor: AppColors.container,
    padding: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: AppColors.temporizador,
    marginBottom: 10,
  },
  timerStatus: {
    fontSize: 16,
    color: AppColors.textWhite,
    opacity: 0.8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  pauseButton: {
    backgroundColor: AppColors.temporizador,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: AppColors.temporizador,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseButtonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  resetButtonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
