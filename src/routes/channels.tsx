import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { channels } from '@/lib/fixtures'

export const Route = createFileRoute('/channels')({
  head: () => ({ meta: [{ title: 'Channels · ZaeWave' }] }),
  component: Channels,
})

function Channels() {
  const [q, setQ] = useState('')
  const list = channels.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-bold sm:text-5xl">ZaeWave Channels</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Spaces for every kind of music creator. Channels open as the community launches;
          each one goes live with real profiles, uploads and activity.
        </p>
        <div className="relative mt-8 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search channels" placeholder="Search channels" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {list.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No channels match “{q}”.</p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <li key={c.slug} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{c.name}</h2>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-muted-foreground">
                    Opening soon
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
