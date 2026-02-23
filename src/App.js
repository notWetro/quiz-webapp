import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import PlayerSetup from './components/PlayerSetup';
import QuizBoard from './components/QuizBoard';
import QuestionModal from './components/QuestionModal';
import ScoreBoard from './components/ScoreBoard';
import { halfDeduction } from './utils/scoring';

// Steps: 'setup' → 'upload' → 'game'
function App() {
  const [step, setStep] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handlePlayersReady = (playerList) => {
    setPlayers(playerList);
    setStep('upload');
  };

  const handleCategoriesLoaded = (cats) => {
    setCategories(cats);
    setStep('game');
  };

  const handleSelectQuestion = (categoryName, points) => {
    const cat = categories.find((c) => c.name === categoryName);
    if (!cat) return;
    const q = cat.questions.find((q) => q.points === points);
    if (!q || q.answered) return;
    setActiveQuestion({ ...q, category: categoryName });
  };

  const markAnswered = (categoryName, points) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.points === points ? { ...q, answered: true } : q
              ),
            }
          : cat
      )
    );
  };

  const handleCorrect = (playerName) => {
    const { category, points } = activeQuestion;
    setPlayers((prev) =>
      prev.map((p) =>
        p.name === playerName ? { ...p, score: p.score + points } : p
      )
    );
    markAnswered(category, points);
    setActiveQuestion(null);
  };

  const handleWrong = (playerName) => {
    const { points } = activeQuestion;
    const deduction = halfDeduction(points);
    setPlayers((prev) =>
      prev.map((p) =>
        p.name === playerName ? { ...p, score: p.score - deduction } : p
      )
    );
    // Wrong answer does NOT mark tile as answered – others can still try
    // But if host wants to close modal they can click Skip
  };

  const handleClose = () => {
    setActiveQuestion(null);
  };

  const resetGame = () => {
    setStep('setup');
    setPlayers([]);
    setCategories([]);
    setActiveQuestion(null);
  };

  const isGameOver =
    step === 'game' &&
    categories.length > 0 &&
    categories.every((cat) => cat.questions.every((q) => q.answered));

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Quiz Board</h1>
        {step === 'game' && (
          <button className="reset-btn" onClick={resetGame}>
            New Game
          </button>
        )}
      </header>

      <main className="app-main">
        {step === 'setup' && (
          <div className="setup-screen">
            <PlayerSetup onStart={handlePlayersReady} />
          </div>
        )}

        {step === 'upload' && (
          <div className="upload-screen">
            <FileUpload onLoad={handleCategoriesLoaded} />
            <button className="back-btn" onClick={() => setStep('setup')}>
              ← Back
            </button>
          </div>
        )}

        {step === 'game' && (
          <div className="game-screen">
            <div className="game-layout">
              <div className="board-area">
                {isGameOver ? (
                  <div className="game-over">
                    <h2>🏆 Game Over!</h2>
                    <p>Final Scores:</p>
                  </div>
                ) : (
                  <QuizBoard
                    categories={categories}
                    onSelectQuestion={handleSelectQuestion}
                  />
                )}
              </div>
              <div className="side-area">
                <ScoreBoard players={players} />
                <button className="upload-new-btn" onClick={() => setStep('upload')}>
                  📂 Load New Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          players={players}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;
