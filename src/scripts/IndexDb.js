import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.2.3/dist/dexie.mjs';

export const professionalDb = new Dexie('professional');

professionalDb.version(1).stores({
  professional_info: '++id, professionalId, specialty',
  audio: '++id, professionalId, audioData',
});

export async function deleteAllAudios() {
  try {
    await professionalDb.audio.clear();
  } catch (error) {
    console.error('Erro ao deletar os áudios:', error);
  }
}

export async function getSpecialtyByProfessionalId(professionalId) {
  try {
    const result = await professionalDb.professional_info
      .where('professionalId')
      .equals(professionalId)
      .last();
    return result ? result.specialty : null;
  } catch (error) {
    console.error('Erro ao buscar a especialidade:', error);
    return null;
  }
}

export async function getLastSpecialty() {
  try {
    const result = await professionalDb.professional_info.orderBy('id').last();

    return result ? result.specialty : null;
  } catch (error) {
    console.error('Erro ao buscar a última especialidade:', error);
    return null;
  }
}

const byProfessional = await getSpecialtyByProfessionalId('0.7s499xz3jlk');
console.log(byProfessional, 'byProfessional');

const lastest = await getLastSpecialty('0.7s499xz3jlk');
console.log(lastest, 'lastest');
