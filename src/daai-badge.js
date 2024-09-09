class DaaiRecorder extends HTMLElement {
  constructor() {
    super();
    this.mediaRecorder = null;
    this.chunks = [];
    this.stream = null;
    this.recordingBlob = null;

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
        gap: 1rem;
        padding: 1rem;
        border: 2px solid #007bff; /* Ajuste a cor conforme necessário */
        border-radius: 8px;
        background-color: #ffffff;
      }
      .recorder-box img {
        height: 40px; /* Ajuste conforme necessário */
      }
      .recorder-box button {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: transform 0.15s ease-in-out;
      }
      .recorder-box button:active {
        transform: scale(0.95);
      }
      .button-primary {
        background-color: #007bff;
        color: white;
      }
      .button-recording {
        background-color: #ff0000;
        color: white;
      }
      .button-inactive {
        background-color: #6c757d;
        color: white;
      }
      .button-success {
        background-color: #28a745;
        color: white;
      }
      .icon {
        margin-right: 0.5rem;
      }
    `;

    const container = document.createElement('div');
    container.className = 'container';

    const recorderBox = document.createElement('div');
    recorderBox.className = 'recorder-box';

    const logo = document.createElement('img');
    logo.src = 'images/logo.png';
    logo.alt = 'daai-logo';
    recorderBox.appendChild(logo);

    this.statusText = document.createElement('span');
    this.statusText.textContent = 'Aguardando';
    recorderBox.appendChild(this.statusText);


    this.addButton(recorderBox, 'recording', 'pause', 'fa-pause', 'Pausar Gravação', this.pauseRecording.bind(this));
    this.addButton(recorderBox, 'waiting_authorization', 'start', 'fa-microphone', 'Iniciar Registro', this.startRecording.bind(this));
    this.addButton(recorderBox, 'recording', 'finish', 'fa-check', 'Finalizar Registro', this.finishRecording.bind(this));
    this.addButton(recorderBox, 'paused', 'resume', 'fa-circle', 'Continuar Registro', this.resumeRecording.bind(this));
    this.addButton(recorderBox, 'in_process', 'download', 'fa-download', 'Download Registro', this.downloadRecording.bind(this));

    shadow.appendChild(style);
    shadow.appendChild(container);
    container.appendChild(recorderBox);
  }

  addButton(parent, status, type, iconClass, text, handler) {
    const button = document.createElement('button');
    button.className = this.getButtonClass(status, type);
    button.innerHTML = `<i class="fa-solid ${iconClass} icon"></i>${text}`;
    button.addEventListener('click', handler);
    parent.appendChild(button);
  }

  getButtonClass(status, type) {
    if (status === 'recording') return 'button-recording';
    if (type === 'start' || type === 'resume') return 'button-primary';
    if (type === 'pause' || type === 'finish') return 'button-recording';
    if (type === 'download') return 'button-success';
    return 'button-inactive';
  }

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => this.chunks.push(event.data);
      this.mediaRecorder.onstop = () => this.handleStop();
      this.mediaRecorder.start();
      this.statusText.textContent = 'Gravando';
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
      this.statusText.textContent = 'Erro ao acessar o microfone';
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.statusText.textContent = 'Gravacao pausada';
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.statusText.textContent = 'Gravando';
    }
  }

  finishRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.statusText.textContent = 'Finalizando';
    }
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

customElements.define('daai-badge', DaaiRecorder);
