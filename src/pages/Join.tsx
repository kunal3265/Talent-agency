import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'

import { Button, ButtonLink } from '../components/Button'
import { Checkbox, Field, FormMessage, Input, Select, Textarea } from '../components/Field'
import { Sparkle } from '../components/Hud'
import { PageHeader } from '../components/PageHeader'
import { Stepper } from '../components/Stepper'
import { DIVISIONS, JOIN } from '../data'
import { postJson } from '../lib/api'
import { removeKey } from '../lib/storage'
import { useLocalState } from '../lib/useLocalState'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { validateSubmissionStep, type FieldErrors, type SubmissionInput } from '../shared/validation'

const EMPTY: SubmissionInput = { name: '', email: '', location: '', division: '', reel: '', credits: '', over18: false, consent: false }
const DRAFT = 'join-draft'

export function Join() {
  useDocumentTitle('Join the roster')
  // The draft (values and step) survives a reload until it is sent.
  const [draft, setDraft] = useLocalState<{ step: number; values: SubmissionInput }>(DRAFT, { step: 0, values: EMPTY })
  const { step, values } = draft
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const set = <K extends keyof SubmissionInput>(k: K, v: SubmissionInput[K]) => {
    setDraft((d) => ({ ...d, values: { ...d.values, [k]: v } }))
    if (errors[k]) setErrors(({ [k]: _drop, ...rest }) => rest)
  }
  const focusFirstError = () => requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())

  async function next(e: FormEvent) {
    e.preventDefault()
    const errs = validateSubmissionStep(step, values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus('Please check the highlighted fields.')
      focusFirstError()
      return
    }
    setStatus(null)
    if (step < 2) {
      setDraft((d) => ({ ...d, step: d.step + 1 }))
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input,select,textarea')?.focus())
      return
    }
    setLoading(true)
    const res = await postJson<{ reference: string }>('/api/submissions', values)
    setLoading(false)
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {})
      setStatus(res.error)
      return
    }
    removeKey(DRAFT)
    setDraft({ step: 0, values: EMPTY })
    setReference(res.data.reference)
  }

  return (
    <>
      <PageHeader word="JOIN US" eyebrow={JOIN.eyebrow} title={JOIN.title} lead={JOIN.lead} />
      <div className="grid gap-12 px-4 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <aside>
          <h2 className="micro text-muted">Before you submit</h2>
          <ul className="mt-5 space-y-4">
            {JOIN.notes.map((n) => (
              <li key={n} className="flex gap-3 text-fg">
                <Sparkle className="mt-1.5 size-2.5 shrink-0 text-violet-text" />
                <span className="text-pretty">{n}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid gap-3">
            {DIVISIONS.map((d) => (
              <div key={d.id} className="panel rounded-[var(--radius-md)] p-5">
                <p className="font-semibold text-bone">{d.plural}</p>
                <p className="mt-1 text-sm text-muted">{d.blurb}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="panel rounded-[var(--radius-lg)] p-6 sm:p-10">
          {reference ? (
            <div role="status" className="flex flex-col items-start gap-5">
              <span className="round grid size-14 place-items-center rounded-full bg-bone text-void">
                <Check className="size-6" aria-hidden />
              </span>
              <h2 className="display text-[clamp(2rem,1.6rem+2vw,3.5rem)] text-bone">You are in the queue</h2>
              <p className="text-fg">
                {JOIN.success} <span className="font-mono text-violet-text">{reference}</span>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setReference(null)}>
                  Submit someone else
                </Button>
                <ButtonLink to="/journal/self-tape-guide" variant="ghost" iconRight={<ArrowRight className="size-4" aria-hidden />}>
                  Read our self-tape guide
                </ButtonLink>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={next} noValidate className="grid gap-6">
              <Stepper steps={JOIN.steps} current={step} />
              <h2 className="display text-[clamp(2rem,1.6rem+1.6vw,3rem)] text-bone">{JOIN.steps[step]}</h2>
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name}>
                    {(p) => <Input {...p} autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} />}
                  </Field>
                  <Field label="Email" error={errors.email}>
                    {(p) => <Input {...p} type="email" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} />}
                  </Field>
                  <Field label="City" error={errors.location}>
                    {(p) => <Input {...p} autoComplete="address-level2" value={values.location} onChange={(e) => set('location', e.target.value)} />}
                  </Field>
                  <Field label="What you do" error={errors.division}>
                    {(p) => (
                      <Select {...p} value={values.division} onChange={(e) => set('division', e.target.value)}>
                        <option value="">Choose one</option>
                        {DIVISIONS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>
              )}
              {step === 1 && (
                <div className="grid gap-5">
                  <Field label="Link to your reel" hint="Vimeo, YouTube or a private link. It must start with https://" error={errors.reel}>
                    {(p) => <Input {...p} type="url" inputMode="url" placeholder="https://" value={values.reel} onChange={(e) => set('reel', e.target.value)} />}
                  </Field>
                  <Field label="Credits and training" hint="A few lines is plenty." error={errors.credits}>
                    {(p) => <Textarea {...p} rows={6} value={values.credits} onChange={(e) => set('credits', e.target.value)} />}
                  </Field>
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-5">
                  <dl className="divide-y divide-line rounded-[var(--radius-md)] bg-void/60 px-5 text-sm shadow-[inset_0_0_0_1px_var(--color-line)]">
                    {[
                      ['Name', values.name],
                      ['Email', values.email],
                      ['City', values.location],
                      ['Division', DIVISIONS.find((d) => d.id === values.division)?.label ?? ''],
                      ['Reel', values.reel],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[100px_1fr] gap-3 py-3">
                        <dt className="micro pt-0.5 text-muted">{k}</dt>
                        <dd className="break-all text-fg">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <Checkbox label="I am 18 or over." checked={values.over18} onChange={(e) => set('over18', e.target.checked)} error={errors.over18} />
                  <Checkbox
                    label="Bravura may keep my submission for 12 months to review it."
                    checked={values.consent}
                    onChange={(e) => set('consent', e.target.checked)}
                    error={errors.consent}
                  />
                </div>
              )}
              {status && <FormMessage tone="error">{status}</FormMessage>}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                <Button
                  variant="ghost"
                  icon={<ArrowLeft className="size-4" aria-hidden />}
                  disabled={step === 0}
                  onClick={() => {
                    setErrors({})
                    setStatus(null)
                    setDraft((d) => ({ ...d, step: Math.max(0, d.step - 1) }))
                  }}
                >
                  Back
                </Button>
                <Button type="submit" size="lg" loading={loading} iconRight={<ArrowRight className="size-4" aria-hidden />}>
                  {step < 2 ? 'Continue' : loading ? 'Sending' : 'Send submission'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
