import { useEffect } from 'react'

const STORAGE_KEY = 'spendscan_form_v1'

export function useFormPersist<T>(data: T, setValue: (key: keyof T, value: any) => void) {
  // Save on every data change
  useEffect(() => {
    if (data && Object.keys(data as object).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {}
    }
  }, [data])

  // Load on mount
  const load = (): Partial<T> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  const clear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  return { load, clear }
}
