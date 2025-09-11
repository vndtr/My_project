const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

openBtn?.addEventListener('click', () => {
  lastActive = document.activeElement;
  dlg.showModal();
  dlg.querySelector('input, select, textarea, button')?.focus();
});

closeBtn?.addEventListener('click', () => dlg.close('cancel'));
// ===== ВАЛИДАЦИЯ ФОРМЫ =====

// Функция для открытия модального окна
function openModal() {
    lastActive = document.activeElement;
    dlg.showModal();
    // Переносим фокус на первое поле формы
    const firstInput = dlg.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
}

// Обработчики для модального окна
openBtn?.addEventListener('click', openModal);
closeBtn?.addEventListener('click', () => dlg.close('cancel'));

// Валидация формы
form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1) Сброс кастомных сообщений
    Array.from(form.elements).forEach(el => {
        el.setCustomValidity?.('');
        el.removeAttribute('aria-invalid');
    });

    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        // Показываем ошибки
        form.reportValidity();

        // Подсвечиваем поля с ошибками
        Array.from(form.elements).forEach(el => {
            if (el.willValidate && !el.checkValidity()) {
                el.setAttribute('aria-invalid', 'true');
                
                // Кастомные сообщения для разных типов ошибок
                if (el.validity.typeMismatch && el.type === 'email') {
                    el.setCustomValidity('Введите корректный e-mail, например name@example.com');
                } else if (el.validity.patternMismatch && el.id === 'phone') {
                    el.setCustomValidity('Введите телефон в формате: +7 (900) 000-00-00');
                } else if (el.validity.valueMissing) {
                    el.setCustomValidity('Это поле обязательно для заполнения');
                }
            }
        });

        return;
    }

    // 3) Успешная отправка
    alert('Форма успешно отправлена!');
    dlg.close('success');
    form.reset();
    
    // Сброс состояния ошибок
    Array.from(form.elements).forEach(el => {
        el.removeAttribute('aria-invalid');
    });
});

// Закрытие модального окна
dlg?.addEventListener('close', () => {
    lastActive?.focus();
});

// ===== МАСКА ДЛЯ ТЕЛЕФОНА =====
const phone = document.getElementById('phone');

phone?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Нормализация: 8 → 7
    if (value.startsWith('8')) {
        value = '7' + value.slice(1);
    }
    
    // Ограничение до 11 цифр
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    // Форматирование
    let formatted = '';
    if (value.length > 0) {
        formatted += '+7';
        if (value.length > 1) {
            formatted += ` (${value.slice(1, 4)}`;
        }
        if (value.length >= 4) {
            formatted += ') ';
        }
        if (value.length >= 5) {
            formatted += value.slice(4, 7);
        }
        if (value.length >= 8) {
            formatted += `-${value.slice(7, 9)}`;
        }
        if (value.length >= 10) {
            formatted += `-${value.slice(9, 11)}`;
        }
    }

    e.target.value = formatted;
});

// Установка pattern для телефона
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

// ===== ДОПОЛНИТЕЛЬНАЯ ВАЛИДАЦИЯ =====
// Валидация email в реальном времени
const email = document.getElementById('email');
email?.addEventListener('blur', () => {
    if (email.value && !email.checkValidity()) {
        email.setCustomValidity('Введите корректный e-mail');
        email.setAttribute('aria-invalid', 'true');
    } else {
        email.setCustomValidity('');
        email.removeAttribute('aria-invalid');
    }
});

// Валидация имени (минимум 2 символа)
const nameField = document.getElementById('name');
nameField?.addEventListener('blur', () => {
    if (nameField.value.length < 2 && nameField.value.length > 0) {
        nameField.setCustomValidity('Имя должно содержать минимум 2 символа');
        nameField.setAttribute('aria-invalid', 'true');
    } else {
        nameField.setCustomValidity('');
        nameField.removeAttribute('aria-invalid');
    }
});

// Сброс ошибок при фокусе
form?.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        e.target.setCustomValidity('');
        e.target.removeAttribute('aria-invalid');
    }
});

// ===== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ С СИНХРОНИЗАЦИЕЙ МЕЖДУ ВКЛАДКАМИ =====
const KEY = 'theme';
const btn = document.querySelector('.theme-toggle');

// Функция применения темы
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('theme-dark');
    } else {
        document.body.classList.remove('theme-dark');
    }
    if (btn) {
        btn.setAttribute('aria-pressed', String(isDark));
        // Обновляем иконку
        const icon = btn.querySelector('.theme-toggle__icon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    }
    localStorage.setItem(KEY, isDark ? 'dark' : 'light');
}

// Функция переключения темы
function toggleTheme() {
    const isDark = !document.body.classList.contains('theme-dark');
    applyTheme(isDark);
}

// Инициализация темы при загрузке
function initTheme() {
    const savedTheme = localStorage.getItem(KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDark = false;
    
    if (savedTheme === 'dark') {
        isDark = true;
    } else if (savedTheme === 'light') {
        isDark = false;
    } else {
        // Если нет сохранённой темы, используем системную
        isDark = systemPrefersDark;
    }
    
    applyTheme(isDark);
}

// Слушатель изменений в localStorage (синхронизация между вкладками)
function setupThemeSync() {
    window.addEventListener('storage', (event) => {
        if (event.key === KEY) {
            const isDark = event.newValue === 'dark';
            applyTheme(isDark);
        }
    });
}

// Периодическая проверка синхронизации
function startSyncCheck() {
    setInterval(() => {
        const savedTheme = localStorage.getItem(KEY);
        const currentIsDark = document.body.classList.contains('theme-dark');
        const shouldBeDark = savedTheme === 'dark';
        
        if (currentIsDark !== shouldBeDark) {
            applyTheme(shouldBeDark);
        }
    }, 1000);
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    setupThemeSync();
    startSyncCheck();
    
    // Обработчик клика по переключателю
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }
    
    // Также обрабатываем кнопки с data-атрибутами
    const themeButtons = document.querySelectorAll('[data-action="toggle-theme"]');
    themeButtons.forEach(button => {
        button.addEventListener('click', toggleTheme);
    });
});

// ===== ОСТАЛЬНОЙ КОД ДЛЯ ФОРМЫ И ВАЛИДАЦИИ =====
// ... (оставьте ваш существующий код для модалки и валидации)