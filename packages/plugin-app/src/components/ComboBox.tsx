import React from 'react'
import * as RAC from 'react-aria-components'

import { env } from '../utils/env.js'
import { cn } from '../utils/index.js'
import { handleKeyDown } from '../utils/keydown.js'

export type SelectOption = { id: string; label: string }

export type ComboBoxProps = {
  label?: string
  options: ReadonlyArray<SelectOption>
  activeOption: SelectOption
  onChange: (id: string) => void
}

export const ComboBox: React.FC<ComboBoxProps> = ({ label, activeOption, options, onChange }) => {
  const ref = React.useRef<HTMLInputElement>(null)

  return (
    <RAC.ComboBox<SelectOption>
      onSelectionChange={(id) => {
        if (id === null) return
        onChange(id as string)
        ref.current?.blur()
      }}
      aria-label={label}
      defaultInputValue={activeOption.label}
      defaultSelectedKey={activeOption.id}
      defaultItems={options}
      className="w-full"
      menuTrigger="focus"
    >
      <div className="border overflow-hidden relative w-full hover:border-gray-200 border-transparent flex justify-between group">
        <RAC.Input
          ref={ref}
          onKeyDown={(e) => handleKeyDown(e, env, ref)}
          className="text-[11px] pl-2 overflow-hidden outline-none shrink grow"
        />
        <RAC.Button
          className="opacity-30 group-hover:opacity-80 shrink-0"
          style={{
            width: 30,
            height: 30,
            backgroundImage:
              'url("data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20width%3D%2230%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m15%2016.7071-3-3%20.7071-.7071%202.6465%202.6464%202.6464-2.6464.7071.7071-3%203-.3535.3536z%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E")',
          }}
        />
      </div>
      <RAC.Popover>
        <RAC.ListBox<SelectOption>
          className="bg-[#222222] min-w-[--trigger-width] py-1.5 text-white text-[12px] overflow-y-auto overflow-x-hidden rounded-sm"
          style={{
            boxShadow: '0 5px 17px rgba(0, 0, 0, .2), 0 2px 7px rgba(0, 0, 0, .15)',
            maxHeight: 'min(400px, 50vh)',
          }}
        >
          {(option) => (
            <RAC.Item
              id={option.id}
              value={option}
              ref={(_) => {
                if (option.id === activeOption.id) {
                  _?.scrollIntoView({ block: 'center' })
                }
              }}
              key={option.id}
              textValue={option.label}
              className={(_) =>
                cn(
                  _.isFocused ? 'bg-[#18a0fb]' : '',
                  'hover:bg-[#18a0fb] w-full pl-2 pr-4 py-1 flex items-center space-x-1',
                )
              }
            >
              {({ isSelected }) => (
                <>
                  <span
                    className="w-4 h-4"
                    style={{
                      backgroundImage: isSelected
                        ? 'url("data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m13.2069%205.20724-5.50002%205.49996-.70711.7072-.70711-.7072-3-2.99996%201.41422-1.41421%202.29289%202.29289%204.79293-4.79289z%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E")'
                        : undefined,
                    }}
                  />
                  <span>{option.label}</span>
                </>
              )}
            </RAC.Item>
          )}
        </RAC.ListBox>
      </RAC.Popover>
    </RAC.ComboBox>
  )
}
