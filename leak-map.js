/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true globalstrict: true
         latedef: false */

'use strict';

console.warn('You are using `leak-map` module which provides imperfect shim ' +
             'for JS WeakMaps. You are adviced to use `--harmony_weakmaps` ' +
             'flag with nodejs to enable real WeakMaps instead!')

var unbind = Function.call.bind(Function.bind, Function.call)
var owns = unbind(Object.prototype.hasOwnProperty)
var define = Object.defineProperties

function LeakMap() {
  if (!(this instanceof LeakMap)) return new LeakMap
}
define(LeakMap.prototype, {
  privates: { value: function(object) {
    var privates = object.valueOf(this)
    return privates !== object && owns(object, 'valueOf') && privates
  }},
  patch: { value: function(object, privates) {
    var access = this, delegate = object.valueOf
    define(object, {
      valueOf: { configurable: true, value: function(auth) {
        return auth === access ? privates : delegate.apply(this, arguments)
      }}
    })
  }},
  has: { value: function has(object) {
    return !!this.privates(object)
  }},
  get: { value: function(object, fallback) {
    var privates = this.privates(object)
    return privates && privates.value !== object ?
      privates.value :
      fallback
  }},
  set: { value: function(key, value) {
    var privates = this.privates(key)
    if (privates) privates.value = value
    else this.patch(key, { value: value })
  }},
  delete: { value: function(key) {
    var privates = this.privates(key)
    if (privates) privates.value = key
    return !!privates
  }}
})

exports.LeakMap = LeakMap
