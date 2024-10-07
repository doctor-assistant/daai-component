import { getFormattedRecordingTime } from "./Clock.js";

export function finishRecording() {
  if (this.mediaRecorder) {
    this.mediaRecorder.stop();
    this.status = 'finished';
    let audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      // Combina os chunks em um blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      console.log(audioBlob, 'Generated audio blob');

      // Cria uma URL para o blob
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      console.log(audio, 'audio gerado');

      // Conectando ao banco de dados e salvando o áudio
      try {
        const db = await this.useIndexDB('AudioDatabase', 1);
        await this.saveAudioToIndexDB(db, audioBlob);
        console.log('chegouu')
      } catch (error) {
        console.error('Erro ao salvar áudio no IndexedDB:', error);
      }

      this.statusText.classList.add('text-finish');
      this.statusText.textContent = 'Aguarde enquanto geramos o relatório final...';
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
  }}
