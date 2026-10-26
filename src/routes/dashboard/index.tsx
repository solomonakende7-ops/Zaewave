import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, AudioWaveform, Disc3, Library, Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeader, StatusPill } from '@/components/page-header'
import { artist, releases, releaseStatusLabel, tracks } from '@/lib/fixtures'

export const Route = createFileRoute('/dashboard/')({
  component: Overview,
})

const quick = [
  { to: '/dashboard/studio', icon: AudioWaveform, title: 'Open studio', body: 'Record or edit a track' },
  { to: '/dashboard/remake', icon: Wand2, title: 'Remake a song', body: 'Transform it with AI' },
  { to: '/dashboard/releases', icon: Disc3, title: 'New release', body: 'Single, EP or album' },
] as const

function Overview() {
  return (
    <>
      <PageHeader
        title={`Welcome back, ${artist.displayName}`}
        description="Your creator dashboard: projects, releases and what needs your attention."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {quick.map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/60 motion-reduce:transition-none"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{title}</span>
              <span className="block text-sm text-muted-foreground">{body}</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent projects</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/music">View all</Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {tracks.map((t) => (
              <li key={t.id} className="flex items-center gap-4 py-3">
                <Library className="size-4 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.genre} · {t.duration} · edited {t.updated}
                  </p>
                </div>
                <StatusPill tone={t.status === 'mastered' ? 'good' : t.status === 'mixing' ? 'info' : 'neutral'}>
                  {t.status}
                </StatusPill>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Releases</h2>
          <ul className="mt-4 space-y-3">
            {releases.map((r) => (
              <li key={r.id} className="rounded-xl bg-secondary/60 p-3">
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.type} · {releaseStatusLabel[r.status]}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-dashed border-border p-6">
        <h2 className="text-lg font-semibold">Streams & earnings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No verified listening or royalty data yet. Figures appear here only once your
          distribution partner reports them. ZaeWave never estimates or invents them.
        </p>
      </section>
    </>
  )
}
