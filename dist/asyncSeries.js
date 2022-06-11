(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.asyncSeries = {}));
})(this, (function (exports) { 'use strict';

    /**
     * Asynchronously process a list of items, consecutively.
     *
     * @param Array array
     * @param Function(value, index, array) iteratee
     *
     * @return Promise resolve when done, reject on first error
     * @version 1.0.4
     */
    function forEach(array, iteratee) {
      var length = array.length;
      var index = -1;
      return Promise.resolve().then(function _proc() {
        ++index;

        if (index < length) {
          return Promise.resolve(iteratee.call(array, array[index], index, array)).then(_proc);
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
     * @version 1.0.4
     */

    function map(array, iteratee, firstValue) {
      var result = [];
      var length = array.length;
      var index = -1;
      return Promise.resolve(firstValue).then(function _proc(prevValue) {
        if (index >= 0) {
          result[index] = prevValue;
        }

        ++index;

        if (index < length) {
          return Promise.resolve(iteratee.call(array, array[index], index, array, prevValue)).then(_proc);
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
     * @version 1.0.4
     */

    function reduce(array, reducer, initialValue) {
      var length = array.length;
      var index = -1;

      if (arguments.length < 3) {
        initialValue = array[0];
        ++index;
      }

      return Promise.resolve(initialValue).then(function _proc(accumulator) {
        ++index;

        if (index < length) {
          return Promise.resolve(reducer.call(array, accumulator, array[index], index, array)).then(_proc);
        }

        return accumulator;
      });
    }

    exports.forEach = forEach;
    exports.map = map;
    exports.reduce = reduce;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=asyncSeries.js.map
