export async function uploadExams(Files, apikey, onSuccess, onError) {
  const url = 'https://apim.doctorassistant.ai/api/exams/perform_ocr_on_file';

  const formData = new FormData();
  formData.append('file', Files);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-daai-api-key': apikey,
      },
      body: formData,
    });

    if (response) {
      const jsonResponse = await response.json();
      if (typeof onSuccess === 'function') {
        onSuccess(jsonResponse);
      }
    }
  } catch (error) {
    if (typeof onError === 'function') {
      onError('erro na requisição', error);
    }
    console.error('Erro ao enviar o arquivo:', error);
  }
}
