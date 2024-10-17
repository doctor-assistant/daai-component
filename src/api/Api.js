export async function uploadAudio(
  audioBlob,
  apikey,
  onError,
  onSuccess,
  speciality
) {
  const url =
    'https://apim.doctorassistant.ai/api/sandbox/integration/consultations';
  console.log('api api');
  console.log(apikey, 'apikey');

  console.log('audio', audioBlob);

  const formData = new FormData();
  formData.append('recording', audioBlob, 'speciality', speciality);

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
      console.log(typeof onSuccess, 'typeof onSuccess');
      if (typeof onSuccess === 'function') {
        onSuccess(jsonResponse);
      }
      console.log('Resposta da API:', jsonResponse);
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
