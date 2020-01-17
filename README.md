# asyncSeries.js [![Build Status](https://travis-ci.org/duzun/asyncSeries.js.svg?branch=master)](https://travis-ci.org/duzun/asyncSeries.js) [![codecov](https://codecov.io/gh/duzun/asyncSeries.js/branch/master/graph/badge.svg)](https://codecov.io/gh/duzun/asyncSeries.js)

Asynchronously process a list of items consecutively.

Even though the processing is asynchronous, it is never done in parallel.

### forEach(array, iteratee)
##### Where `[async ]iteratee(value, index, array)`

Process file contents of a directory, asynchronously & consecutively.

```js
const fs = require('mz/fs');
const { forEach: serialEach } = require('async-series');

(async () => {
    let files = await fs.readdir('.');
    let results = await serialMap(files, async (filename, idx) => {
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
const { map: serialMap } = require('async-series');

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
const { reduce: serialReduce } = require('async-series');

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
