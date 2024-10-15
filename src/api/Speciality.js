export function chooseSpeciality(context) {
  const mockSpecialtyModels = {
    generic: {
      title: 'SOAP',
      content: {
        patientInformation: {
          title: 'Informações do Paciente',
          content: {
            name: { title: 'Nome', content: [] },
            age: { title: 'Idade', content: [] },
            occupation: { title: 'Profissão', content: [] },
            additionalInformation: {
              title: 'Outras Informações Relevantes',
              content: [],
            },
          },
        },
        historyOfPatient: {
          title: 'Histórico do Paciente',
          content: {
            allergies: { title: 'Alergias', content: [] },
            medications: { title: 'Medicações', content: [] },
            medicalConditions: { title: 'Condições Médicas', content: [] },
            habits: { title: 'Hábitos', content: [] },
          },
        },
        subjective: {
          title: 'Subjetivo',
          content: {
            chiefComplaint: { title: 'Principal Queixa', content: [] },
            historyOfPresentIllness: {
              title: 'História da Doença Atual',
              content: [],
            },
          },
        },
        objective: {
          title: 'Objetivo',
          content: {
            exams: { title: 'Exames', content: [] },
            signs: {
              title: 'Sinais vitais e dados antropométricos',
              content: [],
            },
          },
        },
        assessment: {
          title: 'Avaliação',
          content: { description: { title: 'Avaliação', content: [] } },
        },
        plans: {
          title: 'Planos',
          content: {
            medicationRequest: { title: 'Medicações prescritas', content: [] },
            examRequest: { title: 'Exames solicitados', content: [] },
            followUp: { title: 'Acompanhamento', content: [] },
            forwarding: { title: 'Encaminhamento', content: [] },
            orientations: { title: 'Orientações', content: [] },
          },
        },
      },
    },
    psychiatry: {
      title: 'Psiquiatria',
      content: {
        patientInformation: {
          title: 'Informações do Paciente',
          content: {
            name: { title: 'Nome', content: [] },
            age: { title: 'Idade', content: [] },
            occupation: { title: 'Profissão', content: [] },
            additionalInformation: {
              title: 'Outras Informações Relevantes',
              content: [],
            },
          },
        },
        historyOfPatient: {
          title: 'Histórico do Paciente',
          content: {
            allergies: { title: 'Alergias', content: [] },
            medications: { title: 'Medicações', content: [] },
            medicalConditions: { title: 'Condições Médicas', content: [] },
            habits: { title: 'Hábitos', content: [] },
          },
        },
        subjective: {
          title: 'Subjetivo',
          content: {
            chiefComplaint: { title: 'Principal Queixa', content: [] },
            historyOfPresentIllness: {
              title: 'História da Doença Atual',
              content: [],
            },
          },
        },
        objective: {
          title: 'Objetivo',
          content: {
            exams: { title: 'Exames', content: [] },
            psychicExam: { title: 'Exame psíquico', content: [] },
            signs: {
              title: 'Sinais vitais e dados antropométricos',
              content: [],
            },
          },
        },
        assessment: {
          title: 'Avaliação',
          content: { description: { title: 'Avaliação', content: [] } },
        },
        plans: {
          title: 'Planos',
          content: {
            medicationRequest: { title: 'Medicações prescritas', content: [] },
            examRequest: { title: 'Exames solicitados', content: [] },
            followUp: { title: 'Acompanhamento', content: [] },
            forwarding: { title: 'Encaminhamento', content: [] },
            psychotherapy: { title: 'Psicoterapia', content: [] },
            orientations: { title: 'Orientações', content: [] },
          },
        },
      },
    },
    oncology: {
      title: 'Oncologia',
      content: {
        patientInformation: {
          title: 'Informações do Paciente',
          content: {
            name: { title: 'Nome', content: [] },
            age: { title: 'Idade', content: [] },
            occupation: { title: 'Profissão', content: [] },
            additionalInformation: {
              title: 'Outras Informações Relevantes',
              content: [],
            },
          },
        },
        historyOfPatient: {
          title: 'Histórico do Paciente',
          content: {
            allergies: { title: 'Alergias', content: [] },
            medications: { title: 'Medicações', content: [] },
            medicalConditions: { title: 'Condições Médicas', content: [] },
            habits: { title: 'Hábitos', content: [] },
          },
        },
        subjective: {
          title: 'Subjetivo',
          content: {
            chiefComplaint: { title: 'Principal Queixa', content: [] },
            historyOfPresentIllness: {
              title: 'História da Doença Atual',
              content: [],
            },
          },
        },
        objective: {
          title: 'Objetivo',
          content: {
            physicalExams: { title: 'Exames físicos', content: [] },
            clinicalExams: { title: 'Exames clínicos', content: [] },
            signs: {
              title: 'Sinais vitais e dados antropométricos',
              content: [],
            },
          },
        },
        assessment: {
          title: 'Avaliação',
          content: { description: { title: 'Avaliação', content: [] } },
        },
        plans: {
          title: 'Planos',
          content: {
            medicationRequest: { title: 'Medicações prescritas', content: [] },
            examRequest: { title: 'Exames solicitados', content: [] },
            followUp: { title: 'Acompanhamento', content: [] },
            forwarding: { title: 'Encaminhamento', content: [] },
            orientations: { title: 'Orientações', content: [] },
          },
        },
      },
    },
    case_discussion: {
      title: 'Discussão de Caso',
      content: {
        introduction: {
          title: 'Introdução',
          content: {
            professionalName: { title: 'Nome do Profissional', content: [] },
            specialty: { title: 'Especialidade', content: [] },
            local: { title: 'Local', content: [] },
            date: { title: 'Data', content: [] },
            hour: { title: 'Hora', content: [] },
          },
        },
        situation: {
          title: 'Situação',
          content: {
            reason: { title: 'Motivo', content: [] },
            patient: { title: 'Paciente', content: [] },
            mainDiagnosis: { title: 'Diagnóstico rincipal', content: [] },
            currentSituation: { title: 'Situação atual', content: [] },
          },
        },
        history: {
          title: 'Histórico',
          content: {
            medicalHistory: { title: 'Histórico médico', content: [] },
            exams: { title: 'Exames', content: [] },
            allergies: { title: 'Alergias', content: [] },
            signs: {
              title: 'Sinais vitais e dados antropométricos',
              content: [],
            },
          },
        },
        assessment: {
          title: 'Avaliação',
          content: {
            description: { title: 'Avaliação', content: [] },
            differentialDiagnosis: {
              title: 'Diagnóstico Diferencial',
              content: [],
            },
            complications: { title: 'Complicações', content: [] },
          },
        },
        recommendation: {
          title: 'Recomendações',
          content: {
            plans: { title: 'Planos', content: [] },
            examRequest: { title: 'Exames solicitados', content: [] },
            medicationUpdate: { title: 'Medicamentos alterados', content: [] },
            followUp: { title: 'Acompanhamento', content: [] },
            forwarding: { title: 'Encaminhamento', content: [] },
          },
        },
      },
    },
  };

  const select = context.specialityModal.querySelector('#speciality-select');
  select.innerHTML = '';

  Object.entries(mockSpecialtyModels).forEach(([key, model]) => {
    const option = document.createElement('option');
    console.log(key, 'key');
    option.value = key;
    option.textContent = model.title;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const selectedKey = select.value;
    context.specialty = mockSpecialtyModels[selectedKey].title;
    console.log(selectedKey, 'selectedKey');
    context.specialty = selectedKey;
  });

  const closeModal = context.specialityModal.querySelector(
    '#close-speciality-modal'
  );

  closeModal.addEventListener('click', () => context.closeSpecialityModal());
}
