import { ArrowRight, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { BUDGETS, CONTACT, PROJECT_TYPES, talentBySlug } from '../data'
import { postJson } from '../lib/api'
import { validateEnquiry, type FieldErrors } from '../shared/validation'
import { Button } from './Button'
import { Field, FormMessage, Input, Select, Textarea } from './Field'

type Values = { name: string; email: string; company: string; projectType: string; budget: string; startDate: string; message: string }
const EMPTY: Values = { name: '', email: '', company: '', projectType: '', budget: '', startDate: '', message: '' }

/**
 * Booking enquiry: posts to /api/enquiries, which validates and returns a
 * reference. Used on Contact, in the profile "Book" dialog and for sending a
 * shortlist as a brief.
 */
export function EnquiryForm({
  talent: initialTalent = [],
  onSent,
  defaultMessage = '',
  compact,
  submitLabel = 'Send enquiry',
}: {
  talent?: string[]
  onSent?: (reference: string) => void
  defaultMessage?: string
  compact?: boolean
  submitLabel?: string
}) {
  const [values, setValues] = useState<Values>({ ...EMPTY, message: defaultMessage })
  const [talent, setTalent] = useState(initialTalent)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors(({ [k]: _drop, ...rest }) => rest)
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const payload = { ...values, talent }
    const local = validateEnquiry(payload)
    setErrors(local)
    if (Object.keys(local).length) {
      setStatus({ tone: 'error', text: 'Please check the highlighted fields.' })
      const first = e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      return
    }
    setLoading(true)
    setStatus(null)
    const res = await postJson<{ reference: string }>('/api/enquiries', payload)
    setLoading(false)
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {})
      setStatus({ tone: 'error', text: res.error })
      return
    }
    setStatus({ tone: 'success', text: `${CONTACT.success} ${res.data.reference}.` })
    setValues(EMPTY)
    onSent?.(res.data.reference)
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      {talent.length > 0 && (
        <div>
          <p className="mb-2 text-[13px] font-medium text-fg">Talent</p>
          <ul className="flex flex-wrap gap-2">
            {talent.map((slug) => {
              const t = talentBySlug(slug)
              if (!t) return null
              return (
                <li key={slug} className="micro inline-flex h-10 items-center gap-1 rounded-[10px] bg-raised pl-3 text-fg">
                  {t.name}
                  <button
                    type="button"
                    onClick={() => setTalent((cur) => cur.filter((s) => s !== slug))}
                    className="grid size-10 place-items-center rounded-[10px] text-muted hover:text-fg"
                    aria-label={`Remove ${t.name} from this enquiry`}
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
          {errors.talent && <p className="mt-2 text-[13px] text-danger">{errors.talent}</p>}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}>
          {(p) => <Input {...p} autoComplete="name" value={values.name} onChange={set('name')} data-autofocus />}
        </Field>
        <Field label="Email" error={errors.email}>
          {(p) => <Input {...p} type="email" autoComplete="email" value={values.email} onChange={set('email')} />}
        </Field>
        <Field label="Company or production" optional error={errors.company}>
          {(p) => <Input {...p} autoComplete="organization" value={values.company} onChange={set('company')} />}
        </Field>
        <Field label="Project type" error={errors.projectType}>
          {(p) => (
            <Select {...p} value={values.projectType} onChange={set('projectType')}>
              <option value="">Choose one</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          )}
        </Field>
        {!compact && (
          <>
            <Field label="Budget" optional error={errors.budget}>
              {(p) => (
                <Select {...p} value={values.budget} onChange={set('budget')}>
                  <option value="">Choose a range</option>
                  {BUDGETS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Shoot or start date" optional error={errors.startDate}>
              {(p) => <Input {...p} type="date" value={values.startDate} onChange={set('startDate')} className="[color-scheme:dark]" />}
            </Field>
          </>
        )}
      </div>
      <Field label="The brief" hint="Roles, dates, locations and anything we should know." error={errors.message}>
        {(p) => <Textarea {...p} value={values.message} onChange={set('message')} rows={5} />}
      </Field>
      {status && <FormMessage tone={status.tone}>{status.text}</FormMessage>}
      <div>
        <Button type="submit" variant="primary" size="lg" loading={loading} iconRight={<ArrowRight className="size-4" aria-hidden />}>
          {loading ? 'Sending' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
