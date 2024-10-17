import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.2.3/dist/dexie.mjs';

export const professionalDb = new Dexie('professional');

professionalDb.version(1).stores({
  professional_info: '++id, professionalId, specialty',
  audio: '++id, professionalId, audioData',
});
