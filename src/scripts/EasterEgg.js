import { DAAI_LOGO } from '../icons/icons.js';

export function initializeEasterEgg(logoElement) {
  const originalIcon = DAAI_LOGO;
  const easterEggIcon = 'src/icons/animation.gif';
  const intervalDuration = 5400000;
  const randomNumber = Math.random();
  logoElement.src = originalIcon;

  setInterval(() => {
    if (logoElement && randomNumber < 0.1) {
      logoElement.src = easterEggIcon;
      setTimeout(() => {
        logoElement.src = originalIcon;
      }, 5000);
    }
  }, intervalDuration);

  return originalIcon;
}
