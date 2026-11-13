import { ArrowRight } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'

import { postJson } from '../lib/api'
import { validateSubscribe } from '../shared/validation'
import { Button } from './Button'
import { Input } from './Field'

export function NewsletterForm({ className }: { className?: string }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errors = validateSubscribe({ email })
    if (errors.email) return setError(errors.email)
    setError('')
    setState('loading')
    const res = await postJson('/api/subscribe', { email })
    if (res.ok) setState('done')
    else {
      setState('idle')
      setError(res.fieldErrors?.email ?? res.error)
    }
  }

  if (state === 'done')
    return (
      <p role="status" className={className + ' text-sm text-success'}>
        You are on the call sheet. See you next month.
      </p>
    )

  return (
    <form onSubmit={submit} noValidate className={className}>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="h-11"
        />
        <Button type="submit" variant="primary" loading={state === 'loading'} iconRight={<ArrowRight className="size-4" aria-hidden />}>
          Subscribe
        </Button>
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      )}
    </form>
  )
}
