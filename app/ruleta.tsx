import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { AppColors } from '../constants/Colors';
import { usePlayers } from '../context/PlayersContext';

const { width, height } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.6, height * 0.35, 280);
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 10;

// Colores más suaves y menos contrastantes
const colors = [
  "#8a5a9c", "#b67b3f", "#5a8fb8", "#6b7db8", 
  "#7a8bc7", "#8a7db8", "#6b9c8e", "#7db89c",
  "#b87a7a", "#c7a87a", "#7ab8c7", "#5a8bb8"
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
      // Ajustar para que la primera sección empiece desde arriba (-90 grados)
      const startAngle = i * anglePerSection - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSection - Math.PI / 2;
      
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
  };  const spinWheel = () => {
    if (isSpinning || playerSections.length === 0) return;
    
    setIsSpinning(true);
    setSelectedPlayer(null);
    
    const randomIndex = Math.floor(Math.random() * playerSections.length);
    const anglePerSection = 360 / playerSections.length;
    // Calcular el ángulo para que el puntero apunte al centro de la sección
    const centerAngle = randomIndex * anglePerSection + (anglePerSection / 2);
    const spins = 5;
    // Ajustar para que el puntero (que está arriba) apunte al jugador seleccionado
    // Como las secciones ahora empiezan desde arriba, no necesitamos el +90
    const finalAngle = spins * 360 + (360 - centerAngle);
    
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
  };  return (
    <LinearGradient
      colors={[AppColors.backgroundDark, AppColors.backgroundDarker]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color={AppColors.textWhite} />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ruleta</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>¡Gira y descubre quién será!</Text>
        </View>
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
              <TouchableOpacity onPress={spinWheel}>                <LinearGradient
                  colors={[AppColors.ruleta, AppColors.ruletaLight]}
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
                <TouchableOpacity onPress={resetRuleta}>                  <LinearGradient
                    colors={[AppColors.cartas, AppColors.cartasLight]}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    flex: 1,
    textAlign: 'center',
    marginRight: 60, // Para compensar el espacio del botón de volver
  },
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },  ruletaContainer: {
    alignItems: 'center',
    marginVertical: 30,
    position: 'relative',
    paddingHorizontal: 20,
  },
  topIndicator: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    alignSelf: 'center',
  },
  topArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  borderTopColor: AppColors.textWhite,
  shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  wheelWrapper: {
    marginTop: 35,
    borderRadius: WHEEL_SIZE / 2,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
  },  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },  resultPlayer: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 15,
    paddingHorizontal: 20,
  },  button: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },  buttonText: {
    color: AppColors.textWhite,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },noPlayersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },  noPlayersText: {
    fontSize: 18,
    color: AppColors.textWhite,
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
