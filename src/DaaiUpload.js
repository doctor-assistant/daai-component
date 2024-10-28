import {
  DAAI_LOGO,
  DELETE_ICON,
  FILE_ICON,
  UPLOAD_ICON,
} from './icons/icons.js';

class DaaiUpload extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 10px;
        }

        .recorder-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: column;
          padding: 1rem;
          border: 3px solid #009CB1;
          border-radius: 30px;
          background-color: #ffffff;
          height: 300px;
          width: 400px;
          font-family: "Inter", sans-serif;
          font-weight: 600;
          position: relative;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .recorder-box.dragging {
          background-color: #e0f7fa;
          border-color: #007c91;
        }

        .header-content {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .upload {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 70%;
          border: 2px dashed #009CB1;
          border-radius: 4px;
          padding: 2px;
        }

        input[type="file"] {
          display: none;
        }

        button {
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          background-color: transparent;
          color: #009CB1;
          transition: transform 0.15s ease-in-out;
          font-weight: 600
        }

        button:hover {
          transform: scale(1.05);
        }

        ul {
          list-style: none;
          padding: 0;
          margin-top: 10px;
          max-height: 100px;
          overflow-y: auto;
        }

        li {
          display: flex;
          justify-content: space-between;
          align-items:center;
          border: 1px solid #009CB1;
          border-radius: 8px;
          padding:10px
        }

        .error {
          color: red;
          font-size: 14px;
          margin-top: 5px;
        }

        .files {
          display: flex;
          flex-direction: column;
          width: 80%;
          border-radius: 8px;
          padding: 10px;
          gap:5px;
        }

        .button-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-button {
          cursor: pointer;
          color: red;
          background: none;
          border: none;
          font-size: 14px;
          margin-left: 10px;
        }

        .rules-text{
          color:#475569;
          font-size:12px;
        }
      </style>

      <div class="container">
        <div class="recorder-box" id="dropZone">
          <div class="header-content">
            <img src=${DAAI_LOGO} alt="daai-logo" id="logo" />
            <p>Upload de exames</p>
          </div>
          <span class="upload">
            <span class="error" id="error"></span>
            <div class='button-container'>
              <img src=${UPLOAD_ICON} alt='upload-icon'/>
              <button id="uploadButton">Arraste o exame aqui</button>
              </div>
              <span class='rules-text'>Apenas PDF, PNG, JPG e JPEG até 10 MB</span>
            ${this.files ? ' <ul class="files" id="fileList"></ul>' : ''}
            <input type="file" id="fileInput" multiple />
          </span>
        </div>
      </div>
    `;

    this.files = [];

    this.fileInput = shadow.querySelector('#fileInput');
    this.fileList = shadow.querySelector('#fileList');
    this.uploadButton = shadow.querySelector('#uploadButton');
    this.dropZone = shadow.querySelector('#dropZone');
    this.errorMessage = shadow.querySelector('#error');

    this.uploadButton.addEventListener('click', () => this.fileInput.click());

    this.fileInput.addEventListener('change', (event) =>
      this.handleFiles(event.target.files)
    );
    this.addDragAndDropEvents();
  }

  handleFiles(newFiles) {
    const validFiles = Array.from(newFiles).filter(this.isValidFile);
    const invalidFiles = Array.from(newFiles).filter(
      (file) => !this.isValidFile(file)
    );

    if (invalidFiles.length > 0) {
      this.showError(
        'Arquivos inválidos. Apenas PDF, PNG, JPG e JPEG são permitidos.'
      );
    } else {
      this.clearError();
      this.files = [...this.files, ...validFiles];
      this.showFiles();
    }
  }

  isValidFile(file) {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    return validTypes.includes(file.type);
  }

  showFiles() {
    if (!this.fileList) {
      const ul = document.createElement('ul');
      ul.classList.add('files');
      this.fileList = ul;
      this.shadowRoot.querySelector('.upload').appendChild(ul);
    }

    this.fileList.innerHTML = '';

    this.files.forEach((file, index) => {
      const li = document.createElement('li');

      const icon = document.createElement('img');
      icon.src = FILE_ICON;
      icon.alt = 'file-icon';

      li.appendChild(icon);
      li.appendChild(document.createTextNode(` ${file.name}`));

      const deleteButton = document.createElement('button');
      const iconDelete = document.createElement('img');
      iconDelete.src = DELETE_ICON;
      iconDelete.alt = 'delete-icon';

      deleteButton.appendChild(iconDelete);
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', () => {
        this.deleteFile(index);
      });

      li.appendChild(deleteButton);
      this.fileList.appendChild(li);
    });
  }

  deleteFile(index) {
    this.files.splice(index, 1);
    this.showFiles();
  }

  showError(message) {
    this.errorMessage.textContent = message;
  }

  clearError() {
    this.errorMessage.textContent = '';
  }

  addDragAndDropEvents() {
    this.dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.dropZone.classList.add('dragging');
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('dragging');
    });

    this.dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      this.dropZone.classList.remove('dragging');
      const files = event.dataTransfer.files;
      this.handleFiles(files);
    });
  }
}

customElements.define('daai-upload', DaaiUpload);
