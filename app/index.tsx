import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppColors } from '../constants/Colors';
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
    <View style={styles.container}>      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../assets/images/brindis-copas.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Toma o Toma</Text>
        </View>
      </View>{/* Main Content */}
      <ScrollView 
        style={styles.mainContent} 
        contentContainerStyle={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >        {/* Game Icon */}
        <View style={styles.gameIconContainer}>
          <Image 
            source={require('../assets/images/brindis-copas.png')} 
            style={[styles.logoImageClean, { tintColor: '#fff' }]}
            resizeMode="contain"
          />
        </View>{/* Welcome Text */}
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Agrega los nombres de los jugadores</Text>
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
        <View style={styles.buttonsContainer}>          {/* Add Player Button */}
          <TouchableOpacity 
            style={styles.addPlayerBtn}
            onPress={handleAddPlayer}
          >
            <Text style={styles.buttonText}>+ AGREGAR JUGADOR</Text>
          </TouchableOpacity>          

          {/* Continue Button */}
          <TouchableOpacity 
            style={styles.continueBtn}
            onPress={continueToGameSelection}
          >
            <Text style={styles.buttonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>

        {/* Players List - After Continue Button */}
        {players.length > 0 && (
          <View style={styles.playersListSection}>
            <Text style={styles.playersListTitle}>Jugadores ({players.length})</Text>
            <View style={styles.playersListBackground}>
              <ScrollView 
                style={styles.playersScrollView} 
                showsVerticalScrollIndicator={true}
                indicatorStyle="white"
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
            </View>          </View>        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  header: {
    backgroundColor: AppColors.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  logo: {
    width: 40,
    height: 40,
  },  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.textWhite,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  gameIconContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoImageClean: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputSection: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  playerInput: {
    width: '100%',
    padding: 18,
    borderRadius: 15,
    fontSize: 17,
    backgroundColor: '#fff',
    color: '#333',
    borderWidth: 2,
    borderColor: '#e94560',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 15,
  },
  addPlayerBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#11998e',
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  playersListSection: {
    width: '100%',
    maxWidth: 400,
    marginTop: 30,
  },
  playersListTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  playersListBackground: {
    backgroundColor: '#2a2a4a',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#e94560',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playersScrollView: {
    maxHeight: 175,
  },
  playerItem: {
    backgroundColor: '#3a3a5a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a4a6a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removePlayerBtn: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  removePlayerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
