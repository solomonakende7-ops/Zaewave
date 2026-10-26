import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Upload, Wand2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/page-header'
import { remakeModes, remakeStyles } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/remake')({
  head: () => ({ meta: [{ title: 'Remake My Song · ZaeWave' }] }),
  component: Remake,
})

const steps = ['Upload', 'Transform', 'Configure', 'Generate', 'Compare & export']

function Remake() {
  const [file, setFile] = useState<{ name: string; url: string } | null>(null)
  const [mode, setMode] = useState<string>('genre')
  const [style, setStyle] = useState('Amapiano')
  const [tempo, setTempo] = useState(0)
  const [prompt, setPrompt] = useState('')
  const [keepVocals, setKeepVocals] = useState(true)

  useEffect(() => () => {
    if (file) URL.revokeObjectURL(file.url)
  }, [file])

  const current = !file ? 0 : prompt.trim().length < 5 ? 2 : 3

  return (
    <>
      <PageHeader
        title="Remake My Song"
        description="Upload an original, describe the transformation, then compare the versions side by side."
      />

      <ol className="mb-8 flex flex-wrap gap-2" aria-label="Remake steps">
        {steps.map((s, i) => (
          <li
            key={s}
            aria-current={i === current ? 'step' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
              i < current && 'border-chart-2/40 bg-chart-2/10 text-chart-2',
              i === current && 'border-primary bg-primary/15 text-primary',
              i > current && 'border-border text-muted-foreground',
            )}
          >
            {i < current ? <Check className="size-3.5" aria-hidden="true" /> : <span>{i + 1}</span>}
            {s}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">1 · Your original</h2>
            {file ? (
              <div className="mt-4 space-y-3">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <audio controls src={file.url} className="w-full" />
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                  Choose a different song
                </Button>
              </div>
            ) : (
              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8 text-center hover:border-primary/60">
                <Upload className="size-6 text-primary" aria-hidden="true" />
                <span className="font-medium">Select a WAV or MP3</span>
                <span className="text-xs text-muted-foreground">Only upload music you own or are authorized to remake.</span>
                <input
                  type="file"
                  accept="audio/*,.wav,.mp3"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    if (!f.type.startsWith('audio/') && !/\.(wav|mp3)$/i.test(f.name)) {
                      toast.error('Please choose an audio file')
                      return
                    }
                    setFile({ name: f.name, url: URL.createObjectURL(f) })
                  }}
                />
              </label>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">2 · Choose a transformation</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Transformation">
              {remakeModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-colors motion-reduce:transition-none',
                    mode === m.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
                  )}
                >
                  <span className="block font-semibold">{m.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{m.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">3 · Configure</h2>
            {(mode === 'genre' || mode === 'instrumental') && (
              <div>
                <p className="mb-2 text-sm font-medium">Target style</p>
                <div className="flex flex-wrap gap-2">
                  {remakeStyles.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={style === s}
                      onClick={() => setStyle(s)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-sm',
                        style === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/50',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <label htmlFor="tempo" className="font-medium">Tempo change</label>
                <output htmlFor="tempo" className="text-muted-foreground">
                  {tempo === 0 ? 'Keep original' : `${tempo > 0 ? '+' : ''}${tempo}%`}
                </output>
              </div>
              <input id="tempo" type="range" min={-30} max={30} step={5} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={keepVocals} onChange={(e) => setKeepVocals(e.target.checked)} className="size-4 accent-primary" />
              Keep my original vocals
            </label>
            <div className="space-y-2">
              <Label htmlFor="prompt">Describe the remake</Label>
              <Textarea
                id="prompt"
                rows={4}
                maxLength={600}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Turn it into a late-night Amapiano groove with log drums, shakers and a warm Rhodes, around 112 BPM."
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">4 · Generate</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row k="Song" v={file?.name ?? 'Not selected'} />
              <Row k="Transformation" v={remakeModes.find((m) => m.id === mode)?.title ?? ''} />
              {(mode === 'genre' || mode === 'instrumental') && <Row k="Style" v={style} />}
              <Row k="Tempo" v={tempo === 0 ? 'Original' : `${tempo > 0 ? '+' : ''}${tempo}%`} />
              <Row k="Vocals" v={keepVocals ? 'Kept' : 'Replaced'} />
            </dl>
            <Button className="mt-6 w-full" size="lg" disabled>
              <Wand2 /> Generate remake
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              The AI audio engine is being connected. Generation jobs, with live progress, credit
              usage and retries, switch on once it is live. ZaeWave will never show a simulated result.
            </p>
          </section>
          <section className="rounded-2xl border border-dashed border-border p-6">
            <h2 className="text-lg font-semibold">5 · Compare & export</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Generated versions appear here next to your original, with A/B playback and WAV/MP3 export.
              No versions yet.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="truncate text-right font-medium">{v}</dd>
    </div>
  )
}
