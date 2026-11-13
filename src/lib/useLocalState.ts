import { useEffect, useState } from 'react'

import { readJson, writeJson } from './storage'

/** useState that persists to localStorage under `key`. */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJson<T>(key, initial))
  useEffect(() => writeJson(key, value), [key, value])
  return [value, setValue] as const
}
