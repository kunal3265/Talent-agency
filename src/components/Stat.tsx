import { cx } from '../lib/cx'

export function Stat({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cx('border-t border-line pt-4', className)}>
      <p className="display text-[clamp(2.6rem,1.8rem+2.8vw,4.5rem)] text-bone">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  )
}
