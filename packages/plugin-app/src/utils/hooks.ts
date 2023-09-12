import type { DependencyList } from 'react'
import React from 'react'
import { useEffect, useMemo, useState } from 'react'

export const useAsyncMemo = <T>(fn: () => Promise<T>, deps: DependencyList): T | undefined => {
  const [val, setVal] = useState<T | undefined>(undefined)

  useEffect(() => {
    fn().then((_) => setVal(_))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [storageKey])
  const [val, setVal] = useState<T>(persistedVal ?? initialValue)

  const timeoutRef = React.useRef<number | undefined>(undefined)
  const updateValue = React.useCallback(
    (_: T) => {
      setVal(_)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        const jsonVal = JSON.stringify(_)
        localStorage.setItem(storageKey, jsonVal)
      }, storageDebounceMs)
    },
    [storageDebounceMs, storageKey],
  )

  useEffect(() => {
    const jsonVal = localStorage.getItem(storageKey)
    if (jsonVal) {
      setVal(JSON.parse(jsonVal))
    }

    return () => clearTimeout(timeoutRef.current)
  }, [initialValue, storageKey, storageDebounceMs])

  return [val, updateValue]
}
