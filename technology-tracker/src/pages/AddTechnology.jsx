// src/pages/AddTechnology.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddTechnology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    status: 'not-started',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Получаем текущие технологии из localStorage
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];
    
    // Создаем новую технологию
    const newTechnology = {
      id: Date.now(), // Простой ID на основе времени
      ...formData
    };
    
    // Добавляем новую технологию
    const updatedTechnologies = [...technologies, newTechnology];
    localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    
    // Показываем сообщение и перенаправляем
    alert('Технология успешно добавлена!');
    navigate('/technologies');
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="btn btn-secondary">
          ← Назад к списку
        </Link>
        <h1>Добавить новую технологию</h1>
      </div>

      <form onSubmit={handleSubmit} className="technology-form">
        <div className="form-group">
          <label htmlFor="title">Название технологии *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Например: React Hooks"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Опишите, что нужно изучить..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Базы данных</option>
              <option value="tools">Инструменты</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Начальный статус</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершено</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Заметки (необязательно)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Дополнительные заметки..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Добавить технологию
          </button>
          <Link to="/technologies" className="btn btn-secondary">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;