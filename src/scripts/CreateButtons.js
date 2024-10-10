// setando as classes de acordo com o status
export function getButtonClass(type) {
  const classesMap = {
    start: 'button-primary',
    pause: 'button-pause',
    finish: 'button-recording',
    resume: 'button-resume',
    upload: 'button-primary',
    change: 'button-change',
  };
  return classesMap[type] || '';
}
// metódo para criar os botões, definido o seu conteúdo
export function createButton(type, imageUrl, text, handler) {
  const button = document.createElement('button');
  button.className = `button ${getButtonClass(type)}`;
  button.innerHTML = `<img src="${imageUrl}" alt="${text}" class="button-icon"> ${text}`;
  button.addEventListener('click', handler);
  return button;
}
