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

// ===== КАСТОМНЫЙ ВИДЕО ПЛЕЕР С MOBILE SUPPORT =====
function initVideoPlayer() {
    const videoPlayer = document.querySelector('.video-player');
    if (!videoPlayer) return;

    const video = videoPlayer.querySelector('.video-player__video');
    const playBtn = videoPlayer.querySelector('.video-player__play');
    const playIcon = playBtn.querySelector('.video-player__icon');
    const muteBtn = videoPlayer.querySelector('.video-player__mute');
    const muteIcon = muteBtn.querySelector('.video-player__icon');
    const fullscreenBtn = videoPlayer.querySelector('.video-player__fullscreen');
    const fullscreenIcon = fullscreenBtn.querySelector('.video-player__icon');
    const progressBar = videoPlayer.querySelector('.video-player__progress-bar');
    const seek = videoPlayer.querySelector('.video-player__seek');
    const volume = videoPlayer.querySelector('.video-player__volume');
    const currentTime = videoPlayer.querySelector('.video-player__current');
    const duration = videoPlayer.querySelector('.video-player__duration');
    const controls = videoPlayer.querySelector('.video-player__controls');

    let hideControlsTimeout;
    let isSeeking = false;

    // Форматирование времени
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Обновление всех иконок
    function updateIcons() {
        // Иконка воспроизведения/паузы
        playIcon.textContent = video.paused ? '▶' : '⏸';
        
        // Иконка звука
        if (video.muted || video.volume === 0) {
            muteIcon.textContent = '🔇';
        } else if (video.volume < 0.5) {
            muteIcon.textContent = '🔈';
        } else {
            muteIcon.textContent = '🔊';
        }
        
        // Иконка полноэкранного режима
        const isFullscreen = document.fullscreenElement || 
                            document.webkitFullscreenElement ||
                            document.mozFullScreenElement;
        fullscreenIcon.textContent = isFullscreen ? '⛶' : '⛶';
    }

    // Показать/скрыть контролы на мобильных
    function toggleControls() {
        controls.classList.add('video-player__controls--visible');
        clearTimeout(hideControlsTimeout);
        
        if (!video.paused) {
            hideControlsTimeout = setTimeout(() => {
                if (!isSeeking) {
                    controls.classList.remove('video-player__controls--visible');
                }
            }, 3000);
        }
    }

    // Обновление прогресса
    function updateProgress() {
        if (!isSeeking) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            seek.value = percent;
            currentTime.textContent = formatTime(video.currentTime);
        }
    }

    // Обновление длительности
    function updateDuration() {
        if (!isNaN(video.duration)) {
            duration.textContent = formatTime(video.duration);
        }
    }

    // События видео
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => {
        videoPlayer.classList.remove('video-player--playing');
        updateIcons();
        controls.classList.add('video-player__controls--visible');
    });

    // События для обновления иконок
    video.addEventListener('play', updateIcons);
    video.addEventListener('pause', updateIcons);
    video.addEventListener('volumechange', updateIcons);

    // Событие изменения полноэкранного режима
    document.addEventListener('fullscreenchange', updateIcons);
    document.addEventListener('webkitfullscreenchange', updateIcons);
    document.addEventListener('mozfullscreenchange', updateIcons);

    // Обработчики кнопок
    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            videoPlayer.classList.add('video-player--playing');
        } else {
            video.pause();
            videoPlayer.classList.remove('video-player--playing');
        }
        toggleControls();
    });

    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        videoPlayer.classList.toggle('video-player--muted', video.muted);
        toggleControls();
    });

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
        toggleControls();
    });

    // Touch события для прогресс-бара
    seek.addEventListener('input', () => {
        isSeeking = true;
        const seekTime = (seek.value / 100) * video.duration;
        video.currentTime = seekTime;
        currentTime.textContent = formatTime(video.currentTime);
    });

    seek.addEventListener('change', () => {
        isSeeking = false;
    });

    volume.addEventListener('input', () => {
        video.volume = volume.value;
        video.muted = (volume.value === 0);
        toggleControls();
    });

    // Touch события для всего видеоплеера
    videoPlayer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleControls();
    });

    video.addEventListener('click', toggleControls);

    // Авто-скрытие контролов
    video.addEventListener('play', () => {
        setTimeout(() => {
            if (!video.paused && !isSeeking) {
                controls.classList.remove('video-player__controls--visible');
            }
        }, 3000);
    });

    // Инициализация
    updateDuration();
    updateIcons();
    toggleControls(); // Показываем контролы при загрузке
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initVideoPlayer();
});
class Carousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelector('.carousel-container');
        this.slideItems = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.carousel-prev');
        this.nextBtn = container.querySelector('.carousel-next');
        this.dots = container.querySelectorAll('.dot');
        this.currentSlide = 0;
        
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.updateSlide();
    }
    
    next() {
        this.currentSlide = (this.currentSlide + 1) % this.slideItems.length;
        this.updateSlide();
    }
    
    prev() {
        this.currentSlide = (this.currentSlide - 1 + this.slideItems.length) % this.slideItems.length;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    updateSlide() {
        const offset = -this.currentSlide * 100;
        this.slides.style.transform = `translateX(${offset}%)`;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Инициализация карусели
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel(document.querySelector('.carousel'));
    
    // Автопрокрутка
    setInterval(() => carousel.next(), 5000);
});
// ===== УПРАВЛЕНИЕ АДАПТИВНОЙ ШАПКОЙ =====

function initHeader() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.site-nav__list');
    let lastScrollY = window.scrollY;
    let isScrolling;

    // Функция для скрытия/показа шапки при прокрутке
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Очищаем предыдущий таймер
        clearTimeout(isScrolling);
        
        // Прячем шапку при прокрутке вниз, показываем при прокрутке вверх
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Прокрутка вниз - скрываем шапку
            header.classList.add('hidden');
        } else {
            // Прокрутка вверх - показываем шапку
            header.classList.remove('hidden');
        }
        
        // Компактный режим при прокрутке
        if (currentScrollY > 50) {
            header.classList.add('compact');
        } else {
            header.classList.remove('compact');
        }
        
        lastScrollY = currentScrollY;
        
        // Устанавливаем таймер для окончания прокрутки
        isScrolling = setTimeout(() => {
            header.classList.remove('hidden');
        }, 1500);
    }

    // Функция для мобильного меню
    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        navList.classList.toggle('active');
        
        // Блокируем прокрутку тела при открытом меню
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    }

    // Функция закрытия мобильного меню при клике на ссылку
    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Обработчики событий
    if (window.innerWidth <= 768) {
        // Только на мобильных устройствах
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // Закрываем меню при клике на ссылку
        const navLinks = document.querySelectorAll('.site-nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Закрываем меню при клике вне области
        document.addEventListener('click', (e) => {
            if (navList.classList.contains('active') && 
                !e.target.closest('.site-nav__list') && 
                !e.target.closest('.menu-toggle')) {
                closeMobileMenu();
            }
        });
    }

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // На десктопе убираем мобильные классы
            menuToggle?.classList.remove('active');
            navList?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
});