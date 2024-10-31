export function parseThemeAttribute(themeAttr) {
  try {
    return JSON.parse(themeAttr);
  } catch (e) {
    console.error('Erro ao analisar o atributo `theme`:', e);
    return {};
  }
}

// Função ajustada para receber o contexto do componente
export function applyThemeAttributes(themeProp, componentContext) {
  Object.keys(themeProp).forEach((key) => {
    const attributeKey = toKebabCase(key);

    // Acessa o componente `this` passado como contexto
    if (!componentContext.hasAttribute(attributeKey)) {
      componentContext.setAttribute(attributeKey, themeProp[key]);
    }

    const attributeToElementMap = {
      icon: (value) => {
        const img = componentContext.shadowRoot.querySelector('img');
        if (img) img.src = value;
      },
      'button-start-recording-color': (value) => {
        const buttonPrimary =
          componentContext.shadowRoot.querySelector('.button-primary');
        if (buttonPrimary) buttonPrimary.style.backgroundColor = value;
      },
      'button-recording-color': (value) => {
        const buttonRecording =
          componentContext.shadowRoot.querySelector('.button-recording');
        if (buttonRecording) buttonRecording.style.backgroundColor = value;
      },
      'button-pause-color': (value) => {
        const buttonPause =
          componentContext.shadowRoot.querySelector('.button-pause');
        if (buttonPause) buttonPause.style.backgroundColor = value;
      },
      'button-resume-color': (value) => {
        const buttonResume =
          componentContext.shadowRoot.querySelector('.button-resume');
        if (buttonResume) buttonResume.style.backgroundColor = value;
      },
      'button-upload-color': (value) => {
        const buttonUpload =
          componentContext.shadowRoot.querySelector('.button-upload');
        if (buttonUpload) buttonUpload.style.backgroundColor = value;
      },
      'border-color': (value) => {
        const recorderBox =
          componentContext.shadowRoot.querySelector('.recorder-box');
        if (recorderBox) recorderBox.style.borderColor = value;
      },
      'animation-recording-color': (value) => {
        const animatedRecordingElement =
          componentContext.shadowRoot.querySelector(
            '.animated-recording-element'
          );
        if (animatedRecordingElement)
          animatedRecordingElement.style.animationColor = value;
      },
      'animation-paused-color': (value) => {
        const animatedPausedElement = componentContext.shadowRoot.querySelector(
          '.animated-paused-element'
        );
        if (animatedPausedElement)
          animatedPausedElement.style.animationColor = value;
      },
      'text-badge-color': (value) => {
        componentContext.style.setProperty('--text-badge-color', value);
      },
      'button-send-files': (value) => {
        const finishUploadButton = componentContext.shadowRoot.querySelector(
          '.finish-upload-button'
        );
        if (finishUploadButton)
          finishUploadButton.style.backgroundColor = value;
      },
      'button-search-files': (value) => {
        const uploadButton =
          componentContext.shadowRoot.querySelector('.upload-button');
        if (uploadButton) uploadButton.style.backgroundColor = value;
      },
    };

    if (attributeToElementMap[attributeKey]) {
      attributeToElementMap[attributeKey](themeProp[key]);
    }
  });
}

export function toKebabCase(camelCase) {
  return camelCase.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function attributeChangedCallback(name, oldValue, newValue) {
  if (name === 'theme') {
    this.theme = parseThemeAttribute(newValue);
    applyThemeAttributes();
    return;
  }
  const attributeToElementMap = {
    icon: (value) => {
      const img = this.shadowRoot.querySelector('img');
      if (img) img.src = value;
    },
    'button-start-recording-color': (value) => {
      const buttonPrimary = this.shadowRoot.querySelector('.button-primary');
      if (buttonPrimary) buttonPrimary.style.backgroundColor = value;
    },
    'button-recording-color': (value) => {
      const buttonRecording =
        this.shadowRoot.querySelector('.button-recording');
      if (buttonRecording) buttonRecording.style.backgroundColor = value;
    },
    'button-pause-color': (value) => {
      const buttonPause = this.shadowRoot.querySelector('.button-pause');
      if (buttonPause) buttonPause.style.backgroundColor = value;
    },
    'button-resume-color': (value) => {
      const buttonResume = this.shadowRoot.querySelector('.button-resume');
      if (buttonResume) buttonResume.style.backgroundColor = value;
    },
    'border-color': (value) => {
      const recorderBox = this.shadowRoot.querySelector('.recorder-box');
      if (recorderBox) recorderBox.style.borderColor = value;
    },
    'animation-recording-color': (value) => {
      const animatedRecordingElement = this.shadowRoot.querySelector(
        '.animated-recording-element'
      );
      if (animatedRecordingElement)
        animatedRecordingElement.style.animationColor = value;
    },
    'animation-paused-color': (value) => {
      const animatedPausedElement = this.shadowRoot.querySelector(
        '.animated-paused-element'
      );
      if (animatedPausedElement)
        animatedPausedElement.style.animationColor = value;
    },
    'text-badge-color': (value) => {
      this.style.setProperty('--text-badge-color', value);
    },
  };
  if (attributeToElementMap[name]) {
    attributeToElementMap[name](newValue);
  }
}
