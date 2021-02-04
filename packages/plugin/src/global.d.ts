/// <reference types="@figma/plugin-typings" />

interface Window {
  monaco: typeof import('monaco-editor')
}

declare module 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'
declare module 'monaco-editor/esm/vs/editor/editor.worker?worker'
declare module 'monaco-editor/esm/vs/language/json/json.worker?worker'
declare module 'monaco-editor/esm/vs/language/css/css.worker?worker'
declare module 'monaco-editor/esm/vs/language/html/html.worker?worker'
declare module 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
declare module 'monaco-editor/esm/vs/editor/common/core/lineTokens'
declare module 'monaco-editor/esm/vs/editor/common/modes'
declare module 'monaco-editor/esm/vs/editor/standalone/common/themes' {
  export const vs: import('monaco-editor').editor.IStandaloneThemeData
  export const vs_dark: import('monaco-editor').editor.IStandaloneThemeData
  export const hc_black: import('monaco-editor').editor.IStandaloneThemeData
}
