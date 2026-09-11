const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const dialog = document.querySelector('#quote-dialog');
const form = document.querySelector('#quote-form');
const toast = document.querySelector('.toast');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  mobileNav.classList.toggle('open', !isOpen);
});

mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-open-dialog]').forEach(button => {
  button.addEventListener('click', () => {
    const service = button.dataset.service;
    if (service) form.elements.service.value = service;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

const closeDialog = () => {
  dialog.close();
  document.body.classList.remove('dialog-open');
};

document.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) closeDialog();
});
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `Заявка с сайта: ${data.get('service')}`;
  const body = [
    `Имя / компания: ${data.get('name')}`,
    `Контакт: ${data.get('contact')}`,
    `Услуга: ${data.get('service')}`,
    `Маршрут: ${data.get('from') || 'не указан'} → ${data.get('to') || 'не указан'}`,
    '',
    'Информация о грузе:',
    data.get('details') || 'не указана'
  ].join('\n');
  toast.classList.add('show');
  window.location.href = `mailto:sharapova@avind.spb.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setTimeout(() => toast.classList.remove('show'), 3500);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

document.querySelector('#year').textContent = new Date().getFullYear();
