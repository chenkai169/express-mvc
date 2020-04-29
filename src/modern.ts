import co = require('co');
import express = require("express");

const isGeneratorFunction = (f: any) =>
  typeof f === 'function' &&
  f.constructor.name === 'GeneratorFunction';

const hasCatch = (p: any) =>
  typeof p === 'object' &&
  p.catch &&
  typeof p.catch === 'function';

const slice = [].slice;

/**
 * modern
 *
 * 1. normal fn
 * 2. async function
 * 3. generator function
 */

export default function (fn: any) {
  const len = fn.length;

  // generator function
  if (isGeneratorFunction(fn)) fn = co.wrap(fn);

  if (len === 4) {
    return function (err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
      // normal case
      if (typeof next === 'function') {
        return run.call(this, next, slice.call(arguments));
      };

      // router.params('user', (req, res, next, user)=>{ ... })
      if (typeof res === 'function') {
        let _next = res;
        return run.call(this, _next, slice.call(arguments));
      }

      throw new TypeError('unsupported arguments type');
    };
  } else {
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
      run.call(this, next, slice.call(arguments));
    };
  }

  function run(next: express.NextFunction, args: any[]) {
    try {
      const ret = fn.apply(this, args);
      if (hasCatch(ret)) ret.catch(next);
    } catch (e) {
      next(e);
    }
  }
};
