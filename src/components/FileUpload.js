import React, { useRef } from 'react';

/**
 * Expected Markdown format:
 *
 * # Category Name
 *
 * ## 100
 * Question text here
 * **Answer:** The answer text
 *
 * ## 200
 * Question text here
 * **Answer:** The answer text
 *
 * # Another Category
 * ...
 */
function parseMarkdown(text) {
  const lines = text.split('\n');
  const categories = [];
  let currentCategory = null;
  let currentQuestion = null;
  let questionLines = [];

  const flushQuestion = () => {
    if (currentQuestion !== null && currentCategory !== null) {
      const fullText = questionLines.join('\n').trim();
      const answerMatch = fullText.match(/\*\*Answer:\*\*\s*(.+)/i);
      const answer = answerMatch ? answerMatch[1].trim() : '';
      const question = fullText
        .replace(/\*\*Answer:\*\*\s*.+/i, '')
        .trim();
      if (question) {
        currentCategory.questions.push({
          points: currentQuestion,
          question,
          answer,
          answered: false,
        });
      }
    }
    currentQuestion = null;
    questionLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('# ')) {
      flushQuestion();
      currentCategory = {
        name: line.slice(2).trim(),
        questions: [],
      };
      categories.push(currentCategory);
    } else if (line.startsWith('## ')) {
      flushQuestion();
      const pts = parseInt(line.slice(3).trim(), 10);
      if (!isNaN(pts) && pts > 0 && currentCategory) {
        currentQuestion = pts;
      }
    } else if (currentQuestion !== null) {
      questionLines.push(line);
    }
  }
  flushQuestion();

  return categories.filter((c) => c.questions.length > 0);
}

function FileUpload({ onLoad }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.md')) {
      alert('Please upload a Markdown (.md) file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const categories = parseMarkdown(text);
      if (categories.length === 0) {
        alert(
          'No valid questions found. Check the file format:\n\n' +
            '# Category\n## Points\nQuestion text\n**Answer:** Answer text'
        );
        return;
      }
      onLoad(categories);
    };
    reader.readAsText(file);
    // Reset so same file can be re-uploaded
    e.target.value = '';
  };

  return (
    <div className="file-upload">
      <p className="upload-hint">
        Upload a <code>.md</code> file to load quiz questions.
      </p>
      <button className="upload-btn" onClick={() => inputRef.current.click()}>
        📂 Upload Quiz File
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <details className="format-hint">
        <summary>File format help</summary>
        <pre>{`# Category Name\n\n## 100\nQuestion text here\n**Answer:** Answer text\n\n## 200\nAnother question\n**Answer:** Answer text`}</pre>
      </details>
    </div>
  );
}

export { parseMarkdown };
export default FileUpload;
