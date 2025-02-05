import { uploadAudio } from '../api/Api.js';
import {
  StartAnimationMicTest,
  StartAnimationRecording,
} from './Animations.js';
import { blockPageReload } from './BlockPageReload.js';
import { getFormattedRecordingTime } from './Clock.js';
import { deleteAllAudios, professionalDb } from './IndexDb.js';

export async function captureVideoAudio(videoElement) {
  if (!this.audioContext) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  try {
    if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
      throw new Error('Elemento de vídeo inválido');
    }

    if (this.isCapturingVideoAudio) {
      await this.stopVideoAudioCapture();
    }

    this.videoElement = videoElement;
    this.videoAudioNode = this.audioContext.createMediaElementSource(videoElement);
    
    if (this.gainNode) {
      this.videoAudioNode.connect(this.gainNode);
    } else {
      this.videoAudioNode.connect(this.audioContext.destination);
    }
    
    this.isCapturingVideoAudio = true;
    
    this.dispatchEvent(
      new CustomEvent('interface', {
        bubbles: true,
        detail: {
          videoAudioCapture: true,
        },
      })
    );
  } catch (error) {
    console.error('Erro ao capturar áudio do vídeo:', error);
    await this.stopVideoAudioCapture();
    throw new Error(`Falha ao capturar áudio do vídeo: ${error.message}`);
  }
}

export async function stopVideoAudioCapture() {
  try {
    if (this.videoAudioNode) {
      this.videoAudioNode.disconnect();
      this.videoAudioNode = null;
    }
    
    if (this.videoElement) {
      this.videoElement = null;
    }
    
    this.isCapturingVideoAudio = false;
    
    this.dispatchEvent(
      new CustomEvent('interface', {
        bubbles: true,
        detail: {
          videoAudioCapture: false,
        },
      })
    );
  } catch (error) {
    console.error('Erro ao parar captura de áudio do vídeo:', error);
    throw new Error(`Falha ao parar captura de áudio do vídeo: ${error.message}`);
  }
}

export async function startRecording() {
  blockPageReload();
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }

  this.recordingTime = 0;
  this.timerElement.innerText = getFormattedRecordingTime(this.recordingTime);

  try {
    professionalDb.professional_info.add({
      professionalId: this.professionalId,
      specialty: this.specialty,
    });

    let constraints;
    
    if (this.telemedicine && !this.videoElement) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true 
        });
        
        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length > 0) {
          this.displayAudioStream = displayStream;
        }
      } catch (error) {
        console.error('Erro ao capturar áudio da tela:', error);
      }
    }
    
    constraints = {
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
    const micSource = this.audioContext.createMediaStreamSource(this.stream);

    // Configura o analisador para a visualização de áudio
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Cria um nó de ganho e ajusta o ganho para 0 para evitar a reprodução
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    // Cria o nó de mixagem
    this.mixerNode = this.audioContext.createGain();
    micSource.connect(this.mixerNode);
    
    // Conecta o áudio do vídeo se estiver capturando
    if (this.isCapturingVideoAudio && this.videoAudioNode) {
      this.videoAudioNode.connect(this.mixerNode);
    } else if (this.displayAudioStream) {
      const displaySource = this.audioContext.createMediaStreamSource(this.displayAudioStream);
      displaySource.connect(this.mixerNode);
    }

    // Conecta os nós de áudio
    this.mixerNode.connect(this.analyser);
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

    this.dispatchEvent(
      new CustomEvent('interface', {
        bubbles: true,
        detail: {
          record: true,
        },
      })
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
    
    if (this.displayAudioStream) {
      this.displayAudioStream.getTracks().forEach(track => track.stop());
      this.displayAudioStream = null;
    }
    
    this.status = 'finished';
    let audioChunks = [];

    // Coleta os chunks de áudio disponíveis.
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

        this.dispatchEvent(
          new CustomEvent('interface', {
            bubbles: true,
            detail: {
              record: false,
            },
          })
        );

        this.statusText.classList.add('text-finish');
        this.statusText.textContent =
          'Aguarde enquanto geramos o Registro final...';
        this.updateButtons();

        await uploadAudio(
          audioBlob,
          this.apiKey,
          this.onSuccess,
          this.onError,
          this.specialty,
          this.modeApi,
          this.metadata,
          this.onEvent,
          this.professionalId
        );

        await professionalDb.audio.add({
          professionalId: this.professionalId,
          audioData: audioBlob,
        });
      } catch (error) {
        console.error('Erro ao salvar ou recuperar áudio no IndexedDB:', error);
      }

      audioChunks.length = 0;

      this.status = 'upload';
      this.statusText.classList.remove('text-finish');
      this.statusText.classList.add('text-upload');
      this.statusText.textContent = 'Registro finalizado!';
      this.recordingTime = 0;
      getFormattedRecordingTime(this.recordingTime);
      this.updateButtons();
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

export function newRecording() {
  this.canvas.classList.remove('hidden');
  this.canvas.className = 'animation-mic-test';
  this.status = 'micTest';
  this.statusText.innerHTML = '';
  this.statusText.className = 'mic-test-text';
  StartAnimationMicTest(this.canvas);
  this.updateButtons();
  deleteAllAudios();
}

export function redirectToSupportPage(url) {
  window.open('https://doctorassistant.ai/tutorial/', '_blank');
}
