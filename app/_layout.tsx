import { Stack } from 'expo-router';
import { PlayersProvider } from '../context/PlayersContext';
import { AppColors } from '../constants/Colors';

export default function RootLayout() {
  return (
    <PlayersProvider>
      <Stack>      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, // Ocultar header para usar uno personalizado
        }} 
      />      <Stack.Screen 
        name="game-selection" 
        options={{ 
          title: 'Seleccionar Juego',
          headerStyle: {
            backgroundColor: '#e94560',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }} 
      />      <Stack.Screen 
        name="ruleta" 
        options={{ 
          title: 'Ruleta de Jugadores',
          headerStyle: {
            backgroundColor: '#e94560',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }} 
      /><Stack.Screen 
        name="temporizador" 
        options={{ 
          title: 'Temporizador',
          headerStyle: {
            backgroundColor: '#00d2ff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }} 
      />      <Stack.Screen 
        name="moneda" 
        options={{ 
          title: 'Se dice o Callar',
          headerStyle: {
            backgroundColor: AppColors.moneda,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }} 
      /><Stack.Screen 
        name="cartas" 
        options={{ 
          title: 'Tome y Sufra',
          headerStyle: {
            backgroundColor: '#764ba2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}      />
    </Stack>
    </PlayersProvider>
  );
}
