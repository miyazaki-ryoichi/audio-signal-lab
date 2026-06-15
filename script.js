const audioFile = document.querySelector("#audioFile");
const fileName = document.querySelector("#fileName");
const durationLabel = document.querySelector("#duration");
const sampleRateLabel = document.querySelector("#sampleRate");
const peakLevelLabel = document.querySelector("#peakLevel");
const dominantFreqLabel = document.querySelector("#dominantFreq");
const playOriginal = document.querySelector("#playOriginal");
const playProcessed = document.querySelector("#playProcessed");
const stopAudio = document.querySelector("#stopAudio");
const downloadLink = document.querySelector("#downloadLink");
const cutoff = document.querySelector("#cutoff");
const qFactor = document.querySelector("#qFactor");
const gain = document.querySelector("#gain");
const cutoffValue = document.querySelector("#cutoffValue");
const qValue = document.querySelector("#qValue");
const gainValue = document.querySelector("#gainValue");
const normalize = document.querySelector("#normalize");
const monoMix = document.querySelector("#monoMix");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const waveCanvas = document.querySelector("#waveCanvas");
const spectrumCanvas = document.querySelector("#spectrumCanvas");
const samplingCanvas = document.querySelector("#samplingCanvas");
const signalFreq = document.querySelector("#signalFreq");
const lessonSampleRate = document.querySelector("#lessonSampleRate");
const timeWindow = document.querySelector("#timeWindow");
const signalFreqValue = document.querySelector("#signalFreqValue");
const lessonSampleRateValue = document.querySelector("#lessonSampleRateValue");
const timeWindowValue = document.querySelector("#timeWindowValue");
const nyquistStatus = document.querySelector("#nyquistStatus");
const nyquistFreq = document.querySelector("#nyquistFreq");
const aliasFreq = document.querySelector("#aliasFreq");
const samplingNote = document.querySelector("#samplingNote");
const moduleButtons = [...document.querySelectorAll("[data-module-target]")];
const moduleViews = [...document.querySelectorAll("[data-module]")];
const canvases = [waveCanvas, spectrumCanvas, samplingCanvas];

const state = {
  context: null,
  originalBuffer: null,
  processedBuffer: null,
  currentSource: null,
  filterType: "lowpass",
  objectUrl: null,
};

const ensureContext = () => {
  if (!state.context) {
    state.context = new AudioContext();
  }
  return state.context;
};

const formatSeconds = (seconds) => `${seconds.toFixed(2)} s`;
const formatHz = (hz) => `${Math.round(hz).toLocaleString()} Hz`;

function setEnabled(enabled) {
  [playOriginal, playProcessed, stopAudio].forEach((button) => {
    button.disabled = !enabled;
  });
  downloadLink.classList.toggle("disabled", !enabled);
  downloadLink.setAttribute("aria-disabled", String(!enabled));
}

function updateControlLabels() {
  cutoffValue.value = formatHz(Number(cutoff.value));
  qValue.value = Number(qFactor.value).toFixed(2);
  gainValue.value = `${Number(gain.value).toFixed(1)} dB`;
}

function getMonoData(buffer) {
  if (!buffer) return new Float32Array();
  if (!monoMix.checked || buffer.numberOfChannels === 1) {
    return buffer.getChannelData(0);
  }

  const mixed = new Float32Array(buffer.length);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i += 1) {
      mixed[i] += data[i] / buffer.numberOfChannels;
    }
  }
  return mixed;
}

function getPeakDb(buffer) {
  const data = getMonoData(buffer);
  let peak = 0;
  for (let i = 0; i < data.length; i += 1) {
    peak = Math.max(peak, Math.abs(data[i]));
  }
  if (peak === 0) return "-inf dBFS";
  return `${(20 * Math.log10(peak)).toFixed(1)} dBFS`;
}

function drawGrid(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfcf8";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#dbe3dc";
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += width / 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += height / 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawWaveform() {
  fitCanvas(waveCanvas);
  const ctx = waveCanvas.getContext("2d");
  const { width, height } = waveCanvas;
  drawGrid(ctx, width, height);

  if (!state.originalBuffer) {
    ctx.fillStyle = "#5f6b66";
    ctx.font = "700 26px system-ui";
    ctx.fillText("Drop in an audio file", 34, height / 2);
    return;
  }

  const original = getMonoData(state.originalBuffer);
  const processed = getMonoData(state.processedBuffer);
  drawSignalLine(ctx, original, width, height, "#0b4f6c", height * 0.34);
  drawSignalLine(ctx, processed, width, height, "#d95d39", height * 0.66);
}

function drawSignalLine(ctx, data, width, height, color, centerY) {
  const stride = Math.max(1, Math.floor(data.length / width));
  const scale = height * 0.22;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let x = 0; x < width; x += 1) {
    const start = x * stride;
    let min = 1;
    let max = -1;
    for (let i = 0; i < stride && start + i < data.length; i += 1) {
      const sample = data[start + i];
      min = Math.min(min, sample);
      max = Math.max(max, sample);
    }
    ctx.moveTo(x, centerY - max * scale);
    ctx.lineTo(x, centerY - min * scale);
  }
  ctx.stroke();
}

function drawSpectrum() {
  fitCanvas(spectrumCanvas);
  const ctx = spectrumCanvas.getContext("2d");
  const { width, height } = spectrumCanvas;
  drawGrid(ctx, width, height);

  if (!state.processedBuffer) return;

  const data = getMonoData(state.processedBuffer);
  const fftSize = 2048;
  const start = Math.max(0, Math.floor((data.length - fftSize) / 2));
  const bins = new Float32Array(fftSize / 2);
  let maxMagnitude = 0;
  let dominantBin = 0;

  for (let k = 0; k < bins.length; k += 1) {
    let real = 0;
    let imag = 0;
    for (let n = 0; n < fftSize; n += 1) {
      const sample = data[start + n] || 0;
      const window = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (fftSize - 1));
      const angle = (2 * Math.PI * k * n) / fftSize;
      real += sample * window * Math.cos(angle);
      imag -= sample * window * Math.sin(angle);
    }
    const magnitude = Math.sqrt(real * real + imag * imag);
    bins[k] = magnitude;
    if (magnitude > maxMagnitude) {
      maxMagnitude = magnitude;
      dominantBin = k;
    }
  }

  const barWidth = width / bins.length;
  ctx.fillStyle = "#2b8a3e";
  for (let i = 1; i < bins.length; i += 1) {
    const db = 20 * Math.log10((bins[i] / maxMagnitude) || 0.000001);
    const normalized = Math.max(0, (db + 72) / 72);
    const barHeight = normalized * (height - 28);
    ctx.fillRect(i * barWidth, height - barHeight, Math.max(1, barWidth), barHeight);
  }

  const hz = (dominantBin * state.processedBuffer.sampleRate) / fftSize;
  dominantFreqLabel.textContent = formatHz(hz);
}

function drawSamplingLesson() {
  fitCanvas(samplingCanvas);
  const ctx = samplingCanvas.getContext("2d");
  const { width, height } = samplingCanvas;
  const padding = {
    top: height * 0.11,
    right: width * 0.04,
    bottom: height * 0.16,
    left: width * 0.07,
  };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const centerY = padding.top + plotHeight / 2;
  const amplitude = plotHeight * 0.36;
  const freq = Number(signalFreq.value);
  const sampleRate = Number(lessonSampleRate.value);
  const seconds = Number(timeWindow.value) / 1000;
  const sampleCount = Math.floor(seconds * sampleRate) + 1;
  const nyquist = sampleRate / 2;
  const alias = getAliasFrequency(freq, sampleRate);
  const isNyquistOk = freq < nyquist;

  drawGrid(ctx, width, height);
  drawAxis(ctx, padding, plotWidth, centerY, height);

  const toX = (time) => padding.left + (time / seconds) * plotWidth;
  const toY = (value) => centerY - value * amplitude;
  const source = (time) => Math.sin(2 * Math.PI * freq * time);
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const time = index / sampleRate;
    return { time, value: source(time) };
  });

  drawContinuousSignal(ctx, seconds, toX, toY, source, "#0b4f6c", 3);
  drawReconstructedSignal(ctx, samples, sampleRate, seconds, toX, toY, "#d95d39", 2.5);
  drawSamplePoints(ctx, samples, toX, toY);
  drawSamplingLabels(ctx, padding, plotWidth, height, seconds, sampleRate);

  signalFreqValue.value = formatHz(freq);
  lessonSampleRateValue.value = formatHz(sampleRate);
  timeWindowValue.value = `${Math.round(seconds * 1000)} ms`;
  nyquistFreq.textContent = formatHz(nyquist);
  aliasFreq.textContent = formatHz(alias);
  nyquistStatus.textContent = isNyquistOk ? "Nyquist OK" : "Aliasing";
  nyquistStatus.style.color = isNyquistOk ? "#0f766e" : "#d95d39";
  samplingNote.textContent = isNyquistOk
    ? "サンプルレートが信号周波数の2倍を超えているため、赤いsinc復元波形は青い元波形に近づきます。"
    : "ナイキスト周波数を超えています。サンプル点だけを見ると、別の低い周波数として観測されます。";
}

function drawAxis(ctx, padding, plotWidth, centerY, height) {
  ctx.strokeStyle = "#9aa6a1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, centerY);
  ctx.lineTo(padding.left + plotWidth, centerY);
  ctx.stroke();

  ctx.fillStyle = "#5f6b66";
  ctx.font = "700 24px system-ui";
  ctx.fillText("+1", padding.left * 0.35, centerY - height * 0.28);
  ctx.fillText("0", padding.left * 0.5, centerY + 8);
  ctx.fillText("-1", padding.left * 0.35, centerY + height * 0.3);
}

function drawContinuousSignal(ctx, seconds, toX, toY, source, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  const steps = Math.min(1600, Math.max(360, Math.floor(seconds * 30000)));
  for (let i = 0; i <= steps; i += 1) {
    const time = (i / steps) * seconds;
    const x = toX(time);
    const y = toY(source(time));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawReconstructedSignal(ctx, samples, sampleRate, seconds, toX, toY, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();

  const steps = Math.min(1200, Math.max(260, Math.floor(seconds * 22000)));
  for (let i = 0; i <= steps; i += 1) {
    const time = (i / steps) * seconds;
    const value = reconstructSinc(samples, sampleRate, time);
    const x = toX(time);
    const y = toY(value);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSamplePoints(ctx, samples, toX, toY) {
  ctx.fillStyle = "#172121";
  ctx.strokeStyle = "rgba(23, 33, 33, 0.28)";
  ctx.lineWidth = 1;

  samples.forEach(({ time, value }) => {
    const x = toX(time);
    const y = toY(value);
    ctx.beginPath();
    ctx.moveTo(x, toY(0));
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSamplingLabels(ctx, padding, plotWidth, height, seconds, sampleRate) {
  ctx.fillStyle = "#172121";
  ctx.font = "800 24px system-ui";
  ctx.fillText("Original", padding.left, padding.top * 0.62);
  ctx.fillStyle = "#0b4f6c";
  ctx.fillRect(padding.left + 120, padding.top * 0.49, 34, 6);
  ctx.fillStyle = "#172121";
  ctx.fillText("sinc reconstruction", padding.left + 178, padding.top * 0.62);
  ctx.strokeStyle = "#d95d39";
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(padding.left + 400, padding.top * 0.52);
  ctx.lineTo(padding.left + 440, padding.top * 0.52);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#5f6b66";
  ctx.font = "700 22px system-ui";
  ctx.fillText(`Window ${Math.round(seconds * 1000)} ms`, padding.left, height - padding.bottom * 0.38);
  ctx.fillText(`Ts ${(1000 / sampleRate).toFixed(2)} ms`, padding.left + plotWidth * 0.42, height - padding.bottom * 0.38);
}

function reconstructSinc(samples, sampleRate, time) {
  let sum = 0;
  const center = time * sampleRate;
  const radius = 18;

  samples.forEach(({ value }, index) => {
    if (Math.abs(index - center) > radius) return;
    sum += value * sinc(center - index);
  });
  return Math.max(-1.3, Math.min(1.3, sum));
}

function sinc(x) {
  if (Math.abs(x) < 0.000001) return 1;
  return Math.sin(Math.PI * x) / (Math.PI * x);
}

function getAliasFrequency(freq, sampleRate) {
  const folded = Math.abs(((freq + sampleRate / 2) % sampleRate) - sampleRate / 2);
  return Math.min(folded, sampleRate / 2);
}

function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * scale));
  const height = Math.max(1, Math.round(rect.height * scale));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function activateModule(moduleName) {
  moduleButtons.forEach((button) => {
    const isActive = button.dataset.moduleTarget === moduleName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  moduleViews.forEach((view) => {
    view.classList.toggle("active", view.dataset.module === moduleName);
  });

  requestAnimationFrame(() => {
    drawWaveform();
    drawSpectrum();
    drawSamplingLesson();
  });
}

async function processAudio() {
  if (!state.originalBuffer) return;

  const source = state.originalBuffer;
  const offline = new OfflineAudioContext(
    source.numberOfChannels,
    source.length,
    source.sampleRate
  );
  const bufferSource = offline.createBufferSource();
  const filter = offline.createBiquadFilter();
  const gainNode = offline.createGain();

  bufferSource.buffer = source;
  filter.type = state.filterType;
  filter.frequency.value = Number(cutoff.value);
  filter.Q.value = Number(qFactor.value);
  filter.gain.value = Number(gain.value);
  gainNode.gain.value = 10 ** (Number(gain.value) / 20);

  bufferSource.connect(filter).connect(gainNode).connect(offline.destination);
  bufferSource.start();

  state.processedBuffer = await offline.startRendering();
  if (normalize.checked) normalizeBuffer(state.processedBuffer);

  peakLevelLabel.textContent = getPeakDb(state.processedBuffer);
  drawWaveform();
  drawSpectrum();
  refreshDownload();
}

function normalizeBuffer(buffer) {
  let peak = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i += 1) {
      peak = Math.max(peak, Math.abs(data[i]));
    }
  }

  if (peak < 0.000001 || peak >= 0.99) return;
  const scale = 0.99 / peak;
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i += 1) {
      data[i] *= scale;
    }
  }
}

function playBuffer(buffer) {
  if (!buffer) return;
  const context = ensureContext();
  stopCurrent();
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
  state.currentSource = source;
  source.onended = () => {
    if (state.currentSource === source) state.currentSource = null;
  };
}

function stopCurrent() {
  if (!state.currentSource) return;
  try {
    state.currentSource.stop();
  } catch {
    // The source may already have ended.
  }
  state.currentSource = null;
}

function refreshDownload() {
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  if (!state.processedBuffer) return;

  const wav = encodeWav(state.processedBuffer);
  state.objectUrl = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
  downloadLink.href = state.objectUrl;
  downloadLink.classList.remove("disabled");
  downloadLink.setAttribute("aria-disabled", "false");
}

function encodeWav(buffer) {
  const channels = buffer.numberOfChannels;
  const samples = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const wav = new ArrayBuffer(44 + samples * blockAlign);
  const view = new DataView(wav);
  let offset = 0;

  const writeString = (text) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
    offset += text.length;
  };

  writeString("RIFF");
  view.setUint32(offset, 36 + samples * blockAlign, true); offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, channels, true); offset += 2;
  view.setUint32(offset, buffer.sampleRate, true); offset += 4;
  view.setUint32(offset, buffer.sampleRate * blockAlign, true); offset += 4;
  view.setUint16(offset, blockAlign, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString("data");
  view.setUint32(offset, samples * blockAlign, true); offset += 4;

  for (let i = 0; i < samples; i += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return wav;
}

audioFile.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const context = ensureContext();
  const arrayBuffer = await file.arrayBuffer();
  state.originalBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
  fileName.textContent = file.name;
  durationLabel.textContent = formatSeconds(state.originalBuffer.duration);
  sampleRateLabel.textContent = `${state.originalBuffer.sampleRate.toLocaleString()} Hz`;
  setEnabled(true);
  await processAudio();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    state.filterType = button.dataset.filter;
    await processAudio();
  });
});

[cutoff, qFactor, gain, normalize, monoMix].forEach((control) => {
  control.addEventListener("input", async () => {
    updateControlLabels();
    await processAudio();
  });
});

[signalFreq, lessonSampleRate, timeWindow].forEach((control) => {
  control.addEventListener("input", drawSamplingLesson);
});

moduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateModule(button.dataset.moduleTarget);
  });
});

playOriginal.addEventListener("click", () => playBuffer(state.originalBuffer));
playProcessed.addEventListener("click", () => playBuffer(state.processedBuffer));
stopAudio.addEventListener("click", stopCurrent);

updateControlLabels();
setEnabled(false);
drawWaveform();
drawSpectrum();
drawSamplingLesson();

window.addEventListener("resize", () => {
  canvases.forEach(fitCanvas);
  drawWaveform();
  drawSpectrum();
  drawSamplingLesson();
});
