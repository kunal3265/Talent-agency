import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Sparkle } from './Hud'

export function EmptyState({ title, body, action, className }: { title: string; body: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('panel relative flex flex-col items-center gap-4 overflow-hidden rounded-[var(--radius-lg)] px-6 py-16 text-center', className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(139_108_255/0.16),transparent_60%)]" />
      <Sparkle className="relative size-6 text-violet-text" />
      <h2 className="display relative text-[clamp(1.8rem,1.4rem+1.4vw,2.8rem)] text-bone">{title}</h2>
      <p className="relative max-w-md text-sm text-muted text-pretty">{body}</p>
      {action && <div className="relative mt-2 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  )
}
