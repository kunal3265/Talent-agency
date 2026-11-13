import { useEffect } from 'react'

import { SITE } from '../data'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.role}`
  }, [title])
}
