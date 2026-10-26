import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  AudioWaveform,
  Disc3,
  Globe2,
  Mic2,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { LogoArtwork } from '@/components/brand'
import { FeaturePhoto, type photos } from '@/components/feature-photo'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { plans, stores } from '@/lib/fixtures'

export const Route = createFileRoute('/')({
  component: Home,
})

const pillars = [
  {
    icon: AudioWaveform,
    title: 'Music Studio',
    body: 'Record, trim, fade, mix and export straight from your browser, on a phone or a laptop.',
  },
  {
    icon: Wand2,
    title: 'Remake My Song',
    body: 'Upload a track, describe the vibe you want (Amapiano, gospel, trap) and compare versions side by side.',
  },
  {
    icon: Globe2,
    title: 'Distribution',
    body: 'Prepare releases with full credits, validated artwork and metadata, and track every step of delivery.',
  },
  {
    icon: Users,
    title: 'Artist Community',
    body: 'Channels for artists, producers, songwriters, DJs and labels, plus playlists, events and a beat marketplace.',
  },
]

const showcase: {
  id: string
  photo: keyof typeof photos
  alt: string
  position: string
  eyebrow: string
  title: string
  body: string
  points: string[]
  primary: {
    to: '/dashboard/studio' | '/dashboard/remake' | '/register'
    label: string
  }
  secondary: { to: '/dashboard/music' | '/channels'; label: string }
  note?: string
}[] = [
  {
    id: 'studio',
    photo: 'vocalist',
    alt: 'Vocalist singing into a studio condenser microphone with headphones on, in an acoustic-foam vocal booth',
    position: '60% 35%',
    eyebrow: 'Recording studio',
    title: 'Record vocals and produce, right in your browser.',
    body: 'Capture a take with your microphone or drop in a file, then trim, set gain and pan, add fades and EQ, and export a WAV.',
    points: [
      'Record from any mic',
      'Waveform editing with undo and redo',
      'Autosaves on this device',
    ],
    primary: { to: '/dashboard/studio', label: 'Open the studio' },
    secondary: { to: '/dashboard/music', label: 'My Music' },
  },
  {
    id: 'ai-studio',
    photo: 'producer',
    alt: 'Producer in headphones playing a MIDI keyboard next to a laptop running a music session',
    position: '65% 40%',
    eyebrow: 'AI music studio',
    title: 'Make beats, remix and transform your songs.',
    body: 'Remake My Song turns an original into a new version: switch genre, change the tempo, rebuild the beat or create a remix, then compare versions side by side.',
    points: [
      'Genre and mood transformations',
      'Beat-making and remixes',
      'Keep or replace the vocals',
    ],
    primary: { to: '/dashboard/remake', label: 'Try Remake My Song' },
    secondary: { to: '/dashboard/music', label: 'Upload a song' },
    note: 'AI generation switches on once our audio engine is connected. Until then you can prepare your remake settings.',
  },
  {
    id: 'artists',
    photo: 'artist',
    alt: 'Artist in a red hoodie and white mask under neon lights',
    position: '50% 30%',
    eyebrow: 'Featured artist',
    title: 'Your image, your sound, your channel.',
    body: 'Every ZaeWave artist gets a profile that puts their own photo, releases and credits up front, so listeners and collaborators find the real you.',
    points: [
      'Artist photo and profile',
      'Releases and credits in one place',
      'Artist, producer and label channels',
    ],
    primary: { to: '/register', label: 'Create artist account' },
    secondary: { to: '/channels', label: 'Explore channels' },
    note: 'Public artist profiles open together with Channels.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Create',
    body: 'Start a project, record vocals or drop in stems.',
  },
  {
    n: '02',
    title: 'Remake',
    body: 'Transform the song with AI, then refine the best version.',
  },
  {
    n: '03',
    title: 'Release',
    body: 'Add credits and artwork, then send it to the stores.',
  },
]

function Home() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="studio-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                AI music studio · Distribution · Community
              </p>
              <h1 className="font-display text-5xl leading-[1.02] font-bold sm:text-6xl lg:text-7xl">
                Make the song.
                <br />
                <span className="text-brand-gradient">Remake the wave.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                ZaeWave brings recording, AI song remaking and music
                distribution into one studio built for independent artists,
                producers and labels, from Lagos to everywhere.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/dashboard/studio">
                    Open the studio <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard/remake">Try Remake My Song</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Already a member?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-3xl border border-border bg-brand-navy shadow-2xl shadow-primary/10">
                <LogoArtwork />
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section id="features" className="border-t border-border/60 bg-card/30">
          <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
              One platform, from first idea to the stores.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50 motion-reduce:transition-none"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Studio, AI studio and featured artist */}
        {showcase.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className="scroll-mt-16 border-t border-border/60"
          >
            <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 ? 'lg:order-2' : undefined}>
                <div className="relative">
                  <div
                    className="absolute -inset-4 rounded-[2rem] bg-primary/15 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-brand-navy shadow-2xl shadow-primary/10 sm:aspect-[5/4]">
                    <FeaturePhoto
                      photo={s.photo}
                      alt={s.alt}
                      position={s.position}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-primary/20 ring-inset"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {s.eyebrow}
                </p>
                <h2
                  id={`${s.id}-title`}
                  className="mt-3 text-3xl font-bold sm:text-4xl"
                >
                  {s.title}
                </h2>
                <p className="mt-4 text-muted-foreground">{s.body}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <AudioWaveform
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to={s.primary.to}>
                      {s.primary.label} <ArrowRight />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={s.secondary.to}>{s.secondary.label}</Link>
                  </Button>
                </div>
                {s.note && (
                  <p className="mt-4 text-xs text-muted-foreground">{s.note}</p>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* How it works */}
        <section id="how" className="mx-auto max-w-content px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                How ZaeWave works
              </h2>
              <p className="mt-4 text-muted-foreground">
                A clear path from upload to release. Every step shows exactly
                what's happening, including what is still waiting on a partner.
              </p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="rounded-2xl border border-border p-6">
                  <span className="font-display text-sm font-bold text-primary">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Stores */}
        <section className="border-y border-border/60 bg-card/30">
          <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Built to prepare releases for stores including
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {stores.map((s) => (
                <li
                  key={s}
                  className="font-display text-lg font-semibold text-foreground/70"
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-6 max-w-xl text-center text-xs text-muted-foreground">
              Store coverage is confirmed by our distribution partner at launch.
              ZaeWave never marks a release as delivered without the partner's
              confirmation.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="mx-auto max-w-content px-4 py-20 sm:px-6"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Plans for every stage
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pay in Naira or your local currency. Start free, then upgrade when
            you're ready.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {plans.map((p, i) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-6 ${i === 1 ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-3 font-display text-2xl font-bold">
                  {p.price}
                  {p.period && (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {p.period}
                    </span>
                  )}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Disc3
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-content px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card to-card p-10 sm:p-14">
            <Mic2
              className="absolute -right-6 -bottom-6 size-48 text-primary/10"
              aria-hidden="true"
            />
            <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">
              Your next release starts here.
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Create your free ZaeWave account and open the studio in seconds.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/register">
                Create artist account <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
