export class Recorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.isPaused = false;
    this.recordedAudio = null;
    this.recordingTime = 0;
    this.intervalId = null;
    this.audioStream = null;
    this.visualizationStream = null;
    this.audioBlob = null;
    this.micDeviceId = "";
    this.onTimeUpdate = null;
  }

  setMicDevice(deviceId) {
    this.micDeviceId = deviceId;
  }

  setTimeUpdateCallback(callback) {
    this.onTimeUpdate = callback;
  }

  async startRecording() {
    await this.startVisuStream();
    this.audioStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: this.micDeviceId } },
    });

    this.mediaRecorder = new MediaRecorder(this.audioStream);
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstart = () => {
      this.isRecording = true;
      this.recordingTime = 0;
      this.intervalId = setInterval(() => {
        this.recordingTime++;
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.getFormattedRecordingTime());
        }
      }, 1000);
    };

    this.mediaRecorder.onstop = () => {
      clearInterval(this.intervalId);
      this.isRecording = false;
      this.isPaused = false;
      this.audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
      this.recordedAudio = URL.createObjectURL(this.audioBlob);
      this.audioChunks = [];

      this.audioStream.getTracks().forEach((track) => track.stop());
      this.stopVisuStream();
    };

    this.mediaRecorder.start();
  }

  async startVisuStream() {
    this.visualizationStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: this.micDeviceId } },
    });
  }

  stopVisuStream() {
    this.visualizationStream.getTracks().forEach((track) => track.stop());
  }

  togglePauseResume() {
    if (this.mediaRecorder) {
      console.log(this.mediaRecorder.state)
      if (this.mediaRecorder.state === "recording") {
        this.mediaRecorder.pause();
        this.isPaused = true;
        clearInterval(this.intervalId);
        this.stopVisuStream();
      } else if (this.mediaRecorder.state === "paused") {
        this.startVisuStream();
        this.mediaRecorder.resume();
        this.isPaused = false;
        this.intervalId = setInterval(() => {
          this.recordingTime++;
          if (this.onTimeUpdate) {
          this.onTimeUpdate(this.getFormattedRecordingTime());
        }
        }, 1000);
      }
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  getFormattedRecordingTime() {
    // const hours = String(Math.floor(this.recordingTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((this.recordingTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(this.recordingTime % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  getIsRecording() {
    return this.isRecording;
  }

  getIsPaused() {
    return this.isPaused;
  }

  getAudioBlob() {
    return this.audioBlob;
  }

  getVisualizationStream() {
    return this.visualizationStream;
  }
}
