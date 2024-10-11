export async function uploadAudio(audioBlob, apikey, onError, onSuccess) {
  const url =
    'https://apim.doctorassistant.ai/api/sandbox/integration/consultations';
  console.log('api api');
  console.log(apikey, 'apikey');

  const formData = new FormData();
  formData.append('recording', audioBlob);

  try {
    const response = await fetch(url, {
      method: 'POST',
      // mode: 'no-cors',
      // redirect: 'follow',
      headers: {
        'x-daai-api-key': apikey,
      },
      body: formData,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      // onSuccess(jsonResponse);
      console.log('Resposta da API:', jsonResponse);
    } else {
      // onError();
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
