export async function uploadExams(Files, modeApi) {
  const url = 'https://apim.doctorassistant.ai/api/exams/perform_ocr_on_file';
  const apikey = '';
  console.log(Files, 'Files');

  const formData = new FormData();
  formData.append('file', Files);

  console.log(formData, 'formData');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-daai-api-key': apikey,
      },
      body: formData,
    });

    console.log(response, 'response');
  } catch (error) {
    console.error('Erro ao enviar o arquivo:', error);
  }
}
