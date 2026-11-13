import type { ButtonHTMLAttributes } from 'react'

import { cx } from '../lib/cx'

/** A filter toggle. `selected` sets aria-pressed. */
export function Chip({
  selected,
  count,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; count?: number; 'data-force'?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        'micro inline-flex h-10 items-center gap-2 rounded-[10px] px-3.5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 focus-f:outline-2 focus-f:outline-offset-2 focus-f:outline-violet-text active-f:scale-[0.97]',
        selected
          ? 'bg-bone text-void'
          : 'text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover-f:bg-white/[0.06] hover-f:text-white',
        className,
      )}
      {...rest}
    >
      {children}
      {count !== undefined && <span className={cx('font-mono text-[10px]', selected ? 'text-void/70' : 'text-muted')}>{count}</span>}
    </button>
  )
}
