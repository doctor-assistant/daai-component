export async function getSpecialty(apikey, context) {
  const url = 'https://apim.doctorassistant.ai/api/specialties';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-daai-api-key': apikey,
      },
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
          return option;
        }
      );

      itens.forEach((option) => select.appendChild(option));
      select.addEventListener('change', () => {
        const selectedKey = select.value;
        const selectedOption = select.options[select.selectedIndex].textContent;
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
