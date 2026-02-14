import React from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { EventSetup } from './components/EventSetup';
import { ActiveGame } from './components/ActiveGame';
import { Dashboard } from './components/Dashboard';

const GameRouter: React.FC = () => {
  const { state, activeSession } = useGame();
  const [isCreating, setIsCreating] = React.useState(false);

  // If there is an active session selected, show the game
  if (state.activeSessionId && activeSession) {
    return <ActiveGame />;
  }

  // If user wants to create a new session OR if there are no sessions at all
  if (isCreating || state.sessions.length === 0) {
    return <EventSetup onCancel={() => setIsCreating(false)} hasHistory={state.sessions.length > 0} />;
  }

  // Otherwise show dashboard
  return <Dashboard onCreateNew={() => setIsCreating(true)} />;
};

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
