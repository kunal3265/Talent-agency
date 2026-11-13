import { Check, ChevronDown } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cx } from '../lib/cx'

const control =
  'w-full rounded-[var(--radius-sm)] bg-ink px-4 text-[15px] text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)] placeholder:text-faint transition-[box-shadow,background-color] duration-200 hover-f:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35)] focus:outline-none focus-visible:outline-none focus-f:bg-panel focus-f:shadow-[inset_0_0_0_1px_var(--color-violet-text),0_0_0_3px_rgb(139_108_255/0.3)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:shadow-[inset_0_0_0_1px_var(--color-danger)]'

type FieldProps = {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  className?: string
  children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }) => ReactNode
}

/** Label + control + hint/error, wired for screen readers. */
export function Field({ label, hint, error, optional, className, children }: FieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="flex items-baseline justify-between text-[13px] font-medium text-fg">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { 'data-force'?: string }) {
  return <input className={cx(control, 'h-12', className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { 'data-force'?: string }) {
  return <textarea className={cx(control, 'min-h-32 resize-y py-3 leading-relaxed', className)} {...rest} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { 'data-force'?: string }) {
  return (
    <div className="relative">
      <select className={cx(control, 'h-12 appearance-none pr-10 [&>option]:bg-ink', className)} {...rest}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  )
}

/** A checkbox with its label; the box is drawn, the input stays native. */
export function Checkbox({
  label,
  error,
  className,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode; error?: string; 'data-force'?: string }) {
  const id = useId()
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="group flex min-h-10 cursor-pointer items-start gap-3 text-sm text-fg">
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-[6px] bg-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition checked:bg-bone hover-f:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-text aria-[invalid=true]:shadow-[inset_0_0_0_1px_var(--color-danger)] data-[force~=focus]:outline-2 data-[force~=focus]:outline-offset-2 data-[force~=focus]:outline-violet-text"
            {...rest}
          />
          <Check className="pointer-events-none relative size-3.5 text-void opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden />
        </span>
        <span className="leading-snug">{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="pl-8 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/** Form-level status line: error summary or success. */
export function FormMessage({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx(
        'rounded-[var(--radius-sm)] px-4 py-3 text-sm',
        tone === 'error'
          ? 'bg-danger/[0.08] text-danger shadow-[inset_0_0_0_1px_rgb(255_138_128/0.35)]'
          : 'bg-success/[0.08] text-success shadow-[inset_0_0_0_1px_rgb(159_224_168/0.35)]',
      )}
    >
      {children}
    </p>
  )
}
