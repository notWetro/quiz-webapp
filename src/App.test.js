import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { parseMarkdown } from './components/FileUpload';

test('renders player setup on load', () => {
  render(<App />);
  expect(screen.getByText(/players/i)).toBeInTheDocument();
  expect(screen.getByText(/start game/i)).toBeInTheDocument();
});

test('shows error when starting with no player names', async () => {
  render(<App />);
  const startBtn = screen.getByText(/start game/i);
  await userEvent.click(startBtn);
  expect(screen.getByText(/at least one player/i)).toBeInTheDocument();
});

test('parseMarkdown parses categories and questions', () => {
  const md = `# History\n\n## 100\nWhat year did WWII end?\n**Answer:** 1945\n\n## 200\nWho was the first US president?\n**Answer:** George Washington\n\n# Science\n\n## 100\nWhat is H2O?\n**Answer:** Water\n`;
  const cats = parseMarkdown(md);
  expect(cats).toHaveLength(2);
  expect(cats[0].name).toBe('History');
  expect(cats[0].questions).toHaveLength(2);
  expect(cats[0].questions[0].points).toBe(100);
  expect(cats[0].questions[0].answer).toBe('1945');
  expect(cats[1].name).toBe('Science');
});

test('parseMarkdown returns empty for invalid input', () => {
  expect(parseMarkdown('')).toHaveLength(0);
  expect(parseMarkdown('no categories here')).toHaveLength(0);
});

