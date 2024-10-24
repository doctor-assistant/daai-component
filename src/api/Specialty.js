import { saveSpecialties } from '../scripts/IndexDb.js';

export async function getSpecialtyApi() {
  const url = 'https://apim.doctorassistant.ai/api/specialties';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      console.error(
        'Erro na requisição:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Erro ao carregar as especialidades', error);
  }
}

export async function getSpecialty(context) {
  try {
    const jsonResponse = await getSpecialtyApi();
    const select = context.specialtyModal.querySelector('#specialty-select');
    select.innerHTML = '';
    const specialty = jsonResponse.specialties;

    saveSpecialties(specialty);

    const itens = Object.entries(jsonResponse.specialties ?? {}).map(
      ([specialty, { title }]) => {
        const option = document.createElement('option');
        option.value = specialty;
        option.textContent = title;
        return option;
      }
    );

    itens.forEach((option) => select.appendChild(option));
    select.addEventListener('change', () => {
      const selectedKey = select.value;
      context.specialty = selectedKey;
    });

    const closeModal = context.specialtyModal.querySelector(
      '#close-specialty-modal'
    );
    closeModal.addEventListener('click', () => context.closeSpecialtyModal());
  } catch (error) {
    console.error('Erro ao carregar as especialidades', error);
  }
}
