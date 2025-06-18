import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { usePlayers } from '../context/PlayersContext';
import { Ionicons } from '@expo/vector-icons';

export default function IndexScreen() {
  const [player, setPlayer] = useState<string>('');
  const { players, addPlayer } = usePlayers();

  const handleAddPlayer = () => {
    addPlayer(player);
    setPlayer('');
  };

  const continueToGameSelection = () => {
    if (players.length === 0) {
      alert('Por favor, agrega al menos un jugador');
      return;
    }
    router.push('/game-selection');
  };  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="game-controller" size={60} color="#fff" style={styles.headerIcon} />
          </View>
          <Text style={styles.title}>¡Bienvenido a Toma o Toma!</Text>
          <Text style={styles.subtitle}>Agrega los nombres de los jugadores</Text>
        </View>
          <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el nombre del jugador"
              placeholderTextColor="#a0a0a0"
              value={player}
              onChangeText={setPlayer}
              returnKeyType="done"
              onSubmitEditing={handleAddPlayer}
            />
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPlayer}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Agregar jugador</Text>
          </TouchableOpacity>
        </View>
          {players.length > 0 && (
          <View style={styles.playersContainer}>
            <View style={styles.playersHeader}>
              <Ionicons name="people" size={20} color="#fff" />
              <Text style={styles.playersTitle}>Jugadores ({players.length})</Text>
            </View>
            <View style={styles.playersListContainer}>
              {players.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                  <View style={styles.playerAvatar}>
                    <Ionicons name="person" size={16} color="#667eea" />
                  </View>
                  <Text style={styles.player}>{player}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, players.length === 0 && styles.continueButtonDisabled]}
            onPress={continueToGameSelection}
            disabled={players.length === 0}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.continueButtonText}>
              {`Continuar${players.length > 0 ? ` (${players.length} jugadores)` : ''}`}
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerIcon: {
    marginBottom: 0,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginVertical: 20,
  },
  inputWrapper: {
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  footer: {
    padding: 24,
    paddingBottom: 50,
    alignItems: 'center',
  },
  title: { 
    fontSize: 34, 
    fontWeight: '800', 
    marginBottom: 12, 
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
    fontWeight: '500',
  },
  input: { 
    borderWidth: 0, 
    padding: 16, 
    width: '100%', 
    textAlign: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: 25,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playersContainer: {
    marginVertical: 20,
    width: '85%',
    maxHeight: 250
  },
  playersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  playersTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playersListContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    marginVertical: 4,
    borderRadius: 15,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playersList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 10,
    maxHeight: 150
  },
  player: { 
    fontSize: 16, 
    color: '#fff',
    flex: 1,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
