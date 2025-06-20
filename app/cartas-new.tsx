import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayers } from '../context/PlayersContext';

const cartas = {
  penaNormal: [
    'Toma 2 tragos',
    'Habla como bebé por 2 minutos',
    'Haz 10 flexiones',
    'Cuenta una historia embarazosa',
    'Imita a 3 animales diferentes',
    'Di 5 trabalenguas seguidos',
    'Canta una canción completa',
    'Baila por 2 minutos sin parar',
    'Actúa como zombie por 1 minuto',
    'Haz mímica hasta que adivinen la película'
  ],
  penaFuerte: [
    'Escríbele a tu ex (o primer contacto)',
    'Muestra tu galería de fotos por 30 segundos',
    'Lee tu último mensaje de WhatsApp en voz alta',
    'Llama a un contacto aleatorio y di "Te amo"',
    'Publica una foto rara en tu historia',
    'Confiesa tu secreto más vergonzoso'
  ],
  beneficio: [
    'Anula la próxima pena que te toque',
    'Elige a alguien para que haga tu próximo reto',
    'Inmunidad por 2 turnos',
    'Haz que otro jugador tome tu lugar',
    'Salta tu próximo turno',
    'Elige el próximo tipo de carta',
    'Todos los demás deben tomar',
    'Cambia de lugar con quien quieras'
  ],
  evento: [
    'Todos toman al mismo tiempo',
    'Todos deben hablar sin usar palabras por 3 minutos',
    'Todos cambian de lugar (rotación)',
    'Todos deben imitar al jugador actual',
    'Nadie puede usar el celular por 10 minutos',
    'Todos deben bailar por 1 minuto',
    'Silencio total por 2 minutos',
    'Todos deben contar hasta 20 juntos sin coordinarse'
  ]
};

type CardType = 'Pena' | 'Beneficio' | 'Evento';
type CardSubtype = 'Normal' | 'Fuerte';
type GameState = 'waiting' | 'revealing' | 'action';

interface DrawnCard {
  tipo: CardType;
  subtipo?: CardSubtype;
  contenido: string;
}

export default function CartasScreen() {
  const { players } = usePlayers();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [flipAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [roundCount, setRoundCount] = useState(0);

  // Iniciar animación de pulso cuando está esperando
  useEffect(() => {
    if (gameState === 'waiting') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [gameState]);

  const generateCard = (): DrawnCard => {
    const random = Math.random() * 100;
    if (random < 50) {
      // Pena (50%)
      const isPenaFuerte = Math.random() < 0.1; // 10% de penas fuertes
      const subtipo: CardSubtype = isPenaFuerte ? 'Fuerte' : 'Normal';
      const cardsArray = isPenaFuerte ? cartas.penaFuerte : cartas.penaNormal;
      const randomIndex = Math.floor(Math.random() * cardsArray.length);
      
      return {
        tipo: 'Pena',
        subtipo,
        contenido: cardsArray[randomIndex]
      };
    } else if (random < 75) {
      // Beneficio (25%)
      const randomIndex = Math.floor(Math.random() * cartas.beneficio.length);
      return {
        tipo: 'Beneficio',
        contenido: cartas.beneficio[randomIndex]
      };
    } else {
      // Evento (25%)
      const randomIndex = Math.floor(Math.random() * cartas.evento.length);
      return {
        tipo: 'Evento',
        contenido: cartas.evento[randomIndex]
      };
    }
  };

  const drawCard = () => {
    if (players.length === 0) {
      alert('No hay jugadores disponibles');
      return;
    }

    setGameState('revealing');
    
    // Animación de voltear carta
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start(() => {
      const newCard = generateCard();
      setDrawnCard(newCard);
      setRoundCount(prev => prev + 1);
      setGameState('action');
    });
  };

  const nextTurn = () => {
    setDrawnCard(null);
    setGameState('waiting');
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    flipAnim.setValue(0);
    pulseAnim.setValue(1);
  };

  const startNewGame = () => {
    setCurrentPlayerIndex(0);
    setDrawnCard(null);
    setGameState('waiting');
    setRoundCount(0);
    flipAnim.setValue(0);
    pulseAnim.setValue(1);
  };

  const getCardStyle = (tipo: CardType, subtipo?: CardSubtype) => {
    if (tipo === 'Pena') {
      return subtipo === 'Fuerte' ? styles.penaFuerteCard : styles.penaNormalCard;
    }
    if (tipo === 'Beneficio') return styles.beneficioCard;
    if (tipo === 'Evento') return styles.eventoCard;
    return styles.defaultCard;
  };

  const getCardIcon = (tipo: CardType) => {
    if (tipo === 'Pena') return <FontAwesome5 name="exclamation-triangle" size={32} color="#fff" />;
    if (tipo === 'Beneficio') return <FontAwesome5 name="gift" size={32} color="#fff" />;
    if (tipo === 'Evento') return <FontAwesome5 name="users" size={32} color="#fff" />;
    return null;
  };

  const getCardTitle = (tipo: CardType, subtipo?: CardSubtype) => {
    if (tipo === 'Pena') return subtipo === 'Fuerte' ? 'PENA EXTREMA' : 'PENA';
    if (tipo === 'Beneficio') return 'BENEFICIO';
    if (tipo === 'Evento') return 'EVENTO GRUPAL';
    return '';
  };

  return (
    <LinearGradient colors={['#312e81', '#581c87', '#be185d']} style={styles.container}>
      {/* Header con jugadores - inspirado en el demo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.playersSection}>
            <FontAwesome5 name="users" size={18} color="#fff" />
            <Text style={styles.playersLabel}>Jugadores</Text>
          </View>
          <Text style={styles.turnInfo}>
            Turno {currentPlayerIndex + 1} de {players.length}
          </Text>
        </View>
        
        {/* Lista de jugadores con badges */}
        {players.length > 0 && (
          <ScrollView 
            horizontal 
            style={styles.playersScrollView} 
            contentContainerStyle={styles.playersContainer}
            showsHorizontalScrollIndicator={false}
          >
            {players.map((player, index) => (
              <View
                key={index}
                style={[
                  styles.playerBadge,
                  index === currentPlayerIndex ? styles.activePlayerBadge : styles.inactivePlayerBadge
                ]}
              >
                <Text style={[
                  styles.playerBadgeText,
                  index === currentPlayerIndex ? styles.activePlayerText : styles.inactivePlayerText
                ]}>
                  {player}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Área principal del juego */}
      <View style={styles.gameArea}>
        {players.length === 0 ? (
          <View style={styles.noPlayersState}>
            <FontAwesome5 name="users-slash" size={60} color="#fff" />
            <Text style={styles.noPlayersTitle}>Sin jugadores</Text>
            <Text style={styles.noPlayersText}>Ve a la pantalla inicial para agregar jugadores</Text>
          </View>
        ) : gameState === 'waiting' ? (
          <View style={styles.waitingState}>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionTitle}>
                Turno de {players[currentPlayerIndex]}
              </Text>
              <Text style={styles.instructionSubtitle}>
                Toca la carta
              </Text>
            </View>
            
            {/* Carta cerrada con animación de pulso */}
            <TouchableOpacity 
              style={styles.deckCard}
              onPress={drawCard}
              activeOpacity={0.8}
            >
              <Animated.View 
                style={[
                  styles.cardFace,
                  { 
                    transform: [{ scale: pulseAnim }]
                  }
                ]}
              >
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardEmoji}>🎯</Text>
                </View>
                <Text style={styles.deckCardTitle}>TOCA AQUÍ</Text>
                <Text style={styles.deckCardSubtitle}>para revelar tu carta</Text>
              </Animated.View>
              
              {/* Efecto de brillo */}
              <View style={styles.cardShine} />
            </TouchableOpacity>
          </View>
        ) : gameState === 'revealing' ? (
          <View style={styles.revealingState}>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionTitle}>
                Revelando carta...
              </Text>
            </View>
            
            {/* Animación de carta girando */}
            <View style={styles.revealingCard}>
              <Animated.View
                style={[
                  styles.cardFace,
                  {
                    transform: [
                      {
                        rotateY: flipAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '180deg']
                        })
                      }
                    ]
                  }
                ]}
              >
                <Animated.Text style={[styles.revealingEmoji, { transform: [{ rotate: '360deg' }] }]}>
                  🎯
                </Animated.Text>
              </Animated.View>
            </View>
          </View>
        ) : (
          <View style={styles.actionState}>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionTitle}>
                {drawnCard?.tipo === 'Evento' ? 'Para todos:' : `${players[currentPlayerIndex]}:`}
              </Text>
            </View>
            
            {/* Carta revelada */}
            {drawnCard && (
              <Animated.View 
                style={[
                  styles.resultCard, 
                  getCardStyle(drawnCard.tipo, drawnCard.subtipo)
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    {getCardIcon(drawnCard.tipo)}
                  </View>
                  
                  <Text style={styles.cardType}>
                    {getCardTitle(drawnCard.tipo, drawnCard.subtipo)}
                  </Text>
                  
                  {drawnCard.subtipo === 'Fuerte' && (
                    <View style={styles.extremeBadge}>
                      <Text style={styles.extremeBadgeText}>¡RETO EXTREMO!</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.cardContent}>
                  {drawnCard.contenido}
                </Text>
              </Animated.View>
            )}
            
            {/* Botón continuar */}
            <TouchableOpacity style={styles.nextButton} onPress={nextTurn}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>¡Listo! Siguiente turno</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Footer con controles */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={startNewGame}>
          <MaterialIcons name="refresh" size={20} color="#fff" />
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header styles (glassmorphism)
  header: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 60, // Para evitar notch
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playersLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  turnInfo: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  playersScrollView: {
    maxHeight: 50,
  },
  playersContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  playerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  activePlayerBadge: {
    backgroundColor: '#fbbf24',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  inactivePlayerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  playerBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activePlayerText: {
    color: '#000',
  },
  inactivePlayerText: {
    color: '#fff',
  },

  // Game area
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  // States
  noPlayersState: {
    alignItems: 'center',
    gap: 16,
  },
  noPlayersTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  noPlayersText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  
  waitingState: {
    alignItems: 'center',
    gap: 32,
  },
  revealingState: {
    alignItems: 'center',
    gap: 32,
  },
  actionState: {
    alignItems: 'center',
    gap: 24,
    maxWidth: '100%',
  },
  
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },

  // Cards
  deckCard: {
    width: 256,
    height: 384,
    backgroundColor: 'transparent',
    borderRadius: 24,
    overflow: 'hidden',
  },
  revealingCard: {
    width: 256,
    height: 384,
    backgroundColor: 'transparent',
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
    position: 'relative',
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardEmoji: {
    fontSize: 48,
  },
  deckCardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  deckCardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  revealingEmoji: {
    fontSize: 96,
    textAlign: 'center',
  },
  
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
  },

  // Result card
  resultCard: {
    width: 256,
    height: 384,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
    marginBottom: 32,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardType: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  cardContent: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  extremeBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 16,
  },
  extremeBadgeText: {
    color: '#fecaca',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Card type styles
  penaNormalCard: {
    backgroundColor: '#f97316',
  },
  penaFuerteCard: {
    backgroundColor: '#dc2626',
  },
  beneficioCard: {
    backgroundColor: '#10b981',
  },
  eventoCard: {
    backgroundColor: '#8b5cf6',
  },
  defaultCard: {
    backgroundColor: '#6b7280',
  },

  // Buttons
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
