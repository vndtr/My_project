// src/pages/Statistics.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Statistics() {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      setStats({
        total: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        notStarted: technologies.filter(t => t.status === 'not-started').length
      });
    }
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="btn btn-secondary">← На главную</Link>
        <h1>Статистика</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Всего</span>
        </div>
        <div className="stat-card completed">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Завершено</span>
        </div>
        <div className="stat-card in-progress">
          <span className="stat-number">{stats.inProgress}</span>
          <span className="stat-label">В процессе</span>
        </div>
        <div className="stat-card not-started">
          <span className="stat-number">{stats.notStarted}</span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>
    </div>
  );
}

export default Statistics;