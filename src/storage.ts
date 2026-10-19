import { useEffect, useState } from 'react'
const P = 'iphone-sim:'
export function usePersisted<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(P + key); if (s) return JSON.parse(s) as T } catch { /* 저장소 사용 불가 */ }
    return initial
  })
  useEffect(() => { try { localStorage.setItem(P + key, JSON.stringify(v)) } catch { /* ignore */ } }, [key, v])
  return [v, setV] as const
}
export const resetAll = () => {
  try { Object.keys(localStorage).filter(k => k.startsWith(P)).forEach(k => localStorage.removeItem(k)) } catch { /* ignore */ }
  location.reload()
}
