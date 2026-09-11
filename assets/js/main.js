import { initHome } from './modules/homeModule.js';
import { initBio } from './modules/bioModule.js';

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('biografia.html')) {
    initBio();
  } else {
    // Inicializa a Home por padrão
    initHome();
  }
});