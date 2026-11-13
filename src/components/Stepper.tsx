import { Check } from 'lucide-react'

import { cx } from '../lib/cx'

/** Numbered progress for a multi-step form. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 items-center gap-3" aria-current={active ? 'step' : undefined}>
            <span
              className={cx(
                'round grid size-8 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors',
                done ? 'bg-bone text-void' : active ? 'bg-violet-deep text-bone shadow-[0_0_0_1px_var(--color-violet-text),var(--shadow-glow)]' : 'text-muted shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
            </span>
            <span className={cx('micro hidden sm:inline', active ? 'text-bone' : 'text-muted')}>
              {label}
              {done && <span className="sr-only"> (done)</span>}
            </span>
            {i < steps.length - 1 && <span className={cx('h-px flex-1', done ? 'bg-bone/60' : 'bg-line-strong')} aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}
