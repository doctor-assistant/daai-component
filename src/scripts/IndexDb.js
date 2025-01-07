import Dexie from 'dexie';

export const professionalDb = new Dexie('professional');
export const specialtiesDb = new Dexie('specialties');

professionalDb.version(1).stores({
  professional_info: '++id, professionalId, specialty',
  audio: '++id, professionalId, audioData',
});

specialtiesDb.version(1).stores({
  specialties: 'key,title',
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

export async function saveSpecialties(data) {
  try {
    await specialtiesDb.transaction(
      'rw',
      specialtiesDb.specialties,
      async () => {
        for (const [key, value] of Object.entries(data)) {
          await specialtiesDb.specialties.put({ key, title: value.title });
        }
      }
    );
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
  }
}

export async function getSpecialtyTitle(specialtyKey) {
  try {
    const specialty = await specialtiesDb.specialties.get(specialtyKey);
    if (specialty) {
      return specialty.title;
    }
  } catch (error) {
    console.error('Erro ao buscar a especialidade:', error);
    return null;
  }
}
