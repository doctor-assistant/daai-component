# Daai Component

### Sumário

1. [Introdução](#introdução)
2. [Como usar o componente](#uso)
3. [Customização](#customização)
4. [Uso do componente via CDN](#uso-do-componente-via-cdn)
5. [Construção do componente](#construção)

## Introdução

O componente é um sistema de integração para empresas de saúde, como clínicas, sistemas de prontuário eletrônico e empresas que possuem soluções próprias. Seu objetivo é capturar o registro das consultas por meio do áudio entre o profissional de saúde e o paciente via API, entregar os resultados da consulta através da transcrição.

#### Benefícios

- Automatização de processos dentro da empresa
- Registro do áudio e processamento de entrega de acordo com a necessidade específica
- Facilidade de customização de acordo com a interface da empresa (whitelabel)
- Ganho de produtividade: não há necessidade de utilizar vários sistemas em paralelo

## Uso

### instalação

Para instalar o `Daai component` no seu projeto, basta rodar no terminal do projeto que você deseja usar o componente.

💻 Execute esse comando:

```bash
npm i @doctorassistant/daai-component
```

### Como usar após a instalação:

Após instalar o pacote no seu projeto, basta adicionar a tag <daai-component> no local onde deseja que o componente seja renderizado:

```html
import '@doctorassistant/daai-component';

<daai-component></daai-component>
```

onde ele for chamado vai ser renderizado nesse modelo:

![readme_component_layout.png](https://raw.githubusercontent.com/doctor-assistant/daai-component/main/readme_component_layout.png)

## propriedades de funcionamento

```js
// ⚠️ A propriedade professionalId não é obrigatória, o componente irá funcionar normalmente caso você não passe essa chave
professionalId =
  'aqui você deve passar um identificador para o usuário que irá utilizar a componente';

// ⚠️ A propriedade apiKey é obrigatória, sem ela o componente não irá fazer requisições a api
apikey = 'aqui você deve passar a chave da api para realizar as requisições';

// ⚠️ A propriedade modeApi é obrigatória para definir se você deseja utilizar o ambiente de teste você deve passar o valor 'dev', caso você queira testar o ambiente de produção você deve passar o valor 'prod', caso você não passe essa propriedade, o componente não irá fazer requisições.
modeApi = 'dev';
```

## customização

Após a instalação do componente e a sua inclusão no código, será possível customizá-lo passando as props correspondentes. Caso as props não sejam fornecidas, ele utilizará o layout padrão. 🎨

#### 📂 Props que você pode passar para o componente:

```js
theme: {
  icon,
  button-start-recording-color,
  button-recording-color,
  button-pause-color,
  button-resume-color,
  button-upload-color,
  border-color,
  animation-recording-color,
  animation-paused-color,
  text-badge-color,
}
 onSuccess={}
 onError={}
```

### 🖌️ exemplo de uso da customização:

```html
<daai-component
  theme='{
  "icon": "path/to/icon.png",
  "buttonStartRecordingColor": "#0600b1",
  "buttonRecordingColor": "#0600b1",
  "buttonPauseColor": "#0600b1",
  "buttonResumeColor": "#0600b1",
  "buttonUploadColor":"#0600b1",
  "borderColor": "#0600b1",
  "animationRecordingColor":"#0600b1",
  "animationPausedColor": "#0600b1",
  "textBadgeColor": "#0600b1"
  }'
  onSuccess="função que você quer que execute caso seja sucesso"
  onError="função que você quer que execute caso ocorra um erro"
>
</daai-component>
```

### 🔎 definição de cada propriedade:

### 📎 Sugestões:

- As cores podem ser em `hexadecimal` mas você também pode usar o nome da cor ex: 'yellow'.
- O ícone pode ser adicionado como Base64.

#### icon

⚠️ A imagem deve ter dimensões de no máximo 70px de altura e 70px de largura para ficar proporcional ao tamanho do componente

ícone que vai ser renderizado no componente.

#### button-start-recording-color

Essa propriedade é capaz de alterar a cor do botão de `inciar registro`.

#### button-recording-color

essa propriedade consegue mudar a cor do botão de `Finalizar Registro`

#### button-pause-color

essa propriedade consegue mudar a cor de botão de `Pausar` o registro.

#### button-resume-color

Essa propriedade consegue alterar a cor do botão de `Continuar Registro`

#### button-upload-color

Essa propriedade consegue alterar a cor do botão de `Iniciar novo Registro`

#### border-color

Essa propriedade altera a cor da `borda` externa do componente.

#### animation-recording-color

Essa propriedade altera a cor da animação de gravação quando ela está em andamento.

#### animation-paused-color

Essa propriedade é responsável por mudar a cor da animação quando ela está pausada.

#### text-badge-color

Essa propriedade altera a cor dos textos do componente.

## Uso do componente via CDN

Caso a sua aplicação não utilize react, vue.js e angular, você pode optar por usar o nosso componente via CDN.

- exemplo de uso no HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    // aqui você deve chamar por meio do cdn dentro do script
    <script
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@latest/dist/DaaiBadge.js"
      type="module"
    ></script>
  </head>
  <body>
    <h1>Exemplo de uso do componente via cdn</h1>
    <daai-component></daai-component>
  </body>
</html>
```

### ⚠️ Observações

- Quando passar o daai-component dentro do body você ainda terá que passar as propriedades obrigatórias citadas acima.
- Não é obrigatório passar a versão, caso o campo fique vazio ele irá pegar a versão mais recente.

```html
Versão mais atualizada
<script
  src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@latest/dist/DaaiBadge.js"
  type="module"
></script>
Versão especificada
<script
  src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-component@X.X.X/dist/DaaiBadge.js"
  type="module"
></script>
```

## construção

### Shadow dom 👻

O **Shadow DOM** é uma parte do **Web Components** que permite encapsular a estrutura, estilo e funcionalidade de um elemento de forma isolada do resto da página. 🔒 Isso significa que o conteúdo do **Shadow DOM** não pode ser afetado por estilos ou scripts externos, criando um "mini DOM" dentro de um componente.
