import React from 'react';

export default function AdminPanel({ gameState, setGameState }) {
  const [newQuestion, setNewQuestion] = React.useState('');
  const [newAnswers, setNewAnswers] = React.useState([{ text: '', points: 0 }]);

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, { text: '', points: 0 }]);
  };

  const startNewRound = () => {
    setGameState({
      ...gameState,
      question: newQuestion,
      answers: newAnswers,
      revealedAnswers: [],
      strikes: 0,
      stealMode: false,
      stealAttempt: false,
      winner: null
    });
    setNewQuestion('');
    setNewAnswers([{ text: '', points: 0 }]);
  };

  const revealAnswer = (index) => {
    setGameState(prev => ({
      ...prev,
      revealedAnswers: [...prev.revealedAnswers, index],
      teams: prev.teams.map((team, i) =>
        i === prev.currentTeamIndex
          ? { ...team, score: team.score + prev.answers[index].points }
          : team
      )
    }));
  };

  const addStrike = () => {
    const strikesNow = gameState.strikes + 1;
    if (strikesNow >= 3) {
      setGameState(prev => ({
        ...prev,
        stealMode: true,
        strikes: strikesNow
      }));
    } else {
      setGameState(prev => ({ ...prev, strikes: strikesNow }));
    }
  };

  const stealSuccess = () => {
    const totalPoints = gameState.revealedAnswers.reduce((acc, idx) => acc + gameState.answers[idx].points, 0);
    setGameState(prev => ({
      ...prev,
      teams: prev.teams.map((team, i) =>
        i === (prev.currentTeamIndex === 0 ? 1 : 0)
          ? { ...team, score: team.score + totalPoints }
          : team
      ),
      stealMode: false,
      stealAttempt: false
    }));
  };

  const stealFail = () => {
    setGameState(prev => ({
      ...prev,
      stealMode: false,
      stealAttempt: false
    }));
  };

  return (
    <div style={{ padding: '20px', background: '#111', color: '#FFD700', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌟 Sparkles Fortunes - Host Panel</h1>

      <h2>Add New Question</h2>
      <input
        type="text"
        placeholder="Question"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      {newAnswers.map((answer, idx) => (
        <div key={idx} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Answer Text"
            value={answer.text}
            onChange={(e) => {
              const updated = [...newAnswers];
              updated[idx].text = e.target.value;
              setNewAnswers(updated);
            }}
            style={{ width: '70%', padding: '8px' }}
          />
          <input
            type="number"
            placeholder="Points"
            value={answer.points}
            onChange={(e) => {
              const updated = [...newAnswers];
              updated[idx].points = parseInt(e.target.value, 10) || 0;
              setNewAnswers(updated);
            }}
            style={{ width: '20%', padding: '8px', marginLeft: '5%' }}
          />
        </div>
      ))}
      <button onClick={handleAddAnswer} style={{ marginRight: '10px' }}>➕ Add Answer</button>
      <button onClick={startNewRound}>🚀 Start Round</button>

      <hr style={{ margin: '20px 0' }} />

      <h2>Game Controls</h2>
      <div style={{ marginBottom: '10px' }}>
        {gameState.answers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => revealAnswer(idx)}
            disabled={gameState.revealedAnswers.includes(idx)}
            style={{ margin: '5px' }}
          >
            Reveal: {answer.text}
          </button>
        ))}
      </div>
      <button onClick={addStrike} style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>❌ Add Strike</button>

      {gameState.stealMode && (
        <>
          <h3>💥 Steal Attempt!</h3>
          <button onClick={stealSuccess} style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginRight: '10px' }}>✅ Steal Success</button>
          <button onClick={stealFail} style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>❌ Steal Fail</button>
        </>
      )}

      <h2>Scores</h2>
      {gameState.teams.map((team, idx) => (
        <p key={idx}>{team.name}: {team.score} points</p>
      ))}
    </div>
  );
}
