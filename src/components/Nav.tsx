import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router'

import { NAV_LEFT, NAV_RIGHT, SITE } from '../data'
import { cx } from '../lib/cx'
import { useShortlist } from '../lib/shortlist'
import { IconButton, MicroLink } from './Button'
import { Sparkle } from './Hud'
import { useFocusTrap } from './Modal'

const isActive = (pathname: string, to: string) => pathname === to || pathname.startsWith(to + '/')

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [threshold])
  return scrolled
}

function ShortlistLink({ className }: { className?: string }) {
  const { slugs } = useShortlist()
  return (
    <MicroLink to="/shortlist" aria-current={useLocation().pathname === '/shortlist' ? 'page' : undefined} className={cx('gap-1.5', className)}>
      Shortlist
      <span className="sr-only">, {slugs.length} saved</span>
      <span
        aria-hidden
        className={cx(
          'round grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 font-mono text-[10px] transition-colors',
          slugs.length ? 'bg-violet-deep text-bone shadow-[0_0_0_1px_var(--color-violet-text)]' : 'text-muted shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
        )}
      >
        {slugs.length}
      </span>
    </MicroLink>
  )
}

export function Nav() {
  const scrolled = useScrolled()
  const { pathname } = useLocation()
  const home = pathname === '/'
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-300',
          scrolled ? 'bg-void/75 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : 'bg-transparent',
        )}
      >
        <nav aria-label="Main" className="relative flex h-14 items-center justify-between px-4 md:h-[52px]">
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LEFT.map((l) => (
              <li key={l.to}>
                <MicroLink to={l.to} aria-current={isActive(pathname, l.to) ? 'page' : undefined}>
                  {l.label}
                </MicroLink>
              </li>
            ))}
          </ul>

          <Link
            to="/"
            className={cx(
              'display flex min-h-10 items-center gap-1.5 text-[19px] text-bone transition-opacity md:absolute md:left-1/2 md:-translate-x-1/2',
              home && !scrolled ? 'md:pointer-events-none md:opacity-0' : 'opacity-100',
            )}
            aria-label={`${SITE.name}, home`}
            tabIndex={home && !scrolled ? -1 : undefined}
          >
            {SITE.short}
            <Sparkle className="size-2.5 text-violet-text" />
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {NAV_RIGHT.map((l) => (
              <li key={l.to}>
                <MicroLink to={l.to} aria-current={isActive(pathname, l.to) ? 'page' : undefined}>
                  {l.label}
                </MicroLink>
              </li>
            ))}
            <li>
              <ShortlistLink />
            </li>
          </ul>

          <div className="flex items-center gap-2 md:hidden">
            <ShortlistLink />
            <IconButton aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" variant="ghost" onClick={() => setOpen(true)}>
              <Menu className="size-5" aria-hidden />
            </IconButton>
          </div>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return createPortal(<AnimatePresence>{open && <MobilePanel onClose={onClose} />}</AnimatePresence>, document.body)
}

function MobilePanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(true, ref, onClose)
  const links = [{ label: 'Home', to: '/' }, ...NAV_LEFT, ...NAV_RIGHT, { label: 'Shortlist', to: '/shortlist' }]
  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-void px-4 pb-8 focus:outline-none"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgb(139_108_255/0.25),transparent_60%)]" />
      <div className="relative flex h-14 items-center justify-between">
        <span className="display text-[19px] text-bone">{SITE.short}</span>
        <IconButton aria-label="Close menu" variant="ghost" onClick={onClose}>
          <X className="size-5" aria-hidden />
        </IconButton>
      </div>
      <ul className="relative mt-6 flex flex-col">
        {links.map((l, i) => (
          <motion.li key={l.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i, duration: 0.35 }}>
            <NavLink
              to={l.to}
              end={l.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cx('display flex min-h-14 items-center border-b border-line text-[40px] transition-colors', isActive ? 'text-violet-text' : 'text-bone hover:text-violet-text')
              }
            >
              {l.label}
            </NavLink>
          </motion.li>
        ))}
      </ul>
      <p className="micro relative mt-auto pt-10 text-muted">{SITE.email}</p>
    </motion.div>
  )
}
