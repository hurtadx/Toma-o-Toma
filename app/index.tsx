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
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="game-controller" size={60} color="#fff" style={styles.headerIcon} />
          <Text style={styles.title}>¡Bienvenido a Toma o Toma!</Text>
          <Text style={styles.subtitle}>Agrega los nombres de los jugadores</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre del jugador"
            placeholderTextColor="#999"
            value={player}
            onChangeText={setPlayer}
            returnKeyType="done"
            onSubmitEditing={handleAddPlayer}
          />
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
                  <Ionicons name="person" size={16} color="#4caf50" />
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
  headerIcon: {
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginVertical: 20,
  },  footer: {
    padding: 24,
    paddingBottom: 50, // Aumentar margen inferior
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#fff',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9
  },  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    width: '80%', 
    textAlign: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 8,
    fontSize: 16
  },
  addButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },  playersContainer: {
    marginVertical: 20,
    width: '80%',
    maxHeight: 200
  },
  playersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  playersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    marginVertical: 2,
    borderRadius: 8,
    gap: 8,
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
  },
  continueButton: {
    backgroundColor: '#2196f3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
