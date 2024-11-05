import { DAAI_LOGO } from './icons/icons.js';

class DaaiSumarization extends HTMLElement {
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
        margin-top: 10px;
      }
      .container-content {
        color: var(--text-badge-color, #009CB1);
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        border: 3px solid;
        border-radius: 30px;
        background-color: #ffffff;
        height: 40px;
        max-width: 450px;
        font-family: "Inter", sans-serif;
        font-weight: 600;
        position: relative;
        transition: background-color 0.3s, border-color 0.3s;
      }
      .sumary-button {
        height: 30px;
        font-size: 12px;
        border-radius: 6px;
        background-color: #009CB1;
        color: white;
        border: none;
        cursor: pointer;
      }
      .close-button{
        height: 40px;
        width: 100px;
        font-size: 12px;
        border-radius: 8px;
        background-color: #F43F5E;
        color: white;
        border: none;
        cursor: pointer;
      }
      .copy-button{
       height: 40px;
        width: 100px;
        font-size: 12px;
        border-radius: 8px;
        background-color: #009CB1;
        color: white;
        border: none;
        cursor: pointer;
      }
      .copy-button.copied {
        background-color: #4CAF50;
      }
      .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        width: 400px;
        font-weight:600;
        @media (max-width: 600px) {
         width: 80%;
      }
      }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
      }
      .period-container{
        display: flex;
        gap: 10px;
        align-items: center;
        font-weight: 500;
        justify-content: center;
        border: 3px solid  #009CB1;
        border-radius: 10px;
        height: 60px;
        width:96%;
        padding:4px;
      }

    .sumary-container{
        display: flex;
        gap: 10px;
        font-weight: 500;
        align-items: flex-start;
        justify-content: flex-start;
        border: 3px solid  #009CB1;
        border-radius: 10px;
        height: 300px;
        overflow-y: auto;
        padding:8px;
      }
      .sumary-content{
        display: flex;
        gap: 10px;
        align-items: start;
        justify-content: center;
        flex-direction:column;
      }
    </style>
    <div class="container">
      <div class="container-content">
      <img src=${DAAI_LOGO} alt='upload-icon'
        <p>Sumário clínico</p>
        <button class="sumary-button" id="sumary">Gerar sumário</button>
        <button class="sumary-button" id="sumary">Ver sumário</button>
      </div>
    </div>
    `;

    this.shadowRoot
      .querySelector('#sumary')
      .addEventListener('click', () => this.showModal());
  }

  showModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class='sumary-content'>
      <p>Sumário clínico do paciente</p>
      <span class='period-container'>Análise do período de xx/xx/xxxx a xx/xx/xxxx</span>
      <span class='sumary-container'>
          Lorem ipsum dolor sit amet. Cum quos natus sit alias sunt hic ratione temporibus aut quia autem sit suscipit labore et vero iure et voluptatem dolorem. In voluptatem voluptas est autem tempore est cumque dolore eum quod fugiat sit minus neque. Et voluptatem nihil sit doloremque neque eos dolorem corrupti.

          Qui perspiciatis praesentium eum nihil modi ut totam itaque et veritatis officia ad porro eaque sed aliquid ipsam aut possimus pariatur? Et aperiam consequatur est quia sunt quo pariatur sunt aut laboriosam necessitatibus sed fuga dolorem 33 explicabo voluptatibus.

          Qui necessitatibus temporibus et voluptas eius et illo galisum. Qui enim omnis hic omnis commodi eum impedit provident non nulla quia id porro ipsam et cupiditate ullam. Aut rerum deserunt et reiciendis doloremque eos voluptas modi. Ab nobis quos aut modi rerum ea quisquam iste et dicta quaerat.
      </span>
      <div>
      <button class="copy-button" id='copyText'>Copiar</button>
      <button class="close-button" id="closeModal">Fechar</button>
      </div>
      </div>
    `;

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    this.shadowRoot.appendChild(overlay);
    this.shadowRoot.appendChild(modal);

    this.shadowRoot
      .querySelector('#closeModal')
      .addEventListener('click', () => this.closeModal(modal, overlay));
    overlay.addEventListener('click', () => this.closeModal(modal, overlay));

    this.shadowRoot
      .querySelector('#copyText')
      .addEventListener('click', () => this.copySumaryText());
  }
  copySumaryText() {
    const sumaryText =
      this.shadowRoot.querySelector('.sumary-container').innerText;
    const copyButton = this.shadowRoot.querySelector('#copyText');

    navigator.clipboard
      .writeText(sumaryText)
      .then(() => {
        copyButton.classList.add('copied');
        copyButton.innerText = 'Copiado!';

        setTimeout(() => {
          copyButton.classList.remove('copied');
          copyButton.innerText = 'Copiar';
        }, 3000);
      })
      .catch((error) => {
        console.error('Erro ao copiar o texto: ', error);
      });
  }

  closeModal(modal, overlay) {
    this.shadowRoot.removeChild(modal);
    this.shadowRoot.removeChild(overlay);
  }
}

customElements.define('daai-sumarization', DaaiSumarization);
