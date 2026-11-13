import { Loader2 } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { cx } from '../lib/cx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glow'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[12px] font-medium transition-[background-color,color,box-shadow,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 active-f:scale-[0.97] focus-f:outline-2 focus-f:outline-offset-3 focus-f:outline-violet-text'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-bone text-void hover-f:bg-white hover-f:shadow-[0_0_40px_-8px_rgb(241_238_228/0.6)]',
  secondary: 'bg-transparent text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover-f:bg-white/[0.06] hover-f:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.4)]',
  ghost: 'bg-transparent text-fg hover-f:bg-white/[0.07]',
  glow: 'bg-violet-deep text-bone shadow-[inset_0_0_0_1px_rgb(176_156_255/0.45),0_0_30px_-8px_rgb(139_108_255/0.7)] hover-f:bg-[#36267a] hover-f:shadow-[inset_0_0_0_1px_rgb(176_156_255/0.8),0_0_44px_-6px_rgb(139_108_255/0.9)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px]',
}

export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cx(base, variants[variant], sizes[size], className)

type Common = { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; iconRight?: ReactNode }

export function Button({
  variant,
  size,
  icon,
  iconRight,
  loading,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; 'data-force'?: string }) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  )
}

export function ButtonLink({ variant, size, icon, iconRight, className, children, ...rest }: Common & LinkProps & { 'data-force'?: string }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </Link>
  )
}

export function ExternalButton({ variant, size, icon, iconRight, className, children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, size, className)} target="_blank" rel="noreferrer" {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </a>
  )
}

export function IconButton({
  className,
  size = 'md',
  variant = 'secondary',
  children,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm' | 'md'; variant?: ButtonVariant; 'aria-label': string; 'data-force'?: string }) {
  return (
    <button
      type={type}
      className={cx(base, variants[variant], size === 'sm' ? 'size-10' : 'size-11', 'round rounded-full p-0', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

/** Small uppercase text link with an animated underline, as in the hero nav. */
export function MicroLink({ className, children, ...rest }: LinkProps & { 'data-force'?: string }) {
  return (
    <Link
      className={cx(
        'micro relative inline-flex min-h-10 min-w-10 items-center justify-center text-fg/90 transition-colors hover-f:text-white focus-f:outline-2 focus-f:outline-offset-2 focus-f:outline-violet-text aria-[current=page]:text-violet-text',
        'after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover-f:after:scale-x-100 aria-[current=page]:after:scale-x-100',
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  )
}
