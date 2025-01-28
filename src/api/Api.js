import { EventSourceManager } from '../scripts/sse.js';

export async function uploadAudio(
  audioBlob,
  apikey,
  onSuccess,
  onError,
  specialty,
  modeApi,
  metadata,
  onEvent,
  professionalId
) {
  let eventSourceManager = null;

  const url = `https://apim.doctorassistant.ai/api/${modeApi === 'dev' ? 'sandbox' : 'production'}/consultations`;

  const formData = new FormData();
  formData.append('recording', audioBlob);
  formData.append('specialty', specialty);
  formData.append('metadata', JSON.stringify(metadata));
  formData.append('professionalId', professionalId);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-daai-api-key': apikey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      if (typeof onError === 'function') {
        onError('Erro na requisição', errorResponse);
      }
      return;
    }

    if (response.ok) {
      const jsonResponse = await response.json();
      const consultationId = jsonResponse.id;

      if (typeof onEvent === 'function') {
        const sseUrl = `${url}/${consultationId}/events`;
        eventSourceManager = new EventSourceManager(apikey, sseUrl, onEvent);
        eventSourceManager.connect();
      }

      if (typeof onSuccess === 'function') {
        onSuccess(jsonResponse);
      }
    }
  } catch (error) {
    console.error('Erro ao enviar o áudio:', error);
    if (typeof onError === 'function') {
      onError('erro na requisição', error);
    }
  }
}
