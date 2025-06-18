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
  };  return (
    <LinearGradient colors={['#ff6b6b', '#4ecdc4']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Selecciona un Juego</Text>
          <View style={styles.playersInfo}>
            <Ionicons name="people" size={18} color="#fff" />
            <Text style={styles.subtitle}>
              {players.length} jugadores conectados
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>        
        <TouchableOpacity 
          style={[styles.gameButton, styles.ruletaButton]}
          onPress={() => navigateToGame('ruleta')}
        >
          <View style={styles.gameIconContainer}>
            <MaterialIcons name="casino" size={50} color="#fff" />
          </View>
          <View style={styles.gameTextContainer}>
            <Text style={styles.buttonText}>Ruleta</Text>
            <Text style={styles.buttonDescription}>Gira la ruleta de la suerte</Text>
          </View>
        </TouchableOpacity>        

        <TouchableOpacity 
          style={[styles.gameButton, styles.temporizadorButton]}
          onPress={() => navigateToGame('temporizador')}
        >
          <View style={styles.gameIconContainer}>
            <Ionicons name="timer" size={50} color="#fff" />
          </View>
          <View style={styles.gameTextContainer}>
            <Text style={styles.buttonText}>Temporizador</Text>
            <Text style={styles.buttonDescription}>Retos contra el tiempo</Text>
          </View>
        </TouchableOpacity>        

        <TouchableOpacity 
          style={[styles.gameButton, styles.monedaButton]}
          onPress={() => navigateToGame('moneda')}
        >
          <View style={styles.gameIconContainer}>
            <FontAwesome5 name="coins" size={50} color="#fff" />
          </View>
          <View style={styles.gameTextContainer}>
            <Text style={styles.buttonText}>Moneda</Text>
            <Text style={styles.buttonDescription}>Cara o cruz decide tu destino</Text>
          </View>
        </TouchableOpacity>        

        <TouchableOpacity 
          style={[styles.gameButton, styles.cartasButton]}
          onPress={() => navigateToGame('cartas')}
        >
          <View style={styles.gameIconContainer}>
            <MaterialIcons name="style" size={50} color="#fff" />
          </View>
          <View style={styles.gameTextContainer}>
            <Text style={styles.buttonText}>Tome y Sufra</Text>
            <Text style={styles.buttonDescription}>Saca una carta del mazo</Text>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24, 
    paddingBottom: 100,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: { 
    fontSize: 36, 
    fontWeight: '800', 
    marginBottom: 16, 
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  playersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
    fontWeight: '600',
  },
  buttonContainer: { 
    width: '100%', 
    alignItems: 'center',
    gap: 20
  },
  gameButton: {
    width: '90%',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  gameIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  gameTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  ruletaButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  temporizadorButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
  },
  monedaButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
  },
  cartasButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    opacity: 0.9,
    fontWeight: '500',
  }
});
