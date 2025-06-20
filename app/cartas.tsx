import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AppColors } from '../constants/Colors';
import { usePlayers } from '../context/PlayersContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type CardType = 'pena_normal' | 'pena_fuerte' | 'beneficio' | 'evento';

interface Card {
  id: number;
  tipo: CardType;
  texto: string;
  extremo?: boolean;
}


const cardData = {
  pena: {
    normal: [
      "Toma 2 shots",
      "Habla como bebé por 6 turnos, si fallas, tomas shot",
      "Haz 10 flexiones, si no puedes, toma 2 tragos",
      "Cuenta con detalle tu último encuentro sexual ",
      "lamele la mano a alguien del grupo",
      "Imita a alguien del grupo, deben adivinar quién es, si no, toma 2 tragos",
      "Toma sin usar las manos",
      "quitate una prenda de ropa, si no puedes, toma 3 tragos",
      "",
      "Haz mímica hasta que adivinen la película",
      "menciona quien crees que es el que mejor da sexo oral del grupo",
    ],
    fuerte: [
      "Muestra tu galería de fotos por 30 segundos",
      "Escríbele a tu ex",
      "Llama a tu mamá y dile que la amas",
      "Confiesa tu crush actual",
      "Haz una llamada perdida a un contacto random",
      "Lee tu último mensaje de WhatsApp en voz alta",
      "Publica una foto rara en tu historia",
      "Cuenta tu secreto más vergonzoso",
      "Llama a una drogueria y di que estas esperando los condones de hello kitty que pediste"
    ]
  },
  beneficio: [
    "Anula la próxima pena que te toque",
    "Haz que otro jugador tome tu lugar",
    "Todos los demás toman",
    "Elige a quien le toca el próximo turno",
    "Inmunidad total en la próxima ronda",
    "Intercambia tu turno con quien quieras",
    "Reparte 3 tragos entre otros jugadores",
    "Salta tu próximo turno"
  ],
  evento: [
    "¡Toma o Toma , todos los jugadores beben un trago!",
    "Cambien de lugares todos",
    "Por los siguientes 3 turnos no pueden hablar, solo gestos, el que falle toma shot",
    "Todos deben contar hasta 20 juntos",
    "Baile grupal obligatorio",
    "Todos muestran su foto más reciente",
    "El más joven toma doble",
    "El más viejo cuenta una historia"
  ]
};

const generateRandomCard = (): Card => {
  const rand = Math.random();
  let cardType: CardType, content: string, extremo = false;
  let id = Math.floor(Math.random() * 1000);

  if (rand < 0.5) {
    // 50% Pena
    if (Math.random() < 0.2) {
      // 10% Pena Fuerte
      cardType = 'pena_fuerte';
      content = cardData.pena.fuerte[Math.floor(Math.random() * cardData.pena.fuerte.length)];
      extremo = Math.random() < 0.5; // 50% chance de ser extremo
    } else {
      // 40% Pena Normal
      cardType = 'pena_normal';
      content = cardData.pena.normal[Math.floor(Math.random() * cardData.pena.normal.length)];
    }
  } else if (rand < 0.75) {
    // 25% Beneficio
    cardType = 'beneficio';
    content = cardData.beneficio[Math.floor(Math.random() * cardData.beneficio.length)];
  } else {
    // 25% Evento
    cardType = 'evento';
    content = cardData.evento[Math.floor(Math.random() * cardData.evento.length)];
  }

  return { id, tipo: cardType, texto: content, extremo };
};

export default function CartasScreen() {
  const router = useRouter();
  const { players } = usePlayers();
  const [currentTurn, setCurrentTurn] = useState(0);
  const [gameState, setGameState] = useState<'waiting' | 'revealing' | 'action'>('waiting');
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [usedCards, setUsedCards] = useState<Card[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const cardAnimation = useRef(new Animated.Value(0)).current;

  const handleCardDraw = () => {
    if (gameState !== 'waiting') return;
    
    setIsAnimating(true);
    setGameState('revealing');
    
    // Animación de volteo
    Animated.sequence([
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
    
    // Simular revelado de carta
    setTimeout(() => {
      const newCard = generateRandomCard();
      setCurrentCard(newCard);
      setUsedCards(prev => [...prev, newCard]);
      setIsAnimating(false);
      setGameState('action');
    }, 1500);
  };

  const handleNextTurn = () => {
    setCurrentTurn(prev => (prev + 1) % players.length);
    setGameState('waiting');
    setCurrentCard(null);
    
    // Reset animations
    flipAnimation.setValue(0);
    cardAnimation.setValue(0);
  };

  const resetGame = () => {
    setUsedCards([]);
    setCurrentCard(null);
    setCurrentTurn(0);
    setGameState('waiting');
    flipAnimation.setValue(0);
    cardAnimation.setValue(0);
  };

  const getCardStyle = (tipo: CardType) => {
    switch (tipo) {
      case 'pena_normal':
        return styles.penaNormalCard;
      case 'pena_fuerte':
        return styles.penaFuerteCard;
      case 'beneficio':
        return styles.beneficioCard;
      case 'evento':
        return styles.eventoCard;
      default:
        return styles.defaultCard;
    }
  };

  const getCardTypeText = (tipo: CardType) => {
    switch (tipo) {
      case 'pena_normal':
        return 'PENA';
      case 'pena_fuerte':
        return 'PENA FUERTE';
      case 'beneficio':
        return 'BENEFICIO';
      case 'evento':
        return 'EVENTO GRUPAL';
      default:
        return 'CARTA';
    }
  };

  const flipY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const scale = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const currentPlayer = players.length > 0 ? players[currentTurn] : 'Jugador';

  return (    <LinearGradient colors={[AppColors.backgroundDark, AppColors.backgroundDarker]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tome y Sufra</Text>
          <Text style={styles.subtitle}>Cartas jugadas: {usedCards.length}</Text>
        </View>
        
        {/* Players List */}
        {players.length > 0 && (
          <View style={styles.playersContainer}>
            <View style={styles.playersHeader}>
              <Text style={styles.playersTitle}>Jugadores</Text>
              <Text style={styles.turnIndicator}>
                Turno {currentTurn + 1} de {players.length}
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.playersList}
              contentContainerStyle={styles.playersListContent}
            >              {players.map((player, index) => (
                <View
                  key={index}
                  style={[
                    styles.playerBadge,
                    index === currentTurn && styles.currentPlayerBadge
                  ]}
                >
                  <Text style={[
                    styles.playerBadgeText,
                    index === currentTurn && styles.currentPlayerBadgeText
                  ]}>
                    {player}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Game Area */}
        <View style={styles.gameArea}>
          {/* Game State: Waiting */}
          {gameState === 'waiting' && (
            <View style={styles.waitingState}>
              <Text style={styles.turnTitle}>Turno de {currentPlayer}</Text>
              
              <Pressable style={styles.deckCard} onPress={handleCardDraw}>
                <LinearGradient
                  colors={[AppColors.cartas, AppColors.cartasLight]}
                  style={styles.deckCardGradient}
                >
                  <View style={styles.cardFace}>
                    <Text style={styles.cardIcon}>�</Text>
                    <Text style={styles.deckCardTitle}>TOCA AQUÍ</Text>
                    <Text style={styles.deckCardSubtitle}>para revelar tu carta</Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {/* Game State: Revealing */}
          {gameState === 'revealing' && (
            <View style={styles.revealingState}>
              <Text style={styles.revealingTitle}>Revelando carta...</Text>
              
              <Animated.View 
                style={[
                  styles.revealingCard,
                  { transform: [{ rotateY: flipY }] }
                ]}
              >
                <LinearGradient
                  colors={[AppColors.cartas, AppColors.cartasLight]}
                  style={styles.revealingCardGradient}
                >
                  <Text style={styles.revealingIcon}>🎯</Text>
                </LinearGradient>
              </Animated.View>            </View>
          )}

          {/* Game State: Action */}
          {gameState === 'action' && currentCard && (
            <View style={styles.actionState}>
              <Text style={styles.actionTitle}>
                {currentCard.tipo === 'evento' ? 'Para todos:' : `${currentPlayer}:`}
              </Text>
              
              <Pressable onPress={handleNextTurn}>
                <Animated.View 
                  style={[
                    styles.resultCard,
                    getCardStyle(currentCard.tipo),
                    { transform: [{ scale }] }
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>{getCardTypeText(currentCard.tipo)}</Text>
                    {currentCard.extremo && (
                      <View style={styles.extremeBadge}>
                        <Text style={styles.extremeBadgeText}>¡RETO EXTREMO!</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.cardContent}>
                    <Text style={styles.cardText}>{currentCard.texto}</Text>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardTapHint}>Toca para continuar</Text>
                  </View>
                </Animated.View>
              </Pressable>
            </View>
          )}
        </View>        {/* Controls */}
        <View style={styles.controls}>
          <Pressable style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
    // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textGray,    textAlign: 'center',
  },
  
  // Players Container
  playersContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  playersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playersTitle: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  turnIndicator: {
    color: AppColors.textGray,
    fontSize: 12,
    fontWeight: '500',
  },  playersList: {
    flexDirection: 'row',
  },
  playersListContent: {
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  playerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 4,
    minWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  currentPlayerBadge: {
    backgroundColor: AppColors.warning,
    borderColor: 'rgba(255,255,255,0.3)',
    transform: [{ scale: 1.02 }],
    shadowColor: AppColors.warning,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,    elevation: 5,
  },
  playerBadgeText: {
    color: AppColors.textWhite,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  currentPlayerBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Game Area
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 500,
  },

  // Waiting State
  waitingState: {
    alignItems: 'center',
  },
  turnTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    marginBottom: 8,
    textAlign: 'center',
  },
  turnSubtitle: {
    fontSize: 18,
    color: AppColors.textGray,
    marginBottom: 40,
    textAlign: 'center',
  },

  // Revealing State
  revealingState: {
    alignItems: 'center',
  },
  revealingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    marginBottom: 40,
    textAlign: 'center',
  },

  // Action State
  actionState: {
    alignItems: 'center',
    maxWidth: 300,
  },
  actionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    marginBottom: 30,
    textAlign: 'center',
  },

  // Deck Card
  deckCard: {
    width: 280,
    height: 400,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  deckCardGradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardFace: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  deckCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    textAlign: 'center',
    marginBottom: 8,
  },
  deckCardSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // Revealing Card
  revealingCard: {
    width: 280,
    height: 400,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  revealingCardGradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  revealingIcon: {
    fontSize: 80,
  },

  // Result Card
  resultCard: {
    width: 280,
    height: 400,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 4,
    marginBottom: 30,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    textAlign: 'center',    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.textWhite,
    textAlign: 'center',
    lineHeight: 28,
  },
  cardFooter: {
    alignItems: 'center',
    marginTop: 16,
  },
  cardTapHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  extremeBadge: {
    backgroundColor: 'rgba(255, 69, 58, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  extremeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppColors.textWhite,
  },

  // Card Type Styles
  penaNormalCard: {
    backgroundColor: '#ff9500',
    borderColor: '#ff7b00',
  },
  penaFuerteCard: {
    backgroundColor: '#ff3b30',
    borderColor: '#d70015',
  },
  beneficioCard: {
    backgroundColor: '#34c759',
    borderColor: '#248a3d',
  },
  eventoCard: {
    backgroundColor: '#007aff',
    borderColor: '#0051d5',
  },
  defaultCard: {
    backgroundColor: AppColors.container,
    borderColor: AppColors.primaryLight,
  },
  // Controls
  controls: {
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AppColors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});
