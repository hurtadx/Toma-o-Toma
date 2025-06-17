import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { usePlayers } from '../context/PlayersContext';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function GameSelectionScreen() {
  const { players } = usePlayers();

  const navigateToGame = (gamePath: string) => {
    router.push(`/${gamePath}` as any);
  };
  return (
    <LinearGradient colors={['#ff7f50', '#ff4500']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Selecciona un Juego</Text>
        <Text style={styles.subtitle}>
          Jugadores: {players.join(', ')} ({players.length} jugadores)
        </Text>
      
      <View style={styles.buttonContainer}>        <TouchableOpacity 
          style={[styles.gameButton, styles.ruletaButton]}
          onPress={() => navigateToGame('ruleta')}
        >
          <MaterialIcons name="casino" size={40} color="#fff" />
          <Text style={styles.buttonText}>Ruleta</Text>
          <Text style={styles.buttonDescription}>Gira la ruleta y realiza el reto</Text>
        </TouchableOpacity>        <TouchableOpacity 
          style={[styles.gameButton, styles.temporizadorButton]}
          onPress={() => navigateToGame('temporizador')}
        >
          <Ionicons name="timer" size={40} color="#fff" />
          <Text style={styles.buttonText}>Temporizador</Text>
          <Text style={styles.buttonDescription}>Retos contra el tiempo</Text>
        </TouchableOpacity>        <TouchableOpacity 
          style={[styles.gameButton, styles.monedaButton]}
          onPress={() => navigateToGame('moneda')}
        >
          <FontAwesome5 name="coins" size={40} color="#fff" />
          <Text style={styles.buttonText}>Moneda</Text>
          <Text style={styles.buttonDescription}>Cara o cruz decide tu destino</Text>
        </TouchableOpacity>        <TouchableOpacity 
          style={[styles.gameButton, styles.cartasButton]}
          onPress={() => navigateToGame('cartas')}
        >
          <MaterialIcons name="style" size={40} color="#fff" />
          <Text style={styles.buttonText}>Tome y Sufra</Text>
          <Text style={styles.buttonDescription}>Saca una carta del mazo</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },  scrollContainer: {
    flexGrow: 1,
    padding: 24, 
    paddingBottom: 100, // Aumentar margen inferior para navegación
    alignItems: 'center', 
    justifyContent: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#fff',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9
  },
  buttonContainer: { 
    width: '100%', 
    alignItems: 'center',
    gap: 15
  },
  gameButton: {
    width: '85%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ruletaButton: {
    backgroundColor: '#4caf50',
  },
  temporizadorButton: {
    backgroundColor: '#2196f3',
  },
  monedaButton: {
    backgroundColor: '#ff9800',
  },
  cartasButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  buttonDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9
  }
});
