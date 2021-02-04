import React, { FC, useEffect } from 'react'
// import Refractor from 'react-refractor'

// import js from 'refractor/lang/javascript'
// import { theme } from '../themes/monokai'
// import { cssFromTheme } from '../utils/cssFromThemeNew'
import Editor, { useMonaco } from '@monaco-editor/react'
import { reactTypes } from '../utils/react-typings'
import { themeMap, ThemeName } from '../../shared/themes'

import type * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { prepareThemeName } from '../utils/monaco'
;(window as any)['MonacoEnvironment'] = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}

// import { theme } from './prism-theme'
// Refractor.registerLanguage(js)

// monaco.editor.defineTheme('monokai', monokaiTheme)

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
      monaco.languages.registerDocumentFormattingEditProvider('javascript', {
        async provideDocumentFormattingEdits(model) {
          const prettier = await import('prettier/standalone')
          const babel = await import('prettier/parser-babel')
          const text = prettier.format(model.getValue(), {
            parser: 'babel',
            plugins: [babel],
            singleQuote: true,
          })

          return [
            {
              range: model.getFullModelRange(),
              text,
            },
          ]
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

      Object.entries(themeMap).forEach(([themeName_, themeData]) => {
        monaco.editor.defineTheme(prepareThemeName(themeName_), themeData)
      })
    }
  }, [monaco])

  return (
    <div
      className="w-full h-full overflow-hidden"
      // style={{ height: 'calc(100% - 3px)' }}
      // style={{ height: 448 }}
    >
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
          scrollbar: {
            // useShadows: false,
          },
        }}
      />
    </div>
  )
  // return <Refractor language="js" value={code} />
}
