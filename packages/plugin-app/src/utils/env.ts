export type Env = 'Figma' | 'Browser'

export const env: Env = new URLSearchParams(location.search).get('env') === 'figma' ? 'Figma' : 'Browser'
console.log(`Detected plugin env: ${env}`)
