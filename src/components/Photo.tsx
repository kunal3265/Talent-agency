import { useId } from 'react'

import { PHOTOS } from '../data'
import { cx } from '../lib/cx'

// Every image on the site goes through here. With a PHOTOS entry for the key
// it renders that photograph; without one it draws duotone art so the site
// looks finished before real photography arrives.

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}
const hash = (str: string) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

const BUSTS = [
  // head cx, cy, rx, ry, neck/shoulder path
  { head: [200, 205, 70, 86], body: 'M70 500 C 80 380 140 330 172 312 L 172 286 C 190 296 214 296 230 286 L 230 312 C 262 330 330 380 340 500 Z' },
  { head: [215, 200, 68, 84], body: 'M60 500 C 90 390 150 340 186 318 L 190 282 C 206 292 228 292 242 280 L 246 316 C 290 330 350 400 360 500 Z' },
  { head: [190, 210, 72, 86], body: 'M50 500 C 66 400 120 340 160 322 L 164 290 C 180 302 204 302 222 292 L 222 320 C 280 338 330 390 330 500 Z' },
  { head: [205, 196, 66, 82], body: 'M84 500 C 96 400 150 336 182 316 L 184 278 C 198 288 220 288 234 278 L 236 314 C 268 330 318 390 330 500 Z' },
]

export function Photo({
  photoKey,
  alt,
  hue,
  kind = 'portrait',
  pose = 0,
  className,
  label,
}: {
  photoKey: string
  alt: string
  hue: number
  kind?: 'portrait' | 'still'
  pose?: number
  className?: string
  /** Optional caption drawn into generated stills. */
  label?: string
}) {
  const src = PHOTOS[photoKey]
  const id = useId().replace(/:/g, '')
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cx('h-full w-full object-cover', kind === 'portrait' ? 'object-[50%_22%]' : 'object-center', className)}
      />
    )
  }
  const r = rng(hash(photoKey))
  const a11y = alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true as const }
  if (kind === 'portrait') {
    const bust = BUSTS[pose % BUSTS.length]
    const [hx, hy, hrx, hry] = bust.head
    const rimLeft = pose % 2 === 0
    return (
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" {...a11y} className={cx('block h-full w-full', className)}>
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={`hsl(${hue} 55% 22%)`} />
            <stop offset="0.6" stopColor={`hsl(${hue} 50% 9%)`} />
            <stop offset="1" stopColor="#050506" />
          </linearGradient>
          <radialGradient id={`${id}-light`} cx={rimLeft ? '0.15' : '0.85'} cy="0.25" r="0.7">
            <stop offset="0" stopColor={`hsl(${hue} 95% 72%)`} stopOpacity="0.75" />
            <stop offset="1" stopColor={`hsl(${hue} 95% 60%)`} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-skin`} x1={rimLeft ? '0' : '1'} y1="0" x2={rimLeft ? '1' : '0'} y2="0.2">
            <stop offset="0" stopColor={`hsl(${hue} 60% 62%)`} />
            <stop offset="0.18" stopColor={`hsl(${hue} 35% 18%)`} />
            <stop offset="1" stopColor="#08080b" />
          </linearGradient>
          <filter id={`${id}-n`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={hash(photoKey) % 100} />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.16 0" />
          </filter>
        </defs>
        <rect width="400" height="500" fill={`url(#${id}-bg)`} />
        <rect width="400" height="500" fill={`url(#${id}-light)`} />
        <circle cx={rimLeft ? 300 : 100} cy={120 + r() * 60} r={90 + r() * 60} fill={`hsl(${(hue + 40) % 360} 80% 60%)`} opacity="0.1" />
        <g fill={`url(#${id}-skin)`}>
          <path d={bust.body} />
          <ellipse cx={hx} cy={hy} rx={hrx} ry={hry} />
        </g>
        <path d={bust.body} fill="none" stroke={`hsl(${hue} 95% 80%)`} strokeOpacity="0.35" strokeWidth="1.5" />
        <rect width="400" height="500" filter={`url(#${id}-n)`} />
      </svg>
    )
  }
  const sun = { x: 80 + r() * 240, y: 90 + r() * 90, r: 40 + r() * 50 }
  return (
    <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" {...a11y} className={cx('block h-full w-full', className)}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050506" />
          <stop offset="0.55" stopColor={`hsl(${hue} 60% 20%)`} />
          <stop offset="0.62" stopColor={`hsl(${hue} 80% 55%)`} />
          <stop offset="0.63" stopColor="#060608" />
          <stop offset="1" stopColor={`hsl(${hue} 40% 8%)`} />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor={`hsl(${(hue + 30) % 360} 100% 88%)`} />
          <stop offset="0.6" stopColor={`hsl(${hue} 90% 65%)`} stopOpacity="0.8" />
          <stop offset="1" stopColor={`hsl(${hue} 90% 60%)`} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-lines`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#000" opacity="0.35" />
        </pattern>
        <filter id={`${id}-n`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={hash(photoKey) % 100} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.14 0" />
        </filter>
      </defs>
      <rect width="640" height="400" fill={`url(#${id}-sky)`} />
      <circle cx={sun.x} cy={sun.y + 80} r={sun.r * 2} fill={`url(#${id}-sun)`} />
      <path d={`M0 250 L ${120 + r() * 80} ${200 + r() * 20} L ${260 + r() * 80} 246 L ${420 + r() * 60} ${190 + r() * 30} L 640 248 L 640 252 L 0 252 Z`} fill="#050506" />
      <rect width="640" height="400" fill={`url(#${id}-lines)`} />
      <rect width="640" height="400" filter={`url(#${id}-n)`} />
      {label && (
        <text x="24" y="376" fill="#f1eee4" opacity="0.85" style={{ font: '500 13px var(--font-mono)' }}>
          {label}
        </text>
      )}
    </svg>
  )
}
