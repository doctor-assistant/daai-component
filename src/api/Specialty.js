export async function getSpecialty(context) {
  const url = 'https://apim.doctorassistant.ai/api/specialties';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.ok) {
      const jsonResponse = await response.json();

      const select = context.specialtyModal.querySelector('#specialty-select');
      select.innerHTML = '';

      const itens = Object.entries(jsonResponse.specialties ?? {}).map(
        ([specialty, { title }]) => {
          const option = document.createElement('option');
          option.value = specialty;
          option.textContent = title;
          console.log(option, 'itens');
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
