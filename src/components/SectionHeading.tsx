import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Sparkle } from './Hud'

/** Micro eyebrow, heavy display title and optional action on the right. */
export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
  as: Tag = 'h2',
}: {
  eyebrow: string
  title: ReactNode
  action?: ReactNode
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={cx('flex flex-wrap items-end justify-between gap-6', className)}>
      <div>
        <p className="micro flex items-center gap-2 text-muted">
          <Sparkle className="size-2.5 text-violet-text" />
          {eyebrow}
        </p>
        <Tag className="display mt-4 text-[clamp(2.5rem,1.4rem+4.2vw,5.5rem)] text-bone text-balance">{title}</Tag>
      </div>
      {action}
    </div>
  )
}
