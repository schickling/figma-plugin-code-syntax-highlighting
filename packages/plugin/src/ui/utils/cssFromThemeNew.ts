export type ThemeOptions = {
  fontSize: number
  textShadow: string
  fontFamily: string
  lineHeight: number
  tabSize: number
  // paddingTop: 1em;
}

export type OptionalKey =
  | 'number'
  | 'function'
  | 'string'
  | 'boolean'
  | 'operator'
  | 'punctuation'
  | 'atrule'
  | 'attr-value'
  | 'attr-name'
  | 'url'
  | 'regex'
  | 'important'
  | 'prolog'
  | 'builtin'
  | 'constant'
  | 'char'

export type RequiredKey =
  | 'base'
  | 'background'
  | 'property'
  | 'keyword'
  | 'selector'
  | 'variable'
  | 'comment'

export type Key = OptionalKey | RequiredKey

export type MinimalTheme = Record<RequiredKey, string> &
  Partial<Record<OptionalKey, string>>

export type FullTheme = Record<RequiredKey, string> &
  Record<OptionalKey, string>

export type Theme = Record<string, Key[] | Key>
type GetVal<R extends Record<any, any>> = R extends { [P in keyof R]: infer V }
  ? V extends any[]
    ? V[number]
    : V
  : never
type ValidTheme<T extends Theme> = RequiredKey extends GetVal<T>
  ? T
  : [Error, 'You are missing', Exclude<RequiredKey, GetVal<T>>]

export const defineTheme = <T extends Theme>(_: ValidTheme<T>): ValidTheme<T> =>
  _

const fallbacks: { [P in OptionalKey]: RequiredKey } = {
  builtin: 'selector',
  char: 'selector',
  'attr-name': 'selector',
  prolog: 'comment',
  function: 'keyword',
  atrule: 'keyword',
  'attr-value': 'keyword',
  string: 'property',
  number: 'property',
  boolean: 'property',
  constant: 'property',
  url: 'variable',
  operator: 'variable',
  punctuation: 'variable',
  important: 'variable',
  regex: 'variable',
}

const fullTheme = ({ theme }: { theme: MinimalTheme }): FullTheme => {
  Object.entries(fallbacks).forEach(([key, fallbackKey]) => {
    theme[key] = theme[key] ?? theme[fallbackKey]
  })
  return theme as FullTheme
}

const themeToMinimalTheme = (theme: Theme): MinimalTheme => {
  return Object.entries(theme)
    .flatMap(([color, tokens]) =>
      optionalWrap(tokens).map((token) => ({ color, token })),
    )
    .reduce(
      (acc, { color, token }) => ({ ...acc, [token]: color }),
      {} as MinimalTheme,
    )
}

const optionalWrap = <X>(_: X | X[]): X[] => (Array.isArray(_) ? _ : [_])

export const cssFromTheme = ({
  theme,
  options,
}: {
  theme: Theme
  options: ThemeOptions
}): string => {
  const themeColors = fullTheme({ theme: themeToMinimalTheme(theme) })

  const renderColorToken = ({
    key,
    value,
  }: {
    key: string
    value: string
  }): string => `\
.token.${key} {
  color: ${value};
}
  `
  const colorTokens = Object.entries(themeColors)
    .map(([key, value]) => renderColorToken({ key, value }))
    .join('\n')

  return `\
pre[class*="language-"],
code[class*="language-"] {
  color: ${themeColors.base};
  font-size: ${options.fontSize}px;
  text-shadow: ${options.textShadow};
  font-family: ${options.fontFamily};
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: ${options.lineHeight};

  -moz-tab-size: ${options.tabSize};
  -o-tab-size: ${options.tabSize};
  tab-size: ${options.tabSize};

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

pre[class*="language-"] {
  padding: 1em;
  margin: .5em 0;
  overflow: auto;

  background: ${themeColors.background};
}

.namespace {
	opacity: .7;
}

${colorTokens}
`

  //   return /*css*/ `\
  // /*********************************************************
  // * General
  // */

  // pre[class*="language-"],
  // code[class*="language-"] {
  //   color: ${themeColors.base};
  //   font-size: ${options.fontSize}px;
  //   text-shadow: ${options.textShadow};
  //   font-family: ${options.fontFamily};
  //   direction: ltr;
  //   text-align: left;
  //   white-space: pre;
  //   word-spacing: normal;
  //   word-break: normal;
  //   line-height: ${options.lineHeight};

  //   -moz-tab-size: ${options.tabSize};
  //   -o-tab-size: ${options.tabSize};
  //   tab-size: ${options.tabSize};

  //   -webkit-hyphens: none;
  //   -moz-hyphens: none;
  //   -ms-hyphens: none;
  //   hyphens: none;
  // }

  // /* code[class*="language-"]::selection {
  //   text-shadow: none;
  //   background: $//{themeColors.selected};
  // } */

  // /* Blocks */
  // pre[class*="language-"] {
  //   padding: 1em;
  //   margin: .5em 0;
  //   overflow: auto;

  //   background: ${themeColors.background};
  // }

  // /* Inline code */
  // /*
  // :not(pre) > code[class*="language-"] {
  //   padding: .1em .3em;
  //   border-radius: .3em;
  //   color: @inlineCode;
  //   background: @inlineCodeBackground;
  // }
  // */

  // /*********************************************************
  // * Tokens
  // */

  // .namespace {
  //   opacity: .7;
  // }

  // .token.comment,
  // .token.prolog,
  // .token.doctype,
  // .token.cdata {
  //   color: ${themeColors.comment};
  // }

  // .token.punctuation {
  //   color: ${themeColors.punctuation};
  // }

  // .token.number {
  //   color: ${themeColors.property};
  // }

  // .token.string {
  //   color: ${themeColors.string};
  // }

  // .token.property,
  // .token.tag,
  // .token.boolean,
  // .token.constant,
  // .token.symbol,
  // .token.deleted {
  //   color: ${themeColors.property};
  // }

  // .token.selector,
  // .token.attr-name,
  // .token.char,
  // .token.builtin,
  // .token.inserted {
  //   color: ${themeColors.selector};
  // }

  // .token.operator,
  // .token.entity,
  // .token.url,
  // .language-css .token.string,
  // .style .token.string {
  //   color: ${themeColors.operator};
  //   /* background: $//{themeColors.operatorBg}; */
  // }

  // .token.atrule,
  // .token.attr-value,
  // .token.keyword {
  //   color: ${themeColors.keyword};
  // }

  // .token.function {
  //   color: ${themeColors.function};
  // }

  // .token.variable {
  //   color: ${themeColors.variable};
  // }

  // .token.regex,
  // .token.important {
  //   color: ${themeColors.definition};
  // }

  // .token.important,
  // .token.bold {
  //   font-weight: bold;
  // }
  // .token.italic {
  //   font-style: italic;
  // }

  // .token.entity {
  //   cursor: help;
  // }

  // /*********************************************************
  // * Line highlighting
  // */

  // pre[data-line] {
  //   position: relative;
  // }

  // pre[class*="language-"] > code[class*="language-"] {
  //   position: relative;
  //   z-index: 1;
  // }

  // .line-highlight {
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   padding: inherit 0;
  //   /* margin-top: @paddingTop; */

  //   /* background: @highlightBackground;
  //   box-shadow: inset 5px 0 0 @highlightAccent; */

  //   z-index: 0;

  //   pointer-events: none;

  //   line-height: inherit;
  //   white-space: pre;
  // }

  // `
}
