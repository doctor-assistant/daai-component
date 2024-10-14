export const professionalDb = new Dexie('professional');

professionalDb.version(1).stores({
  professional_info: '++id, professionalId, specialty',
  audio: '++id, professionalId, audioData',
});
