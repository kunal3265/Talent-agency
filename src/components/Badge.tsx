import type { ReactNode } from 'react'

import type { Availability } from '../data'
import { AVAILABILITY } from '../data'
import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'violet' | 'success' | 'warning' | 'danger'

const tones: Record<BadgeTone, string> = {
  neutral: 'text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
  violet: 'bg-violet-deep/70 text-violet-text shadow-[inset_0_0_0_1px_rgb(176_156_255/0.35)]',
  success: 'bg-success/10 text-success shadow-[inset_0_0_0_1px_rgb(159_224_168/0.3)]',
  warning: 'bg-[#ffd27a]/10 text-[#ffd27a] shadow-[inset_0_0_0_1px_rgb(255_210_122/0.3)]',
  danger: 'bg-danger/10 text-danger shadow-[inset_0_0_0_1px_rgb(255_138_128/0.3)]',
}

export function Badge({ tone = 'neutral', dot, children, className }: { tone?: BadgeTone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cx('micro inline-flex h-6 items-center gap-1.5 rounded-[7px] px-2 whitespace-nowrap', tones[tone], className)}>
      {dot && <span className="round size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
}

const AVAIL_TONE: Record<Availability, BadgeTone> = { available: 'success', limited: 'warning', booked: 'violet' }

export function AvailabilityBadge({ value, className }: { value: Availability; className?: string }) {
  return (
    <Badge tone={AVAIL_TONE[value]} dot className={className}>
      {AVAILABILITY[value]}
    </Badge>
  )
}
