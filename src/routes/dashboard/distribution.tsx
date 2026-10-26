import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CircleDashed, PlugZap, ShieldCheck } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PageHeader, StatusPill } from '@/components/page-header'
import { releases, releaseStatusLabel, stores } from '@/lib/fixtures'

export const Route = createFileRoute('/dashboard/distribution')({
  head: () => ({ meta: [{ title: 'Distribution · ZaeWave' }] }),
  component: Distribution,
})

const rights = [
  { id: 'audio', label: 'I own or control the rights to this audio, including any samples.' },
  { id: 'art', label: 'I have the rights to use the cover artwork.' },
  { id: 'artist', label: "I am the artist, or I'm authorized to release on their behalf." },
]

function Distribution() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const allChecked = rights.every((r) => checked[r.id])

  return (
    <>
      <PageHeader
        title="Distribution"
        description="Send releases to the streaming stores and follow the real delivery status from our partner."
      />

      <section className="rounded-2xl border border-chart-5/40 bg-chart-5/10 p-6">
        <div className="flex gap-4">
          <PlugZap className="size-6 shrink-0 text-chart-5" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold">Distribution partner: not connected yet</h2>
            <p className="mt-1 text-sm text-foreground/80">
              ZaeWave delivers releases through a licensed distribution partner. Until that
              agreement is in place, releases can be prepared and checked but are not sent to any store.
              Statuses here only change when the partner reports them.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Delivery status</h2>
          <ul className="mt-4 divide-y divide-border">
            {releases.map((r) => (
              <li key={r.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {r.title} <span className="text-sm text-muted-foreground">· {r.type}</span>
                  </p>
                  <StatusPill tone={r.missing.length ? 'warn' : 'info'}>{releaseStatusLabel[r.status]}</StatusPill>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {stores.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
                    >
                      <CircleDashed className="size-3" aria-hidden="true" /> {s}: not sent
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" /> Rights confirmation
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Required before any release is submitted.</p>
          <div className="mt-4 space-y-4">
            {rights.map((r) => (
              <div key={r.id} className="flex items-start gap-3">
                <Checkbox
                  id={`right-${r.id}`}
                  checked={!!checked[r.id]}
                  onCheckedChange={(v) => setChecked((c) => ({ ...c, [r.id]: v === true }))}
                />
                <Label htmlFor={`right-${r.id}`} className="leading-snug font-normal">
                  {r.label}
                </Label>
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full" disabled>
            Submit to stores
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            {allChecked
              ? 'Rights confirmed. Submission unlocks once the distribution partner is connected.'
              : 'Confirm all rights above. Submission also requires the distribution partner.'}
          </p>
        </section>
      </div>
    </>
  )
}
