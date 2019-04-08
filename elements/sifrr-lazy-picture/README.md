# sifrr-lazy-picture

### Usage

After loading JS file as instructed in [main readme](../../README.md). Put this in your html file:

```html
<picture is="sifrr-lazy-picture">
  <img data-src="source/to/use.jpg"> <!-- Use data-src instead of src -->
  <source media="(min-width: 800px)" data-srcset="other/source.png"> <!-- Use data-srcset instead of src -->
</picture>
```

When picture is `200px` below viewport, they will be loaded.
