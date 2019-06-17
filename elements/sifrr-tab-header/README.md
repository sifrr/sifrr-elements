# sifrr-tab-header

-   Load sifrr-tab-header element in your sifrr webapp
-   Add tag to HTML

```html
<sifrr-tab-header options="<JSON String>">
  <span>
    Heading 1
  </span>
  <span>
    Heading 2
  </span>
</sifrr-tab-header>
<!-- optional cantainer -->
<sifrr-tab-container>
  <div>
    Tab 1
  </div>
  <div>
    Tab 2
  </div>
</sifrr-tab-container>
```

## Features

- Shows underline under active heading
- Opacity is 0.8 for inactive headings
- Scrolls active heading into center automatically
- Syncs with container if given as option

## Options

```js
// Default options
{
  showUnderline: true, // show underline or not
  container: null // sync a container
}
```

## API

```js
const header = document.querySelector('sifrr-tab-header');
```

### set active tab

```js
header.active = 2;
```

### sync container

```js
header.refresh({ container: document.querySelector('sifrr-tab-container') })
```
