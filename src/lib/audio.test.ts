// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { defaultEdit, encodeWav, formatTime, peaks } from './audio'

function fakeBuffer(channels: number[][], sampleRate = 8000) {
  return {
    numberOfChannels: channels.length,
    sampleRate,
    length: channels[0].length,
    duration: channels[0].length / sampleRate,
    getChannelData: (c: number) => Float32Array.from(channels[c]),
  } as unknown as AudioBuffer
}

describe('studio audio helpers', () => {
  it('encodes a valid 16-bit PCM WAV header and samples', async () => {
    const blob = encodeWav(fakeBuffer([[0, 1, -1], [0.5, 0, 0]]))
    const view = new DataView(await blob.arrayBuffer())
    const tag = (o: number) => String.fromCharCode(...new Uint8Array(view.buffer, o, 4))
    expect(tag(0)).toBe('RIFF')
    expect(tag(8)).toBe('WAVE')
    expect(view.getUint16(22, true)).toBe(2)
    expect(view.getUint32(24, true)).toBe(8000)
    expect(view.getUint32(40, true)).toBe(3 * 2 * 2)
    expect(view.getInt16(44 + 4, true)).toBe(0x7fff)
    expect(view.getInt16(44 + 8, true)).toBe(-0x8000)
    expect(blob.size).toBe(44 + 12)
  })

  it('computes peak envelopes across channels', () => {
    const p = peaks(fakeBuffer([[0.1, 0.2, 0.9, 0.1], [0.5, 0, 0, 0]]), 2)
    expect(Array.from(p).map((v) => +v.toFixed(2))).toEqual([0.5, 0.9])
  })

  it('starts edits untouched across the whole track', () => {
    expect(defaultEdit(12)).toMatchObject({ start: 0, end: 12, gainDb: 0, pan: 0 })
    expect(formatTime(65.25)).toBe('1:05.3')
  })
})
