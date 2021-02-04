import React, { FC, useEffect } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { reactTypes } from '../assets/react-typings'
import { themeMap, ThemeName } from '@internal/plugin-shared'
import { prepareThemeName } from '../utils/monaco'
import type * as monaco from 'monaco-editor'

export const Prism: FC<{
  code: string
  setCode: (_: string) => void
  themeName: ThemeName
  lineNumbers: boolean
  language: string
  fontSize: number
  fontFamily: string
  setEditor: (_: monaco.editor.IStandaloneCodeEditor) => void
}> = ({
  code,
  setCode,
  themeName,
  language,
  lineNumbers,
  fontSize,
  fontFamily,
  setEditor,
}) => {
  const monaco = useMonaco()

  useEffect(() => {
    if (monaco) {
      // needed for JSX to work
      // Source: https://blog.expo.io/building-a-code-editor-with-monaco-f84b3a06deaf
      {
        monaco.languages.registerDocumentFormattingEditProvider('javascript', {
          async provideDocumentFormattingEdits(model) {
            const prettier = await import('prettier/standalone')
            const babel = await import('prettier/parser-babel')
            const text = prettier.format(model.getValue(), {
              parser: 'babel',
              plugins: [babel],
              singleQuote: true,
            })

            return [{ range: model.getFullModelRange(), text }]
          },
        })

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
        })

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.Latest,
          allowNonTsExtensions: true,
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,
          esModuleInterop: true,
          jsx: monaco.languages.typescript.JsxEmit.React,
          reactNamespace: 'React',
          allowJs: true,
          typeRoots: ['node_modules/@types'],
        })

        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          reactTypes,
          `file:///node_modules/@react/types/index.d.ts`,
        )
      }

      // preload all themes
      Object.entries(themeMap).forEach(([themeName_, themeData]) => {
        monaco.editor.defineTheme(prepareThemeName(themeName_), themeData)
      })
    }
  }, [monaco])

  return (
    <div className="w-full h-full overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={(_) => setCode(_!)}
        onMount={(editor) => setEditor(editor)}
        options={{
          'semanticHighlighting.enabled': true,
          theme: themeName,
          minimap: { enabled: false },
          folding: false,
          scrollBeyondLastLine: false,
          contextmenu: false,
          hover: { enabled: false },
          padding: { top: 0, bottom: 0 },
          parameterHints: { enabled: false },
          lineNumbers: lineNumbers ? 'on' : 'off',
          tabCompletion: 'off',
          tabSize: 2,
          lightbulb: { enabled: false },
          codeLens: false,
          showUnused: false,
          fontSize,
          fontFamily,
          fontLigatures: true,
          lineDecorationsWidth: 10,
          showFoldingControls: undefined,
          foldingHighlight: false,
          renderLineHighlight: 'none',
          occurrencesHighlight: false,
          highlightActiveIndentGuide: false,
          renderIndentGuides: false,
          overviewRulerLanes: 0,
        }}
      />
    </div>
  )
}
