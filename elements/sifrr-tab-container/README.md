# sifrr-tab-container

-   Load sifrr-tab-container element in your sifrr webapp
-   Add tag to HTML

```html
<sifrr-tab-container options="<JSON String>">
  <div slot='tab'>
    Tab 1
  </div>
  <div slot='tab'>
    Tab 2
  </div>
</sifrr-tab-container>
```

## Options

```js
// Default options
{
  num: 1, // number of tabs in view at once
  animation: 'ease', // type of animation for tabs changing
  animationTime: 300, // time in ms for animation
  scrollBreakpoint: 0.3 // breakpoint for scroll, when tab should be changed
}
```

## API

```js
const tabs = document.querySelector('sifrr-tab-container');
```

### Next tab

```js
tabs.next();
```

### previous tab

```js
tabs.prev();
```

### Jump n tabs

```js
tabs.active += 2;
tabs.active += tabs.options.num;
```

### Jump to tab 1

```js
tabs.active = 0; // tabs index start from 0
```

### Check if there are tabs after active tab
```js
tabs.hasNext();
```

### Check if there are tabs before active tab
```js
tabs.hasPrev();
```

### On scroll event
```js
tabs.onScrollPercent = (percent) => {
  // percent = scroll left position / width of 1 tab
};
```
