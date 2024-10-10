export const db = new Dexie('DexieAudio');
db.version(1).stores({
  audios: '++', // Primary key and indexed props
});
