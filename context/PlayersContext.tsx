import React, { createContext, ReactNode, useContext, useState } from 'react';

interface PlayersContextType {
  players: string[];
  setPlayers: (players: string[]) => void;
  addPlayer: (player: string) => void;
  clearPlayers: () => void;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<string[]>([]);

  const addPlayer = (player: string) => {
    if (player.trim() !== '') {
      setPlayers(prev => [...prev, player.trim()]);
    }
  };

  const clearPlayers = () => {
    setPlayers([]);
  };

  return (
    <PlayersContext.Provider value={{ players, setPlayers, addPlayer, clearPlayers }}>
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
