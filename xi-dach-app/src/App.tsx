import React from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { EventSetup } from './components/EventSetup';
import { ActiveGame } from './components/ActiveGame';

const GameRouter: React.FC = () => {
  const { state } = useGame();

  // If there's an active event, show the game dashboard
  if (state.currentEvent?.isActive) {
    return <ActiveGame />;
  }

  // Otherwise show setup screen
  return <EventSetup />;
};

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
