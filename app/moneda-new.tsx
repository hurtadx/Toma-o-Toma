import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { usePlayers } from '../context/PlayersContext';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function MonedaScreen() {
  const { players } = usePlayers();
  const [gameState, setGameState] = useState('selecting'); // 'selecting', 'questioning', 'answering', 'flipping', 'revealing', 'showingSecret'
  const [emisor, setEmisor] = useState<string | null>(null);
  const [encuestado, setEncuestado] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [coinResult, setCoinResult] = useState<'Se dice' | 'Callar' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedForSecret, setSelectedForSecret] = useState<string[]>([]);
  const [showingSecret, setShowingSecret] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  const selectRandomPlayers = () => {
    if (players.length < 2) {
      alert('Se necesitan al menos 2 jugadores para este juego');
      return;
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const newEmisor = shuffled[0];
    const newEncuestado = shuffled[1];
    
    setEmisor(newEmisor);
    setEncuestado(newEncuestado);
    setGameState('questioning');
  };

  const handleAnswerSubmit = () => {
    setGameState('flipping');
    flipCoin();
  };

  const flipCoin = () => {
    setIsFlipping(true);
    
    // Animar la moneda
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      const result = Math.random() < 0.5 ? 'Se dice' : 'Callar';
      setCoinResult(result);
      setIsFlipping(false);
      
      if (result === 'Callar') {
        selectPlayersForSecret();
      }
      setGameState('revealing');
    });
  };

  const selectPlayersForSecret = () => {
    const otherPlayers = players.filter(p => p !== emisor && p !== encuestado);
    const numSelected = Math.min(2, otherPlayers.length);
    const selected = otherPlayers.sort(() => Math.random() - 0.5).slice(0, numSelected);
    setSelectedForSecret(selected);
  };

  const handleShowSecret = () => {
    setShowingSecret(true);
    setTimeout(() => {
      resetGame();
    }, 4000);
  };

  const resetGame = () => {
    setGameState('selecting');
    setEmisor(null);
    setEncuestado(null);
    setAnswer('');
    setCoinResult(null);
    setSelectedForSecret([]);
    setShowingSecret(false);
    flipAnim.setValue(0);
  };

  const flipInterpolation = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  const getPlayerBadgeStyle = (player: string) => {
    if (player === emisor) return styles.playerBadgeEmisor;
    if (player === encuestado) return styles.playerBadgeEncuestado;
    if (selectedForSecret.includes(player)) return styles.playerBadgeSecret;
    return styles.playerBadgeDefault;
  };

  const getPlayerIcon = (player: string) => {
    if (player === emisor) return ' 🎤';
    if (player === encuestado) return ' 👂';
    if (selectedForSecret.includes(player)) return ' 👁️';
    return '';
  };

  return (
    <LinearGradient colors={['#1e293b', '#7e22ce', '#1e293b']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <FontAwesome5 name="comment" size={24} color="#fff" />
              <Text style={styles.title}>Se dice o Callar</Text>
            </View>
            <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
              <MaterialIcons name="refresh" size={16} color="#fff" />
              <Text style={styles.resetButtonText}>Nuevo</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de jugadores */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playersScroll}>
            <View style={styles.playersContainer}>
              {players.map((player, index) => (
                <View key={index} style={[styles.playerBadge, getPlayerBadgeStyle(player)]}>
                  <Text style={styles.playerBadgeText}>
                    {player}{getPlayerIcon(player)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Área principal del juego */}
        <View style={styles.gameArea}>
          {/* Estados del juego */}
          {gameState === 'selecting' && (
            <View style={styles.centerContent}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="users" size={40} color="#fff" />
              </View>
              <Text style={styles.mainTitle}>Nuevo Turno</Text>
              <Text style={styles.subtitle}>Vamos a elegir dos jugadores al azar</Text>
              
              <TouchableOpacity onPress={selectRandomPlayers} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Elegir Jugadores</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameState === 'questioning' && (
            <View style={styles.centerContent}>
              <Text style={styles.mainTitle}>Momento Secreto</Text>
              <View style={styles.instructionCard}>
                <FontAwesome5 name="comment" size={32} color="#3b82f6" />
                <Text style={styles.instructionText}>
                  <Text style={styles.playerHighlight}>{emisor}</Text> debe hacerle una pregunta en secreto a <Text style={styles.playerHighlight}>{encuestado}</Text>
                </Text>
              </View>
              <Text style={styles.helpText}>📱 Pasen el teléfono o susurren la pregunta</Text>
              
              <TouchableOpacity onPress={() => setGameState('answering')} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Ya hice la pregunta</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameState === 'answering' && (
            <View style={styles.centerContent}>
              <Text style={styles.mainTitle}>Respuesta en Voz Alta</Text>
              <View style={styles.instructionCard}>
                <FontAwesome5 name="volume-up" size={32} color="#10b981" />
                <Text style={styles.instructionText}>
                  <Text style={styles.playerHighlight}>{encuestado}</Text>, responde en voz alta para que todos escuchen
                </Text>
                <TextInput
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Escribe aquí la respuesta que dijiste... (opcional)"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.textInput}
                  multiline
                />
              </View>
              
              <TouchableOpacity onPress={handleAnswerSubmit} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Lanzar la Moneda</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameState === 'flipping' && (
            <View style={styles.centerContent}>
              <Text style={styles.mainTitle}>Lanzando la moneda...</Text>
              <Text style={styles.subtitle}>¿Se dirá la pregunta o quedará en secreto?</Text>
              
              <View style={styles.coinContainer}>
                <Animated.View 
                  style={[
                    styles.coin,
                    { transform: [{ rotateY: flipInterpolation }] }
                  ]}
                >
                  <Text style={styles.coinText}>?</Text>
                </Animated.View>
              </View>
            </View>
          )}

          {gameState === 'revealing' && coinResult && (
            <View style={styles.centerContent}>
              <Text style={styles.mainTitle}>Resultado de la Moneda</Text>
              
              <View style={[styles.resultCard, coinResult === 'Se dice' ? styles.resultPositive : styles.resultNegative]}>
                <FontAwesome5 
                  name={coinResult === 'Se dice' ? "volume-up" : "volume-off"} 
                  size={32} 
                  color="#fff" 
                />
                <Text style={styles.resultTitle}>{coinResult}</Text>
                <Text style={styles.resultDescription}>
                  {coinResult === 'Se dice' 
                    ? '🍻 Cualquiera puede tomar para saber la pregunta'
                    : `🎯 Solo ${selectedForSecret.join(' y ')} pueden tomar para saberla`
                  }
                </Text>
              </View>

              {answer.trim() && (
                <View style={styles.answerCard}>
                  <Text style={styles.answerLabel}>La respuesta fue:</Text>
                  <Text style={styles.answerText}>"{answer}"</Text>
                </View>
              )}

              {coinResult === 'Callar' && selectedForSecret.length > 0 && (
                <View style={styles.secretCard}>
                  <Text style={styles.secretText}>
                    🎲 Jugadores elegidos al azar para conocer el secreto
                  </Text>
                </View>
              )}

              <View style={styles.buttonGroup}>
                <Text style={styles.helpText}>
                  {coinResult === 'Se dice' 
                    ? 'Los que quieran saber toman ahora 🍻'
                    : 'Solo los elegidos pueden tomar para saber 🤫'
                  }
                </Text>
                
                <TouchableOpacity onPress={handleShowSecret} style={styles.warningButton}>
                  <Text style={styles.warningButtonText}>Los que tomaron conocen la pregunta</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={resetGame} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Siguiente Ronda</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showingSecret && (
            <View style={styles.centerContent}>
              <Text style={styles.secretTitle}>🔓 Momento de la Verdad</Text>
              
              <View style={styles.secretRevealCard}>
                <FontAwesome5 name="comment" size={40} color="#fbbf24" />
                <Text style={styles.secretRevealText}>
                  <Text style={styles.playerHighlight}>{emisor}</Text> ahora debe revelar la pregunta que le hizo a <Text style={styles.playerHighlight}>{encuestado}</Text>
                </Text>
                
                <View style={styles.secretInstructions}>
                  <Text style={styles.secretInstructionTitle}>🗣️ {emisor}, di la pregunta en voz alta</Text>
                  <Text style={styles.secretInstructionText}>
                    Solo quienes tomaron tienen derecho a escucharla
                  </Text>
                </View>
                
                {coinResult === 'Callar' && (
                  <View style={styles.reminderCard}>
                    <Text style={styles.reminderText}>
                      🤫 Recuerden: solo {selectedForSecret.join(' y ')} podían tomar
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.countdownText}>Nueva ronda en unos segundos...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  playersScroll: {
    marginTop: 8,
  },
  playersContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  playerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 60,
  },
  playerBadgeDefault: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  playerBadgeEmisor: {
    backgroundColor: '#3b82f6',
  },
  playerBadgeEncuestado: {
    backgroundColor: '#10b981',
  },
  playerBadgeSecret: {
    backgroundColor: '#f59e0b',
  },
  playerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  centerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 130, 246, 1)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  instructionCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  playerHighlight: {
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  helpText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginTop: 16,
    width: '100%',
    height: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: 'rgba(59, 130, 246, 1)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(16, 185, 129, 1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  coinContainer: {
    marginVertical: 32,
  },
  coin: {
    width: 128,
    height: 128,
    backgroundColor: 'rgba(251, 191, 36, 1)',
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  coinText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'rgba(251, 191, 36, 0.9)',
  },
  resultCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    width: '100%',
    maxWidth: 350,
  },
  resultPositive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  resultNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 12,
  },
  resultDescription: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  answerCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    maxWidth: 350,
  },
  answerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secretCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    width: '100%',
    maxWidth: 350,
  },
  secretText: {
    color: 'rgba(251, 191, 36, 1)',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonGroup: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  warningButton: {
    backgroundColor: 'rgba(251, 191, 36, 1)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  warningButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secretTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 16,
  },
  secretRevealCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  secretRevealText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  secretInstructions: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    width: '100%',
  },
  secretInstructionTitle: {
    color: '#fbbf24',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  secretInstructionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  reminderCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    width: '100%',
  },
  reminderText: {
    color: 'rgba(239, 68, 68, 1)',
    fontSize: 12,
    textAlign: 'center',
  },
  countdownText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});
