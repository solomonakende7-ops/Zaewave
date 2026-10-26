/**
 * Preview data for the ZaeWave product surface.
 *
 * Everything here is placeholder content so the screens can be explored before
 * accounts, storage and the database are connected (see PLAN.md). Replace these
 * exports with real loaders/server functions in later milestones. Nothing here
 * represents real streams, earnings, ISRCs/UPCs or delivery confirmations.
 */

export type TrackStatus = 'draft' | 'mixing' | 'mastered'

export interface Track {
  id: string
  title: string
  artist: string
  genre: string
  bpm: number | null
  key: string | null
  duration: string
  status: TrackStatus
  updated: string
}

export const artist = {
  displayName: 'Zae Lilith',
  legalName: 'Solomon Akaa',
  accountType: 'Artist',
  country: 'Nigeria',
  plan: 'Free preview',
}

export const tracks: Track[] = [
  {
    id: 'trk_lagos-nights',
    title: 'Lagos Nights',
    artist: 'Zae Lilith',
    genre: 'Afrobeats',
    bpm: 104,
    key: 'A minor',
    duration: '3:24',
    status: 'mastered',
    updated: '2 days ago',
  },
  {
    id: 'trk_log-drum-prayer',
    title: 'Log Drum Prayer',
    artist: 'Zae Lilith',
    genre: 'Amapiano',
    bpm: 112,
    key: 'F major',
    duration: '4:10',
    status: 'mixing',
    updated: '5 days ago',
  },
  {
    id: 'trk_gold-dust',
    title: 'Gold Dust (demo)',
    artist: 'Zae Lilith',
    genre: 'R&B',
    bpm: null,
    key: null,
    duration: '2:51',
    status: 'draft',
    updated: '1 week ago',
  },
]

export type ReleaseStatus =
  | 'draft'
  | 'metadata_incomplete'
  | 'ready_for_review'
  | 'awaiting_provider'

export interface Release {
  id: string
  title: string
  type: 'Single' | 'EP' | 'Album'
  trackIds: string[]
  genre: string
  language: string
  releaseDate: string | null
  status: ReleaseStatus
  missing: string[]
}

export const releases: Release[] = [
  {
    id: 'rel_lagos-nights',
    title: 'Lagos Nights',
    type: 'Single',
    trackIds: ['trk_lagos-nights'],
    genre: 'Afrobeats',
    language: 'English, Yoruba',
    releaseDate: '2026-12-04',
    status: 'ready_for_review',
    missing: [],
  },
  {
    id: 'rel_sunday-service',
    title: 'Sunday Service',
    type: 'EP',
    trackIds: ['trk_log-drum-prayer', 'trk_gold-dust'],
    genre: 'Amapiano',
    language: 'English',
    releaseDate: null,
    status: 'metadata_incomplete',
    missing: ['Cover art (3000×3000)', 'Songwriter credits', 'Release date'],
  },
]

export const releaseStatusLabel: Record<ReleaseStatus, string> = {
  draft: 'Draft',
  metadata_incomplete: 'Metadata incomplete',
  ready_for_review: 'Ready for review',
  awaiting_provider: 'Awaiting distribution partner',
}

/** Store list shown in distribution. Coverage is confirmed by the partner, not by ZaeWave. */
export const stores = [
  'Spotify',
  'Apple Music',
  'YouTube Music',
  'Amazon Music',
  'Deezer',
  'TIDAL',
  'Audiomack',
  'Boomplay',
]

export const remakeStyles = [
  'Afrobeats',
  'Amapiano',
  'Hip-hop',
  'Trap',
  'R&B',
  'Gospel',
  'Reggae',
  'Highlife',
  'Lo-fi',
]

export const remakeModes = [
  {
    id: 'genre',
    title: 'Change genre',
    description: 'Re-imagine the song in a new style while keeping its melody.',
  },
  {
    id: 'instrumental',
    title: 'New instrumental',
    description: 'Generate a fresh backing track around your vocal.',
  },
  {
    id: 'separate',
    title: 'Separate stems',
    description: 'Split vocals, drums, bass and other instruments.',
  },
  {
    id: 'clean',
    title: 'Clean up vocals',
    description: 'Reduce noise and improve vocal clarity.',
  },
] as const

export interface Channel {
  slug: string
  name: string
  description: string
  milestone: number
}

export const channels: Channel[] = [
  { slug: 'artists', name: 'Artist Channel', description: 'Bio, photos, releases, tracks and links.', milestone: 5 },
  { slug: 'discover', name: 'Music Discovery', description: 'Browse, search and filter new music.', milestone: 5 },
  { slug: 'producers', name: 'Producer Channel', description: 'Beats, instrumentals and production services.', milestone: 5 },
  { slug: 'songwriters', name: 'Songwriter Channel', description: 'Portfolios, splits and co-writes.', milestone: 5 },
  { slug: 'dj', name: 'DJ & Remix', description: 'Authorized mixes, remixes and DJ sets.', milestone: 5 },
  { slug: 'labels', name: 'Record Labels', description: 'Rosters, releases and label pages.', milestone: 5 },
  { slug: 'collab', name: 'Collaboration', description: 'Invites, shared drafts, credits and feedback.', milestone: 6 },
  { slug: 'learn', name: 'Learning', description: 'Production tutorials and courses.', milestone: 6 },
  { slug: 'community', name: 'Community', description: 'Comments, likes, follows and discussions.', milestone: 6 },
  { slug: 'events', name: 'Live & Events', description: 'Shows, listening parties and live sessions.', milestone: 6 },
  { slug: 'playlists', name: 'Playlists', description: 'Create, save and share playlists.', milestone: 5 },
  { slug: 'marketplace', name: 'Marketplace', description: 'Sell beats, licenses and digital products.', milestone: 7 },
  { slug: 'charts', name: 'Charts', description: 'Rankings from verified ZaeWave listening data.', milestone: 7 },
  { slug: 'creator', name: 'Creator Dashboard', description: 'Uploads, projects, releases and earnings.', milestone: 2 },
]

export const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    features: ['Studio with 3 projects', 'WAV export', '5 AI credits / month', 'Artist channel'],
  },
  {
    name: 'Studio Pro',
    price: 'Pricing set at launch',
    period: '',
    features: ['Unlimited projects', 'WAV + MP3 export', 'Monthly AI & mastering credits', 'Priority processing'],
  },
  {
    name: 'Label',
    price: 'Pricing set at launch',
    period: '',
    features: ['Multiple artists', 'Release packages', 'Team roles', 'Label channel'],
  },
]
