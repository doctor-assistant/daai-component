// setando as classes de acordo com o status
export function getButtonClass(type) {
  if (type === 'start') return 'button-primary';
  if (type === 'pause') return 'button-pause';
  if (type === 'finish') return 'button-recording';
  if (type === 'resume') return 'button-resume';
  if (type === 'upload') return 'button-primary';
  if (type === 'change') return 'button-change';
  return '';
}
// metódo para criar os botões, definido o seu conteúdo
 export function createButton(type, imageUrl, text, handler) {
    const button = document.createElement('button');
    button.className = `button ${getButtonClass(type)}`;
    button.innerHTML = `<img src="${imageUrl}" alt="${text}" class="button-icon"> ${text}`;
    button.addEventListener('click', handler);
    return button;
  }

