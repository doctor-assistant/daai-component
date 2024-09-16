export async function startRecording() {
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

export function pauseRecording() {
  if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
    this.mediaRecorder.pause();
    this.status = 'paused';

    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
    this.updateButtons();
  }
}

export function resumeRecording() {
  if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
    this.mediaRecorder.resume();
    this.status = 'recording';

    if (this.gainNode) {
      this.gainNode.gain.value = 1;
    }

    this.updateButtons();
  }
}

export function finishRecording() {
  if (this.mediaRecorder) {
    this.mediaRecorder.stop();
    this.status = 'finished';
    this.updateButtons();
  }
}
