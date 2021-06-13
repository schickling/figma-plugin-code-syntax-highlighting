import prettier from 'prettier/standalone'
import babel from 'prettier/parser-babel'

export const formatText = (text: string): string => {
  return prettier.format(text, {
    parser: 'babel-ts',
    plugins: [babel],
    singleQuote: true,
  })
}
