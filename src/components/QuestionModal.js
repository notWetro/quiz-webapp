import React, { useEffect, useRef } from 'react';
import { halfDeduction } from '../utils/scoring';

function QuestionModal({ question, players, onCorrect, onWrong, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (el) el.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!question) return null;

  const halfPoints = halfDeduction(question.points);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Question"
    >
      <div className="modal" ref={dialogRef} tabIndex={-1}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="modal-points">{question.points} Points</div>
        <div className="modal-category">{question.category}</div>
        <p className="modal-question">{question.question}</p>

        {question.answer && (
          <details className="modal-answer">
            <summary>Show Answer</summary>
            <p>{question.answer}</p>
          </details>
        )}

        <div className="modal-actions">
          <div className="player-buttons">
            <h3>Who answered correctly?</h3>
            {players.map((player) => (
              <button
                key={player.name}
                className="correct-btn"
                onClick={() => onCorrect(player.name)}
              >
                ✔ {player.name} (+{question.points})
              </button>
            ))}
          </div>
          <div className="wrong-section">
            <h3>Who answered wrong?</h3>
            {players.map((player) => (
              <button
                key={player.name}
                className="wrong-btn"
                onClick={() => onWrong(player.name)}
              >
                ✘ {player.name} (−{halfPoints})
              </button>
            ))}
          </div>
          <button className="skip-btn" onClick={onClose}>
            Skip / No Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionModal;
