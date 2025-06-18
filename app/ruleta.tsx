import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayers } from '../context/PlayersContext';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
// Hacer la ruleta más pequeña y responsiva
const WHEEL_SIZE = Math.min(width * 0.6, height * 0.35, 280);
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 10;

// Colores vibrantes para las secciones con gradientes
const colors = [
  "#FF6B6B", // Coral
  "#4ECDC4", // Turquesa
  "#45B7D1", // Azul cielo
  "#96CEB4", // Verde menta
  "#FFEAA7", // Amarillo suave
  "#DDA0DD", // Ciruela
  "#98D8C8", // Verde agua
  "#F7DC6F", // Dorado
  "#BB8FCE", // Lavanda
  "#85C1E9", // Azul claro
  "#F8C471", // Naranja claro
  "#82E0AA"  // Verde claro
];

export default function RuletaScreen() {  const { players } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Crear secciones basadas en los jugadores
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
      const startAngle = i * anglePerSection - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSection - Math.PI / 2;
      
      const x1 = CENTER + RADIUS * Math.cos(startAngle);
      const y1 = CENTER + RADIUS * Math.sin(startAngle);
      const x2 = CENTER + RADIUS * Math.cos(endAngle);
      const y2 = CENTER + RADIUS * Math.sin(endAngle);
      
      const largeArcFlag = anglePerSection > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${CENTER} ${CENTER}`,
        `L ${x1} ${y1}`,
        `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      // Calcular posición del texto
      const textAngle = startAngle + anglePerSection / 2;
      const textRadius = RADIUS * 0.65;
      const textX = CENTER + textRadius * Math.cos(textAngle);
      const textY = CENTER + textRadius * Math.sin(textAngle);
      
      sectionElements.push(
        <Path
          key={i}
          d={pathData}
          fill={playerSections[i].color}
          stroke="#ffffff"
          strokeWidth="2"
        />
      );      // Agregar número
      const numberRadius = RADIUS * 0.85;
      const numberX = CENTER + numberRadius * Math.cos(textAngle);
      const numberY = CENTER + numberRadius * Math.sin(textAngle);

      sectionElements.push(
        <SvgText
          key={`number-${i}`}
          x={numberX}
          y={numberY + 5}
          fontSize="10"
          fontWeight="bold"
          fill="#ffffff"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {playerSections[i].number}
        </SvgText>
      );

      // Agregar nombre del jugador (ajustar tamaño según longitud del nombre)
      const fontSize = playerSections[i].text.length > 10 ? 8 : 
                     playerSections[i].text.length > 8 ? 9 : 
                     playerSections[i].text.length > 6 ? 10 : 11;
      
      sectionElements.push(
        <SvgText
          key={`text-${i}`}
          x={textX}
          y={textY + 5}
          fontSize={fontSize}
          fontWeight="bold"
          fill="#ffffff"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {playerSections[i].text}
        </SvgText>
      );
    }
    
    return sectionElements;
  };  const spinWheel = () => {
    if (isSpinning || players.length === 0) {
      alert('Necesitas al menos un jugador para girar la ruleta');
      return;
    }    setIsSpinning(true);
    setSelectedPlayer(null);

    // Resetear el valor a 0 para que cada giro empiece desde la misma posición
    spinValue.setValue(0);

    // Muchas más vueltas para sensación de aleatoriedad: entre 15 y 25 vueltas completas
    const minSpins = 15 * 360; // 15 vueltas mínimo
    const extraSpins = Math.random() * 10 * 360; // hasta 10 vueltas adicionales
    const randomSpin = minSpins + extraSpins;
    
    Animated.timing(spinValue, {
      toValue: randomSpin,
      duration: 6500, // Duración más larga para más drama
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,    }).start(() => {
      // Calcular el resultado basado en el ángulo final
      const finalAngle = randomSpin % 360;
      // Para el puntero superior: el ganador es la sección que esté arriba
      // La sección 0 empieza en 0°, así que simplemente usamos el ángulo final
      const adjustedAngle = (360 - finalAngle) % 360; // Invertir porque la ruleta gira hacia la derecha
      const sectionAngle = 360 / playerSections.length;
      const selectedIndex = Math.floor(adjustedAngle / sectionAngle) % playerSections.length;
        const selectedPlayerName = playerSections[selectedIndex].text;
      
      setSelectedPlayer(selectedPlayerName);
      setIsSpinning(false);
    });
  };
  const resetRuleta = () => {
    // Animación suave para volver a la posición inicial
    Animated.timing(spinValue, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();    
    setSelectedPlayer(null);
  };  return (
    <LinearGradient colors={['#6C5CE7', '#A29BFE']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >        
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ruleta de Jugadores</Text>
            <Text style={styles.subtitle}>¡Gira y descubre quién será!</Text>
          </View>
        </View>

      {players.length === 0 ? (        <View style={styles.noPlayersContainer}>
          <Text style={styles.noPlayersText}>
            Necesitas agregar jugadores primero
          </Text>
          <Text style={styles.noPlayersSubtext}>
            Ve a la pantalla inicial para agregar jugadores
          </Text>
        </View>
      ) : (
        <>          <View style={styles.ruletaContainer}>
            {/* Flecha indicadora arriba - posición tradicional */}
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
                  {/* Centro blanco de la ruleta */}
                  <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r="25"
                    fill="#ffffff"
                    stroke="#dddddd"
                    strokeWidth="2"
                  />
                </Svg>
              </Animated.View>
            </View>
          </View>

          {/* Mostrar lista de jugadores */}
          <View style={styles.playersListContainer}>
            <Text style={styles.playersListTitle}>Jugadores en la ruleta:</Text>
            <Text style={styles.playersListText}>
              {players.map((player, index) => `${index + 1}. ${player}`).join(' • ')}
            </Text>
          </View>          {selectedPlayer && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultPlayer}>¡{selectedPlayer} fue seleccionado!</Text>
              <Text style={styles.resultText}>¡Tu turno para el siguiente desafío!</Text>
            </View>
          )}          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.spinButton, isSpinning && styles.disabledButton]} 
              onPress={spinWheel}
              disabled={isSpinning}
            >
              <Text style={styles.buttonText}>
                {isSpinning ? 'Girando...' : 'Girar Ruleta'}
              </Text>
            </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
    opacity: 0.9,
  },
  ruletaContainer: {
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  leftIndicator: {
    position: 'absolute',
    left: 20,
    top: '50%',
    zIndex: 10,
    transform: [{ translateY: -15 }],
  },
  topIndicator: {
    position: 'absolute',
    top: -15,
    left: '50%',
    zIndex: 10,
    transform: [{ translateX: -15 }],
  },
  topArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  leftArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 15,
    borderBottomWidth: 15,
    borderRightWidth: 30,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  wheelWrapper: {
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: '#ffffff',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  wheel: {
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
  },
  resultContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  resultPlayer: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6C5CE7',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  resultSi: {
    color: '#4CAF50',
  },
  resultNo: {
    color: '#f44336',
  },
  buttonsContainer: {
    gap: 20,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  spinButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  noPlayersContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    marginTop: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  noPlayersText: {
    fontSize: 20,
    color: '#6C5CE7',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  noPlayersSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  playersListContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  playersListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playersListText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});
