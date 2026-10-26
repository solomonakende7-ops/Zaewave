import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download, Mic, Play, Redo2, RotateCcw, Square, Undo2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import {
  buildChain,
  decodeAudio,
  defaultEdit,
  encodeWav,
  formatTime,
  peaks,
  render,
  type EditSettings,
} from '@/lib/audio'

export const Route = createFileRoute('/dashboard/studio')({
  head: () => ({ meta: [{ title: 'Studio · ZaeWave' }] }),
  component: Studio,
})

const BINS = 600
const draftKey = (name: string) => `zaewave.studio.${name}`

function Studio() {
  const [name, setName] = useState<string | null>(null)
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null)
  const [edit, setEdit] = useState<EditSettings | null>(null)
  const [past, setPast] = useState<EditSettings[]>([])
  const [future, setFuture] = useState<EditSettings[]>([])
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [recording, setRecording] = useState(false)
  const [playhead, setPlayhead] = useState<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const srcRef = useRef<AudioBufferSourceNode | null>(null)
  const rafRef = useRef(0)
  const recRef = useRef<MediaRecorder | null>(null)
  const committed = useRef<EditSettings | null>(null)
  const peaksRef = useRef<Float32Array | null>(null)

  // --- loading -------------------------------------------------------------
  async function load(data: ArrayBuffer, label: string) {
    stop()
    setLoading(true)
    try {
      const buf = await decodeAudio(data)
      peaksRef.current = peaks(buf, BINS)
      let initial = defaultEdit(buf.duration)
      try {
        const saved = localStorage.getItem(draftKey(label))
        if (saved) {
          initial = { ...initial, ...JSON.parse(saved) }
          initial.end = Math.min(initial.end, buf.duration)
          toast.info('Restored your saved edits for this track')
        }
      } catch {
        /* ignore corrupt draft */
      }
      setBuffer(buf)
      setName(label)
      setEdit(initial)
      committed.current = initial
      setPast([])
      setFuture([])
    } catch {
      toast.error('This file could not be decoded', { description: 'Try a WAV or MP3 file.' })
    } finally {
      setLoading(false)
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return
    if (file.size > 200 * 1024 * 1024) {
      toast.error('Files up to 200 MB are supported in the browser studio')
      return
    }
    void file.arrayBuffer().then((d) => load(d, file.name))
  }

  async function toggleRecord() {
    if (recording) {
      recRef.current?.stop()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      const chunks: Blob[] = []
      rec.ondataavailable = (e) => chunks.push(e.data)
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        setRecording(false)
        const blob = new Blob(chunks, { type: rec.mimeType })
        void blob.arrayBuffer().then((d) => load(d, `Vocal take ${new Date().toLocaleTimeString()}`))
      }
      recRef.current = rec
      rec.start()
      setRecording(true)
    } catch {
      toast.error('Microphone access was blocked', {
        description: 'Allow microphone access in your browser settings to record.',
      })
    }
  }

  // --- history + autosave ---------------------------------------------------
  useEffect(() => {
    if (!edit || !name) return
    const t = setTimeout(() => {
      const prev = committed.current
      if (prev && JSON.stringify(prev) !== JSON.stringify(edit)) {
        setPast((p) => [...p.slice(-49), prev])
        setFuture([])
        committed.current = edit
      }
      localStorage.setItem(draftKey(name), JSON.stringify(edit))
    }, 400)
    return () => clearTimeout(t)
  }, [edit, name])

  function undo() {
    if (!past.length || !edit) return
    const prev = past[past.length - 1]
    setPast((p) => p.slice(0, -1))
    setFuture((f) => [edit, ...f])
    committed.current = prev
    setEdit(prev)
  }

  function redo() {
    if (!future.length || !edit) return
    const next = future[0]
    setFuture((f) => f.slice(1))
    setPast((p) => [...p, edit])
    committed.current = next
    setEdit(next)
  }

  const update = (patch: Partial<EditSettings>) => setEdit((e) => (e ? { ...e, ...patch } : e))

  // --- waveform ---------------------------------------------------------------
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const p = peaksRef.current
    if (!canvas || !p || !buffer || !edit) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const g = canvas.getContext('2d')!
    g.scale(dpr, dpr)
    g.clearRect(0, 0, w, h)
    const x = (t: number) => (t / buffer.duration) * w
    const grad = g.createLinearGradient(0, 0, w, 0)
    ;['#3ef0c8', '#2f8bff', '#8b2cff', '#ff2d8a', '#ffa726'].forEach((c, i) => grad.addColorStop(i / 4, c))
    const barW = w / p.length
    for (let i = 0; i < p.length; i++) {
      const t = (i / p.length) * buffer.duration
      const inside = t >= edit.start && t <= edit.end
      const bh = Math.max(1, p[i] * h * 0.9)
      g.fillStyle = inside ? grad : 'rgba(255,255,255,0.15)'
      g.fillRect(i * barW, (h - bh) / 2, Math.max(1, barW - 0.5), bh)
    }
    g.fillStyle = 'rgba(47,139,255,0.9)'
    g.fillRect(x(edit.start) - 1, 0, 2, h)
    g.fillRect(x(edit.end) - 1, 0, 2, h)
    if (playhead !== null) {
      g.fillStyle = '#ffffff'
      g.fillRect(x(playhead) - 1, 0, 2, h)
    }
  }, [buffer, edit, playhead])

  useEffect(() => {
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [draw])

  // --- transport ---------------------------------------------------------------
  function stop() {
    try {
      srcRef.current?.stop()
    } catch {
      /* already stopped */
    }
    srcRef.current = null
    cancelAnimationFrame(rafRef.current)
    setPlaying(false)
    setPlayhead(null)
  }

  function play() {
    if (!buffer || !edit) return
    stop()
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    void ctx.resume()
    const when = ctx.currentTime + 0.05
    const src = buildChain(ctx, buffer, edit, when)
    src.onended = () => {
      if (srcRef.current === src) stop()
    }
    srcRef.current = src
    setPlaying(true)
    const tick = () => {
      setPlayhead(edit.start + Math.max(0, ctx.currentTime - when))
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
  }

  useEffect(() => () => stop(), [])

  async function exportWav() {
    if (!buffer || !edit || !name) return
    setExporting(true)
    try {
      const out = await render(buffer, edit)
      const url = URL.createObjectURL(encodeWav(out))
      const a = document.createElement('a')
      a.href = url
      a.download = `${name.replace(/\.[^.]+$/, '')} (ZaeWave edit).wav`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      toast.success('WAV exported', { description: `${formatTime(out.duration)} · ${out.sampleRate / 1000} kHz` })
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  // --- UI ---------------------------------------------------------------------
  return (
    <>
      <PageHeader
        title="Studio"
        description="Record or upload a track, trim it, shape the sound and export a WAV. Runs entirely in your browser."
      >
        <Button variant="outline" asChild>
          <label className="cursor-pointer">
            <Upload /> Upload audio
            <input
              type="file"
              accept="audio/*,.wav,.mp3,.flac,.m4a"
              className="sr-only"
              onChange={(e) => {
                onFile(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>
        </Button>
        <Button variant={recording ? 'destructive' : 'default'} onClick={() => void toggleRecord()}>
          {recording ? <Square /> : <Mic />} {recording ? 'Stop recording' : 'Record vocals'}
        </Button>
      </PageHeader>

      {!buffer || !edit ? (
        <div className="studio-grid grid min-h-72 place-items-center rounded-2xl border border-dashed border-border p-10 text-center">
          <div>
            <p className="text-lg font-semibold">
              {loading ? 'Decoding audio…' : recording ? 'Recording… press Stop when you are done' : 'Start a new session'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload a WAV, MP3 or FLAC, or record straight from your microphone.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-semibold">{name}</h2>
                <p className="text-xs text-muted-foreground">
                  {formatTime(buffer.duration)} · {buffer.numberOfChannels === 1 ? 'Mono' : 'Stereo'} ·{' '}
                  {buffer.sampleRate / 1000} kHz · edits autosave on this device
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" aria-label="Undo" onClick={undo} disabled={!past.length}>
                  <Undo2 />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Redo" onClick={redo} disabled={!future.length}>
                  <Redo2 />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Reset all edits"
                  onClick={() => setEdit(defaultEdit(buffer.duration))}
                >
                  <RotateCcw />
                </Button>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              className="h-36 w-full rounded-xl bg-brand-navy sm:h-44"
              role="img"
              aria-label={`Waveform, trimmed from ${formatTime(edit.start)} to ${formatTime(edit.end)}`}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Slider
                label="Trim start"
                value={edit.start}
                min={0}
                max={buffer.duration}
                step={0.01}
                display={formatTime(edit.start)}
                onChange={(v) => update({ start: Math.min(v, edit.end - 0.1) })}
              />
              <Slider
                label="Trim end"
                value={edit.end}
                min={0}
                max={buffer.duration}
                step={0.01}
                display={formatTime(edit.end)}
                onChange={(v) => update({ end: Math.max(v, edit.start + 0.1) })}
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={playing ? stop : play}>
                {playing ? <Square /> : <Play />} {playing ? 'Stop' : 'Play selection'}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => void exportWav()} disabled={exporting}>
                <Download /> {exporting ? 'Rendering…' : 'Export WAV'}
              </Button>
              <span className="text-sm text-muted-foreground">
                Selection length {formatTime(edit.end - edit.start)}
              </span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Panel title="Level">
              <Slider label="Gain" value={edit.gainDb} min={-24} max={12} step={0.5} display={`${edit.gainDb > 0 ? '+' : ''}${edit.gainDb} dB`} onChange={(v) => update({ gainDb: v })} />
              <Slider label="Pan" value={edit.pan} min={-1} max={1} step={0.05} display={edit.pan === 0 ? 'Center' : edit.pan < 0 ? `${Math.round(-edit.pan * 100)}% L` : `${Math.round(edit.pan * 100)}% R`} onChange={(v) => update({ pan: v })} />
            </Panel>
            <Panel title="Fades">
              <Slider label="Fade in" value={edit.fadeIn} min={0} max={10} step={0.1} display={`${edit.fadeIn.toFixed(1)} s`} onChange={(v) => update({ fadeIn: v })} />
              <Slider label="Fade out" value={edit.fadeOut} min={0} max={10} step={0.1} display={`${edit.fadeOut.toFixed(1)} s`} onChange={(v) => update({ fadeOut: v })} />
            </Panel>
            <Panel title="EQ">
              <Slider label="Low shelf (200 Hz)" value={edit.lowDb} min={-12} max={12} step={0.5} display={`${edit.lowDb > 0 ? '+' : ''}${edit.lowDb} dB`} onChange={(v) => update({ lowDb: v })} />
              <Slider label="High shelf (4 kHz)" value={edit.highDb} min={-12} max={12} step={0.5} display={`${edit.highDb > 0 ? '+' : ''}${edit.highDb} dB`} onChange={(v) => update({ highDb: v })} />
            </Panel>
          </section>
          <p className="text-xs text-muted-foreground">
            Multitrack arranging, reverb, delay, compression, MP3 export and cloud-saved projects are next on the studio roadmap.
          </p>
        </div>
      )}
    </>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      {children}
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}) {
  const id = `s-${label.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="tabular-nums text-muted-foreground">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  )
}
