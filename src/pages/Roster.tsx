import { LayoutGrid, List, Search, X } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'

import { AvailabilityBadge } from '../components/Badge'
import { Button } from '../components/Button'
import { Chip } from '../components/Chip'
import { EmptyState } from '../components/EmptyState'
import { Input, Select } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { SaveButton } from '../components/SaveButton'
import { Segmented } from '../components/Segmented'
import { TalentCard } from '../components/TalentCard'
import { AVAILABILITY, DIVISIONS, divisionLabel, TALENT, type Availability, type DivisionId } from '../data'
import { useLocalState } from '../lib/useLocalState'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type Sort = 'featured' | 'az' | 'city'

export function Roster() {
  useDocumentTitle('Talent')
  const [params, setParams] = useSearchParams()
  const division = (params.get('division') ?? '') as DivisionId | ''
  const q = params.get('q') ?? ''
  const availability = (params.get('availability') ?? '') as Availability | ''
  const [view, setView] = useLocalState<'grid' | 'list'>('roster-view', 'grid')
  const [sort, setSort] = useLocalState<Sort>('roster-sort', 'featured')

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = TALENT.filter(
      (t) =>
        (!division || t.division === division) &&
        (!availability || t.availability === availability) &&
        (!needle || [t.name, t.role, t.base, ...t.skills, ...t.languages].some((s) => s.toLowerCase().includes(needle))),
    )
    if (sort === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'city') return [...list].sort((a, b) => a.base.localeCompare(b.base) || a.name.localeCompare(b.name))
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  }, [division, availability, q, sort])

  const countFor = (id: DivisionId | '') =>
    TALENT.filter((t) => (!id || t.division === id) && (!availability || t.availability === availability)).length
  const hasFilters = !!(division || q || availability)

  return (
    <>
      <PageHeader
        word="ROSTER"
        eyebrow="The roster"
        title="Talent"
        lead="Performers, voices, directors and creators, each with a senior agent who knows their work scene by scene."
      />
      <section className="px-4" aria-label="Filters">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Division">
            <Chip selected={!division} count={countFor('')} onClick={() => update('division', '')}>
              Everyone
            </Chip>
            {DIVISIONS.map((d) => (
              <Chip key={d.id} selected={division === d.id} count={countFor(d.id)} onClick={() => update('division', division === d.id ? '' : d.id)}>
                {d.plural}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <label htmlFor="roster-q" className="sr-only">
                Search talent
              </label>
              <Input
                id="roster-q"
                type="search"
                placeholder="Name, city, skill or language"
                value={q}
                onChange={(e) => update('q', e.target.value)}
                className="h-10 pl-10 text-sm"
              />
            </div>
            <label htmlFor="roster-availability" className="sr-only">
              Availability
            </label>
            <div className="w-full sm:w-44">
              <Select id="roster-availability" value={availability} onChange={(e) => update('availability', e.target.value)} className="h-10 text-sm">
                <option value="">Any availability</option>
                {(Object.keys(AVAILABILITY) as Availability[]).map((a) => (
                  <option key={a} value={a}>
                    {AVAILABILITY[a]}
                  </option>
                ))}
              </Select>
            </div>
            <Segmented
              label="Sort"
              value={sort}
              onChange={setSort}
              options={[
                { value: 'featured', label: 'Featured' },
                { value: 'az', label: 'A–Z' },
                { value: 'city', label: 'City' },
              ]}
            />
            <Segmented
              label="View"
              value={view}
              onChange={setView}
              options={[
                { value: 'grid', label: 'Grid view', icon: <LayoutGrid className="size-4" aria-hidden /> },
                { value: 'list', label: 'List view', icon: <List className="size-4" aria-hidden /> },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-4">
          <p className="micro text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'artist' : 'artists'}
            {division && ` in ${DIVISIONS.find((d) => d.id === division)?.plural.toLowerCase()}`}
          </p>
          {hasFilters && (
            <Button variant="ghost" size="sm" icon={<X className="size-3.5" aria-hidden />} onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              Clear filters
            </Button>
          )}
        </div>
      </section>

      <section className="px-4" aria-label="Results">
        {filtered.length === 0 ? (
          <EmptyState
            title="No one matches"
            body="Try a different name or skill, or widen the division and availability filters."
            action={
              <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Clear filters
              </Button>
            }
          />
        ) : view === 'grid' ? (
          <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => (
              <li key={t.slug}>
                <TalentCard talent={t} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="border-t border-line">
            {filtered.map((t) => (
              <li key={t.slug} className="group flex items-center gap-4 border-b border-line py-3">
                <div className="size-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
                  <Photo photoKey={t.slug} alt="" hue={t.hue} pose={t.pose} />
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/talent/${t.slug}`} className="display text-[26px] text-bone hover:text-violet-text">
                    {t.name}
                  </Link>
                  <p className="micro mt-1 text-muted">
                    {divisionLabel(t.division)} · {t.role} · {t.base}
                  </p>
                </div>
                <p className="hidden max-w-xs flex-1 truncate text-sm text-muted lg:block">{t.skills.join(', ')}</p>
                <AvailabilityBadge value={t.availability} className="hidden sm:inline-flex" />
                <SaveButton slug={t.slug} name={t.name} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
