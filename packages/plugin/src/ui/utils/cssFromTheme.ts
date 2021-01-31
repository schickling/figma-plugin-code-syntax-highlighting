export type ThemeOptions = {
  fontSize: number
  textShadow: string
  fontFamily: string
  lineHeight: number
  tabSize: number
  // paddingTop: 1em;
}

export type ThemeColors = {
  background: string
  base: string

  comment: string
  punctuation?: string
  property: string
  number?: string // custom
  string?: string // custom
  selector: string
  definition: string // custom
  operator: string
  // operatorBg: string
  variable: string
  function?: string
  keyword: string
  // selected: string

  // inlineCode: #DB4C69;
  // inlineCodeBackground: #F9F2F4;

  // highlightBackground: #F7EBC6;
  // highlightAccent: #F7D87C;
}

export const cssFromTheme = ({
  themeColors,
  options,
}: {
  themeColors: ThemeColors
  options: ThemeOptions
}): string => {
  // TODO https://github.com/evanw/esbuild/issues/715
  // themeColors.number ??= themeColors.property
  themeColors.string ??= themeColors.property
  // themeColors.function ??= themeColors.keyword
  // themeColors.punctuation ??= themeColors.variable
  themeColors.number = themeColors.number ?? themeColors.property
  themeColors.string = themeColors.string ?? themeColors.property
  themeColors.function = themeColors.function ?? themeColors.keyword
  themeColors.punctuation = themeColors.punctuation ?? themeColors.variable

  return /*css*/ `\
/*********************************************************
* General
*/

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

/* code[class*="language-"]::selection {
  text-shadow: none;
  background: $//{themeColors.selected};
} */

/* Blocks */
pre[class*="language-"] {
  padding: 1em;
  margin: .5em 0;
  overflow: auto;

  background: ${themeColors.background};
}

/* Inline code */
/*
:not(pre) > code[class*="language-"] {
  padding: .1em .3em;
  border-radius: .3em;
  color: @inlineCode;
  background: @inlineCodeBackground;
}
*/

/*********************************************************
* Tokens
*/

.namespace {
  opacity: .7;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: ${themeColors.comment};
}

.token.punctuation {
  color: ${themeColors.punctuation};
}

.token.number {
  color: ${themeColors.property};
}

.token.string {
  color: ${themeColors.string};
}

.token.property,
.token.tag,
.token.boolean,
.token.constant,
.token.symbol,
.token.deleted {
  color: ${themeColors.property};
}

.token.selector,
.token.attr-name,
.token.char,
.token.builtin,
.token.inserted {
  color: ${themeColors.selector};
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: ${themeColors.operator};
  /* background: $//{themeColors.operatorBg}; */
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: ${themeColors.keyword};
}

.token.function {
  color: ${themeColors.function};
}

.token.variable {
  color: ${themeColors.variable};
}

.token.regex,
.token.important {
  color: ${themeColors.definition};
}

.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}

/*********************************************************
* Line highlighting
*/

pre[data-line] {
  position: relative;
}

pre[class*="language-"] > code[class*="language-"] {
  position: relative;
  z-index: 1;
}

.line-highlight {
  position: absolute;
  left: 0;
  right: 0;
  padding: inherit 0;
  /* margin-top: @paddingTop; */

  /* background: @highlightBackground;
  box-shadow: inset 5px 0 0 @highlightAccent; */

  z-index: 0;

  pointer-events: none;

  line-height: inherit;
  white-space: pre;
}

`
}
