# PostCSS Extract BEMClasses [![Build Status][ci-img]][ci]

[PostCSS] This plugin extaract CSS classes from file and create JSON file where write all unique classes with unique identificators

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/Silvestr-b/postcss-extract-bemclasses.svg
[ci]:      https://travis-ci.org/Silvestr-b/postcss-extract-bemclasses


## Usage

```js
const plugin = require('postcss-extract-bemclasses').default;
const options = {
	output: 'path/to/file.json' // it`s optional
}

postcss([ plugin(options) ])
```

See [PostCSS] docs for examples for your environment.
