import { StartAnimationMicTest } from './Animations.js';

export async function checkPermissionsAndLoadDevices(context) {
  try {
    // Verificar o estado da permissão do microfone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const permissionStatus = await navigator.permissions.query({
      name: 'microphone',
    });

    if (!context.statusText || !context.canvas) {
      console.error('Elementos necessários não encontrados no DOM.');
      return;
    }

    // Verifica se a permissão foi concedida
    const handlePermissionChange = (status) => {
      if (status === 'granted') {
        context.canvas.classList.remove('hidden');
        context.canvas.className = 'animation-mic-test';
        context.status = 'micTest';
        context.statusText.textContent = 'Microfone';
        context.statusText.className = 'mic-test-text';
        StartAnimationMicTest(context.canvas);
      } else {
        context.canvas.classList.add('hidden');
        context.status = 'waiting';
        context.statusText.classList.add('text-waiting-mic-aprove');
        context.statusText.textContent = 'Aguardando autorização do microfone';
      }
      context.updateButtons();
    };

    // Verificar a permissão inicial
    handlePermissionChange(permissionStatus.state);

    // Ouvir mudanças no status da permissão
    permissionStatus.onchange = () => {
      handlePermissionChange(permissionStatus.state);
    };

    // Carregar dispositivos de áudio (microfones)
    const devices = await navigator.mediaDevices.enumerateDevices();
    context.devices = devices.filter((device) => device.kind === 'audioinput');

    // Verifica se há dispositivos de áudio disponíveis
    if (context.devices.length > 0) {
      const select = context.modal.querySelector('#microphone-select');
      select.innerHTML = '';
      context.devices.forEach((device) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.textContent = device.label || `Microfone ${device.deviceId}`;
        select.appendChild(option);
      });

      // Configura o microfone padrão
      context.currentDeviceId = context.devices[0].deviceId;

      // Atualiza quando o dispositivo selecionado muda
      select.addEventListener('change', () => {
        context.currentDeviceId = select.value;
      });
      // Lógica para fechar o modal
      const closeModal = context.modal.querySelector('#close-modal');
      closeModal.addEventListener('click', () => {
        context.closeMicrophoneModal();
      });
    } else {
      console.warn('Nenhum dispositivo de áudio encontrado.');
    }
  } catch (error) {
    console.error(
      'Erro ao verificar permissões ou carregar dispositivos:',
      error
    );
    if (context.statusText) {
      context.statusText.classList.add('text-waiting-mic-aprove');
      context.statusText.textContent =
        'Erro ao verificar permissões ou carregar dispositivos';
    }
  }
}
