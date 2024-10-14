export async function uploadAudio(audioBlob, apikey, onError, onSuccess) {
  const url =
    'https://apim.doctorassistant.ai/api/sandbox/integration/consultations';
  console.log('api api');
  console.log(apikey, 'apikey');
  console.log(onError, 'onError');
  console.log(onSuccess, 'onSuccess');

  const formData = new FormData();
  formData.append('recording', audioBlob);

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
      onSuccess;
      console.log(onSuccess, 'sucesso na api');
      console.log('Resposta da API:', jsonResponse);
    } else {
      console.log(onSuccess, 'erro na api');
      onError;
      console.error(
        'Erro na requisição:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Erro ao enviar o áudio:', error);
  }
}
