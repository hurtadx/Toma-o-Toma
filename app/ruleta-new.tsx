import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { usePlayers } from '../context/PlayersContext';

const { width, height } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.6, height * 0.35, 280);
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 10;

// Colores actualizados para coincidir con la paleta
const colors = [
  "#e94560", "#f27121", "#00d2ff", "#3a7bd5", 
  "#667eea", "#764ba2", "#11998e", "#38ef7d",
  "#ff6b6b", "#feca57", "#48cae4", "#0077b6"
];

export default function RuletaScreen() {
  const { players } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const createPlayerSections = () => {
    if (players.length === 0) return [];
    
    return players.map((player, index) => ({
      text: player,
      color: colors[index % colors.length],
      number: (index + 1).toString()
    }));
  };

  const playerSections = createPlayerSections();

  const createWheelSections = () => {
    if (playerSections.length === 0) return [];
    
    const sectionElements = [];
    const anglePerSection = (2 * Math.PI) / playerSections.length;

    for (let i = 0; i < playerSections.length; i++) {
      const startAngle = i * anglePerSection;
      const endAngle = (i + 1) * anglePerSection;
      
      const x1 = CENTER + RADIUS * Math.cos(startAngle);
      const y1 = CENTER + RADIUS * Math.sin(startAngle);
      const x2 = CENTER + RADIUS * Math.cos(endAngle);
      const y2 = CENTER + RADIUS * Math.sin(endAngle);
      
      const largeArc = anglePerSection > Math.PI ? 1 : 0;
      
      const pathData = `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      sectionElements.push(
        <Path
          key={`section-${i}`}
          d={pathData}
          fill={playerSections[i].color}
          stroke="#ffffff"
          strokeWidth="2"
        />
      );

      // Texto del jugador
      const textAngle = startAngle + anglePerSection / 2;
      const textRadius = RADIUS * 0.7;
      const textX = CENTER + textRadius * Math.cos(textAngle);
      const textY = CENTER + textRadius * Math.sin(textAngle);
      
      const fontSize = playerSections[i].text.length > 10 ? 8 : 
                     playerSections[i].text.length > 8 ? 9 : 
                     playerSections[i].text.length > 6 ? 10 : 11;
      
      sectionElements.push(
        <SvgText
          key={`text-${i}`}
          x={textX}
          y={textY}
          fontSize={fontSize}
          fontWeight="bold"
          fill="#ffffff"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${(textAngle * 180 / Math.PI) + 90} ${textX} ${textY})`}
        >
          {playerSections[i].text}
        </SvgText>
      );
    }
    
    return sectionElements;
  };

  const spinWheel = () => {
    if (isSpinning || playerSections.length === 0) return;
    
    setIsSpinning(true);
    setSelectedPlayer(null);
    
    const randomIndex = Math.floor(Math.random() * playerSections.length);
    const anglePerSection = 360 / playerSections.length;
    const winningAngle = randomIndex * anglePerSection;
    const spins = 5;
    const finalAngle = spins * 360 + (360 - winningAngle);
    
    spinValue.setValue(0);
    
    Animated.timing(spinValue, {
      toValue: finalAngle,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSelectedPlayer(playerSections[randomIndex].text);
      setIsSpinning(false);
    });
  };

  const resetRuleta = () => {
    Animated.timing(spinValue, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();    
    setSelectedPlayer(null);
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
        <Text style={styles.title}>Ruleta de Jugadores</Text>
        <Text style={styles.subtitle}>¡Gira y descubre quién será!</Text>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {players.length === 0 ? (
          <View style={styles.noPlayersContainer}>
            <Text style={styles.noPlayersText}>
              Necesitas agregar jugadores primero
            </Text>
            <Text style={styles.noPlayersSubtext}>
              Ve a la pantalla inicial para agregar jugadores
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.ruletaContainer}>
              {/* Flecha indicadora */}
              <View style={styles.topIndicator}>
                <View style={styles.topArrow} />
              </View>

              {/* Ruleta */}
              <View style={styles.wheelWrapper}>
                <Animated.View 
                  style={[
                    styles.wheel,
                    {
                      transform: [{
                        rotate: spinValue.interpolate({
                          inputRange: [0, 360],
                          outputRange: ['0deg', '360deg']
                        })
                      }]
                    }
                  ]}
                >
                  <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
                    {createWheelSections()}
                    <Circle
                      cx={CENTER}
                      cy={CENTER}
                      r="15"
                      fill="#ffffff"
                      stroke="#333"
                      strokeWidth="3"
                    />
                  </Svg>
                </Animated.View>
              </View>
            </View>

            {/* Resultado */}
            {selectedPlayer && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>¡Resultado!</Text>
                <Text style={styles.resultPlayer}>{selectedPlayer}</Text>
              </View>
            )}

            {/* Botones */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={spinWheel}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.button, isSpinning && styles.disabledButton]}
                >
                  <Text style={styles.buttonText}>
                    {isSpinning ? 'Girando...' : 'Girar Ruleta'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {selectedPlayer && (
                <TouchableOpacity onPress={resetRuleta}>
                  <LinearGradient
                    colors={['#11998e', '#38ef7d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Reiniciar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  ruletaContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  topIndicator: {
    position: 'absolute',
    top: -10,
    zIndex: 10,
  },
  topArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#e94560',
  },
  wheelWrapper: {
    marginTop: 20,
    borderRadius: WHEEL_SIZE / 2,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
  },
  resultContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  resultText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  resultPlayer: {
    fontSize: 24,
    color: '#e94560',
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 15,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 25,
    alignItems: 'center',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  noPlayersContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  noPlayersText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10,
  },
  noPlayersSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
