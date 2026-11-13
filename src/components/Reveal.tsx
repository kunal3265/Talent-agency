import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Fades a block up into place the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className, y = 18 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
