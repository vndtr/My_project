// src/components/TechnologyFilter.jsx
function TechnologyFilter({ activeFilter, onFilterChange, technologies }) {
  const filters = [
    { key: 'all', label: 'Все'},
    { key: 'not-started', label: 'Не начатые'},
    { key: 'in-progress', label: 'В процессе'},
    { key: 'completed', label: 'Завершённые' }
  ];

  // Подсчет технологий по статусам
  const getCount = (filterKey) => {
    if (filterKey === 'all') return technologies.length;
    return technologies.filter(tech => tech.status === filterKey).length;
  };

  return (
    <div className="technology-filter">
      <h3>Фильтр по статусу:</h3>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
          >
            <span className="filter-emoji">{filter.emoji}</span>
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">({getCount(filter.key)})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TechnologyFilter;