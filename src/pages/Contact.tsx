import { Mail, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { EnquiryForm } from '../components/EnquiryForm'
import { PageHeader } from '../components/PageHeader'
import { CONTACT, OFFICES, SITE, TALENT } from '../data'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function LocalTime({ zone }: { zone: string }) {
  const fmt = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: zone }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 30_000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone])
  return <span className="font-mono text-[12px] text-violet-text tabular-nums">{time} local</span>
}

export function Contact() {
  useDocumentTitle('Contact')
  const [params] = useSearchParams()
  const talent = (params.get('talent') ?? '').split(',').filter((s) => TALENT.some((t) => t.slug === s))
  return (
    <>
      <PageHeader word="CONTACT" eyebrow={CONTACT.eyebrow} title={CONTACT.title} lead={CONTACT.lead} />
      <div className="grid gap-12 px-4 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <section className="panel rounded-[var(--radius-lg)] p-6 sm:p-10" aria-labelledby="form-title">
          <h2 id="form-title" className="display mb-8 text-[clamp(2rem,1.6rem+1.6vw,3rem)] text-bone">
            Booking enquiry
          </h2>
          <EnquiryForm talent={talent} />
        </section>
        <aside className="space-y-8">
          <div>
            <h2 className="micro text-muted">Direct lines</h2>
            <a href={`mailto:${SITE.bookings}`} className="mt-3 flex min-h-10 items-center gap-2 text-lg text-bone hover:text-violet-text">
              <Mail className="size-4" aria-hidden /> {SITE.bookings}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="flex min-h-10 items-center gap-2 text-lg text-bone hover:text-violet-text">
              <Phone className="size-4" aria-hidden /> {SITE.phone}
            </a>
          </div>
          <ul className="space-y-4">
            {OFFICES.map((o) => (
              <li key={o.city} className="panel rounded-[var(--radius-md)] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="display text-[32px] text-bone">{o.city}</h3>
                  <LocalTime zone={o.time} />
                </div>
                <p className="mt-3 text-sm text-fg">{o.address}</p>
                <p className="mt-1 text-sm text-muted">{o.hours}</p>
                <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="mt-1 inline-flex min-h-10 items-center text-sm text-violet-text hover:underline">
                  {o.phone}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  )
}
