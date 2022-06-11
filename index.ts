type ItemType = any;
type ReturnType = any;
type IterateeFunction = (this: Array<ItemType>, value: ItemType, index: number, list: Array<ItemType>) => Promise<ReturnType> | ReturnType;
type MapIterateeFunction = (this: Array<ItemType>, value: ItemType, index: number, list: Array<ItemType>, prevValue: ReturnType) => Promise<ReturnType> | ReturnType;
type ReduceIterateeFunction = (this: Array<ItemType>, accumulator: ReturnType, value: ItemType, index: number, list: Array<ItemType>, prevValue: ReturnType) => Promise<ReturnType> | ReturnType;

/**
 * Asynchronously process a list of items, consecutively.
 *
 * @param Array array
 * @param Function(value, index, array) iteratee
 *
 * @return Promise resolve when done, reject on first error
 * @version 1.0.3
 */
export function forEach(array: Array<ItemType>, iteratee: IterateeFunction): Promise<void> {
    const { length } = array;
    let index = -1;

    return Promise.resolve()
        .then(function _proc() {
            ++index;
            if (index < length) {
                return Promise.resolve(iteratee.call(array, array[index], index, array))
                    .then(_proc)
                    ;
            }
        });
}

/**
 * Asynchronously map a list of items, consecutively.
 *
 * @param Array array
 * @param Function(value, index, array, prevValue) iteratee
 * @param any firstValue The `prevValue` of first call to iteratee
 *
 * @return Promise(array) array mapped, reject on first error
 * @version 1.0.3
 */
export function map(array: Array<ItemType>, iteratee: MapIterateeFunction, firstValue: ReturnType): Promise<Array<ReturnType>> {
    const result = [];
    const { length } = array;
    let index = -1;

    return Promise.resolve(firstValue)
        .then(function _proc(prevValue: ReturnType) {
            if (index >= 0) {
                result[index] = prevValue;
            }
            ++index;
            if (index < length) {
                return Promise.resolve(iteratee.call(array, array[index], index, array, prevValue))
                    .then(_proc)
                    ;
            }
            return result;
        });
}

/**
 * Asynchronously reduce a list of items, consecutively.
 *
 * @param Array array
 * @param Function(accumulator, currentValue, index, array) reducer
 * @param any initialValue
 *
 * @return Promise(any) resolve to the last returned value when done, reject on first error
 * @version 1.0.3
 */
export function reduce(array: Array<ItemType>, reducer: ReduceIterateeFunction, initialValue: ReturnType): Promise<ReturnType> {
    const { length } = array;
    let index = -1;
    if (arguments.length < 3) {
        initialValue = array[0];
        ++index;
    }

    return Promise.resolve(initialValue)
        .then(function _proc(accumulator: ReturnType) {
            ++index;
            if (index < length) {
                return Promise.resolve(reducer.call(array, accumulator, array[index], index, array))
                    .then(_proc)
                    ;
            }
            return accumulator;
        });
}
