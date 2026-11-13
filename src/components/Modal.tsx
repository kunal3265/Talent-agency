import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cx } from '../lib/cx'
import { IconButton } from './Button'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Traps Tab inside `ref`, closes on Escape and restores focus on unmount. */
export function useFocusTrap(open: boolean, ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const el = ref.current
    const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? el)?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !el) return
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null)
      if (!items.length) return
      const head = items[0]
      const tail = items[items.length - 1]
      if (!el.contains(document.activeElement)) {
        e.preventDefault()
        head.focus()
      } else if (e.shiftKey && document.activeElement === head) {
        e.preventDefault()
        tail.focus()
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault()
        head.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // the page behind the overlay leaves the tab order and the accessibility tree
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    return () => {
      root?.removeAttribute('inert')
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open, ref])
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return createPortal(
    <AnimatePresence>{open && <ModalPanel {...{ onClose, title, description, className }}>{children}</ModalPanel>}</AnimatePresence>,
    document.body,
  )
}

function ModalPanel({ onClose, title, description, children, className }: Omit<Parameters<typeof Modal>[0], 'open'>) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useFocusTrap(true, ref, onClose)
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        className="absolute inset-0 bg-scrim/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-desc` : undefined}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={cx(
          'relative max-h-[92svh] w-full overflow-y-auto rounded-t-[var(--radius-lg)] bg-panel p-6 shadow-[var(--shadow-float)] focus:outline-none sm:max-w-xl sm:rounded-[var(--radius-lg)] sm:p-8',
          className,
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={`${id}-title`} className="display text-[34px]">
              {title}
            </h2>
            {description && (
              <p id={`${id}-desc`} className="mt-2 text-sm text-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton aria-label="Close" size="sm" onClick={onClose} className="-mt-1 -mr-1">
            <X className="size-4" />
          </IconButton>
        </div>
        {children}
      </motion.div>
    </div>
  )
}
