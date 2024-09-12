class DaaiBadge extends HTMLElement {
  constructor() {
    super();
    // Variáveis de estado e objetos relacionados ao áudio
    this.mediaRecorder = null;
    this.chunks = [];
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.gainNode = null;
    this.status = 'waiting';
    this.devices = [];
    this.currentDeviceId = null;

    // Aqui criamos a shadow dom
    const shadow = this.attachShadow({ mode: 'open' });
    // Aqui criamos o style
    const style = document.createElement('style');

    style.textContent = `
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
      @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
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
        justify-content: center;
        text-items:center;
        gap: 1rem;
        padding: 1rem;
        border: 3px solid #009CB1;
        border-radius: 30px;
        background-color: #ffffff;
        height: 60px;
        width: 600px;
        font-family: "Inter", sans-serif;
        font-weight: 500;
        position: relative;
      }
      .recorder-box img {
        height: 40px;
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
       text-color:'#009CB1'
      }
      .text-waiting-mic-aprove {
       text-color:'#F43F5E'
      }
      .button-primary {
        height: 50px;
        font-size: 30px;
        border-radius: 8px;
        background-color: #009CB1;
        color: white;
      }
      .button-pause {
        width: 100px;
        height: 50px;
        gap: 15px;
        opacity: 1;
        background-color: #F43F5E;
        color:white;
      }
      .button-recording {
        width: 300px;
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
        top: 50%;
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
        background-color: #009CB1;
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
        width:250px;
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

    .button[disabled] {
      cursor: not-allowed;
      background-color:#A6AFC366;
      opacity: 0.5;
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

    // this.statusText = document.createElement('span');
    // this.statusText.textContent = 'Aguardando autorização do microfone';
    // this.recorderBox.appendChild(this.statusText);

      this.statusText = document.createElement('span');
      this.statusText.textContent = 'Microfone';
      this.recorderBox.appendChild(this.statusText);
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'audio-visualizer';
      this.recorderBox.appendChild(this.canvas);

    this.textContent = {
      start: this.createText('recording',''),
      pause: this.createText('recording',''),
      finish:this.createText('recording','Aguarde enquanto geramos o relatório final...'),
      resume: this.createText('',''),
      upload: this.createText('','Relatório finalizado!'),
    };

// aqui vamos usar o createButton para criar esses botões com ícones e textos apropriados.
    this.buttons = {
      changeMicrophone: this.createButton('change', 'fas fa-gear fa-lg', '', this.openMicrophoneModal.bind(this)),
      start: this.createButton('start', 'fa fa-microphone', 'Iniciar Registro', this.startRecording.bind(this)),
      pause: this.createButton('pause', 'fa fa-pause', '', this.pauseRecording.bind(this)),
      finish: this.createButton('finish', 'fa fa-check', 'Finalizar Registro', this.finishRecording.bind(this)),
      resume: this.createButton('resume', 'fa fa-circle', 'Continuar Registro', this.resumeRecording.bind(this)),
      download: this.createButton('download', 'fa fa-download', 'Download', this.downloadRecording.bind(this))
    };

    Object.values(this.buttons).forEach(button => this.recorderBox.appendChild(button));
    // aqui foi construido o modal para a troca de microfones
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
      <p>Escolha o Microfone</p>
      <select id="microphone-select"></select>
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
    this.loadDevices();
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
    if (type === 'download') return 'button-success';
    if (type === 'change') return 'button-change';
    return '';
  }

// aqui foi criado a lógica de alterar os botões de acordo com o status, ex: se for paused o botão de pause e resume vão ser renderizados
  updateButtons() {
    Object.keys(this.buttons).forEach(buttonType => {
      const button = this.buttons[buttonType];

      switch (this.status) {
        case 'waiting':
        case 'authorized':
          buttonType === 'start' || buttonType === 'changeMicrophone' ? button.classList.remove('hidden') : button.classList.add('hidden');
          button.disabled = false;
          break;
        case 'paused':
          buttonType === 'pause' || buttonType === 'resume' ? button.classList.remove('hidden') : button.classList.add('hidden');
          this.canvas.classList.remove('recording');
          if (buttonType === 'pause') {
            button.disabled = true;
          } else {
            button.disabled = false;
          }
          break;
        case 'recording':
          buttonType === 'pause' || buttonType === 'finish' ? button.classList.remove('hidden') : button.classList.add('hidden');
          this.canvas.classList.add('recording');
          button.disabled = false;
          break;
        case 'finished':
          buttonType === 'download' ? button.classList.remove('hidden') : button.classList.add('hidden');
          button.disabled = false;
          break;
      }
    });
  }

// aqui nesse ele manipula os microfones
  async loadDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(device => device.kind === 'audioinput');
      // aqui ele seleciona o microfone
      const select = this.modal.querySelector('#microphone-select');
      select.innerHTML = '';
      this.devices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.textContent = device.label || `Microfone ${device.deviceId}`;
        select.appendChild(option);
      });
      // adiciona o evento para ouvir caso mude e seta para o novo
      select.addEventListener('change', () => {
        this.currentDeviceId = select.value;
      });
      // lógica para fechar o modal
      const closeModal = this.modal.querySelector('#close-modal');
      closeModal.addEventListener('click', () => {
        this.closeMicrophoneModal();
      });
    } catch (error) {
      console.error('Erro ao carregar dispositivos:', error);
    }
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

      this.gainNode.connect(this.audioContext.createBufferSource().context.destination);

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => this.handleDataAvailable(event);
      this.status = 'recording';
      this.mediaRecorder.onstop = () => this.handleStop();
      this.mediaRecorder.start();
      this.updateButtons();
      this.setupVisualizer(this.analyser, dataArray, bufferLength);
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
      this.statusText.textContent = 'Erro ao acessar o microfone';
      this.status = 'waiting';
      this.updateButtons();
    }
  }

  setupVisualizer(analyser, dataArray, bufferLength) {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');

    // Definições com base nos parâmetros fornecidos
    const canvWidth = 250; // Largura do canvas
    const canvHeight = 50; // Altura do canvas
    const lineWidth = 0.5; // Largura das linhas
    const frequLnum = 50;  // Número total de barras
    const middleOut = true; // Desenhar do meio para fora
    const minBarHeight = 2; // Altura mínima das barras

    // Atualiza o canvas para as novas dimensões
    canvas.width = canvWidth;
    canvas.height = canvHeight;

    const barWidth = canvWidth / frequLnum; // Largura de cada barra
    const centerX = canvWidth / 2; // Ponto central no eixo X

    const draw = () => {
        if (this.status === 'recording' || this.status === 'resume') {
            requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvWidth, canvHeight);

            // Define a cor de fundo
            const backgroundColor = '#FFF';
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvWidth, canvHeight);

            // Define a cor das barras
            const barColor = '#F43F5E';
            ctx.strokeStyle = barColor;
            ctx.lineWidth = lineWidth;

            const h = canvHeight;

            // Desenha as barras com intensidade maior no centro e menor nas laterais
            for (let i = 0; i < frequLnum; i++) {
                // Normaliza o índice para um intervalo de -1 a 1
                const normalizedIndex = i / (frequLnum - 1) * 2 - 1;
                const xOffset = normalizedIndex * (canvWidth / 2); // Deslocamento horizontal das barras
                const distanceFromCenter = Math.abs(normalizedIndex); // Distância do centro
                const intensity = 1 - distanceFromCenter; // Intensidade menor nas laterais
                const barHeight = Math.max(dataArray[i] * intensity, minBarHeight); // Ajusta a altura da barra
                const space = (h - barHeight) / 2 + 2; // Espaço para os "caps" das barras

                // Desenha barras à direita do centro
                ctx.beginPath();
                ctx.moveTo(centerX + xOffset, space);
                ctx.lineTo(centerX + xOffset, h - space);
                ctx.stroke();

                // Desenha barras à esquerda do centro
                if (i > 0) {
                    ctx.beginPath();
                    ctx.moveTo(centerX - xOffset, space);
                    ctx.lineTo(centerX - xOffset, h - space);
                    ctx.stroke();
                }
            }
        } else if (this.status === 'paused') {
            requestAnimationFrame(draw);

            ctx.clearRect(0, 0, canvWidth, canvHeight);

            // Define a cor de fundo
            const backgroundColor = '#FFF';
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvWidth, canvHeight);

            // Define a cor da linha pontilhada
            const dashLineColor = '#009CB1';
            ctx.strokeStyle = dashLineColor;
            ctx.lineWidth = lineWidth;
            ctx.setLineDash([3, 5]); // Define a linha pontilhada

            const h = canvHeight;
            const centerY = canvHeight / 2;

            // Desenha uma linha horizontal pontilhada no centro
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvWidth, centerY);
            ctx.stroke();

            // Reseta a linha pontilhada para garantir que não afete outras partes do desenho
            ctx.setLineDash([]);
        }
        else if (this.status === 'paused') {
          requestAnimationFrame(draw);

          ctx.clearRect(0, 0, canvWidth, canvHeight);

          const backgroundColor = '#FFF';
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvWidth, canvHeight);

          const dashLineColor = '#009CB1';
          ctx.strokeStyle = dashLineColor;
          ctx.lineWidth = lineWidth;
          ctx.setLineDash([3, 5]);

          const h = canvHeight;
          const centerY = canvHeight / 2;
          ctx.beginPath();
          ctx.moveTo(0, centerY);
          ctx.lineTo(canvWidth, centerY);
          ctx.stroke();
          ctx.setLineDash([]);
      }
        else {
            ctx.clearRect(0, 0, canvWidth, canvHeight);
        }
    };

    draw();
}



  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.status = 'paused';

      if (this.gainNode) {
        this.gainNode.gain.value = 0;
      }
      this.updateButtons();
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.status = 'recording';

      if (this.gainNode) {
        this.gainNode.gain.value = 1;
      }

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
