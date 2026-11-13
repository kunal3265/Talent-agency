import { Check, Plus } from 'lucide-react'

import { useShortlist } from '../lib/shortlist'
import { cx } from '../lib/cx'
import { useToast } from './Toast'

/** Adds or removes an artist from the shortlist (localStorage). */
export function SaveButton({ slug, name, className, withLabel, force }: { slug: string; name: string; className?: string; withLabel?: boolean; force?: string }) {
  const { has, toggle } = useShortlist()
  const toast = useToast()
  const saved = has(slug)
  return (
    <button
      type="button"
      data-force={force}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : saved ? `Remove ${name} from shortlist` : `Add ${name} to shortlist`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const added = toggle(slug)
        toast(added ? `${name} added to your shortlist` : `${name} removed from your shortlist`)
      }}
      className={cx(
        'inline-flex h-10 items-center justify-center gap-2 rounded-[10px] text-[13px] font-medium backdrop-blur-md transition-[background-color,color,transform] duration-200 focus-f:outline-2 focus-f:outline-offset-2 focus-f:outline-violet-text active-f:scale-[0.94]',
        withLabel ? 'px-4' : 'w-10',
        saved ? 'bg-bone text-void hover-f:bg-white' : 'bg-void/60 text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover-f:bg-white/15',
        className,
      )}
    >
      {saved ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
      {withLabel && <span>{saved ? 'On your shortlist' : 'Add to shortlist'}</span>}
    </button>
  )
}
