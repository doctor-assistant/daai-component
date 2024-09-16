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
    this.status = 'initial';
    this.devices = [];
    this.currentDeviceId = null;

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
         color:#F43F5E;
         font-weight: bold;
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
      text-color:'#F43F5E'
    }

    .animation-mic-test{
      width:130px;
      margin-top:40px;
    }

    <div class="container">
      <div class="recorder-box">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAmCAYAAADTGStiAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAITSURBVHgB1ZdfTttAEMa/2fQA3ADfoOkN/F4JxScgKbRSn0pPEDhB6SukCj2Bm0p9rjkB6QkabhDekCA7zGxQICg46/U6iJ/keGNN/Hn+egO8Sn7kXQxGuwjgDUIY5luYtYZg7txf+YmKVBce5gms+QtwghqYStYnEtqZuQAjQU38PR6MjuXzCyKxXlhDq/kEp4hIufBJ3pZ85nXzuYrnc3z6+wAmTj79hVWU+BsaZHWoeVaA6Axe0BgB0GKlQ+EWbTTNx6x4EN5AaB8xgbUZzdvF/MdGocJIeBNsHE6rjcyIeApzIceZVMQkjp3XrJYb7Xd6bjmvhwtZbYXbzfHwmIrFspdNlr6X25X2t4fwo5eD9jpx28MuEbsEJRBO8xSkL/ZScckbaf+dw7R2ZefRfWIwleMQZK/El21Zd9fNeM/3MemN5CQBsnwkApms38oDJC6kbP+BWn2wSeFJ9a0Poe8yxJpTGXykITYJ3JP5E7bZc9zntJregpcaIFMjPmvZT7FReGyk50TU9nymTSTRAjfco6Vrgz/baJr995d6IoTgRiL1vWxJ0mikBV1kHwiraovU9bYPLMLX/B1P6qjpqp7gxr7DZ53dyzQoTL/QWi2q1BggZZoyt/d2jspMYgtLIVEHH3bO1xnGDPXY5dNDVInjMfEx9jpfq/ykrsfaIgdVRZUwjw0K6eVDzOwIn7KgvzB3l1a49sinti4AAAAASUVORK5CYII=" alt="daai-logo">
        <canvas class="audio-hide" id="audioCanvas"></canvas>
        <button class="button button-change" id="change-microphone" aria-label="Change Microphone"></button>
        <button class="button button-primary" id="start-recording">Iniciar Registro</button>
        <button class="button button-pause hidden" id="pause-recording">Pausar Registro</button>
        <button class="button button-recording hidden" id="finish-recording">Finalizar Registro</button>
        <button class="button button-resume hidden" id="resume-recording">Continuar Registro</button>
        <button class="button button-success hidden" id="download-recording">Download</button>
      </div>
    </div>
    <div class="modal" id="microphone-modal">
      <p>Escolha o Microfone</p>
      <select id="microphone-select"></select>
      <button id="close-modal" class="close-button">Fechar</button>
    </div>
    <div class="backdrop"></div>
  `;


    const container = document.createElement('div');
    container.className = 'container';

    this.recorderBox = document.createElement('div');
    this.recorderBox.className = 'recorder-box';

    const logo = document.createElement('img');
    logo.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAmCAYAAADTGStiAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAITSURBVHgB1ZdfTttAEMa/2fQA3ADfoOkN/F4JxScgKbRSn0pPEDhB6SukCj2Bm0p9rjkB6QkabhDekCA7zGxQICg46/U6iJ/keGNN/Hn+egO8Sn7kXQxGuwjgDUIY5luYtYZg7txf+YmKVBce5gms+QtwghqYStYnEtqZuQAjQU38PR6MjuXzCyKxXlhDq/kEp4hIufBJ3pZ85nXzuYrnc3z6+wAmTj79hVWU+BsaZHWoeVaA6Axe0BgB0GKlQ+EWbTTNx6x4EN5AaB8xgbUZzdvF/MdGocJIeBNsHE6rjcyIeApzIceZVMQkjp3XrJYb7Xd6bjmvhwtZbYXbzfHwmIrFspdNlr6X25X2t4fwo5eD9jpx28MuEbsEJRBO8xSkL/ZScckbaf+dw7R2ZefRfWIwleMQZK/El21Zd9fNeM/3MemN5CQBsnwkApms38oDJC6kbP+BWn2wSeFJ9a0Poe8yxJpTGXykITYJ3JP5E7bZc9zntJregpcaIFMjPmvZT7FReGyk50TU9nymTSTRAjfco6Vrgz/baJr995d6IoTgRiL1vWxJ0mikBV1kHwiraovU9bYPLMLX/B1P6qjpqp7gxr7DZ53dyzQoTL/QWi2q1BggZZoyt/d2jspMYgtLIVEHH3bO1xnGDPXY5dNDVInjMfEx9jpfq/ykrsfaIgdVRZUwjw0K6eVDzOwIn7KgvzB3l1a49sinti4AAAAASUVORK5CYII=';
    logo.alt = 'daai-logo';
    this.recorderBox.appendChild(logo);

    this.status = 'waiting';
     this.statusText = document.createElement('span');
     this.statusText.textContent = 'Aguardando autorização do microfone...';
     this.recorderBox.appendChild(this.statusText);

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'audio-hide';
      this.recorderBox.appendChild(this.canvas);

      // createText(type, iconClass, text) {
      //   const textElement = document.createElement('p');
      //   textElement.className = `text-${type}`;
      //   textElement.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${text}`;
      //   return textElement;
      // }


      this.textContent = {
        pause: this.createText('recording', '', 'Pausar Registro'),
        start: this.createText('recording', '', 'Iniciar Registro'),
        finish: this.createText('recording', '', 'Aguarde enquanto geramos o relatório final...'),
        resume: this.createText('resume', '', 'Continuar Registro'),
        upload: this.createText('upload', 'fa-regular fa-circle-check', 'Relatório finalizado!')
      };

      // Adiciona os elementos ao Shadow DOM
      // Object.values(this.textContent).forEach(element => {
      //   this.shadowRoot.appendChild(element);
      // });


// aqui vamos usar o createButton para criar esses botões com ícones e textos apropriados.
    this.buttons = {
      changeMicrophone: this.createButton('change', 'fas fa-gear fa-lg', '', this.openMicrophoneModal.bind(this)),
      pause: this.createButton('pause', 'fa fa-pause', '', this.pauseRecording.bind(this)),
      start: this.createButton('start', 'fa fa-microphone', 'Iniciar Registro', this.startRecording.bind(this)),
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
    this.checkMicrophonePermissions()
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

  connectedCallback() {
    this.checkMicrophonePermissions();
  }

  async checkMicrophonePermissions() {
    try {
      // Verificar o estado da permissão do microfone
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });

      // Certifique-se de que o statusText e o canvas são válidos
      if (!this.statusText || !this.canvas) {
        console.error('Elementos necessários não encontrados no DOM.');
        return;
      }

      // Se a permissão for concedida, atualizar o status para 'micTest'
      if (permissionStatus.state === 'granted') {
        this.status = 'micTest';
        this.statusText.textContent = 'Microfone';
        this.canvas.classList.remove('hidden');
        this.canvas.className = 'animation-mic-test';
        this.startAudioVisualizer();
      } else {
        this.status = 'waiting';
        this.statusText.textContent = 'Aguardando autorização do microfone';
        this.statusText.classList.remove('text-primary');
        this.statusText.classList.add('text-waiting-mic-aprove');
        this.canvas.classList.add('hidden');
      }

      this.updateButtons();

      permissionStatus.onchange = () => {
        if (permissionStatus.state === 'granted') {
          this.status = 'micTest';
          this.statusText.textContent = 'microfone.';
          this.canvas.classList.remove('hidden');
          this.startAudioVisualizer();
        } else {
          this.status = 'waiting';
          this.statusText.textContent = 'Aguardando autorização do microfone';
          this.statusText.classList.remove('text-primary');
          this.statusText.classList.add('text-waiting-mic-aprove');
          this.canvas.classList.add('hidden'); // Ocultar o canvas
        }
        this.updateButtons();
      };
    } catch (error) {
      console.error('Erro ao verificar permissões do microfone:', error);
      if (this.statusText) {
        this.statusText.textContent = 'Erro ao verificar permissões do microfone';
      }
    }
  }

  async startAudioVisualizer() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      if (!this.canvas) {
        console.error('Canvas não encontrado!');
        return;
      }

      const canvasCtx = this.canvas.getContext('2d');
      const WIDTH = this.canvas.width;
      const HEIGHT = 50;

      // Conectar o Analyser ao destination do contexto de áudio
      source.connect(analyser);

      const draw = () => {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);


        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const barWidth = 20;
        const barSpacing = 12;
        let barHeight;
        const numberOfBars = 6;
        const totalWidth = numberOfBars * barWidth + (numberOfBars - 1) * barSpacing;
        let x = (WIDTH - totalWidth) / 2;

        for (let i = 0; i < numberOfBars; i++) {
          barHeight = dataArray[i];

          canvasCtx.fillStyle = '#DFE4EA';
          canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

          x += barWidth + barSpacing;
        }
      };

      draw();
    } catch (error) {
      console.error('Erro ao capturar o áudio:', error);
    }
}

// aqui foi criado a lógica de alterar os botões de acordo com o status, ex: se for paused o botão de pause e resume vão ser renderizados
updateButtons() {
  Object.keys(this.buttons).forEach(buttonType => {
    const button = this.buttons[buttonType];
    if (this.status === 'finished') {
      this.canvas.classList.add('hidden');
    } else {
      this.canvas.classList.remove('hidden');
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
        this.canvas.className = 'audio-visualizer';
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

  const defaultCanvWidth = 250;
  const defaultCanvHeight = 50;
  const lineWidth = 0.5;
  const frequLnum = 50;
  const minBarHeight = 2;

  const centerX = defaultCanvWidth / 2;

  const draw = () => {
    if (this.status === 'recording' || this.status === 'micTest') {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvas.width = defaultCanvWidth;
      canvas.height = defaultCanvHeight;

      ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const backgroundColor = '#FFF';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const barColor = '#F43F5E';
      ctx.strokeStyle = barColor;
      ctx.lineWidth = lineWidth;

      const h = defaultCanvHeight;

      for (let i = 0; i < frequLnum; i++) {
        const normalizedIndex = i / (frequLnum - 1) * 2 - 1;
        const xOffset = normalizedIndex * (defaultCanvWidth / 2);
        const distanceFromCenter = Math.abs(normalizedIndex);
        const intensity = 1 - distanceFromCenter;
        const barHeight = Math.max(dataArray[i] * intensity, minBarHeight);
        const space = (h - barHeight) / 2 + 2;

        ctx.beginPath();
        ctx.moveTo(centerX + xOffset, space);
        ctx.lineTo(centerX + xOffset, h - space);
        ctx.stroke();

        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(centerX - xOffset, space);
          ctx.lineTo(centerX - xOffset, h - space);
          ctx.stroke();
        }
      }
    } else if (this.status === 'paused') {
      requestAnimationFrame(draw);

      ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const backgroundColor = '#FFF';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const dashLineColor = '#009CB1';
      ctx.strokeStyle = dashLineColor;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([3, 5]);

      const h = defaultCanvHeight;
      const centerY = defaultCanvHeight / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(defaultCanvWidth, centerY);
      ctx.stroke();

      ctx.setLineDash([]);
    } else {
      canvas.width = 0;
      canvas.height = 0;
    }
  };

  if (this.status === 'waiting' || this.status === 'finished') {
    canvas.classList.add('hidden');
  } else {
    canvas.classList.remove('hidden');
    draw();
  }
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
