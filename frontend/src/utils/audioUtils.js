/**
 * WAV encoder utility.
 * Converts raw Float32 PCM samples to a 16-bit PCM .wav Blob
 * compatible with Sarvam Saaras v4 STT API.
 */

function writeStr(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Encode Float32Array samples to a 16-bit mono PCM WAV Blob.
 * @param {Float32Array} samples  - raw float32 audio samples in range [-1, 1]
 * @param {number} sampleRate     - e.g. 16000
 * @returns {Blob} WAV audio blob
 */
export function encodeWAV(samples, sampleRate = 16000) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeStr(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(view, 8, 'WAVE');
  writeStr(view, 12, 'fmt ');
  view.setUint32(16, 16, true);     // PCM chunk size
  view.setUint16(20, 1, true);      // AudioFormat = PCM
  view.setUint16(22, 1, true);      // NumChannels = Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true);      // BlockAlign
  view.setUint16(34, 16, true);     // BitsPerSample
  writeStr(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Resample audio buffer from sourceRate to targetRate using linear interpolation.
 * @param {Float32Array} buffer
 * @param {number} sourceRate
 * @param {number} targetRate
 * @returns {Float32Array}
 */
export function resample(buffer, sourceRate, targetRate) {
  if (sourceRate === targetRate) return buffer;
  const ratio = sourceRate / targetRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIdx = i * ratio;
    const lo = Math.floor(srcIdx);
    const hi = Math.min(lo + 1, buffer.length - 1);
    const frac = srcIdx - lo;
    result[i] = buffer[lo] * (1 - frac) + buffer[hi] * frac;
  }
  return result;
}
