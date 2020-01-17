const fs = require('mz/fs');
const { /* forEach: serialEach,  */map: serialMap, reduce: serialReduce } = require('..');

// Process file contents of a directory, asynchronously & consecutively
(async () => {
    let files = await fs.readdir('.');
    console.log('files: ', files);
    let contents = await serialMap(files, async (filename, idx) => {
        if((await fs.stat(filename)).isDirectory()) return;
        return fs.readFile(filename, 'utf8');
    });
    contents = contents.filter((x) => x);

    console.log('char counts: ', contents.map((cnt) => cnt.length));
})();


// Calculate file sizes in a directory, asynchronously & consecutively
(async () => {
    let files = await fs.readdir('.');
    let size = await serialReduce(files, async (size, filename, idx) => {
        let stats = await fs.stat(filename);
        if(stats.isDirectory()) return size;
        return size + stats.size;
    }, 0);

    console.log('size: ', size);
})();
