import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Sparkle, Timecode } from './Hud'
import { Wordmark } from './Wordmark'

/**
 * Inner-page hero: the page title stretched edge to edge like the home
 * logotype, with the HUD row underneath.
 */
export function PageHeader({
  word,
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  /** The word stretched across the page (short, one word works best). */
  word: string
  eyebrow: string
  /** The real heading text for screen readers and the HUD row. */
  title: string
  lead?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cx('relative overflow-hidden pt-20 md:pt-[68px]', className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vw] max-h-[560px] bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgb(139_108_255/0.2),transparent_100%)]" />
      <h1 className="sr-only">{title}</h1>
      <div aria-hidden className="relative">
        <Wordmark text={word} height={200} fontSize={276} glow={false} label={title} />
      </div>
      <div className="relative mx-4 flex items-center justify-between border-b border-line py-3">
        <p className="micro flex items-center gap-2 text-fg">
          <Sparkle className="size-2.5 text-violet-text" /> {eyebrow}
        </p>
        <Timecode start={word.length * 97} className="hidden text-muted sm:inline" />
        <p className="micro text-muted">{title}</p>
      </div>
      {(lead || children) && (
        <div className="relative mx-4 grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end md:py-14">
          {lead && <p className="max-w-2xl text-[clamp(1.15rem,0.9rem+0.8vw,1.6rem)] leading-snug text-fg text-pretty">{lead}</p>}
          {children}
        </div>
      )}
    </header>
  )
}
