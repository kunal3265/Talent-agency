import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

import { DIVISIONS, FOOTER, NAV_LEFT, NAV_RIGHT, OFFICES, SITE } from '../data'
import { FpsCounter, RecIndicator, Sparkle } from './Hud'
import { NewsletterForm } from './NewsletterForm'
import { Wordmark } from './Wordmark'

const linkCls = 'inline-flex min-h-10 min-w-10 items-center text-sm text-fg/85 transition-colors hover:text-white'

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_100%,rgb(139_108_255/0.18),transparent_65%)]" />
      <div className="relative grid gap-12 px-4 pt-16 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-md">
          <p className="micro flex items-center gap-2 text-muted">
            <Sparkle className="size-2.5 text-violet-text" /> {FOOTER.newsletter.title}
          </p>
          <p className="mt-3 text-lg text-bone">{FOOTER.newsletter.body}</p>
          <NewsletterForm className="mt-5" />
        </div>
        <nav aria-label="Agency">
          <h2 className="micro text-muted">Agency</h2>
          <ul className="mt-3">
            {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/styleguide" className={linkCls}>
                Style guide
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Divisions">
          <h2 className="micro text-muted">Divisions</h2>
          <ul className="mt-3">
            {DIVISIONS.map((d) => (
              <li key={d.id}>
                <Link to={`/talent?division=${d.id}`} className={linkCls}>
                  {d.plural}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="micro text-muted">Offices</h2>
          <ul className="mt-3 space-y-3 text-sm text-fg/85">
            {OFFICES.map((o) => (
              <li key={o.city}>
                <span className="text-bone">{o.city}</span>
                <br />
                <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="inline-flex min-h-10 items-center hover:text-white">
                  {o.phone}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${SITE.email}`} className={linkCls}>
            {SITE.email}
          </a>
          <ul className="mt-2 flex flex-wrap gap-x-4">
            {SITE.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className={linkCls + ' gap-1'}>
                  {s.label}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative px-4" aria-hidden>
        <Wordmark text={SITE.short.toUpperCase()} height={250} fontSize={344} glow={false} label={SITE.name} />
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-muted">
        <FpsCounter />
        <p className="text-xs">{FOOTER.legal}</p>
        <RecIndicator />
      </div>
    </footer>
  )
}
