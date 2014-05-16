# grw

> A stream wrapper github-releases module [link](https://github.com/atom/node-github-releases).

## Getting Started

Install via `npm`

```shell
   npm i grw
```

## Usage

```Javascript
var grw = require('grw');

grw({
    repo: 'xeodou/grw',
    version: 'v0.0.1',
    prefix: 'grw-{version}-beta',
    ext: 'zip'
}).pipe(dist);
```

grw is a readable and writeable stream object.

## Test

Use `gulp mocha` to test the module.




## License

MIT
