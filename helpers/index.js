"use strict"
/**
 * @format
 * @description Server response object
 * @param {any} data
 * @param {boolean} status
 * @param {Error} error
 * @returns
 */

const jwt = require('jwtwebtoken');

module.exports.responseObject = (data, status, error = null) => ({
  data,
  status,
  error,
});

module.exports.generateAccessToken = (accessObject, options = {
  expiresIn: '1800s'
}) => {
  return jwt.sign(accessObject, process.env.TOKEN_SECRET, options);
}


