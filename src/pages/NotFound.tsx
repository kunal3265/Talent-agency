import { ArrowLeft } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Timecode } from '../components/Hud'
import { Wordmark } from '../components/Wordmark'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <section className="relative overflow-hidden pt-24 pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vw] max-h-[600px] bg-[radial-gradient(ellipse_at_50%_80%,rgb(139_108_255/0.25),transparent_60%)]" />
      <div className="relative" aria-hidden>
        <Wordmark text="OFF SCRIPT" height={220} fontSize={300} />
      </div>
      <div className="relative mx-4 flex items-center justify-between border-b border-line py-3">
        <p className="micro text-fg">Error 404</p>
        <Timecode start={404} className="text-muted" />
      </div>
      <div className="relative mx-auto flex max-w-xl flex-col items-center px-4 pt-16 text-center">
        <h1 className="display text-[clamp(2.4rem,1.6rem+3vw,4.5rem)] text-bone">This scene was cut</h1>
        <p className="mt-4 text-muted">The page you are looking for has moved, or never made it out of the edit.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" icon={<ArrowLeft className="size-4" aria-hidden />}>
            Back to the start
          </ButtonLink>
          <ButtonLink to="/talent" variant="secondary">
            Browse talent
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
