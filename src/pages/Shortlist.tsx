import { ArrowRight, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button, ButtonLink } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { EnquiryForm } from '../components/EnquiryForm'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { TalentCard } from '../components/TalentCard'
import { useToast } from '../components/Toast'
import { SHORTLIST, talentBySlug, type Talent } from '../data'
import { useShortlist } from '../lib/shortlist'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function Shortlist() {
  useDocumentTitle('Shortlist')
  const { slugs, clear } = useShortlist()
  const [confirm, setConfirm] = useState(false)
  const toast = useToast()
  const talent = slugs.map(talentBySlug).filter(Boolean) as Talent[]

  return (
    <>
      <PageHeader word="SHORTLIST" eyebrow="Saved on this device" title={SHORTLIST.title} lead={SHORTLIST.lead}>
        {talent.length > 0 && (
          <Button variant="secondary" icon={<Trash2 className="size-4" aria-hidden />} onClick={() => setConfirm(true)}>
            Clear shortlist
          </Button>
        )}
      </PageHeader>
      <div className="px-4">
        {talent.length === 0 ? (
          <EmptyState
            title="Your shortlist is empty"
            body={SHORTLIST.empty}
            action={
              <ButtonLink to="/talent" iconRight={<ArrowRight className="size-4" aria-hidden />}>
                Browse the roster
              </ButtonLink>
            }
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3" aria-label={`${talent.length} saved artists`}>
              {talent.map((t) => (
                <li key={t.slug}>
                  <TalentCard talent={t} />
                </li>
              ))}
            </ul>
            <section className="panel self-start rounded-[var(--radius-lg)] p-6 sm:p-8 lg:sticky lg:top-20" aria-labelledby="brief-title">
              <h2 id="brief-title" className="display text-[clamp(1.8rem,1.4rem+1.4vw,2.6rem)] text-bone">
                Send as a brief
              </h2>
              <p className="mt-2 mb-6 text-sm text-muted">We will check availability for everyone on the list and reply within one working day.</p>
              <EnquiryForm key={slugs.join(',')} talent={slugs} compact submitLabel="Send brief" onSent={(ref) => {
                toast(`Brief sent. Reference ${ref}`)
              }} />
            </section>
          </div>
        )}
      </div>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Clear shortlist?" description={`This removes all ${talent.length} saved artists from this device.`}>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirm(false)} data-autofocus>
            Keep them
          </Button>
          <Button
            onClick={() => {
              clear()
              setConfirm(false)
              toast('Shortlist cleared')
            }}
          >
            Clear all
          </Button>
        </div>
      </Modal>
    </>
  )
}
