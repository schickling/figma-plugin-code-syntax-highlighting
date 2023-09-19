import clsx from 'clsx'

export const identity = <T>(_: T): T => _

export const capitalize = (_: string) => _.charAt(0).toUpperCase() + _.slice(1)

/** Returns a pair of a promise and a resolve function. The promise resolves once the exposed resolve function has been called. */
export const makeExposedPromise = <T>(): { promise: Promise<T>; resolve: (_: T) => unknown } => {
  let resolve: ((_: T) => unknown) | undefined = undefined

  const promise = new Promise<T>((resolve_) => {
    resolve = resolve_
    return
  })

  return { promise, resolve: resolve! }
}

export const cn = clsx
