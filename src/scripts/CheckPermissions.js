import { StartAnimationMicTest } from './Animations.js';

export async function checkPermissionsAndLoadDevices(context) {
  try {
    if (!context.statusText || !context.canvas) {
      console.error('Elementos necessários não encontrados no DOM.');
      return;
    }

    // Tenta acessar o microfone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Verifica o status da permissão do microfone
    const permissionStatus = await navigator.permissions.query({
      name: 'microphone',
    });

    const handlePermissionChange = (status) => {
      if (status === 'granted') {
        context.canvas.classList.remove('hidden');
        context.canvas.className = 'animation-mic-test';
        context.status = 'micTest';
        context.statusText.textContent = 'Microfone';
        context.statusText.className = 'mic-test-text';
        StartAnimationMicTest(context.canvas);
      } else {
        setMicWaitingState(context);
      }
      context.updateButtons();
    };

    // Verificar a permissão inicial e configurar evento para mudanças no status
    handlePermissionChange(permissionStatus.state);
    permissionStatus.onchange = () =>
      handlePermissionChange(permissionStatus.state);

    // Carrega dispositivos de áudio e configura o seletor
    await loadAudioDevices(context);
  } catch (error) {
    handleMicError(context, error);
  }
}

// Define o estado de espera de permissão do microfone
function setMicWaitingState(context) {
  context.canvas.classList.add('hidden');
  context.status = 'waiting';
  context.statusText.classList.add('text-waiting-mic-aprove');
  context.statusText.textContent = 'Aguardando autorização do microfone';
}

// Lida com erros de permissão ou dispositivos indisponíveis
function handleMicError(context, error) {
  context.status = 'micError';
  console.error(
    'Erro ao verificar permissões ou carregar dispositivos:',
    error
  );

  if (context.statusText) {
    context.statusText.classList.add('text-waiting-mic-aprove');
    context.statusText.textContent =
      'Erro ao verificar permissões ou carregar dispositivos';
  }
  context.updateButtons();
}

// Carrega dispositivos de áudio e configura o seletor no modal
async function loadAudioDevices(context) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  context.devices = devices.filter((device) => device.kind === 'audioinput');

  if (context.devices.length > 0) {
    const select = context.microphoneModal.querySelector('#microphone-select');
    select.innerHTML = '';

    context.devices.forEach((device) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || `Microfone ${device.deviceId}`;
      select.appendChild(option);
    });

    // Configura o microfone padrão e eventos de mudança
    context.currentDeviceId = context.devices[0].deviceId;
    select.addEventListener('change', () => {
      context.currentDeviceId = select.value;
    });

    const closeModal = context.microphoneModal.querySelector(
      '#close-microphone-modal'
    );
    closeModal.addEventListener('click', () => context.closeMicrophoneModal());
  } else {
    console.warn('Nenhum dispositivo de áudio encontrado.');
  }
}
