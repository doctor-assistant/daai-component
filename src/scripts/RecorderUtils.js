import { uploadAudio } from '../api/Api.js';
import { StartAnimationRecording } from './Animations.js';
import { blockPageReload } from './BlockPageReload.js';
import { getFormattedRecordingTime } from './Clock.js';
import { professionalDb } from './IndexDb.js';

export async function startRecording() {
  blockPageReload();
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }

  this.recordingTime = 0;
  this.timerElement.innerText = getFormattedRecordingTime(this.recordingTime);

  try {
    await professionalDb.professional_info.add({
      professionalId: this.professionalId,
      specialty: this.specialty,
    });
    const constraints = {
      audio: {
        deviceId: this.currentDeviceId
          ? { exact: this.currentDeviceId }
          : undefined,
      },
    };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    // Cria a fonte de áudio a partir do stream
    const source = this.audioContext.createMediaStreamSource(this.stream);

    // Configura o analisador para a visualização de áudio
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Cria um nó de ganho e ajusta o ganho para 0 para evitar a reprodução
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    source.connect(this.analyser);
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // Inicializa o MediaRecorder para gravar o áudio
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = (event) =>
      this.handleDataAvailable(event);
    this.status = 'recording';

    this.mediaRecorder.onstop = () => this.handleStop();
    this.mediaRecorder.onstart = () => {
      this.statusText.textContent = '';
      this.recordingTime = 0;

      // Inicia o contador
      this.intervalId = setInterval(() => {
        this.recordingTime++;
        this.timerElement.innerText = getFormattedRecordingTime(
          this.recordingTime
        );
      }, 1000);
    };

    this.mediaRecorder.start();

    // Verifica se o canvas está presente para a visualização
    if (!this.canvas) {
      console.error('Canvas não encontrado!');
      return;
    }

    // Adiciona uma classe ao canvas para a visualização
    this.canvas.className = 'audio-visualizer';
    this.updateButtons();

    // Obtém as cores de animação
    const animationRecordingColor = this.getAttribute(
      'animation-recording-color'
    );
    const animationPausedColor = this.getAttribute('animation-paused-color');

    // Inicia a animação de gravação com as cores definidas
    StartAnimationRecording(
      this.analyser,
      dataArray,
      bufferLength,
      this.canvas,
      this.status,
      animationRecordingColor,
      animationPausedColor
    );
  } catch (error) {
    console.error('Erro ao acessar o microfone:', error);
    this.statusText.textContent = 'Erro ao acessar o microfone';
    this.status = 'waiting';
    this.updateButtons();
  }
}

export function pauseRecording() {
  if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
    this.mediaRecorder.pause();
    this.status = 'paused';

    clearInterval(this.intervalId);

    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }

    const animationRecordingColor = this.getAttribute(
      'animation-recording-color'
    );
    const animationPausedColor = this.getAttribute('animation-paused-color');

    StartAnimationRecording(
      this.analyser,
      new Uint8Array(this.analyser.frequencyBinCount),
      this.analyser.frequencyBinCount,
      this.canvas,
      this.status,
      animationRecordingColor,
      animationPausedColor
    );

    this.updateButtons();
  }
}

export function finishRecording() {
  if (this.mediaRecorder) {
    this.mediaRecorder.stop();
    this.status = 'finished';
    let audioChunks = [];

    console.log('apiKey', this.apikey);
    console.log('professionalId', this.professionalId);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      // Combina os chunks em um blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      console.log(audioBlob, 'Generated audio blob');
      await professionalDb.audio.add({
        professionalId: this.professionalId,
        audio: audioBlob,
      });

      // Cria uma URL para o blob e reproduz o áudio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      console.log(audio, 'audio gerado');

      try {
        uploadAudio(audioBlob, this.apiKey, this.onSuccess, this.onError);
      } catch (error) {
        console.error('Erro ao salvar ou recuperar áudio no IndexedDB:', error);
      }

      // Atualização de status da interface e botões
      this.statusText.classList.add('text-finish');
      this.statusText.textContent =
        'Aguarde enquanto geramos o relatório final...';
      this.updateButtons();

      setTimeout(() => {
        this.status = 'upload';
        this.statusText.classList.remove('text-finish');
        this.statusText.classList.add('text-upload');
        this.statusText.textContent = 'Relatório finalizado!';
        this.recordingTime = 0;
        getFormattedRecordingTime(this.recordingTime);
        this.updateButtons();
      }, 10000);
    };
  }
}

export function resumeRecording() {
  if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
    this.mediaRecorder.resume();
    this.status = 'recording';

    // Reinicia o timer
    this.intervalId = setInterval(() => {
      this.recordingTime++;
      this.timerElement.innerText = getFormattedRecordingTime(
        this.recordingTime
      );
    }, 1000);

    // Mantém o ganho em 0 para não reproduzir o áudio
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }

    const animationRecordingColor = this.getAttribute(
      'animation-recording-color'
    );
    const animationPausedColor = this.getAttribute('animation-paused-color');

    StartAnimationRecording(
      this.analyser,
      new Uint8Array(this.analyser.frequencyBinCount),
      this.analyser.frequencyBinCount,
      this.canvas,
      this.status,
      animationRecordingColor,
      animationPausedColor
    );
    this.updateButtons();
  }
}