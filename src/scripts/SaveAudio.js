export function useIndexDB(dbName, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onerror = function (event) {
      reject('Erro ao abrir o IndexedDB:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('audioFiles')) {
        db.createObjectStore('audioFiles', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

export function saveAudioToIndexDB(db, audioBlob) {
  return new Promise((resolve, reject) => {
    const numberOfParts = 4;
    const partSize = Math.ceil(audioBlob.size / numberOfParts);
    const audioParts = [];

    for (let i = 0; i < numberOfParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, audioBlob.size);
      const audioPart = audioBlob.slice(start, end);
      audioParts.push(audioPart);
    }

    const transaction = db.transaction(['audioFiles'], 'readwrite');
    const objectStore = transaction.objectStore('audioFiles');

    const deleteOldRecords = new Promise((resolve, reject) => {
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const allRecords = request.result;
        const recordsToDelete = allRecords.slice(-4);

        let deletePromises = recordsToDelete.map((record) => {
          return new Promise((resolve, reject) => {
            const deleteRequest = objectStore.delete(record.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = (event) => reject(event.target.errorCode);
          });
        });

        Promise.all(deletePromises)
          .then(() => {
            console.log('Últimas 4 gravações removidas com sucesso!');
            resolve();
          })
          .catch((error) => {
            console.error('Erro ao remover as últimas 4 gravações:', error);
            reject(error);
          });
      };

      request.onerror = (event) => {
        console.error(
          'Erro ao buscar gravações no IndexedDB:',
          event.target.errorCode
        );
        reject(event.target.errorCode);
      };
    });

    deleteOldRecords
      .then(() => {
        let savePromises = [];

        audioParts.forEach((part, index) => {
          const audioData = {
            blob: part,
            date: new Date().toISOString(),
            name: `Audio-Part-${index + 1}-${new Date().toISOString()}`,
          };

          savePromises.push(
            new Promise((resolve, reject) => {
              const request = objectStore.add(audioData);
              request.onsuccess = () => {
                console.log(
                  `Parte ${index + 1} do áudio salva no IndexedDB com sucesso!`
                );
                resolve(request.result);
              };
              request.onerror = (event) => {
                console.error(
                  `Erro ao salvar a parte ${index + 1} do áudio no IndexedDB:`,
                  event.target.errorCode
                );
                reject(event.target.errorCode);
              };
            })
          );
        });

        return Promise.all(savePromises);
      })
      .then(() => {
        console.log(
          'Todas as partes do áudio foram salvas no IndexedDB com sucesso!'
        );
        resolve();
      })
      .catch((error) => {
        console.error('Erro ao salvar as partes do áudio no IndexedDB:', error);
        reject(error);
      });
  });
}

export function getAudioFromIndexDB(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audioFiles'], 'readonly');
    const objectStore = transaction.objectStore('audioFiles');
    const request = objectStore.getAll();

    request.onsuccess = () => {
      const allAudioFiles = request.result;

      if (allAudioFiles.length === 0) {
        console.log('Nenhuma gravação encontrada no IndexedDB.');
        resolve([]);
        return;
      }

      const groupedByDate = allAudioFiles.reduce((acc, record) => {
        const dateKey = record.date.split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(record);
        return acc;
      }, {});

      const combinedAudios = Object.values(groupedByDate).map((audioParts) => {
        audioParts.sort((a, b) => a.name.localeCompare(b.name));

        const combinedBlob = new Blob(
          audioParts.map((part) => part.blob),
          { type: 'audio/webm' }
        );

        return {
          id: audioParts[0].id,
          name: `Combined-Audio-${audioParts[0].date}`,
          date: audioParts[0].date,
          blob: combinedBlob,
          url: URL.createObjectURL(combinedBlob),
        };
      });

      resolve(combinedAudios);
    };

    request.onerror = (event) => {
      console.error(
        'Erro ao buscar gravações no IndexedDB:',
        event.target.errorCode
      );
      reject(event.target.errorCode);
    };
  });
}
