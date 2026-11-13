import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import { cx } from '../lib/cx'
import { duration } from '../lib/format'
import { IconButton } from './Button'
import { RecIndicator } from './Hud'
import { Photo } from './Photo'

/**
 * A showreel player. Without a video it plays a generated still with a light
 * sweep and a running clock, so the controls work before footage arrives.
 * Swap the inner <Photo> for a <video> when you have the file.
 */
export function ReelPlayer({ photoKey, hue, title, seconds, className }: { photoKey: string; hue: number; title: string; seconds: number; className?: string }) {
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const id = useId()
  useEffect(() => {
    if (!playing) return
    const iv = window.setInterval(() => {
      setT((cur) => {
        if (cur + 1 >= seconds) {
          setPlaying(false)
          return seconds
        }
        return cur + 1
      })
    }, 1000)
    return () => window.clearInterval(iv)
  }, [playing, seconds])

  const ended = t >= seconds
  return (
    <figure className={cx('panel relative overflow-hidden rounded-[var(--radius-lg)]', className)}>
      <div className="relative aspect-video">
        <Photo photoKey={photoKey} alt={`${title}, still`} hue={hue} kind="still" />
        {playing && (
          <div className="pointer-events-none absolute inset-0 animate-pulse-glow bg-[linear-gradient(100deg,transparent_30%,rgb(255_255_255/0.08)_50%,transparent_70%)] bg-[length:200%_100%]" />
        )}
        <div className="absolute top-4 left-4 flex items-center gap-3 text-bone">
          {playing ? <RecIndicator /> : <span className="micro">Paused</span>}
        </div>
        <div className="absolute top-4 right-4 font-mono text-[11px] text-bone tabular-nums">
          {duration(t)} / {duration(seconds)}
        </div>
        <button
          type="button"
          onClick={() => {
            if (ended) setT(0)
            setPlaying((p) => !p || ended)
          }}
          className="round absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-void/50 text-bone shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35)] backdrop-blur-md transition hover:scale-105 hover:bg-void/70"
          aria-label={playing ? `Pause ${title}` : ended ? `Replay ${title}` : `Play ${title}`}
        >
          {playing ? <Pause className="size-7" aria-hidden /> : ended ? <RotateCcw className="size-7" aria-hidden /> : <Play className="size-7 translate-x-0.5" aria-hidden />}
        </button>
      </div>
      <figcaption className="flex items-center gap-4 p-4">
        <IconButton size="sm" aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)} disabled={ended && !playing}>
          {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        </IconButton>
        <label htmlFor={id} className="sr-only">
          Seek
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={seconds}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          className="h-10 flex-1 cursor-pointer accent-[var(--color-violet)]"
          aria-valuetext={`${duration(t)} of ${duration(seconds)}`}
        />
        <span className="micro hidden text-muted sm:inline">{title}</span>
      </figcaption>
    </figure>
  )
}
