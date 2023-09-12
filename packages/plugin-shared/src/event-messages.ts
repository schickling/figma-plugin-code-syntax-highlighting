import type { RunArgs } from './run'

export type RunMessage = { type: 'RUN' } & Omit<RunArgs, 'fontStyles'>

export function isRunMessage(message: any): message is RunMessage {
  return message?.type === 'RUN'
}

export function isInitMessage(message: any): message is RunMessage {
  return message?.type === 'INIT'
}

export type SelectionChangeMessage = {
  type: 'SELECTION_CHANGE'
  selection?: {
    text: string
    fontSize: number
  }
  isText: boolean
}

export function isSelectionChangeMessage(message: any): message is SelectionChangeMessage {
  return message?.type === 'SELECTION_CHANGE'
}

export type RunDoneMessage = {
  type: 'RUN_DONE'
}

export function isRunDoneMessage(message: any): message is RunDoneMessage {
  return message?.type === 'RUN_DONE'
}
