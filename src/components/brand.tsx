import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

/** Official ZaeWave artwork, served through the Image CDN at display size. */
export function logoSrc(width: number, file = 'icon-512.png') {
  return `/.netlify/images?url=/brand/${file}&w=${width}&fm=webp&q=90`
}

/** Square ZaeWave mark (same artwork as the official logo, on its navy background). */
export function LogoMark({
  size = 36,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <img
      src={logoSrc(size * 2)}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={cn('shrink-0 rounded-lg object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}

export function Wordmark({
  to = '/',
  size = 36,
  className,
}: {
  to?: '/' | '/dashboard'
  size?: number
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-ring',
        className,
      )}
      aria-label="ZaeWave home"
    >
      <LogoMark size={size} />
      <span className="font-display text-xl font-bold tracking-tight">
        Zae<span className="text-primary">Wave</span>
      </span>
    </Link>
  )
}

/** Full official logo artwork (cropped of the screenshot bar only). */
export function LogoArtwork({ className }: { className?: string }) {
  return (
    <img
      src={logoSrc(1440, 'zaewave-logo.jpg')}
      srcSet={`${logoSrc(720, 'zaewave-logo.jpg')} 720w, ${logoSrc(1440, 'zaewave-logo.jpg')} 1440w`}
      sizes="(min-width: 1024px) 560px, 90vw"
      width={720}
      height={441}
      alt="ZaeWave logo"
      className={cn('h-auto w-full object-contain', className)}
    />
  )
}
