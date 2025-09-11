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

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  // Сброс кастомных сообщений
  Array.from(form.elements).forEach(el => {
    el.setCustomValidity?.('');
  });

  if (!form.checkValidity()) {
    // Показываем ошибки
    form.reportValidity();

    // Подсвечиваем поля с ошибками
    Array.from(form.elements).forEach(el => {
      if (el.willValidate) {
        el.toggleAttribute('aria-invalid', !el.checkValidity());
      }
    });

    return;
  }

  // Если форма валидна
  alert('Форма успешно отправлена!'); // или закрыть модалку
  dlg.close('success');
  form.reset();
});

dlg?.addEventListener('close', () => {
  lastActive?.focus();
});
const phone = document.getElementById('phone');

phone?.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.startsWith('8')) value = '7' + value.slice(1);
  if (value.length > 11) value = value.slice(0, 11);

  let formatted = '+7';
  if (value.length > 1) formatted += ` (${value.slice(1, 4)}`;
  if (value.length >= 4) formatted += ') ';
  if (value.length >= 7) formatted += `${value.slice(4, 7)}-`;
  if (value.length >= 9) formatted += `${value.slice(7, 9)}-`;
  if (value.length >= 11) formatted += value.slice(9, 11);

  e.target.value = formatted;
});
// Функция для открытия модального окна
function openModal() {
  const modal = document.getElementById('contactDialog');
  if (modal) {
    modal.showModal();
    // Переносим фокус на первое поле формы
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
  } else {
    console.error('Модальное окно не найдено!');
  }
}

// Добавьте обработчики для существующих кнопок (если есть)
document.addEventListener('DOMContentLoaded', function() {
  const modalButtons = document.querySelectorAll('[onclick="openModal()"]');
  modalButtons.forEach(button => {
    button.addEventListener('click', openModal);
  });
});