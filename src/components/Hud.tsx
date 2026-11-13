import { useEffect, useState } from 'react'

import { cx } from '../lib/cx'
import { timecode } from '../lib/format'
import { useReducedMotion } from '../lib/useReducedMotion'

/** A running SMPTE-style timecode at 25 fps. Frozen under reduced motion. */
export function Timecode({ start = 0, className }: { start?: number; className?: string }) {
  const reduced = useReducedMotion()
  const [frames, setFrames] = useState(start)
  useEffect(() => {
    if (reduced) return
    const t0 = performance.now()
    const id = window.setInterval(() => setFrames(start + Math.floor(((performance.now() - t0) / 1000) * 25)), 40)
    return () => window.clearInterval(id)
  }, [start, reduced])
  return (
    <span className={cx('font-mono text-[11px] tabular-nums tracking-tight', className)} aria-hidden>
      {timecode(frames)}
    </span>
  )
}

/** Measures the real frame rate, like a camera overlay. */
export function FpsCounter({ className }: { className?: string }) {
  const [fps, setFps] = useState(60)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    let frames = 0
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      frames++
      if (now - last >= 1000) {
        setFps(Math.min(240, Math.round((frames * 1000) / (now - last))))
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])
  return (
    <span className={cx('micro tabular-nums', className)} aria-hidden>
      FPS:{fps}
    </span>
  )
}

export function RecIndicator({ className }: { className?: string }) {
  return (
    <span className={cx('micro inline-flex items-center gap-1', className)} aria-hidden>
      Rec
      <span className="round relative inline-block size-[9px] rounded-full border border-fg/80">
        <span className="round absolute inset-[2px] animate-blink rounded-full bg-[#ff4d4d]" />
      </span>
    </span>
  )
}

/** The vertical tick ruler that frames the hero on each side. */
export function Ruler({ side, className, style }: { side: 'left' | 'right'; className?: string; style?: React.CSSProperties }) {
  const ticks = Array.from({ length: 29 }, (_, i) => i)
  return (
    <div className={cx('pointer-events-none flex flex-col gap-[3px]', side === 'right' && 'items-end', className)} style={style} aria-hidden>
      {ticks.map((i) => {
        const major = i % 4 === 0
        const mid = i === 14
        return (
          <div key={i} className={cx('flex items-center gap-1.5', side === 'right' && 'flex-row-reverse')}>
            <span className={cx('block h-px bg-fg/45', major ? 'w-3' : 'w-1.5', mid && 'w-4 bg-fg')} />
            {major && <span className="font-mono text-[6.5px] leading-none text-muted">{side === 'left' ? 14 - i : i - 14}</span>}
            {mid && <span className={cx('text-[7px] leading-none text-fg', side === 'left' ? 'order-last' : '')}>{side === 'left' ? '◂' : '▸'}</span>}
          </div>
        )
      })}
    </div>
  )
}

/** Four-point sparkle used as a decorative marker. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cx('size-3 text-fg/80', className)} aria-hidden>
      <path d="M8 0 C8.6 5.4 10.6 7.4 16 8 C10.6 8.6 8.6 10.6 8 16 C7.4 10.6 5.4 8.6 0 8 C5.4 7.4 7.4 5.4 8 0 Z" fill="currentColor" />
    </svg>
  )
}
