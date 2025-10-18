
// ===== УПРАВЛЕНИЕ ТЕМНОЙ ТЕМОЙ =====
const THEME_KEY = 'theme-preference';

// Основная функция инициализации
function initTheme() {
    
    const themeToggle = document.querySelector('.theme-toggle');
    // Установка начальной темы
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    let isDark = false; // По умолчанию светлая тема
    
    if (savedTheme === 'dark') {
        isDark = true;
    }
    // Если 'light' или null - оставляем светлую тему
    
    applyTheme(isDark);
    
    // Обработчик клика по переключателю
    themeToggle.addEventListener('click', function() {
       
        const isCurrentlyDark = document.body.classList.contains('theme-dark');
        applyTheme(!isCurrentlyDark);
    });
    
    
}

// Функция применения темы
function applyTheme(isDark) {
    
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle?.querySelector('i');
    
    if (isDark) {
        // Включаем темную тему
        document.body.classList.add('theme-dark');
        localStorage.setItem(THEME_KEY, 'dark');
        
        if (icon) {
            icon.className = 'bi bi-sun'; // Солнце для темной темы
        }
        if (themeToggle) {
            themeToggle.setAttribute('data-theme', 'dark');
            themeToggle.title = 'Переключить на светлую тему';
        }
        
    } else {
        // Включаем светлую тему
        document.body.classList.remove('theme-dark');
        localStorage.setItem(THEME_KEY, 'light');
        
        if (icon) {
            icon.className = 'bi bi-moon'; // Луна для светлой темы
        }
        if (themeToggle) {
            themeToggle.setAttribute('data-theme', 'light');
            themeToggle.title = 'Переключить на темную тему';
        }
        
    }
    
    // Обновляем другие компоненты
    updateVideoPlayerTheme(isDark);
}

function updateVideoPlayerTheme(isDark) {
    const videoPlayer = document.querySelector('.enhanced-video-player');
    if (videoPlayer) {
        if (isDark) {
            videoPlayer.classList.add('theme-dark');
        } else {
            videoPlayer.classList.remove('theme-dark');
        }
    }
}

//ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    
    initTheme();
    initFormValidation();
    initPhoneMask();
    initCarousel();
    initEnhancedVideoPlayer();
});

// Дублирующая инициализация на случай проблем
window.addEventListener('load', function() {
    // Проверяем, что тема применилась
    const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
});

// ВАЛИДАЦИЯ ФОРМ 
function initFormValidation() {
    // Форма записи
    const bookingForm = document.getElementById('bookingForm');
    bookingForm?.addEventListener('submit', handleBookingSubmit);
    
    // Форма обратной связи
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', handleContactSubmit);
    
    // Валидация в реальном времени
    initRealTimeValidation();
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(this)) {
        showAlert('Пожалуйста, исправьте ошибки в форме.', 'danger');
        return;
    }
    
    // Симуляция отправки
    showAlert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
    this.reset();
    
    // Закрытие модального окна
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    modal.hide();
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(this)) {
        showAlert('Пожалуйста, исправьте ошибки в форме.', 'danger');
        return;
    }
    
    showAlert('Сообщение успешно отправлено! Мы ответим вам в течение 24 часов.', 'success');
    this.reset();
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });
    
    return isValid;
}

function initRealTimeValidation() {
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, select, textarea')) {
            if (e.target.checkValidity()) {
                e.target.classList.remove('is-invalid');
                e.target.classList.add('is-valid');
            } else {
                e.target.classList.remove('is-valid');
            }
        }
    });
    
    document.addEventListener('change', function(e) {
        if (e.target.matches('input, select, textarea')) {
            if (!e.target.checkValidity()) {
                e.target.classList.add('is-invalid');
            }
        }
    });
}

//  МАСКА ТЕЛЕФОНА
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhone);
        input.addEventListener('blur', validatePhone);
    });
}

function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('8')) {
        value = '7' + value.slice(1);
    }
    
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

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
}

function validatePhone(e) {
    const pattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (e.target.value && !pattern.test(e.target.value)) {
        e.target.classList.add('is-invalid');
    }
}

// КАРУСЕЛЬ
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        // Автопрокрутка
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            ride: 'carousel'
        });
    });
}

// УТИЛИТЫ 
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('main').insertBefore(alertDiv, document.querySelector('main').firstChild);
    
    // Автоматическое скрытие
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Плавная прокрутка
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// LAZY LOADING
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ВИДЕО ПЛЕЕР
function initEnhancedVideoPlayer() {
    const videoPlayer = document.querySelector('.enhanced-video-player');
    if (!videoPlayer) {
        console.log('Video player not found');
        return;
    }

    const video = videoPlayer.querySelector('.video-element');
    const overlay = videoPlayer.querySelector('.video-overlay');
    const playPauseBtn = videoPlayer.querySelector('.play-pause-btn');
    const bigPlayBtn = videoPlayer.querySelector('.btn-play-pause');
    const progressBar = videoPlayer.querySelector('.progress-bar');
    const progressSlider = videoPlayer.querySelector('.progress-slider');
    const currentTimeEl = videoPlayer.querySelector('.current-time');
    const durationEl = videoPlayer.querySelector('.duration');
    const volumeBtn = videoPlayer.querySelector('.volume-btn');
    const volumeSlider = videoPlayer.querySelector('.volume-slider');
    const volumeBar = videoPlayer.querySelector('.volume-slider-container .progress-bar');
    const fullscreenBtn = videoPlayer.querySelector('.fullscreen-btn');
    const loadingIndicator = videoPlayer.querySelector('.video-loading');

    console.log('Video elements found:', {
        video: !!video,
        playPauseBtn: !!playPauseBtn,
        bigPlayBtn: !!bigPlayBtn,
        progressBar: !!progressBar
    });

    // Проверка существования элементов
    if (!video || !playPauseBtn || !bigPlayBtn) {
        console.error('Essential video elements missing');
        return;
    }

    let isSeeking = false;
    let isControlsVisible = true;
    let hideControlsTimeout;

    // Форматирование времени
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Обновление интерфейса
    function updateInterface() {
        // Иконки воспроизведения/паузы
        const playIcons = videoPlayer.querySelectorAll('.bi-play-fill');
        const pauseIcons = videoPlayer.querySelectorAll('.bi-pause');
        
        if (video.paused) {
            videoPlayer.classList.remove('video-playing');
            playIcons.forEach(icon => icon.style.display = 'inline-block');
            if (pauseIcons.length) {
                pauseIcons.forEach(icon => icon.style.display = 'none');
            }
        } else {
            videoPlayer.classList.add('video-playing');
            playIcons.forEach(icon => icon.style.display = 'none');
            if (pauseIcons.length) {
                pauseIcons.forEach(icon => icon.style.display = 'inline-block');
            }
        }

        // Иконка громкости
        if (volumeBtn) {
            const volumeIcon = volumeBtn.querySelector('i');
            if (video.muted || video.volume === 0) {
                volumeIcon.className = 'bi bi-volume-mute';
            } else if (video.volume < 0.5) {
                volumeIcon.className = 'bi bi-volume-down';
            } else {
                volumeIcon.className = 'bi bi-volume-up';
            }
        }

        // Полноэкранный режим
        if (fullscreenBtn) {
            const isFullscreen = document.fullscreenElement || 
                               document.webkitFullscreenElement ||
                               document.mozFullScreenElement;
            const fullscreenIcon = fullscreenBtn.querySelector('i');
            fullscreenIcon.className = isFullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen';
        }
    }

    // Показать/скрыть контролы
    function showControls() {
        if (overlay) {
            overlay.classList.add('controls-visible');
            isControlsVisible = true;
            clearTimeout(hideControlsTimeout);
            
            if (!video.paused) {
                hideControlsTimeout = setTimeout(() => {
                    if (!isSeeking) {
                        overlay.classList.remove('controls-visible');
                        isControlsVisible = false;
                    }
                }, 3000);
            }
        }
    }

    // Обновление прогресса
    function updateProgress() {
        if (!isSeeking && progressBar && progressSlider && currentTimeEl) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            progressSlider.value = percent;
            currentTimeEl.textContent = formatTime(video.currentTime);
        }
    }

    // Обновление длительности
    function updateDuration() {
        if (durationEl && !isNaN(video.duration)) {
            durationEl.textContent = formatTime(video.duration);
        }
    }

    // Управление воспроизведением
    function togglePlay() {
        try {
            if (video.paused) {
                video.play().then(() => {
                    console.log('Video started playing');
                }).catch(error => {
                    console.error('Video play error:', error);
                    // Показываем стандартные контролы если кастомные не работают
                    video.setAttribute('controls', 'true');
                });
            } else {
                video.pause();
            }
            showControls();
        } catch (error) {
            console.error('Toggle play error:', error);
            video.setAttribute('controls', 'true');
        }
    }

    // Назначение обработчиков
    playPauseBtn.addEventListener('click', togglePlay);
    bigPlayBtn.addEventListener('click', togglePlay);

    // Клик по видео для воспроизведения/паузы
    video.addEventListener('click', togglePlay);

    // Прогресс-бар
    if (progressSlider) {
        progressSlider.addEventListener('input', () => {
            isSeeking = true;
            const seekTime = (progressSlider.value / 100) * video.duration;
            video.currentTime = seekTime;
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(video.currentTime);
            }
        });

        progressSlider.addEventListener('change', () => {
            isSeeking = false;
        });
    }

    // Громкость
    if (volumeSlider && volumeBar && volumeBtn) {
        volumeSlider.addEventListener('input', () => {
            video.volume = volumeSlider.value;
            video.muted = (volumeSlider.value === 0);
            volumeBar.style.width = `${volumeSlider.value * 100}%`;
            updateInterface();
        });

        volumeBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (!video.muted && video.volume === 0) {
                video.volume = 0.5;
                volumeSlider.value = 0.5;
                volumeBar.style.width = '50%';
            }
            updateInterface();
            showControls();
        });
    }

    // Полноэкранный режим
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const container = video.parentElement;
            
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
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
            showControls();
        });
    }

    // События видео
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', updateInterface);
    video.addEventListener('pause', updateInterface);
    video.addEventListener('volumechange', updateInterface);
    
    video.addEventListener('waiting', () => {
        if (loadingIndicator) loadingIndicator.classList.remove('d-none');
    });

    video.addEventListener('canplay', () => {
        if (loadingIndicator) loadingIndicator.classList.add('d-none');
    });

    video.addEventListener('ended', () => {
        videoPlayer.classList.remove('video-playing');
        showControls();
    });

    // Авто-скрытие контролов
    video.addEventListener('play', () => {
        setTimeout(() => {
            if (!isSeeking && overlay) {
                overlay.classList.remove('controls-visible');
                isControlsVisible = false;
            }
        }, 3000);
    });

    // Мышь и тач события
    if (overlay) {
        videoPlayer.addEventListener('mousemove', showControls);
        videoPlayer.addEventListener('touchstart', showControls);
    }

    // Инициализация
    updateInterface();
    showControls();

    // Предзагрузка
    video.preload = 'metadata';
    
    console.log('Video player initialized successfully');
}



