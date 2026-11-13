import { ArrowRight, Mail } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Stat } from '../components/Stat'
import { PageHeader } from '../components/PageHeader'
import { ABOUT, AGENTS, HOME, OFFICES } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function About() {
  useDocumentTitle('About us')
  return (
    <>
      <PageHeader word="ABOUT US" eyebrow={ABOUT.eyebrow} title={ABOUT.title} lead={ABOUT.lead} />

      <section className="grid gap-10 px-4 pt-6 md:grid-cols-2" aria-label="Our story">
        {ABOUT.body.map((p, i) => (
          <Reveal key={p} delay={i * 0.08}>
            <p className="text-[17px] leading-relaxed text-fg text-pretty">{p}</p>
          </Reveal>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-x-6 gap-y-10 px-4 pt-20 lg:grid-cols-4" aria-label="In numbers">
        {HOME.stats.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} />
        ))}
      </section>

      <section className="px-4 pt-28" aria-labelledby="values-title">
        <SectionHeading eyebrow="How we work" title={<span id="values-title">Four rules</span>} />
        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT.values.map((v, i) => (
            <div key={v.title} className="bg-void p-7">
              <p className="font-mono text-[11px] text-violet-text">0{i + 1}</p>
              <h3 className="mt-10 text-2xl font-semibold text-bone">{v.title}</h3>
              <p className="mt-3 text-sm text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-28" aria-labelledby="timeline-title">
        <SectionHeading eyebrow="Since 2009" title={<span id="timeline-title">The story so far</span>} />
        <ol className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-5">
          {ABOUT.timeline.map((t) => (
            <li key={t.year}>
              <p className="display text-[44px] text-bone">{t.year}</p>
              <p className="mt-2 text-sm text-muted">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-4 pt-28" aria-labelledby="agents-title">
        <SectionHeading eyebrow="Agents" title={<span id="agents-title">Who picks up</span>} />
        <ul className="mt-12 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a) => (
            <li key={a.slug} className="panel overflow-hidden rounded-[var(--radius-lg)]">
              <div className="aspect-square">
                <Photo photoKey={`agent-${a.slug}`} alt={`Portrait of ${a.name}`} hue={a.hue} pose={a.pose} />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-bone">{a.name}</h3>
                <p className="mt-1 text-sm text-muted">{a.title}</p>
                <p className="micro mt-3 text-muted">{a.office}</p>
                <a href={`mailto:${a.email}`} className="mt-1 inline-flex min-h-10 items-center gap-1.5 text-sm text-violet-text hover:underline">
                  <Mail className="size-3.5" aria-hidden /> {a.email}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pt-28" aria-labelledby="offices-title">
        <SectionHeading
          eyebrow="Offices"
          title={<span id="offices-title">Three cities</span>}
          action={
            <ButtonLink to="/contact" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              Contact an office
            </ButtonLink>
          }
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {OFFICES.map((o) => (
            <div key={o.city} className="panel rounded-[var(--radius-lg)] p-6">
              <h3 className="display text-[40px] text-bone">{o.city}</h3>
              <p className="mt-4 text-sm text-fg">{o.address}</p>
              <p className="mt-1 text-sm text-muted">{o.hours}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
