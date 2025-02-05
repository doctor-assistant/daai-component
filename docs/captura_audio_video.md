# Captura de Áudio de Vídeo

## Descrição
Este documento descreve a implementação da funcionalidade de captura de áudio de vídeo no componente web para telemedicina. Esta funcionalidade permite capturar o áudio de um vídeo que está sendo reproduzido na mesma aba onde o componente está sendo renderizado.

## Funcionalidades
- Captura de áudio de vídeo na mesma aba do navegador
- Mixagem automática com áudio do microfone durante gravação
- Controle independente de volume para áudio do vídeo e microfone
- Tratamento robusto de erros e recursos
- Eventos de interface para monitoramento do estado da captura

## Uso

### Iniciar Captura de Áudio do Vídeo
```javascript
const daaiComponent = document.querySelector('daai-badge');
const videoElement = document.querySelector('video');

try {
  await daaiComponent.captureVideoAudio(videoElement);
} catch (error) {
  console.error('Erro ao capturar áudio:', error);
}
```

### Parar Captura de Áudio do Vídeo
```javascript
await daaiComponent.stopVideoAudioCapture();
```

### Eventos
O componente emite eventos de interface que podem ser monitorados:
```javascript
daaiComponent.addEventListener('interface', (event) => {
  const { videoAudioCapture } = event.detail;
  if (videoAudioCapture !== undefined) {
    console.log('Estado da captura de áudio:', videoAudioCapture);
  }
});
```

## Compatibilidade
- Google Chrome (versão 80+): ✓
- Mozilla Firefox (versão 76+): ✓
- Microsoft Edge (versão 80+): ✓
- Safari (versão 13+): ✓

## Limitações
- O elemento de vídeo deve estar na mesma aba do navegador onde o componente está sendo renderizado
- O navegador deve suportar a Web Audio API
- O usuário deve conceder permissões de acesso ao microfone

## Tratamento de Erros
O componente inclui tratamento para diversos cenários de erro:
- Elemento de vídeo inválido ou não encontrado
- Falha na inicialização do contexto de áudio
- Falha na captura do áudio do vídeo
- Falha na mixagem de áudio
- Limpeza adequada de recursos em caso de erro
