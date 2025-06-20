import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePlayers } from '../context/PlayersContext';

export default function IndexScreen() {
  const [player, setPlayer] = useState<string>('');
  const { players, addPlayer, removePlayer } = usePlayers();

  const handleAddPlayer = () => {
    if (player.trim() && !players.includes(player.trim())) {
      addPlayer(player.trim());
      setPlayer('');
    }
  };

  const continueToGameSelection = () => {
    if (players.length < 1) {
      Alert.alert('Atención', 'Necesitas al menos 1 jugador para continuar');
      return;
    }
    router.push('/game-selection');
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={['#e94560', '#f27121']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Toma o Toma</Text>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Game Icon */}
        <View style={styles.gameIconContainer}>
          <LinearGradient
            colors={['#00d2ff', '#3a7bd5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gameIcon}
          >
            <Ionicons name="game-controller" size={60} color="#fff" />
          </LinearGradient>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>¡Bienvenido a Toma o Toma!</Text>
          <Text style={styles.welcomeSubtitle}>Agrega los nombres de los jugadores</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.playerInput}
            placeholder="Ingresa el nombre del jugador"
            placeholderTextColor="#999"
            value={player}
            onChangeText={setPlayer}
            returnKeyType="done"
            onSubmitEditing={handleAddPlayer}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Add Player Button */}
          <TouchableOpacity onPress={handleAddPlayer}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addPlayerBtn}
            >
              <Text style={styles.buttonText}>+ AGREGAR JUGADOR</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity onPress={continueToGameSelection}>
            <LinearGradient
              colors={['#11998e', '#38ef7d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueBtn}
            >
              <Text style={styles.buttonText}>▶ CONTINUAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Players List at Bottom */}
      {players.length > 0 && (
        <View style={styles.playersListContainer}>
          <View style={styles.playersListBackground}>
            <ScrollView 
              style={styles.playersScrollView} 
              showsVerticalScrollIndicator={false}
            >
              {players.map((playerName, index) => (
                <View key={index} style={styles.playerItem}>
                  <Text style={styles.playerName}>{playerName}</Text>
                  <TouchableOpacity 
                    style={styles.removePlayerBtn}
                    onPress={() => removePlayer(index)}
                  >
                    <Text style={styles.removePlayerText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIconContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  gameIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  welcomeText: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputSection: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  playerInput: {
    width: '100%',
    padding: 18,
    borderRadius: 25,
    fontSize: 17,
    backgroundColor: 'rgba(255,255,255,0.95)',
    color: '#333',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    fontWeight: '500',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 15,
  },
  addPlayerBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
  },
  continueBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(17, 153, 142, 0.4)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 1,
  },
  playersListContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    maxHeight: 120,
  },
  playersListBackground: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  playersScrollView: {
    maxHeight: 80,
  },
  playerItem: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  removePlayerBtn: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePlayerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
