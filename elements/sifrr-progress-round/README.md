# sifrr-progress-round

### Usage

After loading JS file as instructed in [main readme](../../README.md). Put this in your html file:

```html
<sifrr-progress-round progress="47"></sifrr-progress-round>
```

This will render a instagram-like progres round with 47% completion. You need to set width, height with css to fit it as you need.

#### Stroke Theme

It always has translucent background.
You can change progress `stroke` color and `stroke-width` with attribute.

#### Programmatic API

Change using state:

```js
el.state = {
  progress: 34, // default 0
  stroke: '#000', // default #fff
  'stroke-width': 3 // default 2 (between 0-4)
}
```
