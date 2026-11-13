import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

import { talentBySlug, type Project } from '../data'
import { Badge } from './Badge'
import { Photo } from './Photo'

/** One production in the credits list: still, title, kind, year and talent. */
export function WorkRow({ project, index, force }: { project: Project; index: number; force?: string }) {
  const people = project.talent.map(talentBySlug).filter((t) => t !== undefined)
  return (
    <li className="group border-b border-line" data-force={force}>
      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 gap-y-3 py-5 sm:grid-cols-[160px_minmax(0,1fr)] md:grid-cols-[40px_200px_minmax(0,1.4fr)_minmax(0,1fr)] md:items-center md:gap-x-8">
        <span className="hidden font-mono text-[11px] text-muted md:block">{String(index + 1).padStart(2, '0')}</span>
        <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)]">
          <div className="h-full w-full transition-transform duration-700 group-hover-f:scale-110">
            <Photo photoKey={project.slug} alt={`Still from ${project.title}`} hue={project.hue} kind="still" />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="display text-[clamp(1.5rem,1.1rem+1.4vw,2.6rem)] text-bone transition-colors group-hover-f:text-violet-text">{project.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted text-pretty">{project.logline}</p>
        </div>
        <div className="col-start-2 flex flex-col gap-2 md:col-start-auto">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{project.kind}</Badge>
            <Badge tone={project.status === 'Released' ? 'neutral' : project.status === 'In production' ? 'violet' : 'warning'}>{project.status}</Badge>
          </div>
          <p className="micro text-muted">
            {project.year} · {project.studio}
          </p>
          <ul className="flex flex-wrap gap-x-4">
            {people.map((t) => (
              <li key={t.slug}>
                <Link to={`/talent/${t.slug}`} className="micro inline-flex min-h-10 items-center gap-1 text-fg hover:text-violet-text">
                  {t.name}
                  <ArrowUpRight className="size-3" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}
