import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';

export default function TemporizadorScreen() {
  const [seconds, setSeconds] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    const parsedSeconds = parseInt(seconds, 10);
    if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
      setTimeLeft(parsedSeconds);
      setIsRunning(true);
    }
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <Text style={styles.title}>Juego del Temporizador</Text>
      {!isRunning && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Ingresa segundos"
            keyboardType="numeric"
            value={seconds}
            onChangeText={setSeconds}
          />
          <Button title="Iniciar Temporizador" onPress={startTimer} />
        </>
      )}
      {isRunning && timeLeft !== null && (
        <Animated.Text style={[styles.timer, { transform: [{ scale: scaleAnim }] }]}>Tiempo restante: {timeLeft} segundos</Animated.Text>
      )}
      {timeLeft === 0 && <Text style={styles.finished}>¡El tiempo ha terminado!</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, width: '80%', textAlign: 'center', backgroundColor: '#fff', borderRadius: 8 },
  timer: { fontSize: 24, marginTop: 20, color: 'blue', fontWeight: 'bold' },
  finished: { fontSize: 24, marginTop: 20, color: 'red', fontWeight: 'bold' },
});
