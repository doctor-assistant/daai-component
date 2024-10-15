import { chooseSpeciality } from './api/Speciality.js';
import {
  GEAR,
  MICROPHONE_ICON,
  PAUSE_ICON,
  RECORDING_ICON,
  RESUME_ICON,
  SPECIALTY_ICON,
} from './icons/icons.js';
import { blockPageReload } from './scripts/BlockPageReload.js';
import { checkPermissionsAndLoadDevices } from './scripts/CheckPermissions.js';
import {
  applyThemeAttributes,
  parseThemeAttribute,
} from './scripts/ComponentProps.js';
import { createButton } from './scripts/CreateButtons.js';
import { initializeEasterEgg } from './scripts/EasterEgg.js';
import {
  finishRecording,
  newRecording,
  pauseRecording,
  resumeRecording,
  startRecording,
} from './scripts/RecorderUtils.js';

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
    this.apiKey = '';
    this.onSuccess = null;
    this.onError = null;
    this.professionalId = '';
    this.specialty = 'generic';

    this.upload = () => blockPageReload();
    // Aqui criamos a shadow dom
    const shadow = this.attachShadow({ mode: 'open' });
    // Aqui criamos o style
    const style = document.createElement('style');

    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', 'dist/style.css');

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
      chooseSpecialty: createButton(
        'specialty',
        SPECIALTY_ICON,
        '',
        this.openSpecialityModal.bind(this)
      ),
      pause: createButton('pause', PAUSE_ICON, '', pauseRecording.bind(this)),
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
        newRecording.bind(this)
      ),
    };

    Object.values(this.buttons).forEach((button) =>
      this.recorderBox.appendChild(button)
    );
    // aqui foi construido o modal para a troca de microfones
    this.microphoneModal = document.createElement('div');
    this.microphoneModal.className = 'modal microphone-modal';
    this.microphoneModal.innerHTML = `
  <p class='modal-title'>Escolha o Microfone</p>
  <select id="microphone-select" class='select-button'></select>
  <button id="close-microphone-modal" class="close-button">Fechar</button>
`;

    this.microphoneBackdrop = document.createElement('div');
    this.microphoneBackdrop.className = 'backdrop microphone-backdrop';

    // Modal para a escolha de especialidades
    this.specialityModal = document.createElement('div');
    this.specialityModal.className = 'modal speciality-modal';
    this.specialityModal.innerHTML = `
  <p class='modal-title'>Escolha o Modelo do Relatório</p>
  <select id="speciality-select" class='select-button'></select>
  <button id="close-speciality-modal" class="close-button">Fechar</button>
`;

    this.specialityBackdrop = document.createElement('div');
    this.specialityBackdrop.className = 'backdrop speciality-backdrop';

    shadow.appendChild(style);
    shadow.appendChild(container);
    container.appendChild(this.recorderBox);
    shadow.appendChild(this.specialityModal);
    shadow.appendChild(this.microphoneModal);
    shadow.appendChild(this.specialityBackdrop);
    shadow.appendChild(this.microphoneBackdrop);
    this.updateButtons();
    checkPermissionsAndLoadDevices(this);
    chooseSpeciality(this);
  }

  connectedCallback() {
    checkPermissionsAndLoadDevices(this);
    chooseSpeciality(this);
  }

  static get observedAttributes() {
    return ['theme', 'onSuccess', 'onError', 'apiKey', 'professionalId'];
  }

  connectedCallback() {
    console.log('### speciality', this.specialty);
    const successAttr = this.getAttribute('onSuccess');
    const errorAttr = this.getAttribute('onError');
    if (successAttr && typeof window[successAttr] === 'function') {
      this.onSuccess = window[successAttr].bind(this);
    }
    if (errorAttr && typeof window[errorAttr] === 'function') {
      this.onError = window[errorAttr].bind(this);
    }
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
    this.apiKey = this.getAttribute('apikey');
    this.professionalId = this.getAttribute('professionalId');
    this.onSuccess = this.getAttribute('onSuccess')
      ? new Function('return ' + this.getAttribute('onSuccess'))()
      : null;

    this.onError = this.getAttribute('onError')
      ? new Function('return ' + this.getAttribute('onError'))()
      : null;
  }

  triggerSuccess(...params) {
    if (typeof this.onSuccess === 'function') {
      console.log('Função de sucesso executada com parâmetros:', params);
      this.onSuccess(...params);
    }
  }

  triggerError(...params) {
    if (typeof this.onError === 'function') {
      console.log('Função de erro executada com parâmetros:', params);
      this.onError(...params);
    }
  }

  // aqui foi criado a lógica de alterar os botões de acordo com o status, ex: se for paused o botão de pause e resume vão ser renderizados
  updateButtons() {
    const buttonVisibilityMap = {
      waiting: { visible: ['start'], disabled: ['start'] },
      micTest: {
        visible: ['start', 'pause', 'changeMicrophone', 'chooseSpecialty'],
        disabled: ['pause'],
      },
      paused: { visible: ['pause', 'resume'], disabled: ['pause'] },
      recording: { visible: ['pause', 'finish'], disabled: [] },
      finished: { visible: [], disabled: [] },
      upload: { visible: ['upload'], disabled: [] },
      micError: { visible: ['start'], disabled: ['start'] },
    };

    const { visible = [], disabled = [] } =
      buttonVisibilityMap[this.status] || {};

    console.log('this.status', this.status);

    // Atualiza visibilidade e estado dos botões
    Object.keys(this.buttons).forEach((buttonType) => {
      const button = this.buttons[buttonType];
      button.classList.toggle('hidden', !visible.includes(buttonType));
      button.disabled = disabled.includes(buttonType);
    });

    // Lógica para exibir ou ocultar canvas e timerElement
    if (['finished', 'upload', 'resume'].includes(this.status)) {
      this.canvas.classList.add('hidden');
      this.timerElement.classList.add('hidden');
    } else if (['micError', 'waiting'].includes(this.status)) {
      this.canvas.classList.add('hidden');
      this.timerElement.classList.add('hidden');
    } else if (['micTest'].includes(this.status)) {
      this.timerElement.classList.add('hidden');
    } else {
      this.canvas.classList.remove('hidden');
      this.timerElement.classList.remove('hidden');
    }
  }

  // abrir o modal de mudança de microfone
  openMicrophoneModal() {
    this.microphoneBackdrop.classList.add('active');
    this.microphoneModal.classList.add('active');
  }

  closeMicrophoneModal() {
    this.microphoneBackdrop.classList.remove('active');
    this.microphoneModal.classList.remove('active');
  }

  // abrir o modal de mudança de especialidade
  openSpecialityModal() {
    this.specialityBackdrop.classList.add('active');
    this.specialityModal.classList.add('active');
  }

  closeSpecialityModal() {
    this.specialityBackdrop.classList.remove('active');
    this.specialityModal.classList.remove('active');
  }
}

customElements.define('daai-badge', DaaiBadge);
