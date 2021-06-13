export const identity = <T>(_: T): T => _

export const capitalize = (_: string) => _.charAt(0).toUpperCase() + _.slice(1)
