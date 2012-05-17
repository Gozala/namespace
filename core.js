/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true globalstrict: true
         latedef: false */

'use strict';

var create = Object.create
var prototypeOf = Object.getPrototypeOf

// Use `WeakMap` if available otherwise fallback to `LeakMap`.
var Map = typeof(WeakMap) === 'undefined' ?
  require('./leak-map').LeakMap :
  WeakMap

function ns() {
  /**
  Returns a new namespace, function that may can be used to access an
  namespaced object of the argument argument. Namespaced object are associated
  with owner objects via weak references. Namespaced objects inherit from the
  owners ancestor namespaced object. If owner's ancestor is `null` then
  namespaced object inherits from given `prototype`. Namespaces can be used
  to define internal APIs that can be shared via enclosing `namespace` function.

  # Examples

  var internals = ns()
  internals(myObject).secret = secret
  **/
  var map = new Map()
  return function namespace(target) {
    // If `target` is not an object return `target` itself.
    if (!target)
      return target
    if (!map.has(target))
      map.set(target, create(namespace(prototypeOf(target) || null)))

    return map.get(target)
  }
}
exports.ns = ns
