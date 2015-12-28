/**
 * @module kad-traverse
 */

'use strict';

var async = require('async');
var assert = require('assert');
var strategies = require('./lib/strategies');

/**
 * Returns a kad before:send `hook` ensuring that a connection can be opened
 * @function
 * @param {Object} options
 */
module.exports = function(options) {
  options = options || {};

  var strategyNames = Object.keys(strategies);
  var strategyFuncs = strategyNames.map(function(name) {
    return strategies[name](options[name] || {});
  });

  return function(buffer, contact, next) {
    var transport = this;

    function tryStrategy(strategy, callback) {
      strategy.call(transport, callback);
    }

    async.detectSeries(strategyFuncs, tryStrategy, function() {
      next();
    });
  };
};