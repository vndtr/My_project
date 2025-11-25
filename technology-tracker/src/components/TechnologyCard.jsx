// src/components/TechnologyCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({ technology, onStatusChange, onNotesChange }) {
  const [showNotes, setShowNotes] = useState(false);

  const handleStatusClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(technology.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onStatusChange(technology.id, nextStatus);
  };

  const handleNotesChange = (newNotes) => {
    onNotesChange(technology.id, newNotes);
  };

  return (
    <div className={`technology-card status-${technology.status}`}>
      <div className="card-header" onClick={handleStatusClick}>
        <h3>{technology.title}</h3>
        <span className={`status-badge status-${technology.status}`}>
          {technology.status === 'not-started' && 'Не начато'}
          {technology.status === 'in-progress' && 'В процессе'} 
          {technology.status === 'completed' && 'Завершено'}
        </span>
      </div>
      
      <p className="card-description">{technology.description}</p>
      
      <div className="card-actions">
        <button 
          onClick={() => setShowNotes(!showNotes)}
          className="notes-btn"
        >
          {technology.notes ? '📝 Редактировать заметки' : '📝 Добавить заметки'}
        </button>
        <Link to={`/technology/${technology.id}`} className="details-link">
          Подробнее →
        </Link>
      </div>

      {showNotes && (
        <TechnologyNotes
          notes={technology.notes}
          onNotesChange={handleNotesChange}
        />
      )}
    </div>
  );
}

export default TechnologyCard;