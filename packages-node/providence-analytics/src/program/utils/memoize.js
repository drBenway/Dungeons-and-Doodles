const { InputDataService } = require('../services/InputDataService.js');

/**
 * @param {function} func
 * @param {{}} externalStorage
 */
function memoize(func, externalStorage) {
  const storage = externalStorage || {};
  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    // Allow disabling of cache for testing purposes
    // @ts-ignore
    if (!InputDataService.cacheDisabled && args in storage) {
      // @ts-ignore
      return storage[args];
    }
    // @ts-ignore
    const outcome = func.apply(this, args);
    // @ts-ignore
    storage[args] = outcome;
    return outcome;
  };
}

/**
 * @param {function} func
 * @param {{}} externalStorage
 */
function memoizeAsync(func, externalStorage) {
  const storage = externalStorage || {};
  // eslint-disable-next-line func-names
  return async function () {
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    // Allow disabling of cache for testing purposes
    // @ts-ignore
    if (!InputDataService.cacheDisabled && args in storage) {
      // @ts-ignore
      return storage[args];
    }
    // @ts-ignore
    const outcome = await func.apply(this, args);
    // @ts-ignore
    storage[args] = outcome;
    return outcome;
  };
}

module.exports = {
  memoize,
  memoizeAsync,
};
