/* eslint @typescript-eslint/consistent-type-imports: "off" */

interface Window {
  monaco: typeof import('monaco-editor')
}

declare module 'shiki/dist/onigasm.wasm?url'
