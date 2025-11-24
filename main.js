//УПРАВЛЕНИЕ ТЕМНОЙ ТЕМОЙ 
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
}

//ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initFormValidation();
    initPhoneMask();
    initCarousel();
    initSimpleVideoPlayer();
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

// МАСКА ТЕЛЕФОНА
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
    alertDiv.setAttribute('role', 'alert');
    alertDiv.setAttribute('aria-live', 'polite');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
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

//  ВИДЕОПЛЕЕР 
function initSimpleVideoPlayer() {
    const videoPlayer = document.querySelector('.simple-video-player');
    if (!videoPlayer) return;

    const video = videoPlayer.querySelector('.video-element');
    const playBtn = videoPlayer.querySelector('.play-btn');
    const bigPlayBtn = videoPlayer.querySelector('.video-play-btn');
    const progressBar = videoPlayer.querySelector('.progress-bar');
    const currentTimeEl = videoPlayer.querySelector('.current-time');
    const durationEl = videoPlayer.querySelector('.duration');
    const fullscreenBtn = videoPlayer.querySelector('.fullscreen-btn');
    const progressContainer = videoPlayer.querySelector('.progress');
    const volumeBtn = videoPlayer.querySelector('.volume-btn');
    const volumeControl = videoPlayer.querySelector('.volume-control');

    // Создаем слайдер громкости
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.className = 'volume-slider';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = '1';
    volumeControl.appendChild(volumeSlider);

    // Форматирование времени
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Обновление интерфейса
    function updateInterface() {
        // Воспроизведение/пауза
        if (video.paused) {
            videoPlayer.classList.remove('video-playing');
        } else {
            videoPlayer.classList.add('video-playing');
        }

        // Громкость
        updateVolumeIcon();
    }

    // Обновление иконки громкости
    function updateVolumeIcon() {
        volumeControl.classList.remove('volume-muted', 'volume-low', 'volume-normal');
        
        if (video.muted || video.volume === 0) {
            volumeControl.classList.add('volume-muted');
        } else if (video.volume < 0.5) {
            volumeControl.classList.add('volume-low');
        } else {
            volumeControl.classList.add('volume-normal');
        }
    }

    // Обновление прогресса
    function updateProgress() {
        if (!isNaN(video.duration)) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            currentTimeEl.textContent = formatTime(video.currentTime);
        }
    }

    // Обновление длительности
    function updateDuration() {
        if (!isNaN(video.duration)) {
            durationEl.textContent = formatTime(video.duration);
        }
    }

    // Воспроизведение/пауза
    function togglePlay() {
        if (video.paused) {
            video.play().catch(console.error);
        } else {
            video.pause();
        }
        updateInterface();
    }

    // Перемотка по клику на прогресс-бар
    function seekVideo(e) {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    }

    // Управление громкостью
    function toggleMute() {
        video.muted = !video.muted;
        updateVolumeIcon();
    }

    function changeVolume(e) {
        video.volume = e.target.value;
        video.muted = (video.volume === 0);
        updateVolumeIcon();
    }

    // Полноэкранный режим
    function toggleFullscreen() {
        const container = video.parentElement;
        
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    // Назначение обработчиков
    playBtn.addEventListener('click', togglePlay);
    bigPlayBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    progressContainer.addEventListener('click', seekVideo);
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', changeVolume);

    // События видео
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', updateInterface);
    video.addEventListener('pause', updateInterface);
    video.addEventListener('volumechange', updateVolumeIcon);

    // Инициализация
    updateInterface();
    updateVolumeIcon();
}