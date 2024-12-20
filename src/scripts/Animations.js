export async function StartAnimationMicTest(canvasElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 44100,
        channelCount: 1,
        echoCancellation: false,
        autoGainControl: true,
        noiseSuppression: false,
        latency: 0,
      },
    });

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 4096;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (!canvasElement) {
      console.error('Canvas não encontrado!');
      return;
    }

    const canvasCtx = canvasElement.getContext('2d');
    const WIDTH = 300;
    const HEIGHT = 100;

    // Redefinir o tamanho do canvas ao padrão desejado
    canvasElement.width = WIDTH;
    canvasElement.height = HEIGHT;

    source.connect(analyser);

    const barWidth = 14;
    const barSpacing = 16;
    const numberOfBars = 6;
    const totalWidth =
      numberOfBars * barWidth + (numberOfBars - 1) * barSpacing;
    const startX = (WIDTH - totalWidth) / 2;

    const barPositions = [];
    for (let i = 0; i < numberOfBars; i++) {
      barPositions.push(startX + i * (barWidth + barSpacing));
    }

    const previousIntensities = new Array(numberOfBars).fill(0);
    const lerp = (a, b, t) => a + (b - a) * t;

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      barPositions.forEach((x, i) => {
        const barIntensity =
          dataArray[i * Math.floor(bufferLength / numberOfBars)];
        const normalizedIntensity = Math.min(barIntensity / 256, 1);

        previousIntensities[i] = lerp(
          previousIntensities[i],
          normalizedIntensity,
          0.1
        );

        const isActive = previousIntensities[i] > 0.05;

        const color = isActive ? '#637381' : '#DFE4EA';

        const barHeight = HEIGHT / 2;
        const radius = 10;

        canvasCtx.fillStyle = color;

        canvasCtx.beginPath();
        canvasCtx.moveTo(x + radius, HEIGHT / 2 - barHeight);
        canvasCtx.arcTo(
          x + barWidth,
          HEIGHT / 2 - barHeight,
          x + barWidth,
          HEIGHT / 2,
          radius
        );
        canvasCtx.arcTo(x + barWidth, HEIGHT / 2, x, HEIGHT / 2, radius);
        canvasCtx.arcTo(x, HEIGHT / 2, x, HEIGHT / 2 - barHeight, radius);
        canvasCtx.arcTo(
          x,
          HEIGHT / 2 - barHeight,
          x + radius,
          HEIGHT / 2 - barHeight,
          radius
        );
        canvasCtx.closePath();
        canvasCtx.fill();
      });
    };

    draw();
  } catch (error) {
    console.error('Erro ao capturar o áudio:', error);
  }
}

export function StartAnimationRecording(
  analyser,
  dataArray,
  bufferLength,
  canvasElement,
  status,
  animationRecordingColor,
  animationPausedColor
) {
  if (!canvasElement) {
    console.error('Canvas não encontrado!');
    return;
  }

  const ctx = canvasElement.getContext('2d');

  const defaultCanvWidth = 150;
  const defaultCanvHeight = 50;
  const lineWidth = 0.5;
  const frequLnum = 50;
  const minBarHeight = 2;

  const centerX = defaultCanvWidth / 2;

  // Redefinir o tamanho do canvas ao padrão desejado
  canvasElement.width = defaultCanvWidth;
  canvasElement.height = defaultCanvHeight;

  const draw = () => {
    if (status === 'recording' || status === 'micTest' || status === 'upload') {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const backgroundColor = '#FFF';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      ctx.strokeStyle = animationRecordingColor;
      ctx.lineWidth = lineWidth;

      const h = defaultCanvHeight;

      for (let i = 0; i < frequLnum; i++) {
        const normalizedIndex = (i / (frequLnum - 1)) * 2 - 1;
        const xOffset = normalizedIndex * (defaultCanvWidth / 2);
        const distanceFromCenter = Math.abs(normalizedIndex);
        const intensity = 1 - distanceFromCenter;
        const barHeight = Math.max(dataArray[i] * intensity, minBarHeight);
        const space = (h - barHeight) / 2 + 2;

        ctx.beginPath();
        ctx.moveTo(centerX + xOffset, space);
        ctx.lineTo(centerX + xOffset, h - space);
        ctx.stroke();

        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(centerX - xOffset, space);
          ctx.lineTo(centerX - xOffset, h - space);
          ctx.stroke();
        }
      }
    } else if (status === 'paused') {
      requestAnimationFrame(draw);

      ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const backgroundColor = '#FFF';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const dashLineColor = animationPausedColor;

      ctx.strokeStyle = dashLineColor;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([3, 2]);

      const h = defaultCanvHeight;
      const centerY = defaultCanvHeight / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(defaultCanvWidth, centerY);
      ctx.stroke();

      ctx.setLineDash([]);
    } else {
      canvasElement.width = 0;
      canvasElement.height = 0;
    }
  };

  if (status === 'waiting' || status === 'finished') {
    canvasElement.classList.add('hidden');
  } else {
    canvasElement.classList.remove('hidden');
    draw();
  }
}
