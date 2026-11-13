import { useId, useMemo } from 'react'

import { cx } from '../lib/cx'

// The hero creature, drawn entirely in SVG: four glass wings with generated
// venation, a metallic body and a violet core glow. Wings flutter and dust
// drifts unless the visitor prefers reduced motion (styles.css turns the
// keyframes off).

const W = 1000
const H = 600
const CX = W / 2

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

type WingSpec = { length: number; width: number; root: number; broad: number; angle: number; y: number }

const FORE: WingSpec = { length: 455, width: 60, root: 9, broad: 0.95, angle: -3, y: 150 }
const HIND: WingSpec = { length: 425, width: 64, root: 12, broad: 1.4, angle: 9, y: 186 }

/** Wing outline in local space: root at (0,0), tip along +x, leading edge at -y. */
function outline({ length: L, width: Wd, root, broad }: WingSpec, scale = 1) {
  const l = L * scale
  const w = Wd * scale
  return [
    `M 0 ${-root}`,
    `C ${l * 0.22} ${-w * 1.02} ${l * 0.68} ${-w * 1.0} ${l * 0.95} ${-w * 0.42}`,
    `Q ${l * 1.02} ${-w * 0.02} ${l * 0.96} ${w * 0.3}`,
    `C ${l * 0.8} ${w * 0.92} ${l * 0.36} ${w * broad} 0 ${root}`,
    'Z',
  ].join(' ')
}

function veins(spec: WingSpec, seed: number) {
  const { length: L, width: Wd, broad } = spec
  const r = rng(seed)
  const lanes = [-0.86, -0.62, -0.34, -0.06, 0.24, 0.52, 0.8]
  const curve = (k: number) => {
    const spread = k < 0 ? 1 : broad
    return {
      p0: [0, k * spec.root],
      c: [L * 0.5, k * Wd * 1.05 * spread],
      p1: [L * (0.94 - Math.abs(k) * 0.12), k * Wd * 0.38 * spread],
    }
  }
  const at = (k: number, t: number) => {
    const { p0, c, p1 } = curve(k)
    const u = 1 - t
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]
  }
  const long = lanes.map((k) => {
    const { p0, c, p1 } = curve(k)
    return `M ${p0[0]} ${p0[1]} Q ${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`
  })
  const cross: string[] = []
  for (let i = 0; i < lanes.length - 1; i++) {
    let t = 0.06 + r() * 0.04
    while (t < 0.96) {
      const a = at(lanes[i], t)
      const b = at(lanes[i + 1], Math.min(0.99, t + (r() - 0.5) * 0.05))
      cross.push(`M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}`)
      t += 0.028 + r() * 0.03
    }
  }
  // the trailing-edge mesh: short cells between the last lane and the edge
  return { long, cross }
}

function Wing({ spec, side, id, seed, delay }: { spec: WingSpec; side: 1 | -1; id: string; seed: number; delay: string }) {
  const path = outline(spec)
  const ghost = outline(spec, 1.055)
  const { long, cross } = useMemo(() => veins(spec, seed), [spec, seed])
  const clip = `${id}-clip-${seed}`
  const rootX = CX + side * 18
  return (
    <g
      className={side < 0 ? 'animate-flutter-l' : 'animate-flutter-r'}
      style={{ transformOrigin: `${rootX}px ${spec.y}px`, animationDelay: delay }}
    >
      <g transform={`translate(${rootX} ${spec.y}) scale(${side} 1) rotate(${spec.angle})`}>
        <defs>
          <clipPath id={clip}>
            <path d={path} />
          </clipPath>
        </defs>
        <path d={ghost} fill="none" stroke="rgb(230 226 255 / 0.32)" strokeWidth="1.4" />
        <path d={path} fill={`url(#${id}-wing)`} />
        <path d={path} fill={`url(#${id}-root)`} />
        <g clipPath={`url(#${clip})`} fill="none" strokeLinecap="round">
          <g stroke="rgb(196 182 255 / 0.5)" strokeWidth="1.1">
            {long.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g stroke="rgb(176 160 255 / 0.28)" strokeWidth="0.7">
            {cross.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <path d={path} fill={`url(#${id}-sheen)`} opacity="0.7" />
        </g>
        <path d={path} fill="none" stroke="rgb(214 204 255 / 0.75)" strokeWidth="1.6" />
        {/* pterostigma */}
        <path
          d={`M ${spec.length * 0.8} ${-spec.width * 0.66} l 26 6 l -2 7 l -26 -6 z`}
          fill="#0b0816"
          stroke="rgb(214 204 255 / 0.6)"
          strokeWidth="0.8"
        />
      </g>
    </g>
  )
}

export function Dragonfly({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const dust = useMemo(() => {
    const r = rng(42)
    return Array.from({ length: 46 }, (_, i) => {
      const left = r() < 0.5
      const x = CX + (left ? -1 : 1) * (20 + r() * 300) * (r() < 0.7 ? 0.5 : 1)
      const y = 220 + r() * 380
      return { x, y, r: 0.6 + r() * 1.8, delay: `${(r() * 6).toFixed(2)}s`, dur: `${(6 + r() * 6).toFixed(1)}s`, i }
    })
  }, [])

  const segments = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const y = 222 + i * 34
        const w = 15 - i * 0.75
        return { y, w, h: 31 }
      }),
    [],
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cx('block overflow-visible', className)} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b2a92" stopOpacity="0.97" />
          <stop offset="0.3" stopColor="#120d2e" stopOpacity="0.95" />
          <stop offset="0.75" stopColor="#08081a" stopOpacity="0.93" />
          <stop offset="1" stopColor="#121128" stopOpacity="0.88" />
        </linearGradient>
        <radialGradient id={`${id}-root`} cx="0" cy="0" r="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c7a6ff" stopOpacity="0.8" />
          <stop offset="0.45" stopColor="#7d55ff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#7d55ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#a58cff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-core`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f3d6ff" stopOpacity="1" />
          <stop offset="0.25" stopColor="#b77bff" stopOpacity="0.75" />
          <stop offset="0.6" stopColor="#6a3cff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#6a3cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5a3cd6" stopOpacity="0.42" />
          <stop offset="1" stopColor="#5a3cd6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0c0b14" />
          <stop offset="0.3" stopColor="#4b4472" />
          <stop offset="0.48" stopColor="#d9d2ff" />
          <stop offset="0.62" stopColor="#4a3f86" />
          <stop offset="1" stopColor="#0b0a12" />
        </linearGradient>
        <radialGradient id={`${id}-eye`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#f2efff" />
          <stop offset="0.18" stopColor="#8f86c8" />
          <stop offset="0.55" stopColor="#24203c" />
          <stop offset="1" stopColor="#07060d" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* body halo behind everything */}
      <ellipse cx={CX} cy="250" rx="340" ry="230" fill={`url(#${id}-halo)`} />

      {/* wings: hind first so the forewings overlap them */}
      <Wing spec={HIND} side={-1} id={id} seed={11} delay="0.25s" />
      <Wing spec={HIND} side={1} id={id} seed={12} delay="0.25s" />
      <Wing spec={FORE} side={-1} id={id} seed={21} delay="0s" />
      <Wing spec={FORE} side={1} id={id} seed={22} delay="0s" />

      {/* core glow where the wings meet the thorax */}
      <circle cx={CX} cy="168" r="95" fill={`url(#${id}-core)`} className="animate-pulse-glow" />

      <g className="animate-hover">
        {/* legs */}
        <g fill="none" stroke="#5c5486" strokeWidth="2.2" strokeLinecap="round">
          {[-1, 1].map((s) => (
            <g key={s}>
              <path d={`M ${CX + s * 10} 150 q ${s * 28} 6 ${s * 34} 34 q ${s * 4} 12 ${s * 16} 18`} />
              <path d={`M ${CX + s * 10} 168 q ${s * 30} 18 ${s * 30} 46 q 0 12 ${s * 12} 22`} />
              <path d={`M ${CX + s * 8} 186 q ${s * 22} 30 ${s * 16} 60`} />
            </g>
          ))}
        </g>

        {/* abdomen */}
        {segments.map(({ y, w, h }, i) => (
          <g key={y}>
            <rect x={CX - w / 2} y={y} width={w} height={h} rx={w / 2} fill={`url(#${id}-metal)`} />
            <rect x={CX - w / 2 - 1} y={y + h - 3} width={w + 2} height="4" rx="2" fill={i % 3 === 0 ? '#c8a8ff' : '#3a2f6e'} opacity={i % 3 === 0 ? 0.85 : 1} />
          </g>
        ))}
        <path d={`M ${CX} 560 L ${CX} 600`} stroke="rgb(214 204 255 / 0.6)" strokeWidth="1.5" />

        {/* thorax */}
        <ellipse cx={CX} cy="170" rx="30" ry="56" fill={`url(#${id}-metal)`} />
        <ellipse cx={CX} cy="172" rx="13" ry="34" fill="#f0e4ff" opacity="0.55" filter={`url(#${id}-blur)`} />
        <path d={`M ${CX} 120 L ${CX} 222`} stroke="#e6dcff" strokeWidth="1.4" opacity="0.6" />
        {[-1, 1].map((s) => (
          <path key={s} d={`M ${CX + s * 26} 140 q ${s * 8} 30 0 60`} fill="none" stroke="#a99cff" strokeWidth="1.2" opacity="0.7" />
        ))}

        {/* head */}
        <ellipse cx={CX} cy="108" rx="22" ry="14" fill={`url(#${id}-metal)`} />
        <ellipse cx={CX - 24} cy="80" rx="27" ry="25" fill={`url(#${id}-eye)`} />
        <ellipse cx={CX + 24} cy="80" rx="27" ry="25" fill={`url(#${id}-eye)`} />
        <ellipse cx={CX} cy="64" rx="12" ry="9" fill="#15121f" stroke="#7b70b8" strokeWidth="1" />
        <g fill="none" stroke="#8c84c4" strokeWidth="2" strokeLinecap="round">
          <path d={`M ${CX - 8} 58 q -10 -22 -30 -26`} />
          <path d={`M ${CX + 8} 58 q 10 -22 30 -26`} />
        </g>
      </g>

      {/* drifting dust */}
      <g fill="#d9ccff">
        {dust.map((d) => (
          <circle
            key={d.i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            className="animate-drift"
            style={{ animationDelay: d.delay, animationDuration: d.dur }}
          />
        ))}
      </g>
    </svg>
  )
}
