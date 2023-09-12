import type { BuiltInParserName } from 'prettier'
import babel from 'prettier/plugins/babel'
import estree from 'prettier/plugins/estree'
import prettier from 'prettier/standalone'
import type { Lang } from 'shiki'

export const formatText = (text: string, language: Lang): Promise<string> => {
  return prettier.format(text, {
    // TODO needs to be more selective whether prettier supports a given language
    parser: getParser(language),
    plugins: [estree, babel],
    singleQuote: true,
  })
}

const getParser = (language: Lang): BuiltInParserName => {
  switch (language) {
    case 'typescript':
      return 'babel-ts'
    case 'javascript':
      return 'babel'
    case 'tsx':
      return 'babel-ts'
    case 'jsx':
      return 'babel'
    default:
      return 'babel'
  }
}
