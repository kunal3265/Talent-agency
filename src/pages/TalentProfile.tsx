import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { AvailabilityBadge, Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { EnquiryForm } from '../components/EnquiryForm'
import { Sparkle } from '../components/Hud'
import { Modal } from '../components/Modal'
import { Photo } from '../components/Photo'
import { ReelPlayer } from '../components/ReelPlayer'
import { SaveButton } from '../components/SaveButton'
import { TalentCard } from '../components/TalentCard'
import { useToast } from '../components/Toast'
import { Wordmark } from '../components/Wordmark'
import { agentBySlug, divisionLabel, DIVISIONS, TALENT, talentBySlug, WORK } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { NotFound } from './NotFound'

export function TalentProfile() {
  const { slug = '' } = useParams()
  const talent = talentBySlug(slug)
  useDocumentTitle(talent?.name ?? 'Not found')
  const [open, setOpen] = useState(false)
  const toast = useToast()
  if (!talent) return <NotFound />

  const agent = agentBySlug(talent.agent)
  const first = talent.name.split(' ')[0]
  const related = TALENT.filter((t) => t.division === talent.division && t.slug !== talent.slug).slice(0, 4)
  const facts = [
    { label: 'Division', value: divisionLabel(talent.division) },
    { label: 'Based in', value: talent.base },
    talent.playing ? { label: 'Playing age', value: talent.playing } : null,
    { label: 'Languages', value: talent.languages.join(', ') },
    { label: 'Skills', value: talent.skills.join(', ') },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <header className="relative overflow-hidden pt-20 md:pt-[68px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[50vw] max-h-[520px] bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgb(139_108_255/0.2),transparent_100%)]" />
        <div className="relative" aria-hidden>
          <Wordmark text={talent.name.toUpperCase()} height={150} fontSize={210} glow={false} />
        </div>
        <div className="relative mx-4 flex items-center justify-between border-b border-line py-3">
          <Link to={`/talent?division=${talent.division}`} className="micro inline-flex min-h-10 items-center gap-1.5 text-fg hover:text-violet-text">
            <ArrowLeft className="size-3.5" aria-hidden /> {DIVISIONS.find((d) => d.id === talent.division)?.plural}
          </Link>
          <p className="micro text-muted">
            {talent.role} · {talent.base}
          </p>
        </div>
      </header>

      <div className="grid gap-10 px-4 pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]">
            <Photo photoKey={talent.slug} alt={`Portrait of ${talent.name}`} hue={talent.hue} pose={talent.pose} />
            <div className="absolute top-4 left-4">
              <AvailabilityBadge value={talent.availability} className="bg-void/70 backdrop-blur-md" />
            </div>
          </div>
        </div>

        <div>
          <p className="micro flex items-center gap-2 text-muted">
            <Sparkle className="size-2.5 text-violet-text" /> {divisionLabel(talent.division)}
          </p>
          <h1 className="sr-only">{talent.name}</h1>
          <p className="display mt-4 text-[clamp(2.2rem,1.6rem+2.4vw,4rem)] text-bone">{talent.role}</p>
          <p className="mt-6 max-w-xl font-hand text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-tight text-violet-text">“{talent.quote}”</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setOpen(true)} iconRight={<ArrowRight className="size-4" aria-hidden />}>
              Book {first}
            </Button>
            <SaveButton slug={talent.slug} name={talent.name} withLabel className="h-13 px-6 text-[15px]" />
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4">
            {talent.stats.map((s) => (
              <div key={s.label} className="border-t border-line pt-4">
                <dt className="micro text-muted">{s.label}</dt>
                <dd className="display mt-2 text-[clamp(2rem,1.4rem+2vw,3.5rem)] text-bone">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 space-y-4 text-[17px] leading-relaxed text-fg">
            {talent.bio.map((p) => (
              <p key={p} className="text-pretty">
                {p}
              </p>
            ))}
          </div>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[140px_1fr] gap-4 py-3.5 text-sm">
                <dt className="micro pt-0.5 text-muted">{f.label}</dt>
                <dd className="text-fg">{f.value}</dd>
              </div>
            ))}
            {agent && (
              <div className="grid grid-cols-[140px_1fr] gap-4 py-3.5 text-sm">
                <dt className="micro pt-0.5 text-muted">Agent</dt>
                <dd className="flex flex-wrap items-center gap-x-3 text-fg">
                  {agent.name}, {agent.office}
                  <a href={`mailto:${agent.email}?subject=${encodeURIComponent(talent.name)}`} className="inline-flex min-h-10 items-center gap-1.5 text-violet-text hover:underline">
                    <Mail className="size-3.5" aria-hidden /> {agent.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <section className="mt-14" aria-labelledby="reel-title">
            <h2 id="reel-title" className="micro mb-4 text-muted">
              Reel
            </h2>
            <ReelPlayer photoKey={WORK.find((w) => w.talent.includes(talent.slug))?.slug ?? `${talent.slug}-reel`} hue={talent.hue} title={talent.reel.title} seconds={talent.reel.seconds} />
          </section>

          <section className="mt-14" aria-labelledby="credits-title">
            <h2 id="credits-title" className="micro mb-4 text-muted">
              Selected credits
            </h2>
            <ul className="border-t border-line">
              {talent.credits.map((c) => (
                <li key={c.title + c.year} className="grid grid-cols-[56px_1fr] items-baseline gap-x-4 gap-y-1 border-b border-line py-4 sm:grid-cols-[56px_1fr_1fr_120px]">
                  <span className="font-mono text-[12px] text-muted">{c.year}</span>
                  <span className="text-lg font-semibold text-bone">{c.title}</span>
                  <span className="col-start-2 text-sm text-muted sm:col-start-auto">{c.role}</span>
                  <Badge className="col-start-2 w-fit sm:col-start-auto sm:justify-self-end">{c.kind}</Badge>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="px-4 pt-28" aria-labelledby="related-title">
          <h2 id="related-title" className="display text-[clamp(2rem,1.4rem+2.6vw,4rem)] text-bone">
            More {DIVISIONS.find((d) => d.id === talent.division)?.plural.toLowerCase()}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <TalentCard key={t.slug} talent={t} />
            ))}
          </div>
        </section>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={`Book ${first}`} description={`An agent will confirm ${first}’s availability within one working day.`}>
        <EnquiryForm
          talent={[talent.slug]}
          compact
          submitLabel="Send booking request"
          onSent={(ref) => {
            setOpen(false)
            toast(`Booking request sent. Reference ${ref}`)
          }}
        />
      </Modal>
    </>
  )
}
