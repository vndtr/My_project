// src/pages/TechnologyDetail.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
    }
  }, [techId]);

  const updateStatus = (newStatus) => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology({ ...technology, status: newStatus });
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <h1>Технология не найдена</h1>
        <p>Технология с ID {techId} не существует.</p>
        <Link to="/technologies" className="btn">
          ← Назад к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="btn">
          ← Назад к списку
        </Link>
        <h1>{technology.title}</h1>
      </div>

      <div className="technology-detail">
        <div className="detail-section">
          <h3>Описание</h3>
          <p>{technology.description}</p>
        </div>

        <div className="detail-section">
          <h3>Статус изучения</h3>
          <div className="status-buttons">
            <button
              onClick={() => updateStatus('not-started')}
              className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
            >
             <span className="status-text">Не начато</span>
            </button>
            <button
              onClick={() => updateStatus('in-progress')}
              className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
            >
              <span className="status-text">В процессе</span>
            </button>
            <button
              onClick={() => updateStatus('completed')}
              className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
            >
              <span className="status-text">Завершено</span>
            </button>
          </div>
        </div>

        {technology.notes && (
          <div className="detail-section">
            <h3>Мои заметки</h3>
            <p>{technology.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyDetail;