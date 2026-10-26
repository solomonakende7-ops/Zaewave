import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { PageHeader, StatusPill } from '@/components/page-header'
import { releases as sample, releaseStatusLabel, tracks, type Release } from '@/lib/fixtures'

export const Route = createFileRoute('/dashboard/releases')({
  head: () => ({ meta: [{ title: 'Releases · ZaeWave' }] }),
  component: Releases,
})

const tone = {
  draft: 'neutral',
  metadata_incomplete: 'warn',
  ready_for_review: 'info',
  awaiting_provider: 'info',
} as const

function Releases() {
  const [list, setList] = useState<Release[]>(sample)
  const [open, setOpen] = useState(false)
  const [explicit, setExplicit] = useState(false)

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = String(f.get('title') ?? '').trim()
    const type = String(f.get('type')) as Release['type']
    const date = String(f.get('date') ?? '')
    const missing = ['Cover art (3000×3000)', 'Songwriter credits', 'Audio files']
    if (!date) missing.push('Release date')
    setList((l) => [
      {
        id: `rel_${Date.now()}`,
        title,
        type,
        trackIds: [],
        genre: String(f.get('genre') ?? ''),
        language: String(f.get('language') ?? ''),
        releaseDate: date || null,
        status: 'metadata_incomplete',
        missing,
      },
      ...l,
    ])
    setOpen(false)
    setExplicit(false)
    toast.success(`Draft “${title}” created`, { description: 'Finish the checklist to make it ready for review.' })
  }

  return (
    <>
      <PageHeader title="Releases" description="Create singles, EPs and albums and track every step to the stores.">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> Create new release
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new release</DialogTitle>
              <DialogDescription>Start with the basics. You can add tracks, artwork and credits next.</DialogDescription>
            </DialogHeader>
            <form id="new-release" onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Release title</Label>
                <Input id="title" name="title" required maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Release type</Label>
                <select
                  id="type"
                  name="type"
                  className="h-9 w-full rounded-md border border-input bg-input/30 px-3 text-sm"
                  defaultValue="Single"
                >
                  <option>Single</option>
                  <option>EP</option>
                  <option>Album</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Primary genre</Label>
                <Input id="genre" name="genre" required placeholder="Afrobeats" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" name="language" required placeholder="English" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Release date</Label>
                <Input id="date" name="date" type="date" />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Switch id="explicit" checked={explicit} onCheckedChange={setExplicit} />
                <Label htmlFor="explicit">Contains explicit content</Label>
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="new-release">
                Create draft
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-medium">Create your first release.</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{r.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.type} · {r.genre} · {r.language}
                  </p>
                </div>
                <StatusPill tone={tone[r.status]}>{releaseStatusLabel[r.status]}</StatusPill>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Release date</dt>
                  <dd>{r.releaseDate ?? 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tracks</dt>
                  <dd>
                    {r.trackIds.length
                      ? r.trackIds.map((id) => tracks.find((t) => t.id === id)?.title).join(', ')
                      : 'None yet'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">UPC</dt>
                  <dd className="text-muted-foreground">Assigned by partner</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">ISRC</dt>
                  <dd className="text-muted-foreground">Assigned by partner</dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-border pt-4">
                {r.missing.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-chart-2">
                    <CheckCircle2 className="size-4" aria-hidden="true" /> Metadata checklist complete
                  </p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {r.missing.map((m) => (
                      <li key={m} className="flex items-center gap-2 text-chart-5">
                        <AlertCircle className="size-4" aria-hidden="true" /> {m}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to="/dashboard/distribution">Distribution status</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
