import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CartasScreen from './screens/CartasScreen';
import GameSelectionScreen from './screens/GameSelectionScreen';
import HomeScreen from './screens/HomeScreen';
import MonedaScreen from './screens/MonedaScreen';
import RuletaScreen from './screens/RuletaScreen';
import TemporizadorScreen from './screens/TemporizadorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Toma o Toma' }}
        />
        <Stack.Screen 
          name="GameSelection" 
          component={GameSelectionScreen} 
          options={{ title: 'Seleccionar Juego' }}
        />
        <Stack.Screen 
          name="Ruleta" 
          component={RuletaScreen} 
          options={{ title: 'Ruleta' }}
        />
        <Stack.Screen 
          name="Temporizador" 
          component={TemporizadorScreen} 
          options={{ title: 'Temporizador' }}
        />
        <Stack.Screen 
          name="Cartas" 
          component={CartasScreen} 
          options={{ title: 'Tome y Sufra' }}
        />
        <Stack.Screen 
          name="Moneda" 
          component={MonedaScreen} 
          options={{ title: 'Moneda' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
