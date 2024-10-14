# Daai-badge

### Sumário

1. [Introdução](#introdução)
2. [Como usar o componente](#uso)
3. [Customização](#customização)
4. [Construção do componente](#construção)

## Introdução

O componente é um sistema de integração para empresas de saúde, como clínicas, sistemas de prontuário eletrônico e empresas que possuem soluções próprias. Seu objetivo é capturar o registro das consultas por meio do áudio entre o profissional de saúde e o paciente via API, entregar os resultados da consulta através da transcrição.

#### Benefícios

- Automatização de processos dentro da empresa
- Registro do áudio e processamento de entrega de acordo com a necessidade específica
- Facilidade de customização de acordo com a interface da empresa (whitelabel)
- Ganho de produtividade: não há necessidade de utilizar vários sistemas em paralelo

## Uso

### instalação

Para instalar o `Daai-Badge` no seu projeto, basta rodar no terminal do projeto que você deseja usar o componente.

💻 Execute esse comando:

```bash
npm i @doctorassistant/daai-badge
```

### Como usar após a instalação:

Após instalar o pacote no seu projeto, basta adicionar a tag <daai-badge> no local onde deseja que o componente seja renderizado:

```html
<daai-badge></daai-badge>
```

onde ele for chamado vai ser renderizado nesse modelo:
![readme_component_layout.png](https://raw.githubusercontent.com/doctor-assistant/daai-component/main/readme_component_layout.png)

## Customização

Após a instalação do componente e a sua inclusão no código, será possível customizá-lo passando as props correspondentes. Caso as props não sejam fornecidas, ele utilizará o layout padrão. 🎨

#### 📂 Props que você pode passar para o componente:

```js
theme: {
  icon,
  button-start-recording-color,
  button-recording-color,
  button-pause-color,
  button-resume-color,
  border-color,
  animation-recording-color,
  animation-paused-color,
  text-badge-color,
}
 onSuccess={}
 onError={}
 apikey={}

```

### 🖌️ exemplo de uso da customização:

```html
<daai-badge
  theme='{
  "icon": "path/to/icon.png",
  "buttonStartRecordingColor": "#0600b1",
  "buttonRecordingColor": "#0600b1",
  "buttonPauseColor": "#0600b1",
  "buttonResumeColor": "#0600b1",
  "borderColor": "#0600b1",
  "animationRecordingColor":"#0600b1",
  "animationPausedColor": "#0600b1",
  "textBadgeColor": "#0600b1"
  }'
  onSuccess='função que você quer que execute caso seja sucesso'
  onError='função que você quer que execute caso ocorra um erro'
  apikey='chave da api"
>
</daai-badge>
```

### 🔎 definição de cada propriedade:

### 📎 Sugestões:

- As cores podem ser em `hexadecimal` mas você também pode usar o nome da cor ex: 'yellow'.
- O ícone pode ser adicionado como Base64.

#### icon

ícone que vai ser renderizado na badge.

#### button-start-recording-color

Essa propriedade é capaz de alterar a cor do botão de `inciar registro`.

#### button-recording-color

essa propriedade consegue mudar a cor do botão de `Finalizar Registro`

#### button-pause-color

essa propriedade consegue mudar a cor de botão de `Pausar` o registro.

#### button-resume-color

Essa propriedade consegue alterar a cor do botão de `Continuar Registro`

#### border-color

Essa propriedade altera a cor da `borda` externa do componente.

#### animation-recording-color

Essa propriedade altera a cor da animação de gravação quando ela está em andamento.

#### animation-paused-color

Essa propriedade é responsável por mudar a cor da animação quando ela está pausada.

#### text-badge-color

Essa propriedade altera a cor dos textos do componente.

## construção

### Shadow dom 👻

O **Shadow DOM** é uma parte do **Web Components** que permite encapsular a estrutura, estilo e funcionalidade de um elemento de forma isolada do resto da página. 🔒 Isso significa que o conteúdo do **Shadow DOM** não pode ser afetado por estilos ou scripts externos, criando um "mini DOM" dentro de um componente.
