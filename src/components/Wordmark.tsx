import { useId } from 'react'

import { cx } from '../lib/cx'

/**
 * A word set in the heavy display face and stretched to fill its container
 * edge to edge, with film grain and dust inside the letters. Used for the
 * hero logotype and page titles. The SVG scales with its width.
 */
export function Wordmark({
  text,
  className,
  glow = true,
  height = 290,
  fontSize = 400,
  label,
}: {
  text: string
  className?: string
  glow?: boolean
  /** viewBox height; the width is always 1440. */
  height?: number
  fontSize?: number
  /** Accessible name; defaults to the text. */
  label?: string
}) {
  const id = useId().replace(/:/g, '')
  const baseline = height - 6
  // Each letter is fitted on its own so the gaps between them stay tight
  // (the face's side bearings would otherwise open them up when stretched).
  // 0 lets the glyphs sit edge to edge; anything above 0 overlaps the ink
  // and neighbouring letters collide.
  const letters = [...text]
  const tight = 0
  const bleed = 6
  // Narrow and wide glyphs get a share of the width close to their natural one.
  const WEIGHTS: Record<string, number> = { ' ': 0.34, I: 0.42, J: 0.8, '-': 0.6, M: 1.18, W: 1.28 }
  const weight = (ch: string) => WEIGHTS[ch] ?? 1
  const units = letters.reduce((n, ch) => n + weight(ch), 0)
  const lw = (1440 + bleed * 2) / (units - (letters.length - 1) * tight)
  const gap = -tight * lw
  const xs = letters.map((_, i) => letters.slice(0, i).reduce((x, ch) => x + weight(ch) * lw + gap, 0) - bleed)
  const scratches = [
    'M120 60 q30 40 12 90',
    'M410 30 q-20 60 8 120 t-4 80',
    'M700 140 q50 10 80 60',
    'M980 40 q10 70 -14 140',
    'M1210 90 q24 30 10 70',
    'M1330 180 q-30 20 -36 70',
    'M560 220 q30 -10 60 8',
  ]
  return (
    <svg
      viewBox={`0 0 1440 ${height}`}
      role="img"
      aria-label={label ?? text}
      className={cx('block w-full select-none', className)}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <radialGradient id={`${id}-fill`} cx="0.52" cy="1" r="0.75">
          <stop offset="0" stopColor={glow ? '#d9f0a8' : '#f1eee4'} />
          <stop offset="0.3" stopColor={glow ? '#ebf3d2' : '#f2f0e4'} />
          <stop offset="0.6" stopColor="#f3f1e6" />
          <stop offset="1" stopColor="#f6f3ea" />
        </radialGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.08  0 0 0 0 0.1  0 0 0 -2.4 1.25" />
        </filter>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height={height}>
          {letters.map((ch, i) =>
            ch === ' ' ? null : (
            <text
              key={i}
              x={xs[i]}
              y={baseline}
              textLength={weight(ch) * lw}
              lengthAdjust="spacingAndGlyphs"
              fontSize={fontSize}
              fill="#fff"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontVariationSettings: "'wdth' 100" }}
            >
              {ch}
            </text>
            ),
          )}
        </mask>
      </defs>
      <g mask={`url(#${id}-mask)`}>
        <rect width="1440" height={height} fill={`url(#${id}-fill)`} />
        <rect width="1440" height={height} filter={`url(#${id}-grain)`} opacity="0.22" />
        <g fill="none" stroke="#1a1a1f" strokeWidth="1.1" strokeLinecap="round" opacity="0.45">
          {scratches.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </svg>
  )
}
