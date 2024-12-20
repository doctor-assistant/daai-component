import { getSpecialty } from './api/Specialty.js';
import {
  GEAR,
  HELP_ICON,
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
import { getSpecialtyTitle } from './scripts/IndexDb.js';
import {
  finishRecording,
  newRecording,
  pauseRecording,
  redirectToSupportPage,
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
    this.modeApi = 'dev';
    this.metadata = {};
    this.onEvent = null;

    this.upload = () => blockPageReload();
    // Aqui criamos a shadow dom
    const shadow = this.attachShadow({ mode: 'open' });
    // Aqui criamos o style
    const style = document.createElement('style');
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.recorder-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border: 3px solid;
  border-radius: 30px;
  background-color: #ffffff;
  height: 50px;
  width: 430px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  position: relative;
  color: var(--text-badge-color, #009CB1);
   @media (max-width: 600px) {
    width: 270px;
    height: 170px;
    padding: 2px;
    flex-direction: column;
    justify-content: center;

    .wrapper{
    flex-direction:row;
    height: 70px;
    }
}
}

.recorder-box button {
  height: 50px;
  width: 50px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
}

.recorder-box button:active {
  transform: scale(0.95);
}

.text-waiting-mic {
  color: #F43F5E;
}

.text-finish {
  margin: 0 auto;
}

.text-upload {
  color: var(--text-badge-color, #009CB1);
}

.text-waiting-mic-aprove {
  color: #F43F5E;
  font-weight: bold;
}

.button-primary {
  height: 50px;
  font-size: 30px;
  border-radius: 8px;
  background-color:  #009CB1;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

.button-upload {
  height: 50px;
  font-size: 30px;
  border-radius: 8px;
  background-color: var(--button-upload-color, #009CB1);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

.button-pause {
  width: 60px;
  height: 50px;
  opacity: 1;
  background-color: #F43F5E;
  color: white;
}

.button-recording {
  height: 50px;
  font-size: 30px;
  border-radius: 8px;
  background-color: #F43F5E;
  color: white;
}

.button-success {
  background-color: #28a745;
  color: white;
}

.hidden {
  display: none;
}

.modal {
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  z-index: 1000;
  display: none;
  text-align:center;
  font-family: "Inter", sans-serif;
   @media (max-width: 600px) {
   display: none;
    width: 270px;
    height: 170px;
    padding: 2px;
}
}

.modal.active {
  display: block;
  z-index: 99999;
}

.modal button {
  margin-top: 1rem;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: none;
}

.backdrop.active {
  display: block;
  background-color: #00000080;
  z-index: 9999;
}

.close-button {
  width: 100px;
  height: 50px;
  background-color: #525252;
  border: none;
  border-radius: 4px;
  padding: 4px;
  color: #FFFFFF;
   @media (max-width: 600px) {
    width: 90%;
   height: 40px;
}
}

.button-change {
  background-color: transparent;
  border:2px #DFDFDF solid !important;
  font-size: 30px;
  border: none;
  padding: 4px;
  color: #64748B;
  width: 12.66px;
  height: 13.26px;
}

.button-resume {
  height: 50px;
  font-size: 30px;
  border-radius: 8px;
  background-color: var(--button-resume-color, #009CB1);
  color: white;
}

.audio-visualizer {
  pointer-events: none;
  background-color: transparent;
}

.audio-hide {
  width: 0px;
  height: 0px
}

.button[disabled] {
  cursor: not-allowed;
  background-color: #A6AFC366;
  opacity: 0.5;
}

.text-waiting-aprove-mic {
  color: var(--text-badge-color, #009CB1);
}

.animation-mic-test {
  margin-top: 20px;
  width:130px;
   @media (max-width: 600px) {
        margin-top: 20px;
    }
}

.rounded-select {
  font-size: 18px;
  padding: 10px 16px;
  border-radius: 25px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 16px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-repeat: no-repeat;
  @media (max-width: 600px) {
    width: 100px;
    height: 170px;
    padding: 2px;
    flex-direction: column;
    justify-content: center;
}
}

option {
   @media (max-width: 600px) {
    font-size: 10px;
}
}

.modal-title {
  color: #000000
}

.rounded-select:focus {
  border-color: #007bff;
}

.select-button {
  border-radius: 10px;
  width: 400px;
  height: 50px;
  text-align: center;
  text-align-last: center;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  @media (max-width: 600px) {
   width: 90%;
   padding:10px;
}
}
.timer {
  font-weight: 600;
  color: #000000;
  margin-left:14px;
  @media (max-width: 600px) {
   margin-left:0px;
}
}
.button-specialty{
  height: 50px;
  font-size: 30px;
  border-radius: 8px;
  border:2px #64748B solid !important;
  background: transparent !important;
  color: black;
}
.wrapper {
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .btnWrapper{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:10px;
  }
  .button-help {
   background: #c9c9c9;
  }
  `;

    const container = document.createElement('div');
    container.className = 'container';

    this.recorderBox = document.createElement('div');
    this.recorderBox.className = 'recorder-box';

    const wrapper = document.createElement('div');
    const btnWrapper = document.createElement('div');
    wrapper.classList = ['wrapper'];
    btnWrapper.classList = ['btnWrapper'];

    this.logo = document.createElement('img');
    wrapper.appendChild(this.logo);
    this.logo.alt = 'daai-logo';
    wrapper.appendChild(this.logo);

    this.status = 'waiting';
    this.statusText = document.createElement('span');
    this.statusText.classList.add('text-waiting-mic-aprove');
    this.statusText.textContent = 'Aguardando autorização do microfone...';
    wrapper.appendChild(this.statusText);

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'audio-hide';
    wrapper.appendChild(this.canvas);
    this.recorderBox.appendChild(wrapper);

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
        this.openMicrophoneModal.bind(this),
        '',
        'configuração do microfone'
      ),
      chooseSpecialty: createButton(
        'specialty',
        this.specialty === 'generic' ? SPECIALTY_ICON : '',
        this.specialty === 'generic' ? '' : this.specialty,
        this.openSpecialtyModal.bind(this)
      ),
      start: createButton(
        'start',
        MICROPHONE_ICON,
        '',
        startRecording.bind(this),
        '',
        'Iniciar o Registro'
      ),
      pause: createButton(
        'pause',
        PAUSE_ICON,
        '',
        pauseRecording.bind(this),
        '',
        'Pausar Registro'
      ),
      suport: createButton(
        'suport',
        HELP_ICON,
        '',
        redirectToSupportPage.bind(this),
        '',
        'Suporte'
      ),
      start: createButton(
        'start',
        MICROPHONE_ICON,
        '',
        startRecording.bind(this),
        '',
        'Iniciar o Registro'
      ),
      finish: createButton(
        'finish',
        RECORDING_ICON,
        '',
        finishRecording.bind(this),
        '',
        'Finalizar Registro'
      ),
      resume: createButton(
        'resume',
        RESUME_ICON,
        '',
        resumeRecording.bind(this),
        '',
        'Retomar Registro'
      ),
      upload: createButton(
        'upload',
        MICROPHONE_ICON,
        '',
        newRecording.bind(this),
        '',
        'Iniciar novo Registro'
      ),
    };

    Object.values(this.buttons).forEach((button) =>
      btnWrapper.appendChild(button)
    );
    this.recorderBox.appendChild(btnWrapper);
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
    this.microphoneBackdrop.onclick = () => this.closeMicrophoneModal();

    // Modal para a escolha de especialidades
    this.specialtyModal = document.createElement('div');
    this.specialtyModal.className = 'modal specialty-modal';
    this.specialtyModal.innerHTML = `
  <p class='modal-title'>Escolha o Modelo do Registro</p>
  <select id="specialty-select" class='select-button'></select>
  <button id="close-specialty-modal" class="close-button">Fechar</button>
`;

    this.specialtyBackdrop = document.createElement('div');
    this.specialtyBackdrop.className = 'backdrop specialty-backdrop';
    this.specialtyBackdrop.onclick = () => this.closeSpecialtyModal();

    this.buttons.chooseSpecialty.addEventListener('mouseover', async () => {
      const specialty = await getSpecialtyTitle(this.specialty);
      if (!specialty) {
        this.specialty = 'generic';
      }
      this.buttons.chooseSpecialty.title =
        `Especialidade: ${specialty}` || 'Especialidade não encontrada';
    });

    this.buttons.chooseSpecialty.addEventListener('mouseleave', async () => {
      const specialty = await getSpecialtyTitle(this.specialty);
      this.buttons.chooseSpecialty.title =
        this.specialty === 'generic' ? '' : specialty;
    });

    shadow.appendChild(style);
    shadow.appendChild(container);
    container.appendChild(this.recorderBox);
    shadow.appendChild(this.specialtyModal);
    shadow.appendChild(this.microphoneModal);
    shadow.appendChild(this.specialtyBackdrop);
    shadow.appendChild(this.microphoneBackdrop);
    this.updateButtons();
    checkPermissionsAndLoadDevices(this);
  }

  connectedCallback() {
    checkPermissionsAndLoadDevices(this);
  }

  generateRandomId() {
    return Math.random().toString(36);
  }

  static get observedAttributes() {
    return [
      'theme',
      'onSuccess',
      'onError',
      'apiKey',
      'professionalId',
      'specialty',
      'metadata',
      'onEvent',
    ];
  }

  connectedCallback() {
    const successAttr = this.getAttribute('onSuccess');
    const errorAttr = this.getAttribute('onError');
    const specialtyProp = this.getAttribute('specialty');
    const metadataProp = this.getAttribute('metadata');
    const apikey = this.getAttribute('apikey');
    this.modeApi = apikey && apikey.startsWith('PRODUCTION') ? 'prod' : 'dev';
    const eventAttr = this.getAttribute('onEvent');

    if (metadataProp) {
      try {
        this.metadata = JSON.parse(metadataProp);
      } catch (error) {
        this.metadata = {};
      }
    }

    if (specialtyProp) {
      this.specialty = specialtyProp;
    } else {
      this.specialty = 'generic';
    }

    getSpecialty(this, this.modeApi);

    if (successAttr && typeof window[successAttr] === 'function') {
      this.onSuccess = window[successAttr].bind(this);
    }
    if (errorAttr && typeof window[errorAttr] === 'function') {
      this.onError = window[errorAttr].bind(this);
    }

    if (eventAttr && typeof window[eventAttr] === 'function') {
      this.onEvent = window[eventAttr].bind(this);
    }
    const logoElement = this.shadowRoot.querySelector('img');
    const defaultTheme = {
      icon: this.getAttribute('icon') || initializeEasterEgg(logoElement),
      buttonStartRecordingColor: '#009CB1',
      buttonRecordingColor: '#F43F5E',
      buttonPauseColor: '#F43F5E',
      buttonResumeColor: '#009CB1',
      buttonUploadColor: '#009CB1',
      borderColor: '#009CB1',
      animationRecordingColor: '#F43F5E',
      animationPausedColor: '#009CB1',
      textBadgeColor: '#009CB1',
      buttonHelpColor: '#c9c9c9',
    };

    const themeAttr = this.getAttribute('theme');
    if (themeAttr) {
      this.theme = { ...defaultTheme, ...parseThemeAttribute(themeAttr) };
    } else {
      this.theme = defaultTheme;
    }
    applyThemeAttributes(this.theme, this);
    this.apiKey = this.getAttribute('apikey');
    this.professionalId =
      this.getAttribute('professionalId') || this.generateRandomId();
    this.onSuccess = this.getAttribute('onSuccess')
      ? new Function('return ' + this.getAttribute('onSuccess'))()
      : null;

    this.onError = this.getAttribute('onError')
      ? new Function('return ' + this.getAttribute('onError'))()
      : null;

    this.onEvent = this.getAttribute('onEvent')
      ? new Function('return ' + this.getAttribute('onEvent'))()
      : null;
  }

  triggerSuccess(...params) {
    if (typeof this.onSuccess === 'function') {
      this.onSuccess(...params);
    }
  }

  triggerError(...params) {
    if (typeof this.onError === 'function') {
      this.onError(...params);
    }
  }
  triggerEvent(...params) {
    if (typeof this.onEvent === 'function') {
      this.onEvent(...params);
    }
  }

  // aqui foi criado a lógica de alterar os botões de acordo com o status, ex: se for paused o botão de pause e resume vão ser renderizados
  updateButtons() {
    const specialtyProp = this.getAttribute('specialty');
    const isDisabled = specialtyProp ? 'chooseSpecialty' : '';

    const buttonVisibilityMap = {
      waiting: { visible: ['start'], disabled: ['start'] },
      micTest: {
        visible: ['suport', 'start', 'changeMicrophone', 'chooseSpecialty'],
        disabled: [isDisabled],
      },
      paused: { visible: ['pause', 'resume'], disabled: ['pause'] },
      recording: { visible: ['pause', 'finish'], disabled: [] },
      finished: { visible: [], disabled: [] },
      upload: { visible: ['upload'], disabled: [] },
      micError: { visible: ['start'], disabled: ['start'] },
    };

    const { visible = [], disabled = [] } =
      buttonVisibilityMap[this.status] || {};

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
    this.updateButtons();
    this.dispatchEvent(
      new CustomEvent('interface', {
        bubbles: true,
        detail: {
          microphoneSelect: true,
        },
      })
    );
  }

  closeMicrophoneModal() {
    this.microphoneBackdrop.classList.remove('active');
    this.microphoneModal.classList.remove('active');
    this.dispatchEvent(
      new CustomEvent('interface', {
        bubbles: true,
        detail: {
          microphoneSelect: false,
        },
      })
    );
  }

  // abrir o modal de mudança de especialidade
  openSpecialtyModal() {
    this.specialtyBackdrop.classList.add('active');
    this.specialtyModal.classList.add('active');
    this.updateButtons();
    this.dispatchEvent(
      new CustomEvent('interface', {
        bubbles: true,
        detail: {
          specialtySelect: true,
        },
      })
    );
  }

  closeSpecialtyModal() {
    this.specialtyBackdrop.classList.remove('active');
    this.specialtyModal.classList.remove('active');
    const specialtySelect =
      this.specialtyModal.querySelector('#specialty-select');
    this.specialty = specialtySelect.value;
    this.updateButtons();
    this.dispatchEvent(
      new CustomEvent('interface', {
        bubbles: true,
        detail: {
          specialtySelect: false,
        },
      })
    );
  }
}

customElements.define('daai-component', DaaiBadge);
