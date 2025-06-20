import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppColors } from '../constants/Colors';
import { usePlayers } from '../context/PlayersContext';

export default function GameSelectionScreen() {
  const { players } = usePlayers();

  const navigateToGame = (screen: string) => {
    if (players.length === 0) {
      alert('Necesitas agregar al menos un jugador para empezar');
      router.back();
      return;
    }
    router.push(`/${screen}` as any);
  };

  return (
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
        <Text style={styles.headerTitle}>🎮 Seleccionar Juego</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.playersInfo}>
          <Ionicons name="people" size={18} color={AppColors.textWhite} />
          <Text style={styles.subtitle}>
            {players.length} jugadores conectados
          </Text>
        </View>

        {/* Games Container */}
        <View style={styles.buttonContainer}>        
          {/* Ruleta */}
          <TouchableOpacity 
            style={styles.gameButton}
            onPress={() => navigateToGame('ruleta')}
          >
            <LinearGradient
              colors={[AppColors.ruleta, AppColors.ruletaLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameButtonGradient}
            >
              <View style={styles.gameIconContainer}>
                <MaterialIcons name="casino" size={50} color={AppColors.textWhite} />
              </View>
              <View style={styles.gameTextContainer}>
                <Text style={styles.buttonText}>Ruleta</Text>
                <Text style={styles.buttonDescription}>Gira la ruleta de la suerte</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>        

          {/* Temporizador */}
          <TouchableOpacity 
            style={styles.gameButton}
            onPress={() => navigateToGame('temporizador')}
          >
            <LinearGradient
              colors={[AppColors.temporizador, AppColors.temporizadorLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameButtonGradient}
            >
              <View style={styles.gameIconContainer}>
                <Ionicons name="timer" size={50} color={AppColors.textWhite} />
              </View>
              <View style={styles.gameTextContainer}>
                <Text style={styles.buttonText}>Temporizador</Text>
                <Text style={styles.buttonDescription}>Retos contra el tiempo</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Moneda */}
          <TouchableOpacity 
            style={styles.gameButton}
            onPress={() => navigateToGame('moneda')}
          >
            <LinearGradient
              colors={[AppColors.moneda, AppColors.monedaLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameButtonGradient}
            >
              <View style={styles.gameIconContainer}>
                <FontAwesome5 name="coins" size={50} color={AppColors.textWhite} />
              </View>
              <View style={styles.gameTextContainer}>
                <Text style={styles.buttonText}>Moneda</Text>
                <Text style={styles.buttonDescription}>Cara o cruz del destino</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Cartas */}
          <TouchableOpacity 
            style={styles.gameButton}
            onPress={() => navigateToGame('cartas')}
          >
            <LinearGradient
              colors={[AppColors.cartas, AppColors.cartasLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameButtonGradient}
            >
              <View style={styles.gameIconContainer}>
                <MaterialIcons name="style" size={50} color={AppColors.textWhite} />
              </View>
              <View style={styles.gameTextContainer}>
                <Text style={styles.buttonText}>Tome y Sufra</Text>
                <Text style={styles.buttonDescription}>Cartas de castigos y premios</Text>
              </View>
            </LinearGradient>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  playersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textWhite,
    opacity: 0.9,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  gameButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  gameButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
  },
  gameIconContainer: {
    marginRight: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  gameTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    marginBottom: 5,
  },
  buttonDescription: {
    fontSize: 14,
    color: AppColors.textWhite,
    opacity: 0.9,
    lineHeight: 20,
  },
});
