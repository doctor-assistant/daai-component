export async function startMicTestAnimation() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (!this.canvas) {
      console.error('Canvas não encontrado!');
      return;
    }

    const canvasCtx = this.canvas.getContext('2d');
    const WIDTH = this.canvas.width;
    const HEIGHT = 50;
    source.connect(analyser);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      const barWidth = 20;
      const barSpacing = 12;
      let barHeight;
      const numberOfBars = 6;
      const totalWidth = numberOfBars * barWidth + (numberOfBars - 1) * barSpacing;
      let x = (WIDTH - totalWidth) / 2;

      for (let i = 0; i < numberOfBars; i++) {
        barHeight = dataArray[i];

        canvasCtx.fillStyle = '#DFE4EA';
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + barSpacing;
      }
    };

    draw();
  } catch (error) {
    console.error('Erro ao capturar o áudio:', error);
  }
}


export async function StartAnimationRecording(analyser, dataArray, bufferLength, canvasElement, status) {
  const canvas = canvasElement;
  const ctx = canvas.getContext('2d');

  const defaultCanvWidth = 250;
  const defaultCanvHeight = 50;
  const lineWidth = 0.5;
  const frequLnum = 50;
  const minBarHeight = 2;

  const centerX = defaultCanvWidth / 2;

  const draw = () => {
    if (status === 'recording' || status === 'micTest') {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvas.width = defaultCanvWidth;
      canvas.height = defaultCanvHeight;

      ctx.clearRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const backgroundColor = '#FFF';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, defaultCanvWidth, defaultCanvHeight);

      const barColor = '#F43F5E';
      ctx.strokeStyle = barColor;
      ctx.lineWidth = lineWidth;

      const h = defaultCanvHeight;

      for (let i = 0; i < frequLnum; i++) {
        const normalizedIndex = i / (frequLnum - 1) * 2 - 1;
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

      const dashLineColor = '#009CB1';
      ctx.strokeStyle = dashLineColor;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([3, 5]);

      const h = defaultCanvHeight;
      const centerY = defaultCanvHeight / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(defaultCanvWidth, centerY);
      ctx.stroke();

      ctx.setLineDash([]);
    } else {
      canvas.width = 0;
      canvas.height = 0;
    }
  };

  if (status === 'waiting' || status === 'finished') {
    canvas.classList.add('hidden');
  } else {
    canvas.classList.remove('hidden');
    draw();
  }
}
