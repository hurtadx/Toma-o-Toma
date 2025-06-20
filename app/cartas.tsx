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

type CardType = 'pena_normal' | 'pena_fuerte' | 'beneficio' | 'evento' | 'verdad';

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
      "darle un baile erotico a la persona que caiga en la ruleta",
      "Haz mímica hasta que adivinen la película",
      "menciona quien crees que es la persona que mejor da sexo oral del grupo",
      "Entra a una red social y recrea la historia de una persona aleatoria",
      "sube una historia publica pidiendo sexo",
      "Escribele a un random de internet te extraño",
      "sin poder hablar a tu posicion favorita",
      "actua una escena de pelicula para adultos con la persona que caiga en la ruleta",
      "habla solo en preguntas por 8 turnos, si fallas, toma 2 tragos",
      "Habla como un comentarista deportivo por 5 turnos, si fallas, toma 2 tragos",
      "Actúa como si fueras un terapeuta analizando a cada persona",
      "Toma un shot",
      "Toma shot",
      "rueda la ruleta y cambia de vestimenta con esa persona",
      "Confiesa qué miembro del grupo te parece más atractivo sexualmente",
      "Revela si has masturbado pensando en alguien presente",
      "baila bachata con la persona que caiga en la ruleta",
      "tira 3 veces la ruleta y haz un matar, casar y coger"

    ],
    fuerte: [
      "Muestra tu galería de fotos oculta por 4 segundos, si no, toma 4 tragos",
      "Escríbele a tu ex o exligue y dile que lo extrañas",
      "Llama a tu mamá y dile que la amas 🥺",
      "Llama a una drogueria y di que estas esperando los condones de hello kitty que pediste",
      "quitale las medias al que caiga en la ruleta CON LA BOCA"
    ]
  },  beneficio: [
    "¡Felicidades! No haces nada en este turno",
    "Todos los demás toman 1 trago",
    "Elige a alguien para que tome 2 tragos",
    "Puedes solo agua en lugar de alcohol por 2 turnos",
    "Todos toman menos tú",
    "Elige a 2 personas para que tomen",
    "No tomas alcohol por los próximos 2 turnos",
    "Reparte 3 tragos entre otros jugadores",
    "Los demás hacen 10 flexiones, tú descansas"
  ],  evento: [
    "¡Toma o Toma , todos los jugadores beben un trago!",
    "Por los siguientes 4 turnos no pueden hablar, solo gestos, el que falle toma shot",
    "Baile grupal obligatorio, si jugador no lo hace, se quita una prenda",
    "Todos muestran su foto más reciente",
    "El más joven toma una doble",
    "El más viejo toma una doble",
    "Tiran ruleta dos veces, los elegidos deberan hacer un combate de freestyle",
    "¿Quién es más probable que se olvide su propio cumpleaños? El que señalen más toma 2 tragos",
    "¿Quién es más probable que mande mensaje al ex borracho? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se quede dormido en una cita? El que señalen más toma 2 tragos",
    "¿Quién es más probable que gaste todo su sueldo en un día? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se pierda en su propia ciudad? El que señalen más toma 2 tragos",
    "¿Quién es más probable que tenga más de 10 ex? El que señalen más toma 2 tragos",
    "¿Quién es más probable que mienta sobre su edad? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se haga el enfermo para no trabajar? El que señalen más toma 2 tragos",
    "¿Quién es más probable que stalkee a su ex en redes sociales? El que señalen más toma 2 tragos",
    "¿Quién es más probable que llore viendo una película? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se coma la comida de otros? El que señalen más toma 2 tragos",
    "¿Quién es más probable que termine en la cárcel? El que señalen más toma 2 tragos",
    "¿Quién es más probable que sea influencer? El que señalen más toma 2 tragos",
    "¿Quién es más probable que tenga más aplicaciones de citas? El que señalen más toma 2 tragos",
    "¿Quién es más probable que mienta en su perfil de citas? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se case primero? El que señalen más toma 2 tragos",
    "¿Quién es más probable que tenga más hijos? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se vuelva millonario? El que señalen más toma 2 tragos",
    "¿Quién es más probable que olvide nombres constantemente? El que señalen más toma 2 tragos",
    "¿Quién es más probable que termine siendo profesor? El que señalen más toma 2 tragos",
    "¿Quién es más probable que tenga una crisis de mediana edad? El que señalen más toma 2 tragos",
    "¿Quién es más probable que sea el más dramático? El que señalen más toma 2 tragos",
    "¿Quién es más probable que sea adicto a las redes sociales? El que señalen más toma 2 tragos",
    "¿Quién es más probable que termine viviendo con sus padres a los 40? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se tatúe el nombre de su pareja? El que señalen más toma 2 tragos",
    "¿Quién es más probable que termine en un reality show? El que señalen más toma 2 tragos",
    "¿Quién es más probable que sea el más celoso en una relación? El que señalen más toma 2 tragos",
    "¿Quién es más probable que termine siendo vegano? El que señalen más toma 2 tragos",
    "¿Quién es más probable que adopte 10 gatos? El que señalen más toma 2 tragos",
    "¿Quién es más probable que sea el más tacaño? El que señalen más toma 2 tragos",
    "¿Quién es más probable que se vuelva famoso en TikTok? El que señalen más toma 2 tragos",
    "¿Quién es más probable que termine siendo stripper? El que señalen más toma 2 tragos",
    "¿Quién es más probable que mienta sobre su número de parejas sexuales? El que señalen más toma 2 tragos",
    "¿Quién es más probable que tenga una aventura extramatrimonial? El que señalen más toma 2 tragos",
    "¿Quién es más probable que sea el peor en la cama? El que señalen más toma 2 tragos",
    "¿Quién es más probable que termine siendo sugar baby? El que señalen más toma 2 tragos",
    "¿Quién es más probable que haga sexting con chatgpt? El que señalen más toma 2 tragos",
    "¿Quién es mas probable que se coma con una persona casada? El que señalen más toma 2 tragos",  
    "Quien es mas probaabke que vuelva con su ex",
    "Todos hacen una confesión sexual al mismo tiempo, el más aburrido toma",    "Todos dicen cuál es su fetiche más raro (sin detalles)",
    "Todos intercambian una prenda de ropa con alguien",
    "¿Quién hace popó más veces al día? El que señalen más toma 2 tragos",
    "¿Quién tarda más tiempo en el baño? El que señalen más toma 2 tragos",
    "¿Quién ronca más fuerte? El que señalen más toma 2 tragos",

    "¿Quién come más rápido? El que señalen más toma 2 tragos",
    "¿Quién gasta más dinero en comida chatarra? El que señalen más toma 2 tragos",
    "¿Quién ve más porno? El que señalen más toma 2 tragos",
    "¿Quién se masturba más seguido? El que señalen más toma 2 tragos",
    "¿Quién tiene el cuarto más desordenado? El que señalen más toma 2 tragos",
    "¿Quién miente más seguido? El que señalen más toma 2 tragos",
    "¿Quién es más dramático cuando está enfermo? El que señalen más toma 2 tragos",
    "¿Quién llora más viendo películas? El que señalen más toma 2 tragos",
    "¿Quién tiene más miedo a las arañas? El que señalen más toma 2 tragos",
    "¿Quién habla más durante las películas? El que señalen más toma 2 tragos",
    "¿Quién toma más fotos de su comida? El que señalen más toma 2 tragos",
    "¿Quién revisa más su teléfono por día? El que señalen más toma 2 tragos",
    "¿Quién tiene más conversaciones imaginarias? El que señalen más toma 2 tragos",
    "¿Quién canta más en la ducha? El que señalen más toma 2 tragos",
    "¿Quién baila más cuando está solo? El que señalen más toma 2 tragos",
    "¿Quién procrastina más? El que señalen más toma 2 tragos",
    "¿Quién ve más series de Netflix? El que señalen más toma 2 tragos",
    "¿Quién duerme más horas? El que señalen más toma 2 tragos",
    "¿Quién se levanta más tarde? El que señalen más toma 2 tragos",
    "¿Quién tiene más apps de delivery? El que señalen más toma 2 tragos",
    "¿Quién stalkeó más a su ex? El que señalen más toma 2 tragos",
    "¿Quién tiene más fotos de sí mismo en su galería? El que señalen más toma 2 tragos",
    "¿Quién usa más filtros en sus fotos? El que señalen más toma 2 tragos",
    "¿Quién manda más memes por día? El que señalen más toma 2 tragos",
    "¿Quién tiene más contactos bloqueados? El que señalen más toma 2 tragos",
    "¿Quién borra más mensajes después de enviarlos? El que señalen más toma 2 tragos",
    "¿Quién cambia más de outfit antes de salir? El que señalen más toma 2 tragos",    "¿Quién se arrepiente más de sus decisiones? El que señalen más toma 2 tragos"

  ],
  verdad: [
    "Si tuvieras que coger disfrazado, ¿qué te pondrías?",
    "Muestra una foto de una persona con la que tendrías sexo (no del grupo, ni conocidos, ni famosos)",
    "¿Cuál es tu mayor fantasía sexual que nunca has confesado?",
    "¿Con qué tipo de persona nunca tendrías sexo?",
    "¿Cuál es el lugar más raro donde has pensado en tener sexo?",
    "¿Qué es lo más vergonzoso que has hecho por conseguir sexo?",
    "¿Cuál es tu posición sexual favorita y por qué?",
    "¿Has tenido sueños eróticos con alguien presente? (sin decir quién)",
    "¿Cuál es tu fetiche más secreto?",
    "¿Qué mentira has dicho más veces en tu vida?",
    "¿Cuál es tu mayor inseguridad que nadie conoce?",
    "¿Qué harías si supieras que el mundo se acaba mañana?",
    "¿Cuál es el secreto más oscuro que guardas?",
    "¿A quién odias en secreto y por qué?",
    "¿Cuál es tu mayor arrepentimiento en la vida?",
    "¿Qué es lo más loco que has hecho por amor?",
    "¿Cuánto dinero necesitarías para traicionar a tu mejor amigo?",
    "¿Cuál es tu miedo más irracional?",
    "¿Qué piensas realmente sobre cada persona de este grupo?",
    "¿Cuál es la mentira más grande que has dicho a tus padres?",
    "¿Has robado algo? ¿Qué fue?",
    "¿Cuál es tu adicción secreta?",
    "¿Qué es lo más cruel que has hecho a alguien?",
    "¿Has estado enamorado de alguien que no debías?",
    "¿Cuál es tu mayor hipocresía?",
    "¿Qué secreto te llevarías a la tumba?",
    "¿Has fingido un orgasmo? ¿Por qué?",
    "¿Cuál es tu mayor culpa o remordimiento?",
    "¿Qué harías por un millón de pesos que normalmente no harías?",
    "¿Has tenido pensamientos sobre dejar todo y comenzar una nueva vida?",
    "¿Cuál es tu mayor prejuicio que no admites públicamente?",
    "¿Qué es lo más patético que has hecho por atención?",
    "¿Has deseado que algo malo le pase a alguien?",
    "¿Cuál es tu peor hábito que escondes de otros?",
    "¿Qué mentira sobre ti mismo repites más frecuentemente?"
  ]
};

const generateRandomCard = (): Card => {
  const rand = Math.random();
  let cardType: CardType, content: string, extremo = false;
  let id = Math.floor(Math.random() * 1000);

  if (rand < 0.3) {
    // 30% Pena
    if (Math.random() < 0.25) {
      // 7.5% Pena Fuerte
      cardType = 'pena_fuerte';
      content = cardData.pena.fuerte[Math.floor(Math.random() * cardData.pena.fuerte.length)];
      extremo = Math.random() < 0.5;
    } else {
      // 22.5% Pena Normal
      cardType = 'pena_normal';
      content = cardData.pena.normal[Math.floor(Math.random() * cardData.pena.normal.length)];
    }
  } else if (rand < 0.4) {
    // 10% Beneficio
    cardType = 'beneficio';
    content = cardData.beneficio[Math.floor(Math.random() * cardData.beneficio.length)];
  } else if (rand < 0.65) {
    // 25% Verdad
    cardType = 'verdad';
    content = cardData.verdad[Math.floor(Math.random() * cardData.verdad.length)];
  } else {
    // 35% Evento
    cardType = 'evento';
    content = cardData.evento[Math.floor(Math.random() * cardData.evento.length)];
  }

  return { id, tipo: cardType, texto: content, extremo };
};

export default function CartasScreen() {
  const router = useRouter();
  const { players, currentTurn, setCurrentTurn, resetTurn } = usePlayers();
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
  };  const handleNextTurn = () => {
    const newTurn = (currentTurn + 1) % players.length;
    setCurrentTurn(newTurn); // Ahora se guarda automáticamente en el contexto
    setGameState('waiting');
    setCurrentCard(null);
    
    // Reset animations
    flipAnimation.setValue(0);
    cardAnimation.setValue(0);
  };
  const resetGame = () => {
    setUsedCards([]);
    setCurrentCard(null);
    resetTurn(); // Usar la función del contexto
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
      case 'verdad':
        return styles.verdadCard;
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
      case 'verdad':
        return 'VERDAD';
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
  },  eventoCard: {
    backgroundColor: '#007aff',
    borderColor: '#0051d5',
  },
  verdadCard: {
    backgroundColor: '#9d4edd',
    borderColor: '#7209b7',
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
