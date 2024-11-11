import { StartAnimationMicTest } from './Animations.js';

export async function checkPermissionsAndLoadDevices(context) {
  try {
    if (!context.statusText || !context.canvas) {
      console.error('Elementos necessários não encontrados no DOM.');
      return;
    }

    // Tenta acessar o microfone para verificar permissão
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Se o microfone for acessado com sucesso
    handlePermissionGranted(context);

    await loadAudioDevices(context);

    // Parar o stream após detectar que o microfone está funcionando
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    handleMicError(context, error);
  }
}

// Função chamada quando o acesso ao microfone é concedido
function handlePermissionGranted(context) {
  context.canvas.classList.remove('hidden');
  context.canvas.className = 'animation-mic-test';
  context.status = 'micTest';
  context.statusText.innerHTML = ``;
  context.statusText.className = 'mic-test-text';
  StartAnimationMicTest(context.canvas);
  context.updateButtons();
}

function setMicWaitingState(context) {
  context.canvas.classList.add('hidden');
  context.status = 'waiting';
  context.statusText.classList.add('text-waiting-mic-aprove');
  context.statusText.textContent = 'Aguardando autorização do microfone';
}

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

      const label = device.label || `Microfone ${device.deviceId}`;
      option.textContent =
        label.length > 20 ? label.slice(0, 40) + '...' : label;

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
