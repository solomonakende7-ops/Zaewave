# ZaeWave Product Roadmap

ZaeWave is the rebranded successor of the MyDala / ZaeMusic Hub app (https://36bac860.mydala.app). It's an AI music studio, song-remaking tool, artist community and distribution service. The old app keeps running untouched. Its songs and releases were stored only in each visitor's browser (localStorage on the mydala.app domain), so there is no server data to migrate. The Import step in milestone 2 lets artists bring files across.

Each milestone is small and self-contained. Never mark an integration as working until it has been tested against the real provider.

## ✅ Milestone 1: Branded product surface (done)
- Official ZaeWave logo (only the screenshot bar was cropped), favicon, app icons, manifest, dark navy + electric-blue theme.
- Landing page, Sign in / Create account screens (preview only), Channels hub.
- Dashboard shell with the old routes kept: `/dashboard`, `/dashboard/music`, `/dashboard/releases`, `/dashboard/distribution`, `/dashboard/settings`. New: `/dashboard/studio`, `/dashboard/remake`.
- Working browser studio: upload/record, waveform, trim, gain, pan, fades, 2-band EQ, undo/redo, per-device autosave, WAV export.
- Sample data lives in `src/lib/fixtures.ts`.

## Milestone 2: Accounts, data model & storage
- Netlify Identity: register, log in, password reset, email confirmation. Roles: artist, producer, label, admin.
- Netlify Database (Drizzle): profiles, projects, tracks, releases, release_tracks, credits, versions.
- Netlify Blobs for audio and artwork (private keys per user, served through authenticated function routes). Validate type, size and metadata. Use chunked uploads for large files.
- Replace fixtures with loaders/server functions. Add a "My Music" upload → playback journey. Add an import helper for files from the old app.
- Settings: profile editing, account deletion, privacy controls.

## Milestone 3: Studio v2
- Multitrack timeline (arrange, split, join, loop), reverb, delay, compression, noise gate.
- BPM/key detection, MP3 export (lamejs or ffmpeg.wasm), cloud-saved projects with version history.

## Milestone 4: Remake My Song (real AI)
- Pick and verify an audio provider (for example stem separation, text-to-music or remix APIs). Check licensing, pricing and API docs, and store the key as a server env var.
- Background functions + job table: queued → processing → done/failed, with retries. Store results in Blobs. Add A/B compare, save versions and export.
- Voice cloning only when the provider allows it and the user has authorization.

## Milestone 5: Distribution
- Research and contract a distribution aggregator with an API (confirm coverage for Spotify, Apple, YouTube Music, Amazon, Deezer, Audiomack, Boomplay). If no API is available, use a transparent partner-assisted submission queue.
- Full release metadata: credits, ISRC/UPC (from the partner or entered by the artist), territories, scheduling, artwork validation (3000×3000).
- Status sync, delivery reports, rejection and correction flow, takedown and update requests. Show royalty reports only when the partner supplies them.

## Milestone 6: Channels & community
- Artist, Producer, Songwriter, DJ/Remix and Label channels. Discovery with search and filters. Playlists.
- Collaboration (invites, shared drafts, credits, feedback), Community (comments, likes, follows), Learning, Live & Events.
- Moderation and reporting tools for admins.

## Milestone 7: Payments, credits, marketplace & charts
- Paystack (cards and transfers): plans, credit packs and release packages. Server-side verification, signed webhooks, idempotent ledger, receipts.
- Credit deduction tied to AI and mastering jobs. Beat marketplace with licenses. Charts from verified ZaeWave plays only.

## Milestone 8: Custom domain, QA & launch
- Register the domain (the owner chooses and buys it), add it in Netlify, wait for DNS and HTTPS to verify, set it as primary, then update Identity, Paystack and webhook URLs.
- Add end-to-end tests for critical journeys and a mobile pass. Launch from a tested deploy preview.
