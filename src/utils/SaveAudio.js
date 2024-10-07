export function useIndexDB(dbName, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onerror = function(event) {
      reject('Erro ao abrir o IndexedDB:', event.target.errorCode);
};

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      // Criação de um object store (se ainda não existir)
      if (!db.objectStoreNames.contains('audioFiles')) {
        db.createObjectStore('audioFiles', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export function saveAudioToIndexDB(db, audioBlob) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audioFiles'], 'readwrite');
    const objectStore = transaction.objectStore('audioFiles');

    const audioData = {
      blob: audioBlob,
      date: new Date().toISOString(),
      name: `Audio-${new Date().toISOString()}`
    };

    const request = objectStore.add(audioData);

    request.onsuccess = () => {
      console.log('Áudio salvo no IndexedDB com sucesso!');
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error('Erro ao salvar o áudio no IndexedDB:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}
