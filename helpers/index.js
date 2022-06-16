/**
 * @format
 * @description Server response object
 * @param {any} data
 * @param {boolean} status
 * @param {Error} error
 * @returns
 */

module.exports.responseObject = (data, status, error = null) => ({
  data,
  status,
  error,
});
