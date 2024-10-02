

# Daai-badge

### Visão Geral
O Daai-Badge é um Web Component desenvolvido pela Doctor Assistant.ai.

### Sumário
1. [Introdução](#introdução)
2. [Construção do componente](#construção)
3. [Instalação](#instalação)
4. [Uso do componente](#uso)
5. [Customização da daai-badge](#exemplos)
6. [Configuração](#configuração)


## Introdução
Explicação mais detalhada do propósito do projeto e do problema que ele resolve.

## construção


### Shadow dom 👻
O **Shadow DOM** é uma parte do **Web Components** que permite encapsular a estrutura, estilo e funcionalidade de um elemento de forma isolada do resto da página. 🔒 Isso significa que o conteúdo do **Shadow DOM** não pode ser afetado por estilos ou scripts externos, criando um "mini DOM" dentro de um componente.
### Como ele funciona?

Quando você cria um **Shadow DOM**, está basicamente dizendo ao navegador: "Eu quero que essa parte da minha página funcione de forma independente". 🎯

Isso é útil quando você quer evitar conflitos de CSS ou garantir que um componente tenha o mesmo comportamento em qualquer lugar da página.

## Instalação
Para instalar o Daai-Badge no seu projeto, siga os passos abaixo:

Execute o seguinte comando no terminal do seu projeto:

```bash
npm i @doctorassistant/daai-badge
```

## Uso do componente

Após instalar o pacote no seu projeto, basta adicionar a tag <daai-badge> no local onde deseja que o componente seja renderizado:


``` html
<daai-badge></daai-badge>
```
onde ele for chamado vai ser renderizado nesse modelo:

![alt text](image.png)

## Customização 🎨
  Após a instalação do componente e a sua inclusão no código, será possível customizá-lo passando as props correspondentes. Caso as props não sejam fornecidas, ele utilizará o layout padrão.
  #### 📂 Props que você pode passar para o componente:
  ```js
 icon="https://example.com/icon.png"
 button-primary-color="#007BFF"
 button-recording-color="#FF3B30"
 button-pause-color="#C0392B"
 button-resume-color="#28A745"
 border-color="#007BFF"
 animation-recording-color="#FF3B30"
 animation-paused-color="#95A5A6"
 text-badge-color="#007BFF"
  ```
definição de cada propriedade:

 #### icon:
 ícone que vai ser renderizado na badge
 #### button-primary-color:
 #### button-recording-color:
essa propriedade consegue mudar a cor do botão de finalizar a gravação

  ![alt text](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAuCAYAAADjs904AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQfSURBVHhe7ZtPSBRRHMe/JiJFfyTr0iXyIBRaFlEHlzp0ERYiA1tMioRCKlz6e1CEskMeoiCFQoqWqCUWISMQvHQJL0VYkVAoWXboD+Wh8iB2qN9v5z33zbhru6Nbzev3gfHNvHlv5s18f9/fm3V3Cn4SEKxlgSoFSxGBLUcEthwR2HJEYMsRgS0n/cekF8+AnjvAk0fAt6+qUvgnWboM2LwVqKsHKqtUZYqZAvf2ABfPqw0hUJxsBWrr1IaDW2B27uFGtSEEkqsxl5PdczCnZSHYeDR0C8xzrhBsPBq6BZYHquDj0VA+JlmOCGw5IrDliMCWIwJbjghsOfkVuKgIqN0DrKtUFcKfJn8Cs7gHjwDrq4B3b1WlouUuMPDUvXTuc+q5zIkzQH83ldSvn/rPC3wsz/gGHgIRtTsXOqlfi1qfAZ2nk8afR/IjcHExsPcAUFgItLcCE9/VDoPBS0BoY2qJ3gI6djulL6hfDfWfN964x9f3BdjpQ4zoNroute4lEgJK1Xqe8C9wU7PzVZUXFjd6CigpAa5fUZVZoh3MZT9FvuluJkJONV3lcobh4LjRRrdL25fdr84Tz0E8MwOZ/dityXraH1eO1w52nZ/30XgbtwCrdznXx+2SY1H7zAySMQP8Hv8C/5gCjh5zi7xwEVC/H5icBC5fcMpMbDqRuoBkivXy0nFO12OgnCKdKXtvOIocVpFBlAajzdg9x0GZ+i4mZ3JdQ7uzPc2a1Ph4CVNVsg3143V9rPEdjkAsYLkac+g5CcfHMKheS+dVfULk6gRlnBhdG49PZ63ha86+6kN0XKpPtqUyrALXB/4Fvh0DPn0EztLdW055hoVuOwfwl4/dXU6b2TBTdE2TqjQYHnDKBAmj6RhNRXaYBJgNdlkF3WgtXKa+E5/VihcjRY/RZp9K/5FV9McQf9MSSrNlFEArU2MGnZP7mEQf0HlVn0zz+QdjehrSAUfjnliRvn0W+Bd4ihx8g6J2iG7i6TZy83Hg9Qhwk6KQ9+WDOEV2TN10dmEmvOIy2fZNRwMF43YlSjLgDPF54fOMUqDoTMMu9zqYRdfts5nPp7MTBQ9nmYTazJG5P2Sxkwcp1Yy8ctbzyTgtzcoFFbReym7ywimUHMZzm3YZp9Cs+maC0yml32ZOlSRUHxX62Pr4CcpCw5SGk3UbZjp4en6mJUyOvK+Cj8fpnf+jZJJSPX4qdfbwQYHrFx0cXYI/eA7mH8MkpxsSjEUOzedTfQ5wYCjm7mDBgR08Tk/F2nWDvWrH30UcbCPi4P8HEdhyRGDLEYEtRwS2HBHYctwCp/t2SAgWHg3dAvNbakKw8WjoFphfQRSCjUdDt8D8Vhq/gigEE9bO846w+1+VGnkBPDjwnJvTC+CCVcjHJMsRgS1HBLYcEdhqgF8vXowycLlO6AAAAABJRU5ErkJggg==)

 #### button-pause-color:
 essa propriedade consegue mudar a cor de botão de pausar a gravação

 ![alt text](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAzCAYAAAAzSpBQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHCSURBVGhD7Zm/S0JRFIDP8ylpoEItJhE1WAQRNTQkUe0F/QBpCKeIGoIgmoqmGvsD2qMhgpoaGhpaamgoIghqFyMIDBNCeS/v9W6Vx4Rr97zOt9xzj8I7H8/rPdxruWXAo/jU6ElYjiosRxWWowrLUcXTcjW3X7m7G8gcHcDr9RWU3nIq21j8kSi0DA1DPDUP0f5Blf2ZmuQyx4fwtLutZmaQWN+C+Oycmn0PKife2O1yWs3MYmBvv+obRNec+CmaClYbKifWmKlgtaFyf/XnUQtYbbzPUYXlqKJVTnQUXUurcsMNxtsrScuC1pFx6NncgbapVCWnCa1y4e5e6EgvyE5CjAKfPwCdiysQm5iGxNqGzOlCq5xl2+UnVB5hB0NyBJ8FdlNQhlYgIEdd8JqjCstRheWownL14hSL4DqOjEvveTmC40KpUJChW/5cJ+gxw0WyT0W/xw41Q2xyBvzhCGRPT+DjOSvbL3E00JIchfzjA7ycn6lv18fY5b2KvqJVrhFUk+M1RxWWowrLUQWVE0cFpoLVhsqJWxVTwWpD5cR1kalgtaFyolUSp1emIWrC7uj48pEq/3sroAzLUcXDcgCf7z2Gr52/QGQAAAAASUVORK5CYII=)
 #### button-resume-color:
![alt text](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAArCAYAAABYSfeIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAVySURBVHhe7ZtvaBtlHMe/7VwNNP1j1sVKZkdtsawRaedsi9aBRUuoHUjaF3X6JjCLe6FghbIXU0GKL/Kigr4olEIQdBZpg+IopUpfjDHbIFtFuq6jIRiI1nSLsX8gq3bz+d39LslyyUiXVpfe84GQ+z333N1z9/19f/dc2iu4I4DEEBTyt8QASLENhBTbQEixDUTGCdrlG/P44vo3uLR8GX9trnGr5EGlrKgEz1UexRtPvoqjFXZuvZu0Yn+19B0++ukzjiT5xgfH3sZrtSc4SqATmxz9+g/vciTJV7586ROdw3X3bCrdkvwnnY46sekeLcl/0umoE1tOxvYG6XSUj14GQoptIKTYBkKKbSCk2AZCim0gdkTsCpMFDRX1eObgU6gtO4z9hQ/xGsmDhO7n0iOj7byUHS889izONL6FQ+ZK7CvYpzzffRv4Hp/+8jliW7e4l4qrzYt+q5mjdcxcccK1yGHW9MHTFoRrGvA4HQh5T+Esr9kNBjqm0FXKAeMPtKNzloNsaR6Br3gSTdNj3JBMtzinKnFOgxzvDAs9U7ykkpOzbcWP4sNj7+CJ0sdRVLhfiF0Iy8Nlyl9eXj70PPdSUYQ2XVSSSflcWYK9cQQDvD5rmuuh/uI7BtcuC61CScljVsY9B6vNDRevzZrZUxmEFtQ1wW7i5V0kJ2e/cvhFuFvOoLCggFsS+Fd/RefEmxyJzL2nC/twvseBGmVZc7xoc7bCWmRGCTVvzsHtXUYX9/MHhrFiU/fpF4l0uhwoEX0J1Xm0fSXGvf3wiLaBDi9sfrFfuOFrbFD3KVD70vhOiiSiY9Fx1G2I+HZaBaoT24tsG1L6JI87iPFR9fwSFSworoMFK7R9OTs71JR0fDrXc4C9Fy1FwFp4GE0bDvhsFuVcaGzjxUnVcHUSRyayd/+OOvsR4eJ0QhN0H09QhYOIwM9RKgMdDljFicYdb2fniAswr7hqGDOoxfG6QXQGgspFSS2jJTGuGmJ9zYE+btXjKl/GkObSlL7z86ItSWgVM1oap5QLp3waa0U/LYEcgBBEHXcE7U4xbpEMp8uX4FaOcRVIuQW4bLUIa9uMUhKJCjU/hzUhpOZ87Vw6o2Jf1ohIIrX/OBw436x0uS9yEvv3jTC27tzm6G6uRwO8RASxAgs7IIGruY/L4TrmQ1ziFpcRLuK+m0u4oDhqDKEYfWfGf5MzPhrBvX7d98wGcdzJwlVXcSsRQSjt/CFRxt3hdZFo59jl3bCJ0ltTrSWBcCuNu1wkedTHCTOIuVVlIY5n+iKgbdPjhaeOVySxFgvykmD1arwa+mPrsBZ3c7R9chL755vXsPDnEkcJbm1tYuTa1xwRY7gQtaCrI8lx5IDqVuFWCsyw2/gk6iph3cxcBbaFljQsDDHQcVJYmJ0lnL0dPNNOTJl62V1qAlKpVV1KH1HGRbKhvImTuA8NKc6mBOjU+gciaKnJXIUUSuvj85oakxnhjQz3/SzISewbsQjeu/QxpkM/4u/b/yhtwfXf8L5vELN/zCmxBl0od6yVM5qcIMohz8bPTkwibO1NtHOZzESJ6Otre5qjTJCrqsQ9no5H92MVvxAoXpYPiNhUua3JFo0V1aoj1WXeF32ojC/2Yyhai36lrV44kzdk6H4e719twYyfK1KpAwvJZiBoX2FhEu7fhcntPwUkkfOjlyQF3QSuHnM8cfuvoQRJJidnS9Ig3DgVa2Bn08Rz8n8ROh3S2XsY6WwDI8U2EFJsAyHFNhBSbAMhxTYQOrHpBTFJ/pNOR53Y9CagJP9Jp6NObPrHA0n+k05Hndj05h+98inJX0i/dO9o634u1ZAv4+cX9/0yvmRvIh+9DIQU20BIsQ0D8C/MoUAOCO9McQAAAABJRU5ErkJggg==)
 #### border-color
 Essa propriedade altera a cor da borda externa do componente.
 #### animation-recording-color
![alt text](data:image/png;base64,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)
 #### animation-paused-color
![alt text](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALYAAAAjCAYAAAA5W/D0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGlSURBVHhe7dvZboJQFIXhDY6IE9a+/wO2zuKs7d6kF2hK0+uV/0sIJqwI+5wVrjT5cgaISX/OgBSKDUkUG5IoNiRRbEii2JBEsSGJYkMSxYYkig1JFBuSKDYkUWxIotiQ9K+frX4sl9X5fTazzW5nl+vVJqORJUli6+3WOu22TcfjxlzquZXn2p4rXnLb/d7Ol4uNh0NrtVq22mys7ediMnnK7crSTudzlYvrS89FftaQG+W5dTsdW6zX1kpTm02nT7n94WDH08mGnut1u7ZYrSz13FtTbjCwfq9nn56LuedF8ZQrj0c7+JF7btDvV9d+y0UmsoMss9yP+rX47tiOuX+Oe5Z+7z9z/t0xazxj5veMZ6znYvbH41HNFHsRa5P5DDFzPbf03P0lF7PGGj7lfM3v93u15jc/x97F2sWe1HOxh3E99jDyjTnvxO12qzrx8HmiM7Fn0Zl6Ljp29Vx0zAe3dS3XhDc2JPFHA0jijQ1JFBuSKDYkUWxIotiQRLEhiWJDEsWGJIoNSRQbkig2JFFsSKLYkESxIYliQxLFhiSKDUFm36Xv7DjhLfzcAAAAAElFTkSuQmCC)
 #### text-badge-color



