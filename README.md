<h1 align="center"> sifrr-elements </h1>
<p align="center">
  <a href="https://github.com/sifrr/sifrr-elements/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="GitHub license" /></a>
  <a href="https://circleci.com/gh/sifrr/sifrr-elements"><img alt="CircleCI" src="https://img.shields.io/circleci/project/github/sifrr/sifrr-elements/master.svg?logo=circleci&style=flat-square" /></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-elements?ref=badge_small" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-elements.svg?type=small"/></a>
  <a href="https://coveralls.io/github/sifrr/sifrr-elements?branch=master"><img src="https://img.shields.io/coveralls/github/sifrr/sifrr-elements.svg?style=flat-square" alt="Coverage Status" /></a>
</p>

[sifrr-dom](https://github.com/sifrr/sifrr/tree/master/packages/browser/sifrr-dom) elements

## List of Elements:

| Elements                                                | Description                                                                                        | Size                                                                                                                                                                                                                                  |                       Test                      |
| :------------------------------------------------------ | :------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------: |
| [sifrr-stater](./elements/sifrr-stater)                 | State manager for sifrr elements, save them to storage, replay state changes, travel to past state | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-elements/master/elements/sifrr-stater/dist/sifrrstater.min.js?compression=gzip&maxAge=60)](./elements/sifrr-stater/dist/sifrrstater.min.js)                               |                      [WIP]                      |
| [sifrr-tabs](./elements/sifrr-tabs)                     | Android like tabs in browser                                                                       | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-elements/master/elements/sifrr-tabs/dist/sifrrtabs.min.js?compression=gzip&maxAge=60)](./elements/sifrr-tabs/dist/sifrrtabs.js)                                           |                      [WIP]                      |
| [sifrr-lazy-picture](./elements/sifrr-lazy-picture)     | Lazy loading pictures only when in view                                                            | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-elements/master/elements/sifrr-lazy-picture/dist/sifrrlazypicture.min.js?compression=gzip&maxAge=60)](./elements/sifrr-lazy-picture/dist/sifrrlazypicture.min.js)         | [OK](./elements/sifrr-lazy-picture/test/public) |
| [sifrr-lazy-img](./elements/sifrr-lazy-img)             | Lazy loading images only when in view                                                              | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-elements/master/elements/sifrr-lazy-img/dist/sifrrlazyimg.min.js?compression=gzip&maxAge=60)](./elements/sifrr-lazy-img/dist/sifrrlazyimg.min.js)                         |   [OK](./elements/sifrr-lazy-img/test/public)   |
| [sifrr-progress-round](./elements/sifrr-progress-round) | Circular progress circle                                                                           | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-elements/master/elements/sifrr-progress-round/dist/sifrrprogressround.min.js?compression=gzip&maxAge=60)](./elements/sifrr-progress-round/dist/sifrrprogressround.min.js) |                      [WIP]                      |
| [sifrr-code-editor](./elements/sifrr-code-editor)       | Code editor with syntax highlighting using highlight.js                                            | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-elements/master/elements/sifrr-code-editor/dist/sifrrcodeeditor.min.js?compression=gzip&maxAge=60)](./elements/sifrr-code-editor/dist/sifrrcodeeditor.min.js)             |                      [WIP]                      |
| [sifrr-showcase](./elements/sifrr-showcase)             | Showcase sifrr-dom elements                                                                        | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr-elements/master/elements/sifrr-showcase/dist/sifrrshowcase.min.js?compression=gzip&maxAge=60)](./elements/sifrr-showcase/dist/sifrrshowcase.min.js)                       |                      [WIP]                      |

## View examples

Examples as showcase: <https://sifrr.github.io/sifrr-elements/showcase/> (only desktop friendly)

### Packages that have tests have a working example of that package in `test/public` folder

## Usage

### Using direct distribution file

#### Script tag

```html
<script src="https://unpkg.com/@sifrr/elements@{version}/elements/element-name/dist/elementname.min.js"></script>
// for v0.0.3, version = 0.0.3
```

#### Script Module tag

```html
<script src="https://unpkg.com/@sifrr/elements@{version}/elements/element-name/dist/elementname.min.js" type="module"></script>
// for v0.0.3, version = 0.0.3
```

#### Sifrr.Dom.load

```js
Sifrr.Dom.load('element-name', { url: "https://unpkg.com/@sifrr/elements@{version}/elements/element-name/dist/elementname.min.js" })
```

### NPM module

add `@sifrr/elements` package, `yarn add @sifrr/elements`

require/import needed elements

```js
const { SifrrLazyPicture } = require('@sifrr/elements');
//or
import { SifrrLazyPicture } from '@sifrr/elements';

// Register
// Elements are auto registering, so they will be registered when file is loaded
```

## License

sifrr-elements is [MIT Licensed](./LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-elements.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsifrr%2Fsifrr-elements?ref=badge_large)

(c) [@aadityataparia](https://github.com/aadityataparia)
