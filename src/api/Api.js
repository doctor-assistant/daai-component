export async function uploadAudio(audioBlob, apikey, onSucess, onError) {
  const url = 'NÃO TEMOS';
  const base64Audio = await blobToBase64(audioBlob);
// formData - audio ( recording )
  const requestBody = {
      audio: base64Audio
  };

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              apikey
          },
          body: JSON.stringify(requestBody)
      });

      if (response.ok) {
          const jsonResponse = await response.json();
          // retornar o id da consulta ( alguns dados )
          onSucess()
          console.log('Resposta da API:', jsonResponse);
      } else {
         // falar o porque do erro
          onError()
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
