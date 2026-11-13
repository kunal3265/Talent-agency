import { useSearchParams } from 'react-router'

import { Button } from '../components/Button'
import { Chip } from '../components/Chip'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { Segmented } from '../components/Segmented'
import { WorkRow } from '../components/WorkRow'
import { WORK, WORK_KINDS, type WorkStatus } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type StatusFilter = 'all' | WorkStatus

export function Work() {
  useDocumentTitle('Work')
  const [params, setParams] = useSearchParams()
  const kind = params.get('kind') ?? ''
  const status = (params.get('status') ?? 'all') as StatusFilter
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const list = WORK.filter((p) => (!kind || p.kind === kind) && (status === 'all' || p.status === status)).sort((a, b) => b.year - a.year)

  return (
    <>
      <PageHeader
        word="CREDITS"
        eyebrow="Selected work"
        title="Work"
        lead="Features, series, unscripted formats and micro-dramas our artists have made, are making, or are about to."
      />
      <section className="px-4" aria-label="Filters">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Format">
            <Chip selected={!kind} count={WORK.length} onClick={() => set('kind', '')}>
              All formats
            </Chip>
            {WORK_KINDS.map((k) => (
              <Chip key={k} selected={kind === k} count={WORK.filter((p) => p.kind === k).length} onClick={() => set('kind', kind === k ? '' : k)}>
                {k}
              </Chip>
            ))}
          </div>
          <Segmented
            label="Status"
            value={status}
            onChange={(v) => set('status', v)}
            options={[
              { value: 'all', label: 'Any status' },
              { value: 'Released', label: 'Released' },
              { value: 'In production', label: 'Shooting' },
              { value: 'Coming soon', label: 'Coming' },
            ]}
          />
        </div>
        <p className="micro py-4 text-muted" aria-live="polite">
          {list.length} {list.length === 1 ? 'project' : 'projects'}
        </p>
      </section>
      <section className="px-4" aria-label="Projects">
        {list.length === 0 ? (
          <EmptyState
            title="Nothing in that slot"
            body="No projects match that format and status yet."
            action={
              <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Show all work
              </Button>
            }
          />
        ) : (
          <ul className="border-t border-line">
            {list.map((p, i) => (
              <WorkRow key={p.slug} project={p} index={i} />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
