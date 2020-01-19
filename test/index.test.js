/*globals require,describe,it*/

const {
    forEach: eachSeries,
    map: mapSeries,
    reduce: reduceSeries,
} = require('..');

require('chai').should();

const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

describe(`forEach(array, iteratee)`, () => {
    it(`should process the list with a synchronous callback asynchronously`, () => {
        let a = [1,2,3,4,5];
        let n = a.length;
        let prom = eachSeries(a, (val, idx) => {
            val.should.equal(a[idx]);
            n--;
        })
        .then(() => {
            n.should.equal(0);
        });

        n.should.equal(5);

        return prom;
    });

    it(`should process the list in order`, async () => {
        let a = [1,2,3,4,5];
        let n = a.length;
        let order1 = [];
        let order2 = [];
        await eachSeries(a, async (val, idx) => {
            val.should.equal(a[idx]);
            n--;
            order1.push(idx);
            await wait(12 - idx*2);
            order2.push(idx);
        });
        order1.join(',').should.equal('0,1,2,3,4');
        order2.join(',').should.equal('0,1,2,3,4');
        n.should.equal(0);
    });
});

describe(`map`, () => {
    describe(`(array, syncFn)`, () => {
        it(`should process the list with a synchronous callback asynchronously`, () => {
            let a = [1,2,3,4,5];
            let n = a.length;
            let prom = mapSeries(a, (val, idx) => {
                val.should.equal(a[idx]);
                n--;
                return val * 2;
            })
            .then((list) => {
                list.join(',').should.equal('2,4,6,8,10');
                n.should.equal(0);
            });

            n.should.equal(5);

            return prom;
        });
    });

    describe(`(array, asyncFn)`, () => {
        it(`should map the list in order`, async () => {
            let a = [1,2,3,4,5];
            let n = a.length;
            let order = [];
            let list = await mapSeries(a, async (val, idx) => {
                val.should.equal(a[idx]);
                n--;
                await wait(12 - idx*2);
                order.push(idx);
                return val * 2;
            });

            // The mapped array
            list.join(',').should.equal('2,4,6,8,10');

            // The order
            order.join(',').should.equal('0,1,2,3,4');

            // Should have processed all elements
            n.should.equal(0);
        });

    });
});

describe(`reduce`, () => {
    let array = [5,4,3,2,1];
    describe(`(array, reducer)`, () => {
        it(`should do nothing for an empty array, but return a promise`, () => {
            let prom = reduceSeries([], () => {
                'called'.should.equal('never');
            });
            (typeof prom.then).should.equal('function');

            return prom.then((res) => {
                true.should.equal(undefined === res);
            });
        });

        it(`should do nothing for one element array, but return a Promise(array[0])`, () => {
            let array = ['one']
            let prom = reduceSeries(array, () => {
                'called'.should.equal('never');
            });
            (typeof prom.then).should.equal('function');

            return prom.then((res) => {
                res.should.equal(array[0]);
            });
        });

        it(`should reduce the array`, async () => {

            let sum = await reduceSeries(array, (acc, val) => acc + val);
            sum.should.equal(15);

            let fac = await reduceSeries(array, async (acc, val) => acc * val);
            fac.should.equal(120);
        });

        it(`should reduce the list in order`, async () => {
            let order1 = [];
            let order2 = [];
            let sum = await reduceSeries(array, async (acc, val, idx) => {
                order1.push(idx);
                await wait(12 - idx*2);
                order2.push(idx);
                return acc + val;
            });
            sum.should.equal(15);

            order1.join(',').should.equal('1,2,3,4');
            order2.join(',').should.equal('1,2,3,4');
        });
    });

    describe(`(array, reducer, initialValue)`, () => {
      it(`should reduce the array`, async () => {
            let sum = await reduceSeries(array, async (acc, val) => acc + val, 10);
            sum.should.equal(25);

            let fac = await reduceSeries(array, (acc, val) => acc * val, 1/120);
            fac.should.equal(1);
        });

        it(`should reduce the list in order`, async () => {
            let order1 = [];
            let order2 = [];
            let sum = await reduceSeries(array, async (acc, val, idx) => {
                order1.push(idx);
                await wait(12 - idx*2);
                order2.push(idx);
                return acc + val;
            }, 0);
            sum.should.equal(15);

            order1.join(',').should.equal('0,1,2,3,4');
            order2.join(',').should.equal('0,1,2,3,4');
        });

    });
});
