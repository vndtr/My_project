// src/pages/TechnologyList.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyFilter from '../components/TechnologyFilter';
import QuickActions from '../components/QuickActions';
import useTechnologiesApi from '../hook/useTechnologiesApi';

function TechnologyList() {
  const { technologies, loading } = useTechnologiesApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [localTech, setLocalTech] = useState([]);

  // Синхронизируем локальное состояние с данными из хука
  useEffect(() => {
    if (!loading) {
      setLocalTech(technologies);
    }
  }, [technologies, loading]);

  // Функции для обновления статуса и заметок
  const updateStatus = (id, newStatus) => {
    const updated = localTech.map(tech =>
      tech.id === id ? { ...tech, status: newStatus } : tech
    );
    setLocalTech(updated);
    localStorage.setItem('technologies', JSON.stringify(updated));
  };

  const updateNotes = (id, newNotes) => {
    const updated = localTech.map(tech =>
      tech.id === id ? { ...tech, notes: newNotes } : tech
    );
    setLocalTech(updated);
    localStorage.setItem('technologies', JSON.stringify(updated));
  };

  // Быстрые действия
  const markAllCompleted = () => {
    const updated = localTech.map(tech => ({ ...tech, status: 'completed' }));
    setLocalTech(updated);
    localStorage.setItem('technologies', JSON.stringify(updated));
  };

  const resetAllStatuses = () => {
    const updated = localTech.map(tech => ({ ...tech, status: 'not-started' }));
    setLocalTech(updated);
    localStorage.setItem('technologies', JSON.stringify(updated));
  };

  const deleteAllTechnologies = () => {
    setLocalTech([]);
    localStorage.setItem('technologies', JSON.stringify([]));
  };

  // Фильтрация технологий
  const filteredTechnologies = localTech.filter(tech => {
    // Фильтр по статусу
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    
    // Фильтр по поиску
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Отображение загрузки
  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Загрузка технологий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Все технологии</h1>
        <div className="header-actions">
          <Link to="/add-technology" className="btn btn-primary">
             Добавить технологию
          </Link>
          <Link to="/" className="btn btn-secondary">
             На главную
          </Link>
        </div>
      </div>

      <QuickActions 
        onMarkAllCompleted={markAllCompleted}
        onResetAllStatuses={resetAllStatuses}
        onDeleteAll={deleteAllTechnologies}
        technologies={localTech}
      />

      {/* Поиск */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-results">Найдено: {filteredTechnologies.length}</span>
        </div>
      </div>

      {/* Фильтрация */}
      <TechnologyFilter 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        technologies={localTech}
      />

      {/* Список технологий */}
      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            technology={tech}
            onStatusChange={updateStatus}
            onNotesChange={updateNotes}
          />
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="empty-state">
          <p>Технологий не найдено.</p>
          <p>Попробуйте изменить поисковый запрос или фильтр.</p>
        </div>
      )}
    </div>
  );
}

export default TechnologyList;