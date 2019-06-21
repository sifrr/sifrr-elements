# sifrr-code-editor

Code editor in browser with easy customisations using CodeMirror.

### Usage

After loading `sifrr-code-editor` JS file as instructed in [main readme](../../README.md). Put this in your html file:

```html
<sifrr-code-editor lang="javascript"></sifrr-code-editor>
```

### Options

#### lang

`lang` attribute: language to use for highlighting syntax. Supported languages: All modes of codemirror - [list](https://github.com/codemirror/CodeMirror/tree/5.48.0/mode), eg. `html`, `css`, `javascript`, etc.

#### value

`value` attribute: changing value attribute changes value of the editor.

You can get value of editor by property: `element.value`
You can set value of editor by property: `element.value = 'new value'`

#### theme

`theme` attribute: codemirror theme to use for syntax highlighting. default: `dracula`

[supported themes](https://github.com/codemirror/CodeMirror/tree/5.48.0/theme)
