import React, { createContext, ReactNode, useContext, useState } from 'react';

interface PlayersContextType {
  players: string[];
  setPlayers: (players: string[]) => void;
  addPlayer: (player: string) => void;
  removePlayer: (index: number) => void;
  clearPlayers: () => void;
  // Estados para el juego de cartas
  currentTurn: number;
  setCurrentTurn: (turn: number) => void;
  resetTurn: () => void;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  
  const addPlayer = (player: string) => {
    if (player.trim() !== '') {
      setPlayers(prev => [...prev, player.trim()]);
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(prev => prev.filter((_, i) => i !== index));
    // Ajustar el turno si es necesario
    if (index <= currentTurn && currentTurn > 0) {
      setCurrentTurn(prev => prev - 1);
    }
  };

  const clearPlayers = () => {
    setPlayers([]);
    setCurrentTurn(0);
  };

  const resetTurn = () => {
    setCurrentTurn(0);
  };

  return (
    <PlayersContext.Provider value={{ 
      players, 
      setPlayers, 
      addPlayer, 
      removePlayer, 
      clearPlayers,
      currentTurn,
      setCurrentTurn,
      resetTurn
    }}>
      {children}
    </PlayersContext.Provider>
  );
}

export function usePlayers() {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
}

// Default export para evitar warning de Expo Router
export default function NotARoute() {
  return null;
}
