# `@tatumcreative/get`

[![build status][travis-image]][travis-url]

[travis-image]: https://img.shields.io/travis/TatumCreative/npm-get/master.svg?style=flat-square
[travis-url]: http://travis-ci.org/TatumCreative/npm-get

A collection of zero-config `get` functions for fetching things on the internet.

# getText(url) => Promise(text)

Load the text, returns a Promise that resolves to the text. The error is the
failing XMLHttpRequest object.

```js
getText("/foo.txt").then(
  (text) => console.log('Here is the text', text),
  (error) => console.error('There was an error', error),
)
```

# getJSON(url) => Promise(json)

Load some JSON, returns a Promise that resolves to the parsed JSON object. The
error is either the failing XMLHttpRequest object, or a SyntaxError if the JSON
failed to parse.

```js
getJSON("/foo.json").then(
  (json) => console.log('Here is the JSON object', json),
  (error) => console.error('There was an error', error),
)
```

# getImage(url) => Promise(imageElement)

Load an HTMLImageElement. It only resolves after the image is fully downloaded.

```js
getImage("/foo.png").then(
  (imageElement) => document.body.append(imageElement),
  (error) => console.error('There was an error', error),
)
```

# getImageData(url) => Promise({data, width, height})

Load an image and get an [ImageData](ImageData) object `{data, width, height}`.
The data property is a [Uint8ClampedArray](Uint8ClampedArray) that is an array
with values 0-255.

[ImageData]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
[Uint8ClampedArray]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray

```js
getImageData("/foo.png").then(
  ({data, width, height}) => console.log('The first pixel is', data.slice(0,4)),
  (error) => console.error('There was an error', error),
)
```

# Example with parameters

These functions don't care about fancy parameters, but it's trivial to do with
the [query-string](query-string) package.

[query-string](https://www.npmjs.com/package/query-string)

```js
const { getText } = require('@tatumcreative/get')
const { stringify } = require("query-string")

getText("/foo?" + stringify({
  bar: 'a',
  baz: 'b',
}))
```
