export async function uploadAudio(audioBlob) {
  const url = 'NÃO TEMOS';

  const base64Audio = await blobToBase64(audioBlob);

  const requestBody = {
      id: '123',
      token: '123',
      provide_id: '4,5,6',
      audio: base64Audio
  };

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
      });

      if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Resposta da API:', jsonResponse);
      } else {
          console.error('Erro na requisição:', response.status, response.statusText);
      }
  } catch (error) {
      console.error('Erro ao enviar o áudio:', error);
  }
}

// Função para converter Blob em base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}
