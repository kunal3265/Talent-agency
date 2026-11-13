// Validation shared by the forms (instant feedback) and the Worker (the
// authority). Each validator returns a map of field -> message; empty = valid.

import { BUDGETS, DIVISIONS, PROJECT_TYPES, TALENT } from '../data'

export type FieldErrors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const URL_RE = /^https:\/\/[^\s/$.?#].[^\s]*$/i

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

function person(input: Record<string, unknown>, errors: FieldErrors) {
  const name = str(input.name)
  const email = str(input.email)
  if (name.length < 2) errors.name = 'Enter your full name.'
  else if (name.length > 120) errors.name = 'Keep your name under 120 characters.'
  if (!EMAIL.test(email)) errors.email = 'Enter a valid email address.'
}

export type EnquiryInput = {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  startDate: string
  talent: string[]
  message: string
}

export function validateEnquiry(input: Record<string, unknown>, today = new Date()): FieldErrors {
  const errors: FieldErrors = {}
  person(input, errors)
  if (str(input.company).length > 120) errors.company = 'Keep the company name under 120 characters.'
  if (!PROJECT_TYPES.includes(str(input.projectType) as (typeof PROJECT_TYPES)[number])) errors.projectType = 'Choose a project type.'
  if (str(input.budget) && !BUDGETS.includes(str(input.budget) as (typeof BUDGETS)[number])) errors.budget = 'Choose a budget range.'
  const date = str(input.startDate)
  if (date) {
    const d = new Date(date + 'T12:00:00')
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(d.getTime())) errors.startDate = 'Enter a valid date.'
    else if (d < start) errors.startDate = 'Choose a date from today onwards.'
  }
  const talent = input.talent
  if (talent !== undefined) {
    if (!Array.isArray(talent) || talent.length > 30 || talent.some((s) => typeof s !== 'string' || !TALENT.some((t) => t.slug === s)))
      errors.talent = 'One of those artists is not on the roster.'
  }
  const message = str(input.message)
  if (message.length < 20) errors.message = 'Tell us a little more about the project (at least 20 characters).'
  else if (message.length > 3000) errors.message = 'Keep the brief under 3,000 characters.'
  return errors
}

export type SubmissionInput = {
  name: string
  email: string
  location: string
  division: string
  reel: string
  credits: string
  over18: boolean
  consent: boolean
}

export function validateSubmissionStep(step: number, input: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {}
  if (step === 0) {
    person(input, errors)
    if (str(input.location).length < 2) errors.location = 'Enter the city you are based in.'
    if (!DIVISIONS.some((d) => d.id === str(input.division))) errors.division = 'Choose what you do.'
  }
  if (step === 1) {
    if (!URL_RE.test(str(input.reel))) errors.reel = 'Enter a link to your reel that starts with https://'
    const credits = str(input.credits)
    if (credits.length < 10) errors.credits = 'List a few credits or training (at least 10 characters).'
    else if (credits.length > 2000) errors.credits = 'Keep this under 2,000 characters.'
  }
  if (step === 2) {
    if (input.over18 !== true) errors.over18 = 'Confirm you are 18 or over.'
    if (input.consent !== true) errors.consent = 'We need your consent to review your submission.'
  }
  return errors
}

export function validateSubmission(input: Record<string, unknown>): FieldErrors {
  return { ...validateSubmissionStep(0, input), ...validateSubmissionStep(1, input), ...validateSubmissionStep(2, input) }
}

export function validateSubscribe(input: Record<string, unknown>): FieldErrors {
  return EMAIL.test(str(input.email)) ? {} : { email: 'Enter a valid email address.' }
}
