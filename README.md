# Notes

- Monaco version needs to be the same as for [monaco-loader](https://github.com/suren-atoyan/monaco-loader/blob/master/package.json). Currently `0.21.2`.

# Patches

- `has-symbols`: https://github.com/inspect-js/has-symbols/issues/4

# Resolutions

- `@types/react` + `@types/react-dom`: Because some package is using another React version which causes build-time type errors for `packages/plugin`
