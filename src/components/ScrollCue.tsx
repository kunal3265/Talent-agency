import { cx } from '../lib/cx'

/** The hand-drawn "Scroll" in a pencil ellipse. Scrolls to `target`. */
export function ScrollCue({ target, className, label = 'Scroll' }: { target: string; className?: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      className={cx(
        'group relative grid h-[118px] w-[250px] place-items-center rounded-[50%] text-bone transition-transform duration-500 hover:scale-[1.04] focus-visible:outline-offset-[-10px]',
        className,
      )}
      aria-label="Scroll to the agency introduction"
    >
      <svg viewBox="0 0 250 118" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <path
          d="M18 70 C 10 30, 120 4, 196 16 C 252 26, 252 78, 196 98 C 140 116, 40 114, 16 84 C 4 66, 22 44, 52 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="[stroke-dasharray:640] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 group-hover:[stroke-dashoffset:-640]"
        />
        <path d="M30 88 C 70 110, 170 108, 214 86" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      </svg>
      <span className="relative -rotate-6 font-hand text-[30px] leading-none tracking-wide">{label}</span>
    </button>
  )
}
