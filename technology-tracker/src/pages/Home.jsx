// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

function Home() {
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const total = technologies.length;
      const completed = technologies.filter(tech => tech.status === 'completed').length;
      const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
      const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
      const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      setProgress(progressPercentage);
      setStats({ total, completed, inProgress, notStarted });
    }
  }, []);

  return (
    <div className="page">
      <h1>Добро пожаловать в Трекер технологий!</h1>
      <p>Отслеживайте ваш прогресс в изучении технологий.</p>
      
      <div className="home-stats">
        <ProgressBar
          progress={progress}
          label="Общий прогресс изучения"
          color="#45b7d1"
          height={25}
          animated={true}
        />
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Всего технологий</span>
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

      <div className="home-actions">
        <Link to="/technologies" className="btn btn-primary">
          Посмотреть все технологии
        </Link>
      </div>
    </div>
  );
}

export default Home;