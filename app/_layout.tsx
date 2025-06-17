import { Stack } from 'expo-router';
import { PlayersProvider } from '../context/PlayersContext';

export default function RootLayout() {
  return (
    <PlayersProvider>
      <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Toma o Toma',
          headerStyle: {
            backgroundColor: '#4facfe',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="game-selection" 
        options={{ 
          title: 'Seleccionar Juego',
          headerStyle: {
            backgroundColor: '#ff7f50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="ruleta" 
        options={{ 
          title: 'Ruleta',
          headerStyle: {
            backgroundColor: '#4caf50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="temporizador" 
        options={{ 
          title: 'Temporizador',
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="moneda" 
        options={{ 
          title: 'Moneda',
          headerStyle: {
            backgroundColor: '#ff9800',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="cartas" 
        options={{ 
          title: 'Tome y Sufra',
          headerStyle: {
            backgroundColor: '#f44336',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}      />
    </Stack>
    </PlayersProvider>
  );
}
