import type { FC } from 'react'
import { useState } from 'react'
import React, { useMemo } from 'react'
import { Button, Checkbox, Icon, Input, Select, Title } from 'react-figma-plugin-ds'
import type { BuiltinLanguage, BuiltinTheme } from 'shikiji'
import { bundledLanguages, bundledThemes } from 'shikiji'

import { capitalize, identity } from '../utils'
import { toSelectOptions } from '../utils/figma-ds'

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
          <Title size="small">BuiltinTheme &amp; Font</Title>
          <Select
            options={themes}
            placeholder="Select theme"
            defaultValue={themeName}
            onChange={(_) => setThemeName(_.value as unknown as BuiltinTheme)}
          />
          <div className="flex">
            <div className="flex-shrink-0 w-2/3">
              <Select
                options={fonts}
                placeholder="Select font"
                defaultValue={fontFamily}
                className="wide-dropdown"
                onChange={(_) => setFontFamily(_.value as string)}
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
          <Select
            options={languages}
            placeholder="Select language"
            defaultValue={language}
            onChange={(_) => setLanguage(_.value as unknown as BuiltinLanguage)}
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
      <div className="flex justify-between p-4 text-xs">
        <span className="text-black/20">v1.2.0</span>
        <div className="space-x-2 text-blue-500">
          <a
            href="https://www.notion.so/schickling/Figma-Code-Syntax-Highlighter-03408cb2d60846a3a1b7b0506224834f"
            target="_blank"
          >
            Website
          </a>
          <a href="mailto:schickling.j+figma@gmail.com">Contact</a>
        </div>
      </div>
    </div>
  )
}
