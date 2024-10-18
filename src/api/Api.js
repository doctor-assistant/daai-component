export async function uploadAudio(
  audioBlob,
  apikey,
  onError,
  onSuccess,
  specialty
) {
  const url =
    'https://apim.doctorassistant.ai/api/sandbox/integration/consultations';

  const formData = new FormData();
  formData.append('recording', audioBlob);
  formData.append('specialty', specialty);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-daai-api-key': apikey,
      },
      body: formData,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      if (typeof onSuccess === 'function') {
        onSuccess(jsonResponse);
      }
    } else {
      if (typeof onSuccess === 'function') {
        onSuccess('erro na requisição');
      }
      console.error(
        'Erro na requisição:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Erro ao enviar o áudio:', error);
    if (typeof onSuccess === 'function') {
      onError('erro na requisição', error);
    }
  }
}
