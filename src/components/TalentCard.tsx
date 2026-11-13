import { Link } from 'react-router'

import { divisionLabel, type Talent } from '../data'
import { cx } from '../lib/cx'
import { AvailabilityBadge } from './Badge'
import { Photo } from './Photo'
import { SaveButton } from './SaveButton'

/** Portrait card for the roster grid. The whole card links to the profile. */
export function TalentCard({ talent, className, force }: { talent: Talent; className?: string; force?: string }) {
  return (
    <article className={cx('group relative', className)} data-force={force}>
      <Link
        to={`/talent/${talent.slug}`}
        data-force={force}
        className="block rounded-[var(--radius-md)] focus-f:outline-2 focus-f:outline-offset-4 focus-f:outline-violet-text"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-panel">
          <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover-f:scale-[1.04]">
            <Photo photoKey={talent.slug} alt={`Portrait of ${talent.name}`} hue={talent.hue} pose={talent.pose} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <AvailabilityBadge value={talent.availability} className="bg-void/70 backdrop-blur-md" />
          </div>
          <div className="absolute inset-x-4 bottom-4">
            <p className="micro text-bone/80">
              {divisionLabel(talent.division)} · {talent.base}
            </p>
            <h3 className="display mt-1.5 text-[28px] text-bone">
              {talent.name}
            </h3>
          </div>
        </div>
      </Link>
      <SaveButton slug={talent.slug} name={talent.name} className="absolute top-3 right-3" />
    </article>
  )
}
