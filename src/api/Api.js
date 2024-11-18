export async function uploadAudio(
  audioBlob,
  apikey,
  onSuccess,
  onError,
  specialty,
  modeApi,
  metadata
) {
  const url =
    modeApi === 'dev'
      ? 'https://apim.doctorassistant.ai/api/sandbox/consultations'
      : 'https://apim.doctorassistant.ai/api/production/consultations';

  const formData = new FormData();
  formData.append('recording', audioBlob);
  formData.append('specialty', specialty);
  formData.append('metadata', JSON.stringify(metadata));

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
