import React from 'react';
import AdminPanel from './components/AdminPanel';
import DisplayScreen from './components/DisplayScreen';

export default function App() {
  const [gameState, setGameState] = React.useState({
    question: '',
    answers: [],
    revealedAnswers: [],
    strikes: 0,
    teams: [
      { name: 'Team A', score: 0 },
      { name: 'Team B', score: 0 },
    ],
    currentTeamIndex: 0,
    stealMode: false,
    stealAttempt: false,
    winner: null
  });

  return (
    <div>
      <AdminPanel gameState={gameState} setGameState={setGameState} />
      <DisplayScreen gameState={gameState} />
    </div>
  );
}
