import { DependencyList, useEffect, useMemo, useState } from 'react'

export const useAsyncMemo = <T>(fn: () => Promise<T>, deps: DependencyList): T | undefined => {
  const [val, setVal] = useState<T | undefined>(undefined)

  useEffect(() => {
    fn().then((_) => setVal(_))
  }, deps)

  return val
}

export const usePersistedState = <T>({
  initialValue,
  storageKey,
  storageDebounceMs = 50,
}: {
  initialValue: T
  storageKey: string
  storageDebounceMs?: number
}): [T, (_: T) => unknown] => {
  const persistedVal = useMemo(() => {
    const jsonVal = localStorage.getItem(storageKey)
    return jsonVal ? JSON.parse(jsonVal) : undefined
  }, [])
  const [val, setVal] = useState<T>(persistedVal ?? initialValue)

  let timeout: NodeJS.Timeout
  const updateValue = (_: T) => {
    setVal(_)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const jsonVal = JSON.stringify(_)
      localStorage.setItem(storageKey, jsonVal)
    }, storageDebounceMs)
  }

  useEffect(() => {
    const jsonVal = localStorage.getItem(storageKey)
    if (jsonVal) {
      setVal(JSON.parse(jsonVal))
    }

    return () => clearTimeout(timeout)
  }, [initialValue, storageKey, storageDebounceMs])

  return [val, updateValue]
}
