export async function uploadExams(Files, apikey) {
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
  } catch (error) {
    console.error('Erro ao enviar o arquivo:', error);
  }
}
