import React, { FC, useMemo } from 'react'
import { Input, Select, Title, Button, Checkbox } from 'react-figma-plugin-ds'
import type { SelectOption } from 'react-figma-plugin-ds'
import { extract } from '../utils/monaco'
import { defaultThemeNames, themeMap, ThemeName } from '../themes'
import type * as monaco from 'monaco-editor'
import { useMonaco } from '@monaco-editor/react'

export const Sidebar: FC<{
  code: string
  monoFonts: Font[]
  editor: monaco.editor.IStandaloneCodeEditor | undefined
  themeName: ThemeName
  setThemeName: (_: ThemeName) => void
  language: string
  setLanguage: (_: string) => void
  fontSize: number
  setFontSize: (_: number) => void
  lineNumbers: boolean
  setLineNumbers: (_: boolean) => void
}> = ({
  code,
  monoFonts,
  editor,
  themeName,
  setThemeName,
  language,
  setLanguage,
  fontSize,
  setFontSize,
  lineNumbers,
  setLineNumbers,
}) => {
  const createText = async () => {
    const result = await extract(code, 'typescript')
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CREATE_TEXT',
          result,
        },
      },
      '*',
    )
  }

  const monaco = useMonaco()

  const themes = useMemo(
    () => toSelectOptions(Object.keys(themeMap).concat(defaultThemeNames)),
    [],
  )
  const fonts = toSelectOptions(monoFonts.map((_) => _.fontName.family))
  const languages = useMemo(
    () =>
      toSelectOptions(
        monaco?.languages.getLanguages().map((_) => _.id) ?? ['javascript'],
        (_) => _.toLowerCase(),
      ),
    [monaco],
  )

  console.log({ themes, themeName })

  return (
    <div
      className="flex-shrink-0 h-full overflow-y-scroll bg-white border-l border-gray-200"
      style={{ width: 201 }}
    >
      <div className="p-2">
        <Title size="small">Theme &amp; Font</Title>
        <Select
          options={themes}
          placeholder="Select theme"
          defaultValue={themeName}
          onChange={(_) => setThemeName((_.value as unknown) as ThemeName)}
        />
        <div className="flex">
          <Select
            options={fonts}
            placeholder="Select font"
            defaultValue={fonts[0].value}
          />
          <Input
            placeholder="Font size"
            defaultValue={fontSize}
            type="number"
            onChange={(_) => setFontSize(parseInt(_))}
          />
        </div>
      </div>
      <div className="w-full h-px bg-gray-200" />
      <div className="p-2">
        <Title size="small">Options</Title>
        <Select
          options={languages}
          placeholder="Select language"
          defaultValue={language}
          onChange={(_) => setLanguage(_.value as string)}
        />
        <Checkbox
          defaultValue={lineNumbers}
          onChange={setLineNumbers}
          label="Line numbers"
        />
        <div className="p-2">
          <Button
            isSecondary
            onClick={() =>
              editor?.getAction('editor.action.formatDocument').run()
            }
          >
            Use Prettier
          </Button>
        </div>
      </div>
      <div className="p-2">
        <Title size="small">Actions</Title>
        <Checkbox label="Overwrite selected text" />
        <div className="p-2">
          <Button isSecondary onClick={createText}>
            Run plugin
          </Button>
        </div>
      </div>
    </div>
  )
}

const toSelectOptions = (
  values: string[],
  mapValue: (_: string) => string = (_) => _,
): SelectOption[] => values.map((_) => ({ label: _, value: mapValue(_) }))
