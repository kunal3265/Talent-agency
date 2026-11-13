import { Sparkle } from './Hud'

/** An endless strip of outlined display words. Pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="group relative overflow-hidden border-y border-line py-5" aria-hidden>
      <div className="flex w-max animate-marquee items-center gap-10 group-hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="display text-[clamp(2.25rem,1.5rem+3vw,4.5rem)] text-transparent [-webkit-text-stroke:1.2px_var(--color-bone)]">{item}</span>
            <Sparkle className="size-5 text-violet" />
          </span>
        ))}
      </div>
    </div>
  )
}
