export const formatDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/** HH:MM:SS:FF at 25 fps. */
export function timecode(frames: number) {
  const ff = frames % 25
  const total = Math.floor(frames / 25)
  const s = total % 60
  const m = Math.floor(total / 60) % 60
  const h = Math.floor(total / 3600)
  return [h, m, s, ff].map((n) => String(n).padStart(2, '0')).join(':')
}

export const duration = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
