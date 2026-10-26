/** Browser-side audio helpers for the ZaeWave studio (Web Audio API, no server). */

export interface EditSettings {
  /** Trim window, seconds from the start of the source. */
  start: number
  end: number
  gainDb: number
  /** -1 (left) … 1 (right) */
  pan: number
  fadeIn: number
  fadeOut: number
  /** Shelf EQ in dB */
  lowDb: number
  highDb: number
}

export function defaultEdit(duration: number): EditSettings {
  return { start: 0, end: duration, gainDb: 0, pan: 0, fadeIn: 0, fadeOut: 0, lowDb: 0, highDb: 0 }
}

export async function decodeAudio(data: ArrayBuffer): Promise<AudioBuffer> {
  const ctx = new AudioContext()
  try {
    return await ctx.decodeAudioData(data)
  } finally {
    void ctx.close()
  }
}

/** Peak envelope for drawing a waveform with `bins` columns. */
export function peaks(buffer: AudioBuffer, bins: number): Float32Array {
  const out = new Float32Array(bins)
  const step = Math.max(1, Math.floor(buffer.length / bins))
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c)
    for (let i = 0; i < bins; i++) {
      let max = 0
      const from = i * step
      const to = Math.min(from + step, data.length)
      for (let j = from; j < to; j++) {
        const v = Math.abs(data[j])
        if (v > max) max = v
      }
      if (max > out[i]) out[i] = max
    }
  }
  return out
}

/**
 * Builds the processing chain (EQ → gain/fades → pan) on any context and starts
 * the source at `when`. Shared by live preview and offline export so they match.
 */
export function buildChain(
  ctx: BaseAudioContext,
  buffer: AudioBuffer,
  edit: EditSettings,
  when = 0,
): AudioBufferSourceNode {
  const length = Math.max(0, edit.end - edit.start)
  const src = ctx.createBufferSource()
  src.buffer = buffer

  const low = ctx.createBiquadFilter()
  low.type = 'lowshelf'
  low.frequency.value = 200
  low.gain.value = edit.lowDb

  const high = ctx.createBiquadFilter()
  high.type = 'highshelf'
  high.frequency.value = 4000
  high.gain.value = edit.highDb

  const gain = ctx.createGain()
  const level = Math.pow(10, edit.gainDb / 20)
  const g = gain.gain
  const t0 = when
  const fadeIn = Math.min(edit.fadeIn, length / 2)
  const fadeOut = Math.min(edit.fadeOut, length / 2)
  g.setValueAtTime(fadeIn > 0 ? 0 : level, t0)
  if (fadeIn > 0) g.linearRampToValueAtTime(level, t0 + fadeIn)
  if (fadeOut > 0) {
    g.setValueAtTime(level, t0 + length - fadeOut)
    g.linearRampToValueAtTime(0, t0 + length)
  }

  const pan = ctx.createStereoPanner()
  pan.pan.value = edit.pan

  src.connect(low).connect(high).connect(gain).connect(pan).connect(ctx.destination)
  src.start(when, edit.start, length)
  return src
}

/** Renders the edit to a new stereo AudioBuffer. */
export async function render(buffer: AudioBuffer, edit: EditSettings): Promise<AudioBuffer> {
  const length = Math.max(1, Math.ceil((edit.end - edit.start) * buffer.sampleRate))
  const ctx = new OfflineAudioContext(2, length, buffer.sampleRate)
  buildChain(ctx, buffer, edit, 0)
  return ctx.startRendering()
}

/** Encodes an AudioBuffer as 16-bit PCM WAV. */
export function encodeWav(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels
  const rate = buffer.sampleRate
  const frames = buffer.length
  const bytes = frames * channels * 2
  const view = new DataView(new ArrayBuffer(44 + bytes))
  const str = (o: number, s: string) => [...s].forEach((ch, i) => view.setUint8(o + i, ch.charCodeAt(0)))
  str(0, 'RIFF')
  view.setUint32(4, 36 + bytes, true)
  str(8, 'WAVE')
  str(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * channels * 2, true)
  view.setUint16(32, channels * 2, true)
  view.setUint16(34, 16, true)
  str(36, 'data')
  view.setUint32(40, bytes, true)
  const data = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c))
  let o = 44
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const s = Math.max(-1, Math.min(1, data[c][i]))
      view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true)
      o += 2
    }
  }
  return new Blob([view], { type: 'audio/wav' })
}

export function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = (s % 60).toFixed(1).padStart(4, '0')
  return `${m}:${sec}`
}
