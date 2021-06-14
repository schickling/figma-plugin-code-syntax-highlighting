import type { SelectOption } from 'react-figma-plugin-ds'

export const toSelectOptions = <T>({
  values,
  getLabel,
  getValue,
}: {
  values: T[]
  getValue: (_: T) => string
  getLabel: (_: T) => string
}): SelectOption[] => values.map((_) => ({ label: getLabel(_), value: getValue(_) }))
