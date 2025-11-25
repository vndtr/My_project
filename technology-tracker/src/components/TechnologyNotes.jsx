// src/components/TechnologyNotes.jsx
function TechnologyNotes({ notes, onNotesChange }) {
  return (
    <div className="notes-section">
      <h4>Мои заметки:</h4>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Записывайте сюда важные моменты..."
        rows="3"
        className="notes-textarea"
      />
      <div className="notes-hint">
        {notes.length > 0 
          ? `Заметка сохранена (${notes.length} символов)` 
          : 'Добавьте заметку'
        }
      </div>
    </div>
  );
}

export default TechnologyNotes;