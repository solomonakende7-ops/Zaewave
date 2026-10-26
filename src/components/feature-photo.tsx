import { cn } from '@/lib/utils'

/** Original uploaded photos in `public/images/`, with their intrinsic size. */
export const photos = {
  vocalist: { file: 'studio-vocalist.jpg', width: 1080, height: 970 },
  producer: { file: 'ai-producer.jpg', width: 1080, height: 1004 },
  artist: { file: 'artist-portrait.jpg', width: 1080, height: 1028 },
} as const

const widths = [480, 720, 1080]

function photoSrc(file: string, width: number) {
  return `/.netlify/images?url=/images/${file}&w=${width}&fm=webp&q=80`
}

/**
 * Responsive photo served through the Image CDN at the displayed size.
 * `object-cover` crops instead of stretching; `position` keeps faces in frame.
 */
export function FeaturePhoto({
  photo,
  alt,
  position = 'center',
  sizes = '(min-width: 1024px) 560px, 92vw',
  priority = false,
  className,
}: {
  photo: keyof typeof photos
  alt: string
  position?: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const { file, width, height } = photos[photo]
  return (
    <img
      src={photoSrc(file, 720)}
      srcSet={widths.map((w) => `${photoSrc(file, w)} ${w}w`).join(', ')}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('size-full object-cover', className)}
      style={{ objectPosition: position }}
    />
  )
}
