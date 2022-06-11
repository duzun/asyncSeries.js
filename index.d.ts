declare type ItemType = any;
declare type ReturnType = any;
declare type IterateeFunction = (this: Array<ItemType>, value: ItemType, index: number, list: Array<ItemType>) => Promise<ReturnType> | ReturnType;
declare type MapIterateeFunction = (this: Array<ItemType>, value: ItemType, index: number, list: Array<ItemType>, prevValue: ReturnType) => Promise<ReturnType> | ReturnType;
declare type ReduceIterateeFunction = (this: Array<ItemType>, accumulator: ReturnType, value: ItemType, index: number, list: Array<ItemType>, prevValue: ReturnType) => Promise<ReturnType> | ReturnType;
/**
 * Asynchronously process a list of items, consecutively.
 *
 * @param Array array
 * @param Function(value, index, array) iteratee
 *
 * @return Promise resolve when done, reject on first error
 * @version 1.0.4
 */
export declare function forEach(array: Array<ItemType>, iteratee: IterateeFunction): Promise<void>;
/**
 * Asynchronously map a list of items, consecutively.
 *
 * @param Array array
 * @param Function(value, index, array, prevValue) iteratee
 * @param any firstValue The `prevValue` of first call to iteratee
 *
 * @return Promise(array) array mapped, reject on first error
 * @version 1.0.4
 */
export declare function map(array: Array<ItemType>, iteratee: MapIterateeFunction, firstValue: ReturnType): Promise<Array<ReturnType>>;
/**
 * Asynchronously reduce a list of items, consecutively.
 *
 * @param Array array
 * @param Function(accumulator, currentValue, index, array) reducer
 * @param any initialValue
 *
 * @return Promise(any) resolve to the last returned value when done, reject on first error
 * @version 1.0.4
 */
export declare function reduce(array: Array<ItemType>, reducer: ReduceIterateeFunction, initialValue: ReturnType): Promise<ReturnType>;
export {};
