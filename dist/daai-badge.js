class DaaiBadge extends HTMLElement {
  constructor() {
    super();
    this.mediaRecorder = null;
    this.chunks = [];
    this.stream = null;
    this.audioContext = null;
    this.status = 'waiting';
    this.devices = [];
    this.currentDeviceId = null;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
      }
      .recorder-box {
        display: flex;
        align-items: center;
        justify-content:center;
        gap: 2rem;
        padding: 1rem;
        border: 3px solid  #009CB1;
        border-radius: 30px;
        background-color: #ffffff;
        height: 60px;
        width: 600px;
      }
      .recorder-box img {
        height: 40px;
      }
      .recorder-box button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: medium;
        cursor: pointer;
        transition: transform 0.15s ease-in-out;
      }
      .recorder-box button:active {
        transform: scale(0.95);
      }
      .button-primary {
        width:180px;
        height:50px;
        font-size:30px;
        border-radius:8px;
        background-color: #009CB1;
        color: white;
      }
      .button-recording {
        width:180px;
        height:50px;
        font-size:30px;
        border-radius:8px;
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius:10px;
        padding: 1rem;
        z-index: 1000;
        display: none;
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
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: none;
        border-radius:20px;
      }
      .backdrop.active {
        display: block;
      }
      .close-button{
        background-color: #009CB1;
        border:none;
        border-radius:10px;
        padding:4px;
        color:#FFFFFF;
        }
    `;

    const container = document.createElement('div');
    container.className = 'container';

    this.recorderBox = document.createElement('div');
    this.recorderBox.className = 'recorder-box';

    const logo = document.createElement('img');
    logo.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAmCAYAAADTGStiAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAITSURBVHgB1ZdfTttAEMa/2fQA3ADfoOkN/F4JxScgKbRSn0pPEDhB6SukCj2Bm0p9rjkB6QkabhDekCA7zGxQICg46/U6iJ/keGNN/Hn+egO8Sn7kXQxGuwjgDUIY5luYtYZg7txf+YmKVBce5gms+QtwghqYStYnEtqZuQAjQU38PR6MjuXzCyKxXlhDq/kEp4hIufBJ3pZ85nXzuYrnc3z6+wAmTj79hVWU+BsaZHWoeVaA6Axe0BgB0GKlQ+EWbTTNx6x4EN5AaB8xgbUZzdvF/MdGocJIeBNsHE6rjcyIeApzIceZVMQkjp3XrJYb7Xd6bjmvhwtZbYXbzfHwmIrFspdNlr6X25X2t4fwo5eD9jpx28MuEbsEJRBO8xSkL/ZScckbaf+dw7R2ZefRfWIwleMQZK/El21Zd9fNeM/3MemN5CQBsnwkApms38oDJC6kbP+BWn2wSeFJ9a0Poe8yxJpTGXykITYJ3JP5E7bZc9zntJregpcaIFMjPmvZT7FReGyk50TU9nymTSTRAjfco6Vrgz/baJr995d6IoTgRiL1vWxJ0mikBV1kHwiraovU9bYPLMLX/B1P6qjpqp7gxr7DZ53dyzQoTL/QWi2q1BggZZoyt/d2jspMYgtLIVEHH3bO1xnGDPXY5dNDVInjMfEx9jpfq/ykrsfaIgdVRZUwjw0K6eVDzOwIn7KgvzB3l1a49sinti4AAAAASUVORK5CYII=';
    logo.alt = 'daai-logo';
    this.recorderBox.appendChild(logo);

    this.statusText = document.createElement('span');
    this.statusText.textContent = 'Aguardando autorização do microfone';
    this.recorderBox.appendChild(this.statusText);

    this.buttons = {
      start: this.createButton('start', 'fa-microphone', 'Iniciar Registro', this.startRecording.bind(this)),
      pause: this.createButton('pause', 'fa-pause', 'Pausar Registro', this.pauseRecording.bind(this)),
      finish: this.createButton('finish', 'fa-check', 'Finalizar Registro', this.finishRecording.bind(this)),
      resume: this.createButton('resume', 'fa-circle', 'Continuar Registro', this.resumeRecording.bind(this)),
      download: this.createButton('download', 'fa-download', 'Download Registro', this.downloadRecording.bind(this)),
      changeMicrophone: this.createButton('change', 'fa-microphone-alt', 'Mudar Microfone', this.openMicrophoneModal.bind(this))
    };

    for (const button of Object.values(this.buttons)) {
      this.recorderBox.appendChild(button);
    }


    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
      <h2>Selecionar Microfone</h2>
      <select id="microphone-select"></select>
      <button id="close-modal" class='close-button'>Fechar</button>
    `;

    this.backdrop = document.createElement('div');
    this.backdrop.className = 'backdrop';

    shadow.appendChild(style);
    shadow.appendChild(container);
    container.appendChild(this.recorderBox);
    shadow.appendChild(this.modal);
    shadow.appendChild(this.backdrop);

    this.updateButtons();
    this.loadDevices();
  }

  createButton(type, iconClass, text, handler) {
    const button = document.createElement('button');
    button.className = `button ${this.getButtonClass(type)}`;
    button.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${text}`;
    button.addEventListener('click', handler);
    button.classList.add('hidden');
    return button;
  }

  getButtonClass(type) {
    if (type === 'start') return 'button-primary';
    if (type === 'pause' || type === 'finish') return 'button-recording';
    if (type === 'resume') return 'button-primary';
    if (type === 'download') return 'button-success';
    return '';
  }

  updateButtons() {
    Object.keys(this.buttons).forEach(buttonType => {
      const button = this.buttons[buttonType];
      switch (this.status) {
        case 'waiting':
          buttonType === 'start' || buttonType === 'changeMicrophone' ? button.classList.remove('hidden') : button.classList.add('hidden');
          break;
        case 'authorized':
        case 'paused':
          buttonType === 'pause' || buttonType === 'start' || buttonType === 'changeMicrophone' ? button.classList.remove('hidden') : button.classList.add('hidden');
          break;
        case 'recording':
          buttonType === 'pause' || buttonType === 'finish' ? button.classList.remove('hidden') : button.classList.add('hidden');
          break;
        case 'finished':
          buttonType === 'download' ? button.classList.remove('hidden') : button.classList.add('hidden');
          break;
      }
    });
  }

  async loadDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(device => device.kind === 'audioinput');

      const select = this.modal.querySelector('#microphone-select');
      select.innerHTML = '';
      this.devices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.textContent = device.label || `Microfone ${device.deviceId}`;
        select.appendChild(option);
      });

      select.addEventListener('change', () => {
        this.currentDeviceId = select.value;
      });

      const closeModal = this.modal.querySelector('#close-modal');
      closeModal.addEventListener('click', () => {
        this.closeMicrophoneModal();
      });
    } catch (error) {
      console.error('Erro ao carregar dispositivos:', error);
    }
  }

  openMicrophoneModal() {
    this.backdrop.classList.add('active');
    this.modal.classList.add('active');
  }

  closeMicrophoneModal() {
    this.backdrop.classList.remove('active');
    this.modal.classList.remove('active');
  }

  async startRecording() {
    try {
      const constraints = { audio: { deviceId: this.currentDeviceId ? { exact: this.currentDeviceId } : undefined } };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.audioContext.destination);

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => this.handleDataAvailable(event);
      this.mediaRecorder.onstop = () => this.handleStop();
      this.mediaRecorder.start();
      this.status = 'recording';
      this.statusText.textContent = 'Gravando';

      this.updateButtons();
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
      this.statusText.textContent = 'Erro ao acessar o microfone';
      this.status = 'waiting'; // Retorna ao status inicial
      this.updateButtons();
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.status = 'paused';
      this.statusText.textContent = 'Registro pausado';
      this.updateButtons();
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.status = 'recording';
      this.statusText.textContent = 'Gravando';
      this.updateButtons();
    }
  }

  finishRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.status = 'finished';
      this.statusText.textContent = 'Finalizando';
      this.updateButtons();
    }
  }

  handleDataAvailable(event) {
    this.chunks.push(event.data);
  }

  handleStop() {
    this.recordingBlob = new Blob(this.chunks, { type: 'audio/wav' });
    this.chunks = [];
    this.statusText.textContent = 'Pronto para download';
  }

  downloadRecording() {
    if (this.recordingBlob) {
      const url = URL.createObjectURL(this.recordingBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recording.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('Nenhuma gravação para download.');
    }
  }
}

customElements.define('daai-badge', DaaiBadge);
