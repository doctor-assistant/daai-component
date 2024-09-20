import { DAAI_LOGO } from "./constants.js";
import { StartAnimationMicTest, StartAnimationRecording } from "./utils/animations.js";


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

    // Aqui criamos a shadow dom
    const shadow = this.attachShadow({ mode: 'open' });
    // Aqui criamos o style
    const style = document.createElement('style');

    this.shadowRoot.innerHTML = `
   <style>
       @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
      @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
      }
      .recorder-box {
        display: flex;
        align-items: center;
        justify-content: space-around;
        text-items:center;
        padding: 1rem;
        border: 3px solid;
        border-radius: 30px;
        background-color: #ffffff;
        height: 60px;
        width: 700px;
        font-family: "Inter", sans-serif;
        font-weight: 500;
        position: relative;
        color:${this.getAttribute('text-color')}
      }
      .recorder-box button {
        height: 50px;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        cursor: pointer;
        transition: transform 0.15s ease-in-out;
      }
      .recorder-box button:active {
        transform: scale(0.95);
      }
      .text-primary {
       color:${this.getAttribute('text-color')}
      }
      .text-waiting-mic-aprove {
        color:${this.getAttribute('text-color')}
         font-weight: bold;
      }
      .button-primary {
        height: 50px;
        font-size: 30px;
        border-radius: 8px;
        background-color:#009CB1;
        color: white;
      }
      .button-pause {
        width: 60px;
        height: 50px;
        gap: 15px;
        opacity: 1;
        background-color: #F43F5E;
        color:white;
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
        font-family: "Inter", sans-serif;
      }
      .modal.active {
        display: block;
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
        border-radius: 20px;
      }
      .backdrop.active {
        display: block;
      }
      .close-button {
        width: 200px;
        background-color:#525252;
        border: none;
        border-radius: 4px;
        padding: 4px;
        color: #FFFFFF;
      }
      .button-change {
        background-color: transparent;
        font-size: 30px;
        border: none;
        padding: 4px;
        color: #64748B;
        width: 12.66px;
        height: 13.26px;
      }
      .button-resume{
        height: 50px;
        font-size: 30px;
        border-radius: 8px;
        background-color: #009CB1;
        color: white;
      }
    .audio-visualizer {
      pointer-events: none;
      background-color: transparent;
    }
    .audio-hide {
      width:0px;
      heigth:0px
    }

    .button[disabled] {
      cursor: not-allowed;
      background-color:#A6AFC366;
      opacity: 0.5;
    }

    .text-waiting-aprove-mic {
      color:${this.getAttribute('text-color')}
    }

    .animation-mic-test{
      width:130px;
      margin-top:40px;
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
      background-position: right 10px center;
      background-size: 16px;
      cursor: pointer;
  }
  .modal-title{
      color:${this.getAttribute('text-color')}
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
  }
    .timer {
      font-weight: 600;
    }
  ;
  `;


    const container = document.createElement('div');
    container.className = 'container';

    this.recorderBox = document.createElement('div');
    this.recorderBox.className = 'recorder-box';

    const logo = document.createElement('img');
    logo.src = DAAI_LOGO;
    logo.alt = 'daai-logo';
    this.recorderBox.appendChild(logo);

     this.status = 'waiting';
     this.statusText = document.createElement('span');
     this.statusText.textContent = 'Aguardando autorização do microfone...';
     this.recorderBox.appendChild(this.statusText);

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'audio-hide';
      this.recorderBox.appendChild(this.canvas);

      this.timerElement = document.createElement('div');
      this.timerElement.className = 'timer';
      this.timerElement.innerText = '00:00:00';
      this.recorderBox.appendChild(this.timerElement);

      this.textContent = {
        pause: this.createText('recording', '', 'Pausar Registro'),
        start: this.createText('recording', '', 'Iniciar Registro'),
        finish: this.createText('recording', '', 'Aguarde enquanto geramos o relatório final...'),
        resume: this.createText('resume', '', 'Continuar Registro'),
        upload: this.createText('upload', 'fa-regular fa-circle-check', 'Relatório finalizado!')
      };


// aqui vamos usar o createButton para criar esses botões com ícones e textos apropriados.
    this.buttons = {
      changeMicrophone: this.createButton('change', 'fas fa-gear fa-lg', '', this.openMicrophoneModal.bind(this)),
      pause: this.createButton('pause', 'fa fa-pause', '', this.pauseRecording.bind(this)),
      start: this.createButton('start', 'fa fa-microphone', 'Iniciar Registro', this.startRecording.bind(this)),
      finish: this.createButton('finish', 'fa fa-check', 'Finalizar Registro', this.finishRecording.bind(this)),
      resume: this.createButton('resume', 'fa fa-circle', 'Continuar Registro', this.resumeRecording.bind(this)),
      upload: this.createButton('upload', 'fa fa-microphone', 'Iniciar novo registro', this.startRecording.bind(this))
    };

    Object.values(this.buttons).forEach(button => this.recorderBox.appendChild(button));
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
    this.checkPermissionsAndLoadDevices()
    this.updateButtons();
  }

  // metódo para criar os botões, definido o seu conteúdo
  createButton(type, iconClass, text, handler) {
    const button = document.createElement('button');
    button.className = `button ${this.getButtonClass(type)}`;
    button.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${text}`;
    button.addEventListener('click', handler);
    return button;
  }
  // metódo para criar os textos, definido o seu conteúdo
  createText(type, iconClass,text, content) {
    const textElement = document.createElement('p');
    textElement.className = `text-${type}`;
    textElement.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${text}`;
    textElement.textContent = content;
    return textElement;
  }

  // setando as classes de acordo com o status
  getButtonClass(type) {
    if (type === 'start') return 'button-primary';
    if (type === 'pause') return 'button-pause';
    if (type === 'finish') return 'button-recording';
    if (type === 'resume') return 'button-resume';
    if (type === 'upload') return 'button-primary';
    if (type === 'change') return 'button-change';
    return '';
  }

 async connectedCallback() {
   await this.checkPermissionsAndLoadDevices();
  }

  async checkPermissionsAndLoadDevices() {
    try {
      // Verificar o estado da permissão do microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });

      // Certifique-se de que statusText e canvas são válidos
      if (!this.statusText || !this.canvas) {
        console.error('Elementos necessários não encontrados no DOM.');
        return;
      }

      // Verifica se a permissão foi concedida
      const handlePermissionChange = (status) => {
        if (status === 'granted') {
          this.canvas.classList.remove('hidden');
          this.canvas.className = 'animation-mic-test';
          this.status = 'micTest';
          this.statusText.textContent = 'Microfone';
          this.statusText.className = 'mic-test-text'
          StartAnimationMicTest(this.canvas);
        } else {
          this.canvas.classList.add('hidden');
          this.status = 'waiting';
          this.statusText.textContent = 'Aguardando autorização do microfone';
          this.statusText.classList.remove('text-primary');
          this.statusText.classList.add('text-waiting-mic-aprove');
        }
        this.updateButtons();
      };

      // Verificar a permissão inicial
      handlePermissionChange(permissionStatus.state);

      // Ouvir mudanças no status da permissão
      permissionStatus.onchange = () => {
        handlePermissionChange(permissionStatus.state);
      };

      // Carregar dispositivos de áudio (microfones)
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(device => device.kind === 'audioinput');

      // Verifica se há dispositivos de áudio disponíveis
      if (this.devices.length > 0) {
        const select = this.modal.querySelector('#microphone-select');
        select.innerHTML = '';
        this.devices.forEach(device => {
          const option = document.createElement('option');
          option.value = device.deviceId;
          option.textContent = device.label || `Microfone ${device.deviceId}`;
          select.appendChild(option);
        });

        // Configura o microfone padrão
        this.currentDeviceId = this.devices[0].deviceId;

        // Atualiza quando o dispositivo selecionado muda
        select.addEventListener('change', () => {
          this.currentDeviceId = select.value;
        });

        // Lógica para fechar o modal
        const closeModal = this.modal.querySelector('#close-modal');
        closeModal.addEventListener('click', () => {
          this.closeMicrophoneModal();
        });
      } else {
        console.warn('Nenhum dispositivo de áudio encontrado.');
      }
    } catch (error) {
      console.error('Erro ao verificar permissões ou carregar dispositivos:', error);
      if (this.statusText) {
        console.log(this.status,'status')
        this.statusText.textContent = 'Erro ao verificar permissões ou carregar dispositivos';
      }
    }
  }

  static get observedAttributes() {
    return ['icon', 'button-primary-color', 'button-recording-color', 'button-pause-color','button-resume-color' ,'border-color', 'animation-recording-color','animation-paused-color', 'text-color'];
  }

  connectedCallback() {
    if (!this.hasAttribute('icon')) this.setAttribute('icon', DAAI_LOGO);
    if (!this.hasAttribute('button-primary-color')) this.setAttribute('button-primary-color', '#009CB1');
    if (!this.hasAttribute('button-recording-color')) this.setAttribute('button-recording-color', '#F43F5E');
    if (!this.hasAttribute('button-pause-color')) this.setAttribute('button-pause-color', '#F43F5E');
    if (!this.hasAttribute('button-resume-color')) this.setAttribute('button-resume-color', '#009CB1');
    if (!this.hasAttribute('border-color')) {
      this.setAttribute('border-color','#009CB1');
    }
    if (!this.hasAttribute('animation-recording-color')) this.setAttribute('animation-recording-color', '#F43F5E');
    if (!this.hasAttribute('animation-paused-color')) this.setAttribute('animation-paused-color', '#009CB1');
    if (!this.hasAttribute('text-color')) this.setAttribute('text-color', '#1cde02');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const shadowRoot = this.shadowRoot;
    switch (name) {
      case 'icon':
        const img = shadowRoot.querySelector('img');
        if (img) img.src = newValue;
        break;
      case 'button-primary-color':
        const buttonPrimary = shadowRoot.querySelector('.button-primary');
        if (buttonPrimary) buttonPrimary.style.backgroundColor = newValue;
        break;
      case 'button-recording-color':
        const buttonRecording = shadowRoot.querySelector('.button-recording');
        if (buttonRecording) buttonRecording.style.backgroundColor = newValue;
        break;
      case 'button-pause-color':
        const buttonPause = shadowRoot.querySelector('.button-pause');
        if (buttonPause) buttonPause.style.backgroundColor = newValue;
        break;
      case 'button-resume-color':
        const buttonResume = shadowRoot.querySelector('.button-resume');
        if (buttonResume) buttonResume.style.backgroundColor = newValue;
        break;
      case 'border-color':
        const recorderBox = shadowRoot.querySelector('.recorder-box');
        if (recorderBox) recorderBox.style.borderColor = newValue;
        break;
      case 'animation-recording-color':
        const animatedRecordingElement = shadowRoot.querySelector('.animated-recording-element');
        if (animatedRecordingElement) animatedRecordingElement.style.animationColor = newValue;
        break;
      case 'animation-paused-color':
        const animatedPausedElement = shadowRoot.querySelector('.animated-paused-element');
        if (animatedPausedElement) animatedPausedElement.style.animationColor = newValue;
        break;
      case 'text-color':
        const textColor = shadowRoot.querySelector('.text-color');
        if (textColor) textColor.style.color = newValue;
        break;
    }
  }

// aqui foi criado a lógica de alterar os botões de acordo com o status, ex: se for paused o botão de pause e resume vão ser renderizados
updateButtons() {
  Object.keys(this.buttons).forEach(buttonType => {
    const button = this.buttons[buttonType];
    if (this.status === 'finished' || this.status === 'waiting' || this.status === 'upload') {
      this.canvas.classList.add('hidden');
      this.timerElement.classList.add('hidden');
    } else {
      this.canvas.classList.remove('hidden');
      this.timerElement.classList.remove('hidden');
    }
      switch (this.status) {
        case 'waiting':
            buttonType === 'start' ? button.classList.remove('hidden') : button.classList.add('hidden');
            button.disabled = true;
            this.canvas.classList.remove('hidden');
            break;
      case 'micTest':
              buttonType === 'start' || buttonType === 'pause' || buttonType === 'changeMicrophone'
                  ? button.classList.remove('hidden')
                  : button.classList.add('hidden');
              button.disabled = (buttonType === 'pause');
              this.canvas.classList.remove('hidden');
              break;
        case 'paused':
            buttonType === 'pause' || buttonType === 'resume' ? button.classList.remove('hidden') : button.classList.add('hidden');
            button.disabled = (this.status === 'paused' && buttonType === 'pause');
            break;
        case 'recording':
            buttonType === 'pause' || buttonType === 'finish' ? button.classList.remove('hidden') : button.classList.add('hidden');
            button.disabled = false;
            break;
        case 'finished':
            buttonType === '' ? button.classList.remove('hidden') : button.classList.add('hidden');
            button.disabled = false;
            break;
        case 'upload':
          buttonType === 'upload' ? button.classList.remove('hidden') : button.classList.add('hidden');
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


getFormattedRecordingTime() {
    const hours = String(Math.floor(this.recordingTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((this.recordingTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(this.recordingTime % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }


async startRecording() {
    this.statusText.textContent = '';
    try {
      const constraints = { audio: { deviceId: this.currentDeviceId ? { exact: this.currentDeviceId } : undefined } };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.gainNode = this.audioContext.createGain();
      source.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => this.handleDataAvailable(event);
      this.status = 'recording';
      this.mediaRecorder.onstop = () => this.handleStop();
      this.mediaRecorder.onstart = () => {

      this.intervalId = setInterval(() => {
          this.recordingTime++;
          this.timerElement.innerText = this.getFormattedRecordingTime();
          }, 1000)
        }
      this.mediaRecorder.start();

      if (!this.canvas) {
          console.error('Canvas não encontrado!');
          return;
      }

      this.canvas.className = 'audio-visualizer';
      this.updateButtons();

      StartAnimationRecording(this.analyser, dataArray, bufferLength, this.canvas, this.status);

  } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
      this.statusText.textContent = 'Erro ao acessar o microfone';
      this.status = 'waiting';
      this.updateButtons();
  }
}

pauseRecording() {
  if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
    this.mediaRecorder.pause();
    this.status = 'paused';

    clearInterval(this.intervalId)

    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }

    StartAnimationRecording(this.analyser, new Uint8Array(this.analyser.frequencyBinCount), this.analyser.frequencyBinCount, this.canvas, this.status);

    this.updateButtons();
  }
}


  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.status = 'recording';

      this.intervalId = setInterval(() => {
        this.recordingTime++;
        this.timerElement.innerText = this.getFormattedRecordingTime();
        }, 1000)


      if (this.gainNode) {
        this.gainNode.gain.value = 1;
      }
      StartAnimationRecording(this.analyser, new Uint8Array(this.analyser.frequencyBinCount), this.analyser.frequencyBinCount, this.canvas, this.status);
      this.updateButtons();
    }
  }

  finishRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.status = 'finished';
      this.statusText.classList.add('text-primary');
      this.statusText.textContent = 'Aguarde enquanto geramos o relatório final...';
      this.updateButtons();

      setTimeout(() => {
        this.status = 'upload';
        this.statusText.textContent = 'Relatório finalizado!'
        this.updateButtons();
      }, 10000);
    }
  }

  handleDataAvailable(event) {
    this.chunks.push(event.data);
  }

  handleStop() {
    this.recordingBlob = new Blob(this.chunks, { type: 'audio/wav' });
    this.chunks = [];
  }}

customElements.define('daai-badge', DaaiBadge);
