# ZaeWave

ZaeWave is an AI music creation studio, song-remaking platform, artist community and music distribution service for independent artists, producers and labels. It's the rebrand and upgrade of the MyDala / ZaeMusic Hub app.

## What works today
- Landing page, sign-in and registration screens (preview mode), and a Channels hub.
- Creator dashboard: Overview, Studio, Remake My Song, My Music, Releases, Distribution, Settings.
- **Studio**: upload or record audio, see the waveform, trim, gain, pan, fades and low/high-shelf EQ, undo/redo, autosave on the device, and export WAV. Everything runs in the browser through the Web Audio API.
- **My Music**: local upload with type and size checks, playback, and search.
- **Releases**: create draft releases and see the metadata checklist.
- **Distribution**: rights confirmation and per-store status. Submission stays locked until a distribution partner is connected.

The catalog, releases and profile shown are sample data from `src/lib/fixtures.ts`. Accounts, cloud storage, AI generation, distribution and payments are not connected yet. See [PLAN.md](PLAN.md).

## Tech
TanStack Start (React 19), Vite, Tailwind CSS 4, shadcn/ui, and the Web Audio API, deployed on Netlify. Logo images are served through the Netlify Image CDN.

## Run locally
```bash
pnpm install
netlify dev   # or: pnpm dev
pnpm test
```

## Brand assets
- `public/brand/zaewave-logo.jpg`: the official logo, with only the screenshot bar cropped. The untouched upload is in `brand-source/`.
- `public/brand/icon-*.png`, `public/favicon.ico` and `public/apple-touch-icon.png`: square icons made from the same artwork.

## Custom domain
1. Register a domain (for example a `.com` costs roughly $10–20/year, a `.ng` or `.com.ng` from a NiRA registrar).
2. In Netlify go to **Domain management → Add a domain**, then either use Netlify DNS (change nameservers) or add the CNAME/A records your registrar needs.
3. Wait for verification and the automatic HTTPS certificate, then set the domain as primary. The `*.netlify.app` address redirects to it automatically.
4. Once accounts and payments exist, update the Identity email links and the Paystack callback and webhook URLs to the new domain.

## Roadmap
See [PLAN.md](PLAN.md): accounts and storage, Studio v2, real AI remakes, distribution partner, channels, Paystack payments, then the domain and launch.
