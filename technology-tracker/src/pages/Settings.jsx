// src/pages/Settings.jsx
import { Link } from 'react-router-dom';

function Settings() {
  const handleReset = () => {
    if (window.confirm('Удалить все технологии?')) {
      localStorage.removeItem('technologies');
      alert('Данные сброшены');
      window.location.reload();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="btn btn-secondary">На главную</Link>
        <h1>Настройки</h1>
      </div>
      
      <div className="settings-section">
        <h3>Управление данными</h3>
        <button onClick={handleReset} className="btn btn-danger">
          Сбросить все данные
        </button>
      </div>
    </div>
  );
}

export default Settings;