/* eslint @typescript-eslint/consistent-type-imports: "off" */

interface Window {
  monaco: typeof import('monaco-editor')
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
