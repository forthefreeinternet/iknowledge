/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

// dexpress modification
// var setPrototypeOf = require('setprototypeof')

/**
 * Initialization middleware, exposing the
 * request and response to each other, as well
 * as defaulting the X-Powered-By header field.
 *
 * @param {Function} app
 * @return {Function}
 * @api private
 */

exports.init = function(app){
  return function expressInit(req, res, next){
    if (app.enabled('x-powered-by')) {
      res.setHeader('X-Powered-By', 'Express');
    }
    
    req.res = res;
    res.req = req;
    req.next = next;

    // dexpress modification
    res.set('Response-ID', req.get('Request-ID'))
    // setPrototypeOf(req, app.request)
    Object.assign(req, app.request);
    //setPrototypeOf(res, app.response)
    Object.assign(res, app.response);

    res.locals = res.locals || Object.create(null);

    next();
  };
};

