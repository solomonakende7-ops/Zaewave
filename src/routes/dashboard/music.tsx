import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pause, Play, Search, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader, StatusPill } from '@/components/page-header'
import { tracks as sampleTracks } from '@/lib/fixtures'

export const Route = createFileRoute('/dashboard/music')({
  head: () => ({ meta: [{ title: 'My Music · ZaeWave' }] }),
  component: MyMusic,
})

interface LocalTrack {
  id: string
  title: string
  size: string
  url: string
}

const ACCEPTED = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/flac', 'audio/x-flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a']
const MAX_BYTES = 200 * 1024 * 1024

function MyMusic() {
  const [query, setQuery] = useState('')
  const [uploads, setUploads] = useState<LocalTrack[]>([])
  const [playing, setPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const urlsRef = useRef<string[]>([])

  useEffect(() => () => urlsRef.current.forEach((u) => URL.revokeObjectURL(u)), [])

  function onFiles(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type) && !/\.(wav|mp3|flac|aac|m4a)$/i.test(file.name)) {
        toast.error(`${file.name} isn't a supported audio file`, {
          description: 'Use WAV, MP3, FLAC, AAC or M4A.',
        })
        continue
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is larger than 200 MB`)
        continue
      }
      const url = URL.createObjectURL(file)
      urlsRef.current.push(url)
      setUploads((u) => [
        { id: url, title: file.name.replace(/\.[^.]+$/, ''), size: `${(file.size / 1048576).toFixed(1)} MB`, url },
        ...u,
      ])
      toast.success(`${file.name} is ready to play`, {
        description: 'Kept on this device for now. Cloud storage comes with accounts.',
      })
    }
  }

  function toggle(t: LocalTrack) {
    const el = audioRef.current
    if (!el) return
    if (playing === t.id) {
      el.pause()
      setPlaying(null)
      return
    }
    el.src = t.url
    void el.play().then(
      () => setPlaying(t.id),
      () => toast.error('This file could not be played in your browser'),
    )
  }

  const q = query.trim().toLowerCase()
  const filtered = sampleTracks.filter((t) => !q || `${t.title} ${t.genre}`.toLowerCase().includes(q))
  const filteredUploads = uploads.filter((t) => !q || t.title.toLowerCase().includes(q))

  return (
    <>
      <PageHeader title="My Music" description="Manage and organize your entire music catalog.">
        <Button asChild>
          <label className="cursor-pointer">
            <Upload /> Upload audio
            <input
              type="file"
              accept=".wav,.mp3,.flac,.aac,.m4a,audio/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                onFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </label>
        </Button>
      </PageHeader>
      <audio ref={audioRef} onEnded={() => setPlaying(null)} className="hidden" />

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          aria-label="Search your music"
          placeholder="Search by title or genre"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {uploads.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Uploaded this session
          </h2>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {filteredUploads.map((t) => (
              <li key={t.id} className="flex items-center gap-4 p-4">
                <Button
                  size="icon"
                  variant={playing === t.id ? 'default' : 'secondary'}
                  aria-label={playing === t.id ? `Pause ${t.title}` : `Play ${t.title}`}
                  onClick={() => toggle(t)}
                >
                  {playing === t.id ? <Pause /> : <Play />}
                </Button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.size} · on this device</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/studio">Edit in studio</Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Sample catalog
        </h2>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-medium">No songs found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[36rem] text-sm">
              <thead className="text-left text-xs text-muted-foreground uppercase">
                <tr className="border-b border-border">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Genre</th>
                  <th className="p-4 font-semibold">BPM / Key</th>
                  <th className="p-4 font-semibold">Length</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="p-4 font-medium">{t.title}</td>
                    <td className="p-4 text-muted-foreground">{t.genre}</td>
                    <td className="p-4 text-muted-foreground">
                      {t.bpm ? `${t.bpm} · ${t.key}` : 'Not analyzed'}
                    </td>
                    <td className="p-4 text-muted-foreground">{t.duration}</td>
                    <td className="p-4">
                      <StatusPill tone={t.status === 'mastered' ? 'good' : t.status === 'mixing' ? 'info' : 'neutral'}>
                        {t.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
