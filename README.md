# asyncSeries.js [![Build Status](https://travis-ci.org/duzun/asyncSeries.js.svg?branch=master)](https://travis-ci.org/duzun/asyncSeries.js) [![codecov](https://codecov.io/gh/duzun/asyncSeries.js/branch/master/graph/badge.svg)](https://codecov.io/gh/duzun/asyncSeries.js)

Asynchronously process a list of items consecutively.

Even though the processing is asynchronous, it is never done in parallel.

## Install

```sh
npm i -S @duzun/async-series
```

## Import or require?

This library can be included either as an ESM or UMD.

#### ESM

```js
import {
    forEach as serialEach,
    map     as serialMap,
    reduce  as serialReduce
} from '@duzun/async-series';
```

#### CommonJS

```js
const {
    forEach: serialEach,
    map    : serialMap,
    reduce : serialReduce,
} = require('@duzun/async-series');
```

#### AMD

```js
require('https://unpkg.com/@duzun/async-series', (asyncSeries) => {
    const {
        forEach: serialEach,
        map    : serialMap,
        reduce : serialReduce,
    } = asyncSeries;

    // ...
});
```

#### Browser

```html
<script src="https://unpkg.com/@duzun/async-series"></script>
```

## Usage by example

### forEach(array, iteratee)
##### Where `[async ]iteratee(value, index, array)`

Process file contents of a directory, asynchronously & consecutively.

```js
const fs = require('mz/fs');
const { forEach: serialEach } = require('@duzun/async-series');

(async () => {
    let files = await fs.readdir('.');
    let results = await serialEach(files, async (filename, idx) => {
        if((await fs.stat(filename)).isDirectory()) return;
        let contents = await fs.readFile(filename);

        // Do some heavy processing here...
    });
})();
```

### map(array, iteratee[, firstValue])
##### Where `[async ]iteratee(value, index, array)`

Get file contents of a directory, asynchronously & consecutively;

```js
const fs = require('mz/fs');
const { map: serialMap } = require('@duzun/async-series');

(async () => {
    let files = await fs.readdir('.');
    let contents = await serialMap(files, async (filename, idx) => {
        if((await fs.stat(filename)).isDirectory()) return;
        return fs.readFile(filename, 'utf8');
    });
    contents = contents.filter((x) => x);
})();
```

### reduce(array, reducer[, initialValue])
##### Where `[async ]reducer(accumulator, currentValue, index, array)`

Calculate file sizes in a directory, asynchronously & consecutively.

```js
const fs = require('mz/fs');
const { reduce: serialReduce } = require('@duzun/async-series');

(async () => {
    let files = await fs.readdir('.');
    let size = await serialReduce(files, async (size, filename, idx) => {
        let stats = await fs.stat(filename);
        if(stats.isDirectory()) return size;
        return size + stats.size;
    }, 0);

    console.log('size: ', size);
})();

```

## Why?

Why not? :)

I know, there is a great library [Async.js](https://caolan.github.io/async/), which already has [eachSeries](https://caolan.github.io/async/v3/docs.html#eachSeries), [mapSeries](https://caolan.github.io/async/v3/docs.html#mapSeries) and [reduce](https://caolan.github.io/async/v3/docs.html#reduce) and many other functions.

This library is **< 900 bytes** minified, and **< 500 bytes** when also gzipped.

And if you include it with [rollup.js](https://rollupjs.org/), you only get the function you've imported.
