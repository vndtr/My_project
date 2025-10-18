const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initFormValidation();
    initPhoneMask();
    initCarousel();
});

// ===== УПРАВЛЕНИЕ ТЕМНОЙ ТЕМОЙ =====
const THEME_KEY = 'theme-preference';

function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem(THEME_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Установка начальной темы
    let isDark = false;
    if (savedTheme === 'dark') {
        isDark = true;
    } else if (savedTheme === 'light') {
        isDark = false;
    } else {
        isDark = systemPrefersDark;
    }
    
    applyTheme(isDark);
    
    // Обработчик переключателя
    themeToggle?.addEventListener('click', () => {
        const isCurrentlyDark = document.body.classList.contains('theme-dark');
        applyTheme(!isCurrentlyDark);
    });
}

function applyTheme(isDark) {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle?.querySelector('i');
    
    if (isDark) {
        document.body.classList.add('theme-dark');
        localStorage.setItem(THEME_KEY, 'dark');
        if (icon) {
            icon.className = 'bi bi-sun';
        }
    } else {
        document.body.classList.remove('theme-dark');
        localStorage.setItem(THEME_KEY, 'light');
        if (icon) {
            icon.className = 'bi bi-moon';
        }
    }
}

// ===== ВАЛИДАЦИЯ ФОРМ =====
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

// ===== МАСКА ТЕЛЕФОНА =====
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

// ===== КАРУСЕЛЬ =====
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

// ===== УТИЛИТЫ =====
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

// ===== SMOOTH SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для якорей
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

// ===== LAZY LOADING =====
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
openBtn?.addEventListener('click', () => {
  lastActive = document.activeElement;
  dlg.showModal();
  dlg.querySelector('input, select, textarea, button')?.focus();
});

closeBtn?.addEventListener('click', () => dlg.close('cancel'));

// ===== УЛУЧШЕННЫЙ ВИДЕО ПЛЕЕР =====
function initEnhancedVideoPlayer() {
    const videoPlayer = document.querySelector('.enhanced-video-player');
    if (!videoPlayer) return;

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
    const speedOptions = videoPlayer.querySelectorAll('.speed-option');
    const qualityOptions = videoPlayer.querySelectorAll('.quality-option');
    const loadingIndicator = videoPlayer.querySelector('.video-loading');
    const notifications = videoPlayer.querySelector('.video-notifications');

    let isSeeking = false;
    let isControlsVisible = true;
    let hideControlsTimeout;
    let wasPausedBeforeSeeking = false;

    // Форматирование времени
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
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
            pauseIcons.forEach(icon => icon.style.display = 'none');
        } else {
            videoPlayer.classList.add('video-playing');
            playIcons.forEach(icon => icon.style.display = 'none');
            pauseIcons.forEach(icon => icon.style.display = 'inline-block');
        }

        // Иконка громкости
        const volumeIcon = volumeBtn.querySelector('i');
        if (video.muted || video.volume === 0) {
            volumeIcon.className = 'bi bi-volume-mute';
        } else if (video.volume < 0.5) {
            volumeIcon.className = 'bi bi-volume-down';
        } else {
            volumeIcon.className = 'bi bi-volume-up';
        }

        // Полноэкранный режим
        const isFullscreen = document.fullscreenElement || 
                           document.webkitFullscreenElement ||
                           document.mozFullScreenElement;
        const fullscreenIcon = fullscreenBtn.querySelector('i');
        fullscreenIcon.className = isFullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen';
    }

    // Показать/скрыть контролы
    function showControls() {
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

    function hideControls() {
        if (!video.paused && !isSeeking) {
            overlay.classList.remove('controls-visible');
            isControlsVisible = false;
        }
    }

    // Обновление прогресса
    function updateProgress() {
        if (!isSeeking) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            progressSlider.value = percent;
            currentTimeEl.textContent = formatTime(video.currentTime);
        }
    }

    // Обновление длительности
    function updateDuration() {
        if (!isNaN(video.duration)) {
            durationEl.textContent = formatTime(video.duration);
        }
    }

    // Уведомления
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} video-notification`;
        notification.textContent = message;
        notifications.innerHTML = '';
        notifications.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // События видео
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', updateInterface);
    video.addEventListener('pause', updateInterface);
    video.addEventListener('volumechange', updateInterface);
    video.addEventListener('ended', () => {
        videoPlayer.classList.remove('video-playing');
        showControls();
        showNotification('Воспроизведение завершено', 'info');
    });

    video.addEventListener('waiting', () => {
        loadingIndicator.classList.remove('d-none');
    });

    video.addEventListener('canplay', () => {
        loadingIndicator.classList.add('d-none');
    });

    video.addEventListener('progress', () => {
        if (video.buffered.length > 0) {
            const buffered = (video.buffered.end(0) / video.duration) * 100;
            // Можно добавить индикатор буферизации
        }
    });

    // Управление воспроизведением
    function togglePlay() {
        if (video.paused) {
            video.play().catch(error => {
                showNotification('Ошибка воспроизведения видео', 'danger');
                console.error('Video play error:', error);
            });
        } else {
            video.pause();
        }
        showControls();
    }

    playPauseBtn?.addEventListener('click', togglePlay);
    bigPlayBtn?.addEventListener('click', togglePlay);

    // Клик по видео для воспроизведения/паузы
    video.addEventListener('click', togglePlay);

    // Прогресс-бар
    progressSlider.addEventListener('input', () => {
        isSeeking = true;
        const seekTime = (progressSlider.value / 100) * video.duration;
        video.currentTime = seekTime;
        currentTimeEl.textContent = formatTime(video.currentTime);
    });

    progressSlider.addEventListener('mousedown', () => {
        wasPausedBeforeSeeking = video.paused;
        if (!video.paused) {
            video.pause();
        }
        isSeeking = true;
    });

    progressSlider.addEventListener('mouseup', () => {
        isSeeking = false;
        if (!wasPausedBeforeSeeking) {
            video.play();
        }
    });

    // Громкость
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

    // Полноэкранный режим
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
        showControls();
    });

    // События полноэкранного режима
    document.addEventListener('fullscreenchange', updateInterface);
    document.addEventListener('webkitfullscreenchange', updateInterface);
    document.addEventListener('mozfullscreenchange', updateInterface);


    // Мышь и тач события
    videoPlayer.addEventListener('mousemove', showControls);
    videoPlayer.addEventListener('touchstart', showControls);

    // Авто-скрытие контролов
    video.addEventListener('play', () => {
        setTimeout(hideControls, 3000);
    });

    // Инициализация
    updateInterface();
    showControls();

    // Предзагрузка
    video.preload = 'metadata';
}

// Добавьте вызов в основную функцию инициализации
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initFormValidation();
    initPhoneMask();
    initCarousel();
    initEnhancedVideoPlayer(); // Добавьте эту строку
});

