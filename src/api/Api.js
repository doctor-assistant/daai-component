export async function uploadAudio(audioBlob, apikey) {
  const url = '/';
  console.log('api api');
  console.log(apikey, 'apikey');

  const formData = new FormData();
  formData.append('file', audioBlob);

  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        apikey,
      },
      body: formData,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      if (component.onSuccess) component.onSuccess(jsonResponse);
      console.log('Resposta da API:', jsonResponse);
    } else {
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
