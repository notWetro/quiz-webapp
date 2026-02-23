import React from 'react';

function QuizBoard({ categories, onSelectQuestion }) {
  // Collect all unique point values across all categories, sorted ascending
  const allPoints = [
    ...new Set(
      categories.flatMap((cat) => cat.questions.map((q) => q.points))
    ),
  ].sort((a, b) => a - b);

  return (
    <div className="quiz-board">
      {/* Header row */}
      <div
        className="board-grid"
        style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}
      >
        {categories.map((cat) => (
          <div key={cat.name} className="category-header">
            {cat.name}
          </div>
        ))}

        {/* Point tiles */}
        {allPoints.map((pts) =>
          categories.map((cat) => {
            const question = cat.questions.find((q) => q.points === pts);
            if (!question) {
              return (
                <div key={`${cat.name}-${pts}-empty`} className="tile tile-empty" />
              );
            }
            return (
              <div
                key={`${cat.name}-${pts}`}
                className={`tile ${question.answered ? 'tile-answered' : 'tile-active'}`}
                onClick={() => !question.answered && onSelectQuestion(cat.name, pts)}
                role="button"
                tabIndex={question.answered ? -1 : 0}
                onKeyDown={(e) => {
                  if (!question.answered && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectQuestion(cat.name, pts);
                  }
                }}
                aria-label={
                  question.answered
                    ? `${cat.name} ${pts} points – already answered`
                    : `${cat.name} ${pts} points`
                }
              >
                {question.answered ? '' : pts}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default QuizBoard;
