# namespace

[![Build Status](https://secure.travis-ci.org/Gozala/namespace.png)](http://travis-ci.org/Gozala/namespace)

Library provides an API for creating sets of namespaced properties for any
given objects (frozen or not). This effectively may be used for creating
fields that are not part of object's public API, which is useful for hiding
internal details or for adding fields to an existing objects (Built-ins or not)
without mutating them and there for any risks of naming conflicts.


## Usage

It is recommended to use this library with enabled `WeakMap`s. On node that
simply means running it with additional flag: `node --harmony_weakmaps`. If
weak maps are not available library will fallback to using imperfect weak map
shim.

```js
var ns = require('namespace/core').ns
var internals = ns()

internals(publicAPI).secret = secret
```

Namespace may be used with multiple objects:

```js
var observable = ns()

function Observable() {
  observable(this).observers = []
}
Observable.prototype.observe = function(observer) {
  observable(this).observers.push(observer)
}
```

Also, multiple namespaces can be used with a same object without any conflicts.

```js
var pending = ns()

function Eventual() {
  Observable.call(this)
  pending(this).realized = false
}
Eventual.prototype = Object.create(Observable.prototype)
Eventual.prototype.realize = function realize(value) {
  if (!pending(this).realized) {
    obesrvable(this).observers.splice.forEach(function(observer) {
      observer(value)
    })
  }
}
```

Access to the namespaced properties can be shared with other code by simple
handing a namespace function. Although doing this across modules is not
recommended, for example instead of sharing `pending` namespace one could share
following function instead:

```js
exports.isRealized = function isRealized(value) {
  return pending(value).realized
}
```

Namespaced objects create parallel inheritance chain, or more simply:

```js
var foo = ns()
var ancestor = {}

foo(ancestor) === foo(Object.create(ancestor)) // => true
```

Namespaces are simply a sugar on top of ES.next [WeakMaps][] allowing you to
associate sets of namespaced properties to an object via weak references.

## Install

    npm install namespace

[WeakMaps]:http://wiki.ecmascript.org/doku.php?id=harmony:weak_maps
