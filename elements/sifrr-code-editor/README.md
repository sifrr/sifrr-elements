# sifrr-lazy-img

### Usage

After loading `sifrr-code-editor` JS file as instructed in [main readme](../../README.md). Put this in your html file:

```html
<sifrr-code-editor lang="html"></sifrr-code-editor>
```

### Options

#### lang

`lang` attribute: language to use for highlighting syntax. Supported languages: html, js, css, default: html

#### value

`value` attribute: changing value attribute changes value to the editor.

You can get value of editor by property also: `element.value`

#### theme

`theme` attribute: highlight.js theme to use for syntax highlighting. default: atom-dark-one

[supported themes](https://github.com/highlightjs/highlight.js/tree/9.15.6/src/styles)
