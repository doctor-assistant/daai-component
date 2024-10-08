import {
  GEAR,
  MICROPHONE_ICON,
  PAUSE_ICON,
  RECORDING_ICON,
  RESUME_ICON
} from './icons/icons.js';
import { blockPageReload } from './utils/blockPageReload.js';
import { checkPermissionsAndLoadDevices } from './utils/CheckPermissions.js';
import { applyThemeAttributes, parseThemeAttribute } from './utils/ComponentProps.js';
import { createButton } from './utils/CreateButtons.js';
import { initializeEasterEgg } from './utils/EasterEgg.js';
import { finishRecording, pauseRecording, resumeRecording, startRecording } from './utils/RecorderUtils.js';

class DaaiBadge extends HTMLElement {
  constructor() {
    super();
    this.mediaRecorder = null;
    this.chunks = [];
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.gainNode = null;
    this.status = 'initial';
    this.devices = [];
    this.currentDeviceId = null;
    this.recordingTime = 0;
    this.intervalId = null;
    this.easterEggTimeoutId = null;
    blockPageReload()
    // Aqui criamos a shadow dom
    const shadow = this.attachShadow({ mode: 'open' });
    // Aqui criamos o style
    const style = document.createElement('style');

    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', 'src/style.css');

    shadow.appendChild(linkElement);

    const container = document.createElement('div');
    container.className = 'container';

    this.recorderBox = document.createElement('div');
    this.recorderBox.className = 'recorder-box';

    this.logo = document.createElement('img');
    this.recorderBox.appendChild(this.logo);
    this.logo.alt = 'daai-logo';
    this.recorderBox.appendChild(this.logo);

    this.status = 'waiting';
    this.statusText = document.createElement('span');
    this.statusText.classList.add('text-waiting-mic-aprove');
    this.statusText.textContent = 'Aguardando autorização do microfone...';
    this.recorderBox.appendChild(this.statusText);

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'audio-hide';
    this.recorderBox.appendChild(this.canvas);

    this.timerElement = document.createElement('div');
    this.timerElement.className = 'timer';
    this.timerElement.innerText = '00:00:00';
    this.recorderBox.appendChild(this.timerElement);

    // aqui vamos usar o createButton para criar esses botões com ícones e textos apropriados.
    this.buttons = {
      changeMicrophone: createButton(
        'change',
        GEAR,
        '',
        this.openMicrophoneModal.bind(this)
      ),
      pause: createButton(
        'pause',
        PAUSE_ICON,
        '',
        pauseRecording.bind(this)
      ),
      start: createButton(
        'start',
        MICROPHONE_ICON,
        'Iniciar Registro',
        startRecording.bind(this)
      ),
      finish: createButton(
        'finish',
        RECORDING_ICON,
        'Finalizar Registro',
        finishRecording.bind(this)
      ),
      resume: createButton(
        'resume',
        RESUME_ICON,
        'Continuar Registro',
        resumeRecording.bind(this)
      ),
      upload: createButton(
        'upload',
        MICROPHONE_ICON,
        'Iniciar novo registro',
        startRecording.bind(this)
      ),
    };

    Object.values(this.buttons).forEach((button) =>
      this.recorderBox.appendChild(button)
    );
    // aqui foi construido o modal para a troca de microfones
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
      <p class='modal-title'>Escolha o Microfone</p>
      <select id="microphone-select" class='select-button'></select>
      <button id="close-modal" class="close-button">Fechar</button>
    `;

    this.backdrop = document.createElement('div');
    this.backdrop.className = 'backdrop';

    shadow.appendChild(style);
    shadow.appendChild(container);
    container.appendChild(this.recorderBox);
    shadow.appendChild(this.modal);
    shadow.appendChild(this.backdrop);
    this.updateButtons();
    checkPermissionsAndLoadDevices(this);
  }

  connectedCallback() {
    checkPermissionsAndLoadDevices(this);
  }

  static get observedAttributes() {
    return ['theme', 'onSuccess', 'onError', 'ApiKey'];
  }

  connectedCallback() {
    const logoElement = this.shadowRoot.querySelector('img');
    const defaultTheme = {
      icon: this.getAttribute('icon') || initializeEasterEgg(logoElement),
      buttonStartRecordingColor: '#009CB1',
      buttonRecordingColor: '#F43F5E',
      buttonPauseColor: '#F43F5E',
      buttonResumeColor: '#009CB1',
      borderColor: '#009CB1',
      animationRecordingColor: '#F43F5E',
      animationPausedColor: '#009CB1',
      textBadgeColor: '#009CB1',
    };

    const themeAttr = this.getAttribute('theme');
    if (themeAttr) {
      this.theme = { ...defaultTheme, ...parseThemeAttribute(themeAttr) };
    } else {
      this.theme = defaultTheme;
    }
    applyThemeAttributes(this.theme, this);
  }

  // aqui foi criado a lógica de alterar os botões de acordo com o status, ex: se for paused o botão de pause e resume vão ser renderizados
  updateButtons() {
    Object.keys(this.buttons).forEach((buttonType) => {
      const button = this.buttons[buttonType];
      if (
        this.status === 'finished' ||
        this.status === 'waiting' ||
        this.status === 'upload'
      ) {
        this.canvas.classList.add('hidden');
        this.timerElement.classList.add('hidden');
      } else {
        this.canvas.classList.remove('hidden');
        this.timerElement.classList.remove('hidden');
      }
      switch (this.status) {
        case 'waiting':
          buttonType === 'start'
            ? button.classList.remove('hidden')
            : button.classList.add('hidden');
          button.disabled = true;
          this.canvas.classList.remove('hidden');
          break;
        case 'micTest':
          buttonType === 'start' ||
          buttonType === 'pause' ||
          buttonType === 'changeMicrophone'
            ? button.classList.remove('hidden')
            : button.classList.add('hidden');
          button.disabled = buttonType === 'pause';
          this.canvas.classList.remove('hidden');
          break;
        case 'paused':
          buttonType === 'pause' || buttonType === 'resume'
            ? button.classList.remove('hidden')
            : button.classList.add('hidden');
          button.disabled = this.status === 'paused' && buttonType === 'pause';
          break;
        case 'recording':
          buttonType === 'pause' || buttonType === 'finish'
            ? button.classList.remove('hidden')
            : button.classList.add('hidden');
          button.disabled = false;
          break;
        case 'finished':
          buttonType === ''
            ? button.classList.remove('hidden')
            : button.classList.add('hidden');
          button.disabled = false;
          break;
        case 'upload':
          buttonType === 'upload'
            ? button.classList.remove('hidden')
            : button.classList.add('hidden');
          button.disabled = false;
          break;
      }
    });
  }

  // abrir o modal de mudança de microfone
  openMicrophoneModal() {
    this.backdrop.classList.add('active');
    this.modal.classList.add('active');
  }

  closeMicrophoneModal() {
    this.backdrop.classList.remove('active');
    this.modal.classList.remove('active');
  }
}

customElements.define('daai-badge', DaaiBadge);
