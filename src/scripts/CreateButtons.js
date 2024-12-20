// setando as classes de acordo com o status
export function getButtonClass(type) {
  const classesMap = {
    start: 'button-primary',
    pause: 'button-pause',
    finish: 'button-recording',
    resume: 'button-resume',
    upload: 'button-upload',
    change: 'button-change',
    specialty: 'button-specialty',
    suport: 'button-help',
  };
  return classesMap[type] || '';
}
// metódo para criar os botões, definido o seu conteúdo
export function createButton(type, imageUrl, text, handler, specialty, title) {
  const button = document.createElement('button');
  button.className = `button ${getButtonClass(type, specialty)}`;

  if (title) {
    button.title = title;
  }

  const icon = imageUrl
    ? `<img src="${imageUrl}" alt="${text}" class="button-icon">`
    : '';
  button.innerHTML = `${icon} ${text}`;
  button.addEventListener('click', handler);

  return button;
}
