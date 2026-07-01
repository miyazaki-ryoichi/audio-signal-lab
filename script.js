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
const aliasCanvas = document.querySelector("#aliasCanvas");
const ltiTimeCanvas = document.querySelector("#ltiTimeCanvas");
const ltiFreqCanvas = document.querySelector("#ltiFreqCanvas");
const filterTimeCanvas = document.querySelector("#filterTimeCanvas");
const poleZeroCanvas = document.querySelector("#poleZeroCanvas");
const filterFreqCanvas = document.querySelector("#filterFreqCanvas");
const zSequenceCanvas = document.querySelector("#zSequenceCanvas");
const zPlaneCanvas = document.querySelector("#zPlaneCanvas");
const zSignalSelect = document.querySelector("#zSignalSelect");
const zA = document.querySelector("#zA");
const zOmega = document.querySelector("#zOmega");
const zSamples = document.querySelector("#zSamples");
const zAValue = document.querySelector("#zAValue");
const zOmegaValue = document.querySelector("#zOmegaValue");
const zSampleValue = document.querySelector("#zSampleValue");
const zSignalSummary = document.querySelector("#zSignalSummary");
const zFormula = document.querySelector("#zFormula");
const zRoc = document.querySelector("#zRoc");
const zInsightList = document.querySelector("#zInsightList");
const windowTimeCanvas = document.querySelector("#windowTimeCanvas");
const windowResponseCanvas = document.querySelector("#windowResponseCanvas");
const leakageCanvas = document.querySelector("#leakageCanvas");
const signalFreq = document.querySelector("#signalFreq");
const lessonSampleRate = document.querySelector("#lessonSampleRate");
const timeWindow = document.querySelector("#timeWindow");
const showSinc = document.querySelector("#showSinc");
const ltiProbe = document.querySelector("#ltiProbe");
const ltiProbeValue = document.querySelector("#ltiProbeValue");
const ltiSystemName = document.querySelector("#ltiSystemName");
const firTaps = document.querySelector("#firTaps");
const firTapValue = document.querySelector("#firTapValue");
const tapControlText = document.querySelector("#tapControlText");
const filterCutoff = document.querySelector("#filterCutoff");
const filterCutoffValue = document.querySelector("#filterCutoffValue");
const filterBandwidth = document.querySelector("#filterBandwidth");
const filterBandwidthValue = document.querySelector("#filterBandwidthValue");
const bandwidthControl = document.querySelector("#bandwidthControl");
const playFilterInput = document.querySelector("#playFilterInput");
const playFilterOutput = document.querySelector("#playFilterOutput");
const poleRadiusControl = document.querySelector("#poleRadiusControl");
const poleRadius = document.querySelector("#poleRadius");
const poleRadiusValue = document.querySelector("#poleRadiusValue");
const stabilityStatus = document.querySelector("#stabilityStatus");
const windowName = document.querySelector("#windowName");
const lobeReadout = document.querySelector("#lobeReadout");
const leakageReadout = document.querySelector("#leakageReadout");
const toneBin = document.querySelector("#toneBin");
const toneBinValue = document.querySelector("#toneBinValue");
const weakToneGap = document.querySelector("#weakToneGap");
const weakToneGapValue = document.querySelector("#weakToneGapValue");
const weakToneLevel = document.querySelector("#weakToneLevel");
const weakToneLevelValue = document.querySelector("#weakToneLevelValue");
const windowSize = document.querySelector("#windowSize");
const windowSizeValue = document.querySelector("#windowSizeValue");
const resetWindowLab = document.querySelector("#resetWindowLab");
const signalFreqValue = document.querySelector("#signalFreqValue");
const lessonSampleRateValue = document.querySelector("#lessonSampleRateValue");
const timeWindowValue = document.querySelector("#timeWindowValue");
const nyquistStatus = document.querySelector("#nyquistStatus");
const nyquistFreq = document.querySelector("#nyquistFreq");
const aliasFreq = document.querySelector("#aliasFreq");
const spectrogramStatus = document.querySelector("#spectrogramStatus");
const samplingNote = document.querySelector("#samplingNote");
const moduleButtons = [...document.querySelectorAll("[data-module-target]")];
const moduleViews = [...document.querySelectorAll("[data-module]")];
const ltiInputButtons = [...document.querySelectorAll("[data-lti-input]")];
const ltiSystemButtons = [...document.querySelectorAll("[data-lti-system]")];
const filterFamilyButtons = [...document.querySelectorAll("[data-filter-family]")];
const filterModeButtons = [...document.querySelectorAll("[data-filter-mode]")];
const filterApproxButtons = [...document.querySelectorAll("[data-filter-approx]")];
const windowTypeButtons = [...document.querySelectorAll("[data-window-type]")];
const canvases = [
  waveCanvas,
  spectrumCanvas,
  samplingCanvas,
  aliasCanvas,
  ltiTimeCanvas,
  ltiFreqCanvas,
  filterTimeCanvas,
  poleZeroCanvas,
  filterFreqCanvas,
  zSequenceCanvas,
  zPlaneCanvas,
  windowTimeCanvas,
  windowResponseCanvas,
  leakageCanvas,
];

const state = {
  context: null,
  originalBuffer: null,
  processedBuffer: null,
  currentSource: null,
  filterType: "lowpass",
  ltiInput: "impulse",
  ltiSystem: "average",
  filterFamily: "fir",
  filterMode: "lowpass",
  filterApprox: "butterworth",
  filterImpulse: [],
  zSignal: "geometric",
  zA: 0.6,
  zOmega: 0.75,
  zSamples: 22,
  windowType: "rect",
  objectUrl: null,
};

const windowDefaults = {
  type: "rect",
  toneBin: 7.3,
  weakGap: 4,
  weakLevel: -38,
  size: 64,
};

const zSignals = {
  impulse: {
    label: "Impulse δ[n]",
    formula: () => String.raw`X(z)=1`,
    roc: () => String.raw`\mathrm{ROC}: \text{all } z`,
    summary: "finite sequence",
    sequence: (n) => (n === 0 ? 1 : 0),
    poles: () => [],
    zeros: () => [],
    insights: () => [
      "極がないので有限長列として扱えます。",
      "インパルス応答が δ[n] のシステムは恒等システムです。",
      "他のシステムの応答を見るための基準入力になります。",
    ],
  },
  step: {
    label: "Step u[n]",
    formula: () => String.raw`X(z)=\frac{z}{z-1}=\frac{1}{1-z^{-1}}`,
    roc: () => String.raw`\mathrm{ROC}: |z|>1`,
    summary: "pole at z = 1",
    sequence: (n) => (n >= 0 ? 1 : 0),
    poles: () => [{ re: 1, im: 0 }],
    zeros: () => [{ re: 0, im: 0 }],
    insights: () => [
      "ROCが外側なので右側列、つまり因果的な列として読めます。",
      "極が単位円上にあるため、絶対総和可能ではありません。",
      "最終値定理などを使うときは、極の位置条件を確認する必要があります。",
    ],
  },
  geometric: {
    label: "Geometric a^n u[n]",
    formula: () => String.raw`X(z)=\frac{z}{z-${formatNumber(state.zA)}}=\frac{1}{1-${formatNumber(state.zA)}z^{-1}}`,
    roc: () => String.raw`\mathrm{ROC}: |z|>${formatNumber(Math.abs(state.zA))}`,
    summary: () => `pole at z = ${formatNumber(state.zA)}`,
    sequence: (n) => (n >= 0 ? state.zA ** n : 0),
    poles: () => [{ re: state.zA, im: 0 }],
    zeros: () => [{ re: 0, im: 0 }],
    insights: () => [
      `極は z = ${formatNumber(state.zA)} にあります。`,
      Math.abs(state.zA) < 1 ? "|a| < 1 なので時間列は減衰します。" : "|a| ≥ 1 なので時間列は減衰しません。",
      Math.abs(state.zA) < 1 ? "因果IIRの安定な基本例として読めます。" : "因果IIRとしては不安定側の例です。",
    ],
  },
  ramp: {
    label: "Ramp n u[n]",
    formula: () => String.raw`X(z)=\frac{z}{(z-1)^2}`,
    roc: () => String.raw`\mathrm{ROC}: |z|>1`,
    summary: "double pole at z = 1",
    sequence: (n) => (n >= 0 ? n : 0),
    poles: () => [
      { re: 1, im: 0 },
      { re: 1, im: 0, offset: 1 },
    ],
    zeros: () => [{ re: 0, im: 0 }],
    insights: () => [
      "z = 1 に2重極があるため、単位ステップより強く発散します。",
      "極の重複度は、時間領域での多項式的な増加と対応します。",
      "ROCは外側ですが、単位円上に極があるため安定な応答ではありません。",
    ],
  },
  cosine: {
    label: "Cosine cos(nωT)u[n]",
    formula: () => String.raw`X(z)=\frac{z(z-\cos ${formatNumber(state.zOmega)})}{z^2-2z\cos ${formatNumber(state.zOmega)}+1}`,
    roc: () => String.raw`\mathrm{ROC}: |z|>1`,
    summary: () => `poles at e^±j${formatNumber(state.zOmega)}`,
    sequence: (n) => (n >= 0 ? Math.cos(n * state.zOmega) : 0),
    poles: () => [
      { re: Math.cos(state.zOmega), im: Math.sin(state.zOmega) },
      { re: Math.cos(state.zOmega), im: -Math.sin(state.zOmega) },
    ],
    zeros: () => [{ re: Math.cos(state.zOmega), im: 0 }],
    insights: () => [
      "極の角度が振動の速さに対応します。",
      "極が単位円上にあるので、振幅は減衰せず振動が続きます。",
      "フィルタやDFTの章では、この角度が周波数の読み取りにつながります。",
    ],
  },
};

const ensureContext = () => {
  if (!state.context) {
    state.context = new AudioContext();
  }
  return state.context;
};

const formatSeconds = (seconds) => `${seconds.toFixed(2)} s`;
const formatHz = (hz) => `${Math.round(hz).toLocaleString()} Hz`;
const formatNumber = (value) => {
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? "0" : rounded.toFixed(2).replace(/\.?0+$/, "");
};

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
  if (showSinc.checked) {
    drawSincComponents(ctx, samples, sampleRate, seconds, toX, toY);
  }
  drawReconstructedSignal(ctx, samples, sampleRate, seconds, toX, toY, "#d95d39", 2.5);
  drawSamplePoints(ctx, samples, toX, toY);
  drawSamplingLabels(ctx, padding, plotWidth, height, seconds, sampleRate);
  drawAliasSpectrogram();

  signalFreqValue.value = formatHz(freq);
  lessonSampleRateValue.value = formatHz(sampleRate);
  timeWindowValue.value = `${Math.round(seconds * 1000)} ms`;
  nyquistFreq.textContent = formatHz(nyquist);
  aliasFreq.textContent = formatHz(alias);
  spectrogramStatus.textContent = `Observed ${formatHz(alias)}`;
  nyquistStatus.textContent = isNyquistOk ? "Nyquist OK" : "Aliasing";
  nyquistStatus.style.color = isNyquistOk ? "#0f766e" : "#d95d39";
  samplingNote.textContent = isNyquistOk
    ? "薄い線が各サンプル点のsinc成分です。これらを足し合わせると、赤い復元波形が青い元波形に近づきます。"
    : "ナイキスト周波数を超えています。サンプル点からは、下のスペクトログラムに出る低い周波数として観測されます。";
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

function drawSincComponents(ctx, samples, sampleRate, seconds, toX, toY) {
  const maxKernels = 23;
  const stride = Math.max(1, Math.ceil(samples.length / maxKernels));
  const steps = Math.min(900, Math.max(240, Math.floor(seconds * 18000)));

  samples.forEach((sample, index) => {
    if (index % stride !== 0) return;
    const alpha = 0.08 + Math.min(0.18, Math.abs(sample.value) * 0.16);
    ctx.strokeStyle = `rgba(217, 93, 57, ${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();

    for (let i = 0; i <= steps; i += 1) {
      const time = (i / steps) * seconds;
      const value = sample.value * sinc(time * sampleRate - index);
      const x = toX(time);
      const y = toY(value);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
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
  ctx.fillText("sinc sum", padding.left + 178, padding.top * 0.62);
  ctx.strokeStyle = "#d95d39";
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(padding.left + 285, padding.top * 0.52);
  ctx.lineTo(padding.left + 325, padding.top * 0.52);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(217, 93, 57, 0.45)";
  ctx.fillText("components", padding.left + 355, padding.top * 0.62);

  ctx.fillStyle = "#5f6b66";
  ctx.font = "700 22px system-ui";
  ctx.fillText(`Window ${Math.round(seconds * 1000)} ms`, padding.left, height - padding.bottom * 0.38);
  ctx.fillText(`Ts ${(1000 / sampleRate).toFixed(2)} ms`, padding.left + plotWidth * 0.42, height - padding.bottom * 0.38);
}

function drawAliasSpectrogram() {
  fitCanvas(aliasCanvas);
  const ctx = aliasCanvas.getContext("2d");
  const { width, height } = aliasCanvas;
  const padding = {
    top: height * 0.14,
    right: width * 0.04,
    bottom: height * 0.2,
    left: width * 0.08,
  };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const freq = Number(signalFreq.value);
  const sampleRate = Number(lessonSampleRate.value);
  const nyquist = sampleRate / 2;
  const alias = getAliasFrequency(freq, sampleRate);
  const yMax = Math.max(1000, Math.ceil(Math.max(freq, nyquist) * 1.18 / 250) * 250);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfcf8";
  ctx.fillRect(0, 0, width, height);

  const toY = (hz) => padding.top + plotHeight - (hz / yMax) * plotHeight;
  const toX = (ratio) => padding.left + ratio * plotWidth;

  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + plotHeight);
  gradient.addColorStop(0, "rgba(217, 93, 57, 0.16)");
  gradient.addColorStop(Math.max(0, 1 - nyquist / yMax), "rgba(217, 93, 57, 0.07)");
  gradient.addColorStop(1, "rgba(15, 118, 110, 0.08)");
  ctx.fillStyle = gradient;
  ctx.fillRect(padding.left, padding.top, plotWidth, plotHeight);

  ctx.strokeStyle = "#dbe3dc";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i += 1) {
    const x = toX(i / 8);
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + plotHeight);
    ctx.stroke();
  }
  for (let i = 0; i <= 5; i += 1) {
    const hz = (yMax / 5) * i;
    const y = toY(hz);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + plotWidth, y);
    ctx.stroke();
    ctx.fillStyle = "#5f6b66";
    ctx.font = "700 20px system-ui";
    ctx.fillText(formatHz(hz), padding.left * 0.18, y + 7);
  }

  drawSpectrogramBand(ctx, padding, plotWidth, toY(freq), "#0b4f6c", "11, 79, 108", "true signal");
  drawSpectrogramBand(ctx, padding, plotWidth, toY(alias), "#d95d39", "217, 93, 57", "observed");
  drawNyquistBoundary(ctx, padding, plotWidth, toY(nyquist), nyquist);
  drawFoldArrow(ctx, padding, plotWidth, toY(freq), toY(alias), freq > nyquist);

  ctx.fillStyle = "#172121";
  ctx.font = "800 22px system-ui";
  ctx.fillText("time", padding.left + plotWidth - 46, height - padding.bottom * 0.33);
  ctx.save();
  ctx.translate(padding.left * 0.25, padding.top + plotHeight * 0.52);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("frequency", 0, 0);
  ctx.restore();
}

function drawSpectrogramBand(ctx, padding, plotWidth, y, color, rgb, label) {
  const bandGradient = ctx.createLinearGradient(padding.left, 0, padding.left + plotWidth, 0);
  bandGradient.addColorStop(0, `rgba(${rgb}, 0)`);
  bandGradient.addColorStop(0.15, `rgba(${rgb}, 0.74)`);
  bandGradient.addColorStop(0.85, `rgba(${rgb}, 0.74)`);
  bandGradient.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = bandGradient;
  ctx.fillRect(padding.left, y - 8, plotWidth, 16);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(padding.left, y);
  ctx.lineTo(padding.left + plotWidth, y);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "800 20px system-ui";
  ctx.fillText(label, padding.left + 14, y - 14);
}

function drawNyquistBoundary(ctx, padding, plotWidth, y, nyquist) {
  ctx.strokeStyle = "rgba(23, 33, 33, 0.45)";
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 7]);
  ctx.beginPath();
  ctx.moveTo(padding.left, y);
  ctx.lineTo(padding.left + plotWidth, y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#172121";
  ctx.font = "800 20px system-ui";
  ctx.fillText(`Nyquist ${formatHz(nyquist)}`, padding.left + plotWidth - 190, y - 12);
}

function drawFoldArrow(ctx, padding, plotWidth, trueY, aliasY, shouldFold) {
  if (!shouldFold) return;
  const x = padding.left + plotWidth * 0.78;
  ctx.strokeStyle = "#d95d39";
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(x, trueY);
  ctx.quadraticCurveTo(x + plotWidth * 0.08, (trueY + aliasY) / 2, x, aliasY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#d95d39";
  ctx.beginPath();
  ctx.moveTo(x, aliasY);
  ctx.lineTo(x - 9, aliasY - 16);
  ctx.lineTo(x + 9, aliasY - 16);
  ctx.closePath();
  ctx.fill();
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

function drawLtiLab() {
  const x = makeLtiInput(state.ltiInput);
  const h = makeLtiImpulse(state.ltiSystem);
  const y = convolve(x, h).slice(0, x.length);
  const probe = Number(ltiProbe.value);

  ltiProbeValue.value = probe;
  ltiSystemName.textContent = {
    average: "Moving average",
    echo: "Echo",
    edge: "Edge detector",
  }[state.ltiSystem];

  drawLtiTimeDomain(x, h, y, probe);
  drawLtiFrequencyDomain(x, h, y);
}

function makeLtiInput(type) {
  const length = 48;
  const x = new Array(length).fill(0);
  if (type === "impulse") {
    x[8] = 1;
  } else if (type === "step") {
    for (let i = 8; i < length; i += 1) x[i] = 1;
  } else {
    for (let i = 8; i < 28; i += 1) {
      const window = Math.sin(Math.PI * (i - 8) / 20);
      x[i] = Math.sin(2 * Math.PI * 0.13 * i) * window;
    }
  }
  return x;
}

function makeLtiImpulse(type) {
  if (type === "echo") return [1, 0, 0, 0, 0, 0.55, 0, 0, 0, 0.28];
  if (type === "edge") return [1, -1];
  return [0.2, 0.2, 0.2, 0.2, 0.2];
}

function convolve(a, b) {
  const y = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      y[i + j] += a[i] * b[j];
    }
  }
  return y;
}

function drawLtiTimeDomain(x, h, y, probe) {
  fitCanvas(ltiTimeCanvas);
  const ctx = ltiTimeCanvas.getContext("2d");
  const { width, height } = ltiTimeCanvas;
  drawGrid(ctx, width, height);
  const hDisplay = h.concat(new Array(Math.max(0, x.length - h.length)).fill(0));

  const left = width * 0.07;
  const right = width * 0.04;
  const laneHeight = height * 0.24;
  const gap = height * 0.06;
  const lanes = [
    { label: "input x[n]", data: x, color: "#0b4f6c", top: height * 0.08 },
    { label: "impulse response h[n]", data: hDisplay, color: "#d95d39", top: height * 0.08 + laneHeight + gap },
    { label: "output y[n] = x[n] * h[n]", data: y, color: "#2b8a3e", top: height * 0.08 + 2 * (laneHeight + gap) },
  ];

  lanes.forEach((lane) => {
    drawStemSeries(ctx, lane.data, {
      left,
      top: lane.top,
      width: width - left - right,
      height: laneHeight,
      color: lane.color,
      label: lane.label,
      highlightIndex: lane.label.startsWith("output") ? probe : -1,
    });
  });

  ctx.fillStyle = "#172121";
  ctx.font = "800 22px system-ui";
  ctx.fillText(`At n = ${probe}, y[n] is the sum of shifted products`, left, height - height * 0.035);
}

function drawStemSeries(ctx, data, options) {
  const { left, top, width, height, color, label, highlightIndex = -1 } = options;
  const maxAbs = Math.max(0.25, ...data.map((value) => Math.abs(value)));
  const centerY = top + height * 0.54;
  const xStep = width / Math.max(1, data.length - 1);

  ctx.strokeStyle = "#9aa6a1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(left, centerY);
  ctx.lineTo(left + width, centerY);
  ctx.stroke();

  ctx.fillStyle = "#172121";
  ctx.font = "800 21px system-ui";
  ctx.fillText(label, left, top + 22);

  data.forEach((value, index) => {
    const x = left + index * xStep;
    const y = centerY - (value / maxAbs) * height * 0.38;
    const isHighlight = index === highlightIndex;
    ctx.strokeStyle = isHighlight ? "#172121" : color;
    ctx.fillStyle = isHighlight ? "#172121" : color;
    ctx.lineWidth = isHighlight ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, isHighlight ? 6 : 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawLtiFrequencyDomain(x, h, y) {
  fitCanvas(ltiFreqCanvas);
  const ctx = ltiFreqCanvas.getContext("2d");
  const { width, height } = ltiFreqCanvas;
  drawGrid(ctx, width, height);

  const curves = [
    { label: "|X|", data: getMagnitudeResponse(x), color: "#0b4f6c" },
    { label: "|H|", data: getMagnitudeResponse(h), color: "#d95d39" },
    { label: "|Y|", data: getMagnitudeResponse(y), color: "#2b8a3e" },
  ];
  const maxValue = Math.max(0.001, ...curves.flatMap((curve) => curve.data));
  const rect = {
    left: width * 0.08,
    top: height * 0.12,
    width: width * 0.86,
    height: height * 0.68,
  };

  drawFrequencyAxes(ctx, rect, "0", "π");
  curves.forEach((curve, index) => {
    drawResponseCurve(ctx, curve.data, rect, curve.color, maxValue, curve.label, index);
  });
}

function getMagnitudeResponse(signal, bins = 160) {
  const values = [];
  for (let bin = 0; bin < bins; bin += 1) {
    const omega = (Math.PI * bin) / (bins - 1);
    let real = 0;
    let imag = 0;
    signal.forEach((sample, n) => {
      real += sample * Math.cos(-omega * n);
      imag += sample * Math.sin(-omega * n);
    });
    values.push(Math.sqrt(real * real + imag * imag));
  }
  return values;
}

function drawFrequencyAxes(ctx, rect, leftLabel, rightLabel) {
  ctx.strokeStyle = "#9aa6a1";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
  ctx.fillStyle = "#5f6b66";
  ctx.font = "800 20px system-ui";
  ctx.fillText(leftLabel, rect.left, rect.top + rect.height + 34);
  ctx.fillText(rightLabel, rect.left + rect.width - 18, rect.top + rect.height + 34);
  ctx.fillText("magnitude", rect.left, rect.top - 16);
}

function drawResponseCurve(ctx, data, rect, color, maxValue, label, index) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((value, i) => {
    const x = rect.left + (i / (data.length - 1)) * rect.width;
    const y = rect.top + rect.height - (value / maxValue) * rect.height * 0.9;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = "800 22px system-ui";
  ctx.fillText(label, rect.left + 16 + index * 80, rect.top + 34);
}

function drawFilterLab() {
  const requestedTaps = Number(firTaps.value);
  const radius = Number(poleRadius.value);
  const cutoffRatio = Number(filterCutoff.value);
  const bandwidthRatio = Number(filterBandwidth.value);
  const isFir = state.filterFamily === "fir";
  const firTapCount = Math.max(3, requestedTaps % 2 === 0 ? requestedTaps + 1 : requestedTaps);
  const iirOrder = Math.max(1, Math.min(6, requestedTaps));
  const poles = getIirPoles(iirOrder, radius, cutoffRatio, bandwidthRatio, state.filterMode, state.filterApprox);
  const zeros = getIirZeros(iirOrder, cutoffRatio, state.filterMode);
  const iirDenominator = getDenominatorFromPoles(poles);
  const iirNumerator = getNumeratorFromZeros(zeros, state.filterMode, cutoffRatio);
  let impulse = isFir
    ? makeFirImpulse(firTapCount, cutoffRatio, bandwidthRatio, state.filterMode)
    : makeIirImpulse(iirNumerator, iirDenominator, 96);
  impulse = normalizePeakResponse(impulse);
  state.filterImpulse = impulse;

  firTaps.min = isFir ? "3" : "1";
  firTaps.max = isFir ? "63" : "6";
  if (isFir && requestedTaps < 3) firTaps.value = "3";
  if (!isFir && requestedTaps > 6) firTaps.value = "6";
  tapControlText.textContent = isFir ? "FIR taps" : "IIR order";
  firTapValue.value = isFir ? firTapCount : iirOrder;
  filterCutoffValue.value = `${cutoffRatio.toFixed(2)}π`;
  filterBandwidthValue.value = `${bandwidthRatio.toFixed(2)}π`;
  bandwidthControl.hidden = !["bandpass", "notch"].includes(state.filterMode);
  poleRadiusControl.hidden = isFir;
  poleRadiusValue.value = radius.toFixed(2);
  stabilityStatus.textContent = `${isFir ? "FIR" : state.filterApprox === "chebyshev" ? "Chebyshev IIR" : "Butterworth IIR"} / ${state.filterMode} / ${isFir ? `${firTapCount} taps` : `order ${iirOrder}`}`;
  stabilityStatus.style.color = isFir || radius < 1 ? "#0f766e" : "#d95d39";

  drawFilterImpulse(impulse, isFir);
  drawPoleZero(isFir, firTapCount, radius, poles, zeros);
  drawFilterFrequency(impulse);
}

function makeFirImpulse(taps, cutoffRatio, bandwidthRatio, mode) {
  const center = (taps - 1) / 2;
  const lowpass = (ratio) => {
    const normalizedCutoff = Math.max(0.001, Math.min(0.499, ratio)) / 2;
    const tapsRaw = Array.from({ length: taps }, (_, n) => {
      const x = n - center;
      const ideal = Math.abs(x) < 1e-9
        ? 2 * normalizedCutoff
        : Math.sin(2 * Math.PI * normalizedCutoff * x) / (Math.PI * x);
      const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (taps - 1));
      return ideal * window;
    });
    const gain = tapsRaw.reduce((sum, value) => sum + value, 0) || 1;
    return tapsRaw.map((value) => value / gain);
  };

  const delta = Array.from({ length: taps }, (_, n) => (n === center ? 1 : 0));
  if (mode === "lowpass") return lowpass(cutoffRatio);
  if (mode === "highpass") {
    const lp = lowpass(cutoffRatio);
    return lp.map((value, n) => delta[n] - value);
  }

  const lowEdge = Math.max(0.02, cutoffRatio - bandwidthRatio / 2);
  const highEdge = Math.min(0.48, cutoffRatio + bandwidthRatio / 2);
  const band = lowpass(highEdge).map((value, n) => value - lowpass(lowEdge)[n]);
  if (mode === "bandpass") return band;
  return band.map((value, n) => delta[n] - value);
}

function getIirPoles(order, radius, cutoffRatio, bandwidthRatio, mode, approximation) {
  const baseAngle = Math.max(0.08, Math.min(0.48, cutoffRatio)) * Math.PI;
  const pairRadius = (index) => {
    if (approximation !== "chebyshev") return radius;
    const ripple = index % 2 === 0 ? 1.04 : 0.92;
    return Math.max(0.05, Math.min(1.18, radius * ripple));
  };
  const orient = (angle) => (mode === "highpass" ? Math.PI - angle : angle);

  if (mode === "bandpass" || mode === "notch") {
    const spread = Math.max(0.03, bandwidthRatio / 2) * Math.PI;
    const pairs = Math.max(1, Math.ceil(order / 2));
    const poles = [];
    for (let i = 0; i < pairs; i += 1) {
      const offset = pairs === 1 ? 0 : ((i / (pairs - 1)) - 0.5) * spread;
      poles.push(...getPolePair(pairRadius(i), Math.max(0.04, Math.min(Math.PI - 0.04, baseAngle + offset))));
    }
    return poles.slice(0, Math.max(2, order % 2 === 0 ? order : order + 1));
  }

  if (order === 1) return [{ re: mode === "highpass" ? -radius : radius, im: 0 }];
  if (order === 2) return getPolePair(pairRadius(0), orient(baseAngle));
  if (order === 3) {
    const realPole = { re: mode === "highpass" ? -pairRadius(0) : pairRadius(0), im: 0 };
    return [realPole, ...getPolePair(pairRadius(1), orient(baseAngle))];
  }
  const poles = [];
  const pairs = Math.floor(order / 2);
  for (let i = 0; i < pairs; i += 1) {
    const angleScale = 0.72 + (pairs === 1 ? 0 : (0.56 * i) / (pairs - 1));
    const angle = Math.max(0.06 * Math.PI, Math.min(0.49 * Math.PI, baseAngle * angleScale));
    poles.push(...getPolePair(pairRadius(i), orient(angle)));
  }
  if (order % 2 === 1) poles.unshift({ re: mode === "highpass" ? -pairRadius(pairs) : pairRadius(pairs), im: 0 });
  return poles;
}

function getPolePair(radius, angle) {
  return [
    { re: radius * Math.cos(angle), im: radius * Math.sin(angle) },
    { re: radius * Math.cos(angle), im: -radius * Math.sin(angle) },
  ];
}

function getDenominatorFromPoles(poles) {
  let coeffs = [1];
  const remaining = [...poles];
  while (remaining.length > 0) {
    const pole = remaining.shift();
    if (Math.abs(pole.im) < 1e-9) {
      coeffs = convolveReal(coeffs, [1, -pole.re]);
    } else {
      const pairIndex = remaining.findIndex((candidate) =>
        Math.abs(candidate.re - pole.re) < 1e-9 && Math.abs(candidate.im + pole.im) < 1e-9
      );
      if (pairIndex >= 0) remaining.splice(pairIndex, 1);
      const radiusSq = pole.re * pole.re + pole.im * pole.im;
      coeffs = convolveReal(coeffs, [1, -2 * pole.re, radiusSq]);
    }
  }
  return coeffs;
}

function getIirZeros(order, cutoffRatio, mode) {
  if (mode === "bandpass") {
    return Array.from({ length: order }, (_, index) => ({ re: index % 2 === 0 ? 1 : -1, im: 0 }));
  }
  if (mode === "notch") {
    const angle = Math.max(0.08, Math.min(0.48, cutoffRatio)) * Math.PI;
    const zeros = [];
    for (let i = 0; i < Math.max(1, Math.ceil(order / 2)); i += 1) zeros.push(...getPolePair(1, angle));
    return zeros.slice(0, Math.max(2, order % 2 === 0 ? order : order + 1));
  }
  const zero = mode === "highpass" ? 1 : -1;
  return Array.from({ length: order }, () => ({ re: zero, im: 0 }));
}

function getNumeratorFromZeros(zeros, mode, cutoffRatio) {
  let coeffs = getDenominatorFromPoles(zeros);
  const reference = mode === "highpass" ? Math.PI : mode === "bandpass" ? cutoffRatio * Math.PI : 0;
  const gain = evaluateFirAt(coeffs, reference);
  const safeGain = Math.abs(gain) > 1e-9 ? Math.abs(gain) : 1;
  return coeffs.map((value) => value / safeGain);
}

function evaluateFirAt(coeffs, omega) {
  let real = 0;
  let imag = 0;
  coeffs.forEach((value, n) => {
    real += value * Math.cos(-omega * n);
    imag += value * Math.sin(-omega * n);
  });
  return Math.sqrt(real * real + imag * imag);
}

function convolveReal(a, b) {
  const y = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      y[i + j] += a[i] * b[j];
    }
  }
  return y;
}

function makeIirImpulse(numerator, denominator, length) {
  const impulse = new Array(length).fill(0);
  for (let n = 0; n < length; n += 1) {
    let value = 0;
    for (let k = 0; k < numerator.length; k += 1) {
      value += n === k ? numerator[k] : 0;
    }
    for (let k = 1; k < denominator.length; k += 1) {
      if (n - k >= 0) value -= denominator[k] * impulse[n - k];
    }
    impulse[n] = Math.max(-8, Math.min(8, value));
  }
  return impulse;
}

function normalizePeakResponse(impulse) {
  const response = getMagnitudeResponse(impulse, 256);
  const peak = Math.max(0.001, ...response);
  return impulse.map((value) => value / peak);
}

function drawFilterImpulse(impulse, isFir) {
  fitCanvas(filterTimeCanvas);
  const ctx = filterTimeCanvas.getContext("2d");
  const { width, height } = filterTimeCanvas;
  drawGrid(ctx, width, height);
  drawStemSeries(ctx, impulse, {
    left: width * 0.08,
    top: height * 0.16,
    width: width * 0.86,
    height: height * 0.62,
    color: isFir ? "#0b4f6c" : "#d95d39",
    label: isFir ? "FIR impulse response: finite tail" : "IIR impulse response: feedback tail",
  });
}

function drawPoleZero(isFir, taps, radius, poles = [], zeros = []) {
  fitCanvas(poleZeroCanvas);
  const ctx = poleZeroCanvas.getContext("2d");
  const { width, height } = poleZeroCanvas;
  drawGrid(ctx, width, height);

  const size = Math.min(width, height) * 0.62;
  const cx = width / 2;
  const cy = height / 2;
  const scale = size / 2;

  ctx.strokeStyle = "#9aa6a1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - scale * 1.18, cy);
  ctx.lineTo(cx + scale * 1.18, cy);
  ctx.moveTo(cx, cy - scale * 1.18);
  ctx.lineTo(cx, cy + scale * 1.18);
  ctx.stroke();

  if (isFir) {
    for (let m = 1; m < taps; m += 1) {
      const angle = (2 * Math.PI * m) / taps;
      drawZero(ctx, cx + Math.cos(angle) * scale, cy - Math.sin(angle) * scale);
    }
  } else {
    zeros.forEach((zero) => {
      drawZero(ctx, cx + zero.re * scale, cy - zero.im * scale);
    });
    poles.forEach((pole) => {
      drawPole(ctx, cx + pole.re * scale, cy - pole.im * scale);
    });
  }

  ctx.fillStyle = "#172121";
  ctx.font = "800 22px system-ui";
  ctx.fillText(
    isFir ? "FIR zeros from finite impulse" : `${poles.length} poles / ${zeros.length} zeros`,
    width * 0.08,
    height * 0.12
  );
}

function drawZero(ctx, x, y) {
  ctx.strokeStyle = "#0b4f6c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPole(ctx, x, y) {
  ctx.strokeStyle = "#d95d39";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
}

function drawFilterFrequency(impulse) {
  fitCanvas(filterFreqCanvas);
  const ctx = filterFreqCanvas.getContext("2d");
  const { width, height } = filterFreqCanvas;
  drawGrid(ctx, width, height);
  const response = getComplexResponse(impulse, 220);
  const magnitudeDb = response.map((point) => Math.max(-80, 20 * Math.log10(Math.max(1e-5, point.magnitude))));
  const phase = unwrapPhase(response.map((point) => point.phase));
  const magRect = {
    left: width * 0.12,
    top: height * 0.12,
    width: width * 0.78,
    height: height * 0.34,
  };
  const phaseRect = {
    left: width * 0.12,
    top: height * 0.58,
    width: width * 0.78,
    height: height * 0.30,
  };

  drawBodeAxes(ctx, magRect, "Magnitude [dB]", "0 dB", "-80 dB");
  drawBodeCurve(ctx, magnitudeDb, magRect, "#2b8a3e", -80, 8);

  const phaseMin = Math.min(-Math.PI, Math.floor(Math.min(...phase) / Math.PI) * Math.PI);
  const phaseMax = Math.max(Math.PI, Math.ceil(Math.max(...phase) / Math.PI) * Math.PI);
  drawBodeAxes(ctx, phaseRect, "Phase [rad]", `${formatPi(phaseMax)}`, `${formatPi(phaseMin)}`);
  drawBodeCurve(ctx, phase, phaseRect, "#d95d39", phaseMin, phaseMax);

  ctx.fillStyle = "#5f6b66";
  ctx.font = "800 16px system-ui";
  ctx.fillText("0", magRect.left, height - 18);
  ctx.fillText("π", magRect.left + magRect.width - 10, height - 18);
  ctx.fillText("normalized frequency", magRect.left + magRect.width * 0.34, height - 18);
}

function getComplexResponse(signal, bins = 160) {
  const values = [];
  for (let bin = 0; bin < bins; bin += 1) {
    const omega = (Math.PI * bin) / (bins - 1);
    let real = 0;
    let imag = 0;
    signal.forEach((sample, n) => {
      real += sample * Math.cos(-omega * n);
      imag += sample * Math.sin(-omega * n);
    });
    values.push({
      magnitude: Math.sqrt(real * real + imag * imag),
      phase: Math.atan2(imag, real),
    });
  }
  return values;
}

function unwrapPhase(phases) {
  const unwrapped = [];
  let offset = 0;
  let previous = phases[0] ?? 0;
  phases.forEach((phase, index) => {
    if (index > 0) {
      const delta = phase - previous;
      if (delta > Math.PI) offset -= 2 * Math.PI;
      if (delta < -Math.PI) offset += 2 * Math.PI;
    }
    unwrapped.push(phase + offset);
    previous = phase;
  });
  return unwrapped;
}

function drawBodeAxes(ctx, rect, label, topLabel, bottomLabel) {
  ctx.strokeStyle = "#9aa6a1";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
  ctx.strokeStyle = "rgba(154, 166, 161, 0.55)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    const y = rect.top + (rect.height * i) / 4;
    ctx.beginPath();
    ctx.moveTo(rect.left, y);
    ctx.lineTo(rect.left + rect.width, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#5f6b66";
  ctx.font = "800 16px system-ui";
  ctx.fillText(label, rect.left, rect.top - 12);
  ctx.fillText(topLabel, rect.left + rect.width + 10, rect.top + 6);
  ctx.fillText(bottomLabel, rect.left + rect.width + 10, rect.top + rect.height);
}

function drawBodeCurve(ctx, data, rect, color, minValue, maxValue) {
  const span = Math.max(1e-9, maxValue - minValue);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = rect.left + (index / (data.length - 1)) * rect.width;
    const clamped = Math.max(minValue, Math.min(maxValue, value));
    const y = rect.top + rect.height - ((clamped - minValue) / span) * rect.height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function formatPi(value) {
  if (Math.abs(value) < 1e-9) return "0";
  const ratio = Math.round((value / Math.PI) * 10) / 10;
  if (ratio === 1) return "π";
  if (ratio === -1) return "-π";
  return `${ratio}π`;
}

function drawWindowLab() {
  const size = Number(windowSize.value);
  const bin = Number(toneBin.value);
  const weakGap = Number(weakToneGap.value);
  const weakLevel = Number(weakToneLevel.value);
  const window = makeWindow(state.windowType, size);
  const lobe = getWindowLobeInfo(state.windowType);

  windowName.textContent = lobe.name;
  lobeReadout.textContent = `main ${lobe.mainBins} bins / side ${lobe.sideDb} dB`;
  toneBinValue.value = bin.toFixed(2);
  weakToneGapValue.value = `${weakGap.toFixed(1)} bins`;
  weakToneLevelValue.value = `${weakLevel} dB`;
  windowSizeValue.value = size;

  drawWindowShape(window, lobe);
  drawWindowResponse(window, lobe);
  drawLeakageSpectrum(window, bin, weakGap, weakLevel);
}

function resetWindowDefaults() {
  state.windowType = windowDefaults.type;
  toneBin.value = String(windowDefaults.toneBin);
  weakToneGap.value = String(windowDefaults.weakGap);
  weakToneLevel.value = String(windowDefaults.weakLevel);
  windowSize.value = String(windowDefaults.size);
  windowTypeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.windowType === windowDefaults.type);
  });
  drawWindowLab();
}

function makeWindow(type, size) {
  return Array.from({ length: size }, (_, n) => {
    if (size === 1) return 1;
    const phase = (2 * Math.PI * n) / (size - 1);
    if (type === "hann") return 0.5 - 0.5 * Math.cos(phase);
    if (type === "hamming") return 0.54 - 0.46 * Math.cos(phase);
    if (type === "blackman") return 0.42 - 0.5 * Math.cos(phase) + 0.08 * Math.cos(2 * phase);
    return 1;
  });
}

function getWindowLobeInfo(type) {
  const info = {
    rect: { name: "Rectangular", mainBins: 2, sideDb: "-13" },
    hann: { name: "Hann", mainBins: 4, sideDb: "-31" },
    hamming: { name: "Hamming", mainBins: 4, sideDb: "-43" },
    blackman: { name: "Blackman", mainBins: 6, sideDb: "-58" },
  };
  return info[type] || info.hann;
}

function drawWindowShape(window, info) {
  fitCanvas(windowTimeCanvas);
  const ctx = windowTimeCanvas.getContext("2d");
  const { width, height } = windowTimeCanvas;
  drawGrid(ctx, width, height);
  const rect = {
    left: width * 0.07,
    top: height * 0.16,
    width: width * 0.88,
    height: height * 0.62,
  };

  ctx.strokeStyle = "#9aa6a1";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
  ctx.strokeStyle = "#0b4f6c";
  ctx.lineWidth = 4;
  ctx.beginPath();
  window.forEach((value, index) => {
    const x = rect.left + (index / (window.length - 1)) * rect.width;
    const y = rect.top + rect.height - value * rect.height * 0.92;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = "#172121";
  ctx.font = "800 22px system-ui";
  ctx.fillText(info.name, rect.left, rect.top - 20);
  ctx.fillStyle = "#5f6b66";
  ctx.font = "700 20px system-ui";
  ctx.fillText("time-domain taper w[n]", rect.left + rect.width - 250, rect.top + rect.height + 34);
}

function drawWindowResponse(window, info) {
  fitCanvas(windowResponseCanvas);
  const ctx = windowResponseCanvas.getContext("2d");
  const { width, height } = windowResponseCanvas;
  drawGrid(ctx, width, height);

  const response = getDtftDb(window, 1024);
  const rect = {
    left: width * 0.13,
    top: height * 0.18,
    width: width * 0.78,
    height: height * 0.64,
  };
  drawDbAxes(ctx, rect, "0 bin", "12 bins");
  drawDbCurve(ctx, response.slice(0, 260), rect, "#0b4f6c", -90, 0);
  drawMainLobeMarker(ctx, rect, info.mainBins / 2, 12, "main lobe");
  drawSideLobeBand(ctx, rect, Number(info.sideDb), -90, 0);
}

function getDtftDb(signal, bins) {
  const magnitudes = [];
  for (let i = 0; i < bins; i += 1) {
    const omega = (Math.PI * i) / (bins - 1);
    let real = 0;
    let imag = 0;
    signal.forEach((sample, n) => {
      real += sample * Math.cos(-omega * n);
      imag += sample * Math.sin(-omega * n);
    });
    magnitudes.push(Math.sqrt(real * real + imag * imag));
  }
  const maxValue = Math.max(...magnitudes, 1e-12);
  return magnitudes.map((value) => 20 * Math.log10(Math.max(value / maxValue, 1e-8)));
}

function drawLeakageSpectrum(window, strongBin, weakGap, weakLevelDb) {
  fitCanvas(leakageCanvas);
  const ctx = leakageCanvas.getContext("2d");
  const { width, height } = leakageCanvas;
  drawGrid(ctx, width, height);

  const weakBin = Math.min(window.length / 2 - 1, strongBin + weakGap);
  const weakAmp = 10 ** (weakLevelDb / 20);
  const strongOnly = window.map((w, n) => {
    const strongTone = Math.sin((2 * Math.PI * strongBin * n) / window.length);
    return strongTone * w;
  });
  const samples = window.map((w, n) => {
    const strongTone = Math.sin((2 * Math.PI * strongBin * n) / window.length);
    const weakTone = weakAmp * Math.sin((2 * Math.PI * weakBin * n) / window.length);
    return (strongTone + weakTone) * w;
  });
  const scale = getDftMagnitudes(strongOnly).reduce((max, value) => Math.max(max, value), 1e-12);
  const spectrum = magnitudesToDb(getDftMagnitudes(samples), scale).slice(0, window.length / 2);
  const strongLeakage = magnitudesToDb(getDftMagnitudes(strongOnly), scale).slice(0, window.length / 2);
  const rect = {
    left: width * 0.13,
    top: height * 0.14,
    width: width * 0.78,
    height: height * 0.68,
  };
  drawDbAxes(ctx, rect, "0", "Nyquist");
  drawSpectrumBars(ctx, spectrum, rect, -90, 0, strongBin, weakBin);
  drawToneMarker(ctx, rect, strongBin, spectrum.length, "strong", "#172121");
  drawToneMarker(ctx, rect, weakBin, spectrum.length, "weak", "#0b4f6c");
  drawLeakageDecision(ctx, rect, spectrum, strongLeakage, strongBin, weakBin, weakLevelDb);
}

function getDftDb(signal) {
  const magnitudes = getDftMagnitudes(signal);
  const maxValue = Math.max(...magnitudes, 1e-12);
  return magnitudesToDb(magnitudes, maxValue);
}

function getDftMagnitudes(signal) {
  const magnitudes = [];
  const size = signal.length;
  for (let k = 0; k < size; k += 1) {
    let real = 0;
    let imag = 0;
    for (let n = 0; n < size; n += 1) {
      const angle = (-2 * Math.PI * k * n) / size;
      real += signal[n] * Math.cos(angle);
      imag += signal[n] * Math.sin(angle);
    }
    magnitudes.push(Math.sqrt(real * real + imag * imag));
  }
  return magnitudes;
}

function magnitudesToDb(magnitudes, reference) {
  return magnitudes.map((value) => 20 * Math.log10(Math.max(value / reference, 1e-8)));
}

function drawDbAxes(ctx, rect, leftLabel, rightLabel) {
  ctx.strokeStyle = "#9aa6a1";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
  ctx.fillStyle = "#5f6b66";
  ctx.font = "800 19px system-ui";
  [-80, -60, -40, -20, 0].forEach((db) => {
    const y = mapDbToY(db, rect, -90, 0);
    ctx.strokeStyle = "rgba(154, 166, 161, 0.35)";
    ctx.beginPath();
    ctx.moveTo(rect.left, y);
    ctx.lineTo(rect.left + rect.width, y);
    ctx.stroke();
    ctx.fillStyle = "#5f6b66";
    ctx.fillText(`${db}`, rect.left - 48, y + 6);
  });
  ctx.fillText(leftLabel, rect.left, rect.top + rect.height + 34);
  ctx.fillText(rightLabel, rect.left + rect.width - 74, rect.top + rect.height + 34);
  ctx.fillText("dB", rect.left - 42, rect.top - 16);
}

function drawDbCurve(ctx, data, rect, color, minDb, maxDb) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((db, index) => {
    const x = rect.left + (index / (data.length - 1)) * rect.width;
    const y = mapDbToY(db, rect, minDb, maxDb);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawSpectrumBars(ctx, data, rect, minDb, maxDb, strongBin = -1, weakBin = -1) {
  const barWidth = rect.width / data.length;
  data.forEach((db, index) => {
    const x = rect.left + index * barWidth;
    const y = mapDbToY(db, rect, minDb, maxDb);
    const colorStrength = Math.max(0.18, (db - minDb) / (maxDb - minDb));
    const distanceToWeak = Math.abs(index - weakBin);
    const distanceToStrong = Math.abs(index - strongBin);
    if (distanceToWeak < 0.75) {
      ctx.fillStyle = `rgba(11, 79, 108, ${Math.max(0.38, colorStrength)})`;
    } else if (distanceToStrong < 0.75) {
      ctx.fillStyle = `rgba(23, 33, 33, ${Math.max(0.42, colorStrength)})`;
    } else {
      ctx.fillStyle = `rgba(217, 93, 57, ${colorStrength})`;
    }
    ctx.fillRect(x, y, Math.max(2, barWidth * 0.78), rect.top + rect.height - y);
  });
}

function drawMainLobeMarker(ctx, rect, halfWidthBins, visibleBins, label) {
  const x = rect.left + (halfWidthBins / visibleBins) * rect.width;
  ctx.strokeStyle = "#d95d39";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(x, rect.top);
  ctx.lineTo(x, rect.top + rect.height);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#d95d39";
  ctx.font = "800 18px system-ui";
  ctx.fillText(label, x + 8, rect.top + 26);
}

function drawSideLobeBand(ctx, rect, sideDb, minDb, maxDb) {
  const y = mapDbToY(sideDb, rect, minDb, maxDb);
  ctx.strokeStyle = "#2b8a3e";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(rect.left, y);
  ctx.lineTo(rect.left + rect.width, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#2b8a3e";
  ctx.font = "800 18px system-ui";
  ctx.fillText(`side lobe ${sideDb} dB`, rect.left + rect.width * 0.48, y - 8);
}

function drawToneMarker(ctx, rect, bin, binCount, label = "tone", color = "#172121") {
  const x = rect.left + (bin / binCount) * rect.width;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(x, rect.top);
  ctx.lineTo(x, rect.top + rect.height);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.font = "800 18px system-ui";
  ctx.fillText(`${label} ${bin.toFixed(2)}`, Math.min(x + 8, rect.left + rect.width - 120), rect.top + 26);
}

function drawLeakageDecision(ctx, rect, spectrum, strongLeakage, strongBin, weakBin, weakLevelDb) {
  const weakIndex = Math.max(0, Math.min(spectrum.length - 1, Math.round(weakBin)));
  const weakObserved = spectrum[weakIndex];
  const localLeakage = Math.max(
    spectrum[Math.max(0, weakIndex - 2)] ?? -90,
    spectrum[Math.max(0, weakIndex - 1)] ?? -90,
    spectrum[Math.min(spectrum.length - 1, weakIndex + 1)] ?? -90,
    spectrum[Math.min(spectrum.length - 1, weakIndex + 2)] ?? -90
  );
  const contrast = weakObserved - localLeakage;
  const localVisible = contrast > 3 || Math.abs(weakBin - strongBin) > 5;
  const leakageFloor = strongLeakage[weakIndex];
  const sourceMargin = weakObserved - leakageFloor;
  const separatedVisible = sourceMargin > 6;
  const visibleCount = Number(localVisible) + Number(separatedVisible);
  leakageReadout.textContent = visibleCount === 2
    ? "both visible"
    : visibleCount === 1
      ? "mixed"
      : "masked";
  leakageReadout.style.color = visibleCount === 2 ? "#0f766e" : visibleCount === 1 ? "#b7791f" : "#d95d39";

  drawDecisionBadge(
    ctx,
    rect.left,
    rect.top - 46,
    "local peak",
    localVisible,
    `+${contrast.toFixed(1)} dB vs neighbors`
  );
  drawDecisionBadge(
    ctx,
    rect.left,
    rect.top - 20,
    "strong-only floor",
    separatedVisible,
    `+${sourceMargin.toFixed(1)} dB vs leakage`
  );
  ctx.fillStyle = "#5f6b66";
  ctx.font = "700 17px system-ui";
  ctx.fillText(`weak source ${weakLevelDb} dB`, rect.left + rect.width - 165, rect.top - 20);
}

function drawDecisionBadge(ctx, x, y, label, visible, detail) {
  ctx.fillStyle = visible ? "#0f766e" : "#d95d39";
  ctx.font = "800 17px system-ui";
  ctx.fillText(`${label}: ${visible ? "visible" : "masked"}`, x, y);
  ctx.fillStyle = "#5f6b66";
  ctx.font = "700 16px system-ui";
  ctx.fillText(detail, x + 178, y);
}

function mapDbToY(db, rect, minDb, maxDb) {
  const clamped = Math.max(minDb, Math.min(maxDb, db));
  return rect.top + ((maxDb - clamped) / (maxDb - minDb)) * rect.height;
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

function zMath(tex) {
  return `\\[${tex}\\]`;
}

function drawZSequence() {
  fitCanvas(zSequenceCanvas);
  const ctx = zSequenceCanvas.getContext("2d");
  const { width, height } = zSequenceCanvas;
  drawGrid(ctx, width, height);

  const signal = zSignals[state.zSignal];
  const count = state.zSamples;
  const samples = Array.from({ length: count }, (_, n) => ({ n, value: signal.sequence(n) }));
  const rect = { left: 58, right: width - 28, top: 44, bottom: height - 58 };
  const maxAbs = Math.max(1, ...samples.map((sample) => Math.abs(sample.value)));
  const yZero = (rect.top + rect.bottom) / 2;
  const xAt = (n) => rect.left + (n / Math.max(1, count - 1)) * (rect.right - rect.left);
  const yAt = (value) => yZero - (value / maxAbs) * ((rect.bottom - rect.top) * 0.45);

  ctx.strokeStyle = "#92a39b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.left, yZero);
  ctx.lineTo(rect.right, yZero);
  ctx.stroke();

  ctx.fillStyle = "#5f6b66";
  ctx.font = "800 18px system-ui";
  ctx.fillText("x[n]", rect.left, rect.top - 14);
  ctx.fillText("n", rect.right - 4, yZero + 28);

  ctx.strokeStyle = "#0f766e";
  ctx.fillStyle = "#0f766e";
  ctx.lineWidth = 3;
  samples.forEach(({ n, value }) => {
    const x = xAt(n);
    const y = yAt(value);
    ctx.beginPath();
    ctx.moveTo(x, yZero);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#5f6b66";
  ctx.font = "700 15px system-ui";
  [0, Math.floor((count - 1) / 2), count - 1].forEach((n) => {
    ctx.fillText(String(n), xAt(n) - 5, yZero + 22);
  });
}

function drawZPlaneLab() {
  fitCanvas(zPlaneCanvas);
  const ctx = zPlaneCanvas.getContext("2d");
  const { width, height } = zPlaneCanvas;
  drawGrid(ctx, width, height);

  const signal = zSignals[state.zSignal];
  const poles = signal.poles();
  const zeros = signal.zeros();
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) / 3.5;
  const toX = (re) => centerX + re * scale;
  const toY = (im) => centerY - im * scale;

  ctx.strokeStyle = "#92a39b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(34, centerY);
  ctx.lineTo(width - 34, centerY);
  ctx.moveTo(centerX, 34);
  ctx.lineTo(centerX, height - 34);
  ctx.stroke();

  ctx.strokeStyle = "#0b4f6c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, scale, 0, Math.PI * 2);
  ctx.stroke();

  const rocRadius = state.zSignal === "geometric" ? Math.abs(state.zA) * scale : state.zSignal === "impulse" ? 0 : scale;
  if (rocRadius > 0) {
    ctx.strokeStyle = "rgba(217, 93, 57, 0.45)";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, rocRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  zeros.forEach((zero) => {
    ctx.strokeStyle = "#0b4f6c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(toX(zero.re), toY(zero.im), 10, 0, Math.PI * 2);
    ctx.stroke();
  });

  poles.forEach((pole) => {
    const jitter = pole.offset ? pole.offset * 9 : 0;
    const x = toX(pole.re) + jitter;
    const y = toY(pole.im) - jitter;
    ctx.strokeStyle = "#d95d39";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y + 10);
    ctx.moveTo(x + 10, y - 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.stroke();
  });

  ctx.fillStyle = "#5f6b66";
  ctx.font = "800 16px system-ui";
  ctx.fillText("Re", width - 58, centerY - 12);
  ctx.fillText("Im", centerX + 12, 56);
  ctx.fillText("unit circle", centerX + scale - 72, centerY - 12);
}

function drawZTransformLab() {
  if (!zSequenceCanvas || !zPlaneCanvas) return;

  state.zSignal = zSignalSelect.value;
  state.zA = Number(zA.value);
  state.zOmega = Number(zOmega.value);
  state.zSamples = Number(zSamples.value);

  const signal = zSignals[state.zSignal];
  zAValue.value = formatNumber(state.zA);
  zOmegaValue.value = formatNumber(state.zOmega);
  zSampleValue.value = String(state.zSamples);
  zSignalSummary.textContent = typeof signal.summary === "function" ? signal.summary() : signal.summary;
  zFormula.innerHTML = zMath(signal.formula());
  zRoc.innerHTML = zMath(signal.roc());
  zInsightList.innerHTML = signal.insights().map((insight) => `<li>${insight}</li>`).join("");

  drawZSequence();
  drawZPlaneLab();
  window.MathJax?.typesetPromise?.([zFormula, zRoc]);
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
    drawLtiLab();
    drawZTransformLab();
    drawFilterLab();
    drawWindowLab();
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

function makeFilterDemoSignal(sampleRate = 44100, seconds = 2.2) {
  const length = Math.floor(sampleRate * seconds);
  const data = new Float32Array(length);
  const fadeLength = Math.floor(sampleRate * 0.03);
  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate;
    const fadeIn = Math.min(1, i / fadeLength);
    const fadeOut = Math.min(1, (length - i - 1) / fadeLength);
    const envelope = Math.min(fadeIn, fadeOut);
    data[i] = envelope * (
      0.34 * Math.sin(2 * Math.PI * 180 * t) +
      0.28 * Math.sin(2 * Math.PI * 900 * t) +
      0.22 * Math.sin(2 * Math.PI * 3200 * t)
    );
  }
  return { data, sampleRate };
}

function convolveSignal(input, impulse) {
  const output = new Float32Array(input.length);
  for (let n = 0; n < input.length; n += 1) {
    let sum = 0;
    for (let k = 0; k < impulse.length && k <= n; k += 1) {
      sum += impulse[k] * input[n - k];
    }
    output[n] = sum;
  }
  normalizeFloatArray(output, 0.85);
  return output;
}

function normalizeFloatArray(data, target = 0.9) {
  let peak = 0;
  for (let i = 0; i < data.length; i += 1) peak = Math.max(peak, Math.abs(data[i]));
  if (peak < 1e-8 || peak <= target) return;
  const gainValue = target / peak;
  for (let i = 0; i < data.length; i += 1) data[i] *= gainValue;
}

function playFloatArray(data, sampleRate) {
  const context = ensureContext();
  const buffer = context.createBuffer(1, data.length, sampleRate);
  buffer.copyToChannel(data, 0);
  playBuffer(buffer);
}

function playFilterDemo(filtered) {
  const demo = makeFilterDemoSignal();
  const data = filtered ? convolveSignal(demo.data, state.filterImpulse.length ? state.filterImpulse : [1]) : demo.data;
  playFloatArray(data, demo.sampleRate);
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

[signalFreq, lessonSampleRate, timeWindow, showSinc].forEach((control) => {
  control.addEventListener("input", drawSamplingLesson);
});

ltiInputButtons.forEach((button) => {
  button.addEventListener("click", () => {
    ltiInputButtons.forEach((item) => item.classList.toggle("active", item === button));
    state.ltiInput = button.dataset.ltiInput;
    drawLtiLab();
  });
});

ltiSystemButtons.forEach((button) => {
  button.addEventListener("click", () => {
    ltiSystemButtons.forEach((item) => item.classList.toggle("active", item === button));
    state.ltiSystem = button.dataset.ltiSystem;
    drawLtiLab();
  });
});

filterFamilyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterFamilyButtons.forEach((item) => item.classList.toggle("active", item === button));
    state.filterFamily = button.dataset.filterFamily;
    drawFilterLab();
  });
});

filterModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterModeButtons.forEach((item) => item.classList.toggle("active", item === button));
    state.filterMode = button.dataset.filterMode;
    drawFilterLab();
  });
});

filterApproxButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterApproxButtons.forEach((item) => item.classList.toggle("active", item === button));
    state.filterApprox = button.dataset.filterApprox;
    drawFilterLab();
  });
});

[zSignalSelect, zA, zOmega, zSamples].forEach((control) => {
  control.addEventListener("input", drawZTransformLab);
});

ltiProbe.addEventListener("input", drawLtiLab);
firTaps.addEventListener("input", drawFilterLab);
filterCutoff.addEventListener("input", drawFilterLab);
filterBandwidth.addEventListener("input", drawFilterLab);
poleRadius.addEventListener("input", drawFilterLab);

windowTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    windowTypeButtons.forEach((item) => item.classList.toggle("active", item === button));
    state.windowType = button.dataset.windowType;
    drawWindowLab();
  });
});

[toneBin, weakToneGap, weakToneLevel, windowSize].forEach((control) => {
  control.addEventListener("input", drawWindowLab);
});

resetWindowLab.addEventListener("click", resetWindowDefaults);

moduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateModule(button.dataset.moduleTarget);
  });
});

playOriginal.addEventListener("click", () => playBuffer(state.originalBuffer));
playProcessed.addEventListener("click", () => playBuffer(state.processedBuffer));
stopAudio.addEventListener("click", stopCurrent);
playFilterInput.addEventListener("click", () => playFilterDemo(false));
playFilterOutput.addEventListener("click", () => playFilterDemo(true));

updateControlLabels();
setEnabled(false);
drawWaveform();
drawSpectrum();
drawSamplingLesson();
drawLtiLab();
drawZTransformLab();
drawFilterLab();
drawWindowLab();

window.addEventListener("resize", () => {
  canvases.forEach(fitCanvas);
  drawWaveform();
  drawSpectrum();
  drawSamplingLesson();
  drawLtiLab();
  drawZTransformLab();
  drawFilterLab();
  drawWindowLab();
});
