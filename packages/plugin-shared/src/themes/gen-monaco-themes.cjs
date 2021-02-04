// @ts-check
const fs = require('fs')
const path = require('path')

const toVarName = (str) => str.replace(/[-\(\)\s\.]/g, '_')
const themeFileNames = fs
  .readdirSync(path.join(__dirname, 'monaco'))
  .map((_) => _.replace(/\.json$/, ''))
const importStatements = themeFileNames
  .map((_) => `import ${toVarName(_)} from './monaco/${_}.json'`)
  .join('\n')

const themeMapMembers = themeFileNames
  .map(
    (name) => `  '${name}': ${toVarName(name)} as editor.IStandaloneThemeData,`,
  )
  .join('\n')

const genFileContent = `
import type { editor } from 'monaco-editor'

${importStatements}

export const monacoThemeMap = {
${themeMapMembers}
}
`

fs.writeFileSync(path.join(__dirname, 'monaco-themes.ts'), genFileContent)
