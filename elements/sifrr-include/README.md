# sifrr-include

### Usage

After loading `sifrr-include` JS file as instructed in [main readme](../../README.md). Put this in your html file:

```html
<sifrr-include type="html" url="url"></sifrr-include>
```

### Options

#### type

`type` attribute: type of file html, js or css. default: html

#### url

url of file to include

#### example

./example.html

```html
<p>Example</p>
```

then

```html
<sifrr-include type="html" url="./example.html"></sifrr-include>
```

will render

```html
<sifrr-include type="html" url="./example.html">
  <p>Example</p>
</sifrr-include>
```
