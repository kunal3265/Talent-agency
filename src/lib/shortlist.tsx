import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { TALENT } from '../data'
import { readJson, writeJson } from './storage'

type Shortlist = {
  slugs: string[]
  has: (slug: string) => boolean
  toggle: (slug: string) => boolean
  remove: (slug: string) => void
  clear: () => void
}

const Ctx = createContext<Shortlist | null>(null)
const KEY = 'shortlist'

/** Saved talent, kept in localStorage so it survives a reload. */
export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(() =>
    readJson<string[]>(KEY, []).filter((s) => TALENT.some((t) => t.slug === s)),
  )
  useEffect(() => writeJson(KEY, slugs), [slugs])

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs])
  const toggle = useCallback(
    (slug: string) => {
      const adding = !slugs.includes(slug)
      setSlugs((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]))
      return adding
    },
    [slugs],
  )
  const remove = useCallback((slug: string) => setSlugs((cur) => cur.filter((s) => s !== slug)), [])
  const clear = useCallback(() => setSlugs([]), [])

  const value = useMemo(() => ({ slugs, has, toggle, remove, clear }), [slugs, has, toggle, remove, clear])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useShortlist() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useShortlist must be used inside ShortlistProvider')
  return ctx
}
