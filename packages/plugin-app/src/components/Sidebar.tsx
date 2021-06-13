import React, { FC, useMemo } from 'react'
import { Input, Select, Title, Button, Checkbox, Icon } from 'react-figma-plugin-ds'
import type { SelectOption } from 'react-figma-plugin-ds'
import { themeMap } from '@internal/plugin-shared'
import type * as monaco from 'monaco-editor'
import { BUNDLED_LANGUAGES, BUNDLED_THEMES, Lang, Theme } from 'shiki'
import { toSelectOptions } from '../utils/figma-ds'
import { capitalize, identity } from '../utils'

export const Sidebar: FC<{
  monoFontFamilies: string[]
  editor: monaco.editor.IStandaloneCodeEditor | undefined
  themeName: Theme
  setThemeName: (_: Theme) => void
  language: Lang
  setLanguage: (_: Lang) => void
  fontSize: number
  setFontSize: (_: number) => void
  fontFamily: string
  setFontFamily: (_: string) => void
  includeBackground: boolean
  setIncludeBackground: (_: boolean) => void
  lineNumbers: boolean
  setLineNumbers: (_: boolean) => void
  overwriteText: boolean
  setOverwriteText: (_: boolean) => void
  overwriteTextEnabled: boolean
  runPrettier: () => void
  execRun: () => void
  isLoading: boolean
}> = ({
  monoFontFamilies,
  editor,
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
  overwriteText,
  setOverwriteText,
  overwriteTextEnabled,
  runPrettier,
  execRun,
  isLoading,
}) => {
  const themes = useMemo(() => toSelectOptions({ values: BUNDLED_THEMES, getValue: identity, getLabel: identity }), [])
  const fonts = toSelectOptions({ values: monoFontFamilies, getLabel: identity, getValue: identity })
  const languages = useMemo(
    () => toSelectOptions({ values: BUNDLED_LANGUAGES, getLabel: (_) => capitalize(_.id), getValue: (_) => _.id }),
    [],
  )

  return (
    <div className="flex-shrink-0 h-full overflow-y-scroll bg-white border-l border-gray-200" style={{ width: 201 }}>
      <div className="p-2">
        <Title size="small">Theme &amp; Font</Title>
        <Select
          options={themes}
          placeholder="Select theme"
          defaultValue={themeName}
          onChange={(_) => setThemeName(_.value as unknown as Theme)}
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
          onChange={(_) => setLanguage(_.value as unknown as Lang)}
        />
        <Checkbox label="Include background" defaultValue={includeBackground} onChange={setIncludeBackground} />
        <Checkbox defaultValue={lineNumbers} onChange={setLineNumbers} label="Line numbers" />
        <div className="p-2">
          <Button isSecondary onClick={runPrettier}>
            Use Prettier
          </Button>
        </div>
      </div>
      <div className="p-2">
        <Title size="small">Actions</Title>
        <Checkbox
          label="Overwrite selected text"
          defaultValue={!overwriteTextEnabled ? false : overwriteText}
          onChange={setOverwriteText}
          isDisabled={!overwriteTextEnabled}
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
  )
}
