import type { FC } from 'react'
import { useState } from 'react'
import React, { useMemo } from 'react'
import { Button, Checkbox, Icon, Input, Title } from 'react-figma-plugin-ds'
import type { BuiltinLanguage, BuiltinTheme } from 'shikiji'
import { bundledLanguages, bundledThemes } from 'shikiji'

import { toSelectOptions } from '../utils/figma-ds.js'
import { capitalize, identity } from '../utils/index.js'
import { ComboBox } from './ComboBox.jsx'

export const Sidebar: FC<{
  monoFontFamilies: string[]
  themeName: BuiltinTheme
  setThemeName: (_: BuiltinTheme) => void
  language: BuiltinLanguage
  setLanguage: (_: BuiltinLanguage) => void
  fontSize: number
  setFontSize: (_: number) => void
  fontFamily: string
  setFontFamily: (_: string) => void
  includeBackground: boolean
  setIncludeBackground: (_: boolean) => void
  lineNumbers: boolean
  setLineNumbers: (_: boolean) => void
  overwriteExisting: boolean
  setOverwriteExisting: (_: boolean) => void
  overwriteExistingEnabled: boolean
  runPrettier: () => Promise<void>
  execRun: () => void
  isFigmaLoading: boolean
}> = ({
  monoFontFamilies,
  themeName,
  setThemeName,
  language,
  setLanguage,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  includeBackground,
  setIncludeBackground,
  lineNumbers,
  setLineNumbers,
  overwriteExisting,
  setOverwriteExisting,
  overwriteExistingEnabled,
  runPrettier,
  execRun,
  isFigmaLoading: isLoading,
}) => {
  const themes = useMemo(
    () => toSelectOptions({ values: Object.keys(bundledThemes), getValue: identity, getLabel: identity }),
    [],
  )
  const fonts = toSelectOptions({ values: monoFontFamilies, getLabel: identity, getValue: identity })
  const languages = useMemo(
    () =>
      toSelectOptions({
        values: Object.keys(bundledLanguages),
        getLabel: (id) => capitalize(id),
        getValue: (id) => id,
      }),
    [],
  )
  const [prettierIsLoading, setPrettierIsLoading] = useState(false)
  const runPrettier_ = async () => {
    setPrettierIsLoading(true)
    await runPrettier().catch((_) => console.log(_))
    setPrettierIsLoading(false)
  }

  return (
    <div
      className="flex flex-col justify-between flex-shrink-0 h-full overflow-y-scroll bg-white border-l border-gray-200"
      style={{ width: 201 }}
    >
      <div>
        <div className="p-2">
          <Title size="small">Theme &amp; Font</Title>
          <ComboBox
            label="Select theme"
            onChange={(_) => setThemeName(_ as BuiltinTheme)}
            options={themes.map((_) => ({ id: _.value as string, label: _.label }))}
            activeOption={{ id: themeName, label: themeName }}
          />
          <div className="flex">
            <div className="flex-shrink-0 w-2/3">
              <ComboBox
                label="Select font"
                onChange={(_) => setFontFamily(_)}
                options={fonts.map((_) => ({ id: _.value as string, label: _.label }))}
                activeOption={{ id: fontFamily, label: fontFamily }}
              />
            </div>
            <div className="flex-shrink-0 w-1/3">
              <Input
                placeholder="Font size"
                defaultValue={fontSize}
                type="number"
                onChange={(_) => setFontSize(parseInt(_))}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-gray-200" />
        <div className="p-2">
          <Title size="small">Options</Title>
          <ComboBox
            label="Select language"
            onChange={(_) => setLanguage(_ as BuiltinLanguage)}
            options={languages.map((_) => ({ id: _.value as string, label: _.label }))}
            activeOption={{ id: language, label: capitalize(language) }}
          />
          <Checkbox label="Include background" defaultValue={includeBackground} onChange={setIncludeBackground} />
          <Checkbox
            defaultValue={lineNumbers}
            onChange={setLineNumbers}
            label="Line numbers"
            isDisabled={!includeBackground}
          />
          <div className="p-2">
            <Button isSecondary onClick={runPrettier_}>
              <span>Use Prettier</span>
              {prettierIsLoading && (
                <div className="transform scale-75">
                  <Icon className="animate-spin fix-icon" name="spinner" />
                </div>
              )}
            </Button>
          </div>
        </div>
        <div className="p-2">
          <Title size="small">Actions</Title>
          <Checkbox
            label="Overwrite selected text"
            defaultValue={!overwriteExistingEnabled ? false : overwriteExisting}
            onChange={setOverwriteExisting}
            isDisabled={!overwriteExistingEnabled}
          />
          <div className="p-2">
            <Button isSecondary onClick={execRun} isDisabled={isLoading}>
              <span>Run plugin</span>
              {isLoading && (
                <div className="transform scale-75">
                  <Icon className="animate-spin fix-icon" name="spinner" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="justify-between p-3 text-[11px] flex items-end">
        <div className="space-x-1 text-blue-500/70 flex">
          <a href="https://github.com/sponsors/schickling" target="_blank">
            ☕ Buy me a coffee
          </a>
          <span className="opacity-30">•</span>
          <a
            href="https://www.notion.so/schickling/Figma-Code-Syntax-Highlighter-03408cb2d60846a3a1b7b0506224834f"
            target="_blank"
          >
            Info
          </a>
        </div>
        <div className="text-black/20" title={import.meta.env.VITE_GIT_COMMIT?.slice(0, 7) ?? 'no commit found'}>
          v1.2.1
        </div>
      </div>
    </div>
  )
}
