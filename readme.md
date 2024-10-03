# Daai-badge
### Sumário
1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Aplicabilidade](#aplicabilidade)
4. [Customização](#customização)
5. [Construção do componente](#construção)


## Introdução
O componente é um sistema de integração para empresas de saúde como clínicas, prontuários eletrônicos e empresas que possuem um sistema próprio. O objetivo dele é capturar o registro das consultas através do áudio entre o profissional de saúde e o paciente e, de forma personalizada ou por API, entregar os resultados da consulta nos respectivos campos de output do prontuário utilizado pela empresa.
 #### Beneficios
- Automatização de processos dentro da empresa
- Registro do áudio e processamento de entrega de acordo com a necessidade específica
- Facilidade de customização de acordo com a interface da empresa (whitelabel)
- Ganho de produtividade: não há necessidade de utilizar vários sistemas em paralelo

## Instalação
Para instalar o Daai-Badge no seu projeto, siga os passos abaixo:

Execute o seguinte comando no terminal do seu projeto:

```bash
npm i @doctorassistant/daai-badge
```

## Aplicabilidade

Após instalar o pacote no seu projeto, basta adicionar a tag <daai-badge> no local onde deseja que o componente seja renderizado:


``` html
<daai-badge></daai-badge>
```
onde ele for chamado vai ser renderizado nesse modelo:
![alt text](readme_component_layout.png)

## Customização
  Após a instalação do componente e a sua inclusão no código, será possível customizá-lo passando as props correspondentes. Caso as props não sejam fornecidas, ele utilizará o layout padrão. 🎨
  #### 📂 Props que você pode passar para o componente:
  ```js
 icon,
 button-start-recording-color,
 button-recording-color,
 button-pause-color,
 button-resume-color,
 border-color,
 animation-recording-color,
 animation-paused-color,
 text-badge-color,
  ```
definição de cada propriedade:

 #### icon
 ícone que vai ser renderizado na badge.
 #### button-start-recording-color
 Essa propriedade é capaz de alterar a cor do botão de `inciar registro`.

 #### button-recording-color
essa propriedade consegue mudar a cor do botão de `Finalizar Registro`

 #### button-pause-color
 essa propriedade consegue mudar a cor de botão de `Pausar` o registro.

 #### button-resume-color
 Essa propriedade consegue alterar a cor do botão de ` Continuar Registro `

 #### border-color
 Essa propriedade altera a cor da borda externa do componente.
 #### animation-recording-color
 Essa propriedade altera a cor da animação de gravação quando ela está em andamento.

 #### animation-paused-color

 Essa propriedade é responsável por mudar a cor da animação quando ela está pausada.

#### text-badge-color

 Essa propriedade altera a cor dos textos do componente.

## construção


### Shadow dom 👻
O **Shadow DOM** é uma parte do **Web Components** que permite encapsular a estrutura, estilo e funcionalidade de um elemento de forma isolada do resto da página. 🔒 Isso significa que o conteúdo do **Shadow DOM** não pode ser afetado por estilos ou scripts externos, criando um "mini DOM" dentro de um componente.
