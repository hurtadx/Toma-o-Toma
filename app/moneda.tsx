import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePlayers } from '../context/PlayersContext';
import { AppColors } from '../constants/Colors';

export default function MonedaScreen() {
  const { players } = usePlayers();
  const [gameState, setGameState] = useState('selecting'); // 'selecting', 'questioning', 'answering', 'flipping', 'revealing'
  const [emisor, setEmisor] = useState<string | null>(null);
  const [encuestado, setEncuestado] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [coinResult, setCoinResult] = useState<'Se dice' | 'Callar' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedForSecret, setSelectedForSecret] = useState<string[]>([]);
  const [flipAnim] = useState(new Animated.Value(0));const selectRandomPlayers = () => {
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

  const resetGame = () => {
    setGameState('selecting');
    setEmisor(null);
    setEncuestado(null);
    setAnswer('');
    setCoinResult(null);
    setSelectedForSecret([]);
    flipAnim.setValue(0);
  };

  const flipInterpolation = flipAnim.interpolate({    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });  return (
    <LinearGradient
      colors={[AppColors.backgroundDark, AppColors.backgroundDarker]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header simplificado */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Se dice o Callar</Text>
            <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
              <MaterialIcons name="refresh" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Lista de jugadores compacta */}
          {(emisor || encuestado || selectedForSecret.length > 0) && (
            <View style={styles.playersRow}>
              {emisor && (
                <View style={styles.emisorBadge}>
                  <Text style={styles.badgeText}>{emisor}</Text>
                </View>
              )}
              {encuestado && (                <View style={styles.encuestadoBadge}>
                  <Text style={styles.badgeText}>{encuestado}</Text>
                </View>
              )}
              {selectedForSecret.map((player, index) => (
                <View key={index} style={styles.secretBadge}>
                  <Text style={styles.badgeText}>{player}</Text>
                </View>
              ))}
            </View>
          )}
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
              <Text style={styles.mainTitle}>Momento Secreto</Text>              <View style={styles.instructionCard}>
                <FontAwesome5 name="comment" size={32} color="#3b82f6" />
                <Text style={styles.instructionText}>
                  <Text style={styles.playerHighlight}>{emisor}</Text>
                  <Text> debe hacerle una pregunta en secreto a </Text>
                  <Text style={styles.playerHighlight}>{encuestado}</Text>
                </Text>
              </View>
              <Text style={styles.helpText}>Pasen el teléfono o susurren la pregunta</Text>
              
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
                <Text style={styles.resultTitle}>{coinResult}</Text>                <Text style={styles.resultDescription}>
                  {coinResult === 'Se dice' 
                    ? 'Cualquiera puede tomar para saber la pregunta'
                    : `Solo ${selectedForSecret.join(' y ')} pueden tomar para saberla`
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
                <View style={styles.secretCard}>                  <Text style={styles.secretText}>
                    Jugadores elegidos al azar para conocer el secreto
                  </Text>
                </View>
              )}              <View style={styles.buttonGroup}>                <Text style={styles.helpText}>
                  {coinResult === 'Se dice' 
                    ? 'Los que quieran saber toman ahora'
                    : 'Solo los elegidos pueden tomar para saber'
                  }
                </Text>
                
                <TouchableOpacity onPress={resetGame} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Siguiente Ronda</Text>
                </TouchableOpacity>
              </View>
            </View>          )}        </View>
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textWhite,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  resetButton: {
    backgroundColor: AppColors.error,
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  playersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  emisorBadge: {
    backgroundColor: AppColors.moneda,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  encuestadoBadge: {
    backgroundColor: AppColors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secretBadge: {
    backgroundColor: AppColors.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: AppColors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centerContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: AppColors.container,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.textWhite,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textGray,
    textAlign: 'center',
    marginBottom: 30,
  },
  instructionCard: {
    backgroundColor: AppColors.container,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    gap: 12,
  },
  instructionText: {
    fontSize: 16,
    color: AppColors.textWhite,
    textAlign: 'center',
    lineHeight: 22,
  },
  playerHighlight: {
    color: AppColors.monedaLight,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 14,
    color: AppColors.textGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: AppColors.backgroundDarker,
    borderWidth: 1,
    borderColor: AppColors.container,
    borderRadius: 8,
    padding: 12,
    color: AppColors.textWhite,
    fontSize: 14,
    width: '100%',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: AppColors.moneda,
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
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: AppColors.containerLight,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: AppColors.textWhite,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  coinContainer: {
    marginVertical: 30,
  },
  coin: {
    width: 120,
    height: 120,
    backgroundColor: AppColors.warning,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  coinText: {
    fontSize: 32,
    fontWeight: '900',
    color: AppColors.textWhite,
  },
  resultCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultPositive: {
    backgroundColor: AppColors.success,
  },
  resultNegative: {
    backgroundColor: AppColors.error,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.textWhite,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: AppColors.textWhite,
    textAlign: 'center',
    lineHeight: 22,
  },
  answerCard: {
    backgroundColor: AppColors.container,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  answerLabel: {
    fontSize: 12,
    color: AppColors.textGray,
    fontWeight: '600',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 16,
    color: AppColors.textWhite,
    fontStyle: 'italic',
  },
  secretCard: {
    backgroundColor: AppColors.warning,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  secretText: {
    fontSize: 14,
    color: AppColors.textWhite,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
});
