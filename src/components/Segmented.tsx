import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** A small radio group drawn as joined buttons (grid/list view, sort). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: T
  options: { value: T; label: string; icon?: ReactNode }[]
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cx('inline-flex h-10 rounded-[10px] shadow-[inset_0_0_0_1px_var(--color-line-strong)]', className)}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={o.icon ? o.label : undefined}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
              e.preventDefault()
              const i = options.findIndex((x) => x.value === value)
              const next = options[(i + (e.key === 'ArrowRight' ? 1 : options.length - 1)) % options.length]
              onChange(next.value)
              const group = e.currentTarget.parentElement
              requestAnimationFrame(() => group?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus())
            }}
            tabIndex={on ? 0 : -1}
            className={cx(
              'micro inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-[10px] px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-text',
              on ? 'bg-bone text-void' : 'text-muted hover:text-fg',
            )}
          >
            {o.icon ?? o.label}
          </button>
        )
      })}
    </div>
  )
}
