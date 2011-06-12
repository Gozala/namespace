/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint undef: true es5: true node: true devel: true
         forin: true latedef: false supernew: true */
/*global define: true */

(typeof define !== "function" ? function($){ $(require, exports, module); } : define)(function(require, exports, module, undefined) {

"use strict";

var Namespace = require("../namespace").Namespace;

exports["test namsepace basics"] = function(assert) {
  var privates = new Namespace;
  var object = { foo: function foo() { return "hello foo"; } };

  assert.ok(!Namespace.hasNamespace(object, privates),
            "has no `privates` namespace");
  assert.notEqual(privates(object), object,
                  "namespaced object is not the same");
  assert.equal(Object.getPrototypeOf(privates(object)), object,
               "namespace inherits form the tagret object");
  assert.equal(privates(object).valueOf(), object,
               "original object is accessible by `valueOf()`");
  assert.equal(privates(privates(object)), privates(object),
               "namespacing namespaced object has no effect");
  assert.equal(privates(object).foo, object.foo,
               "public properties are shared with namespace");
  assert.equal(privates(object).foo(), object.foo(),
               "shared properties behave same");

  assert.equal(privates(object), privates(object),
               "same namespaced object is returned on each call");
};

exports["test namespace overlays"] = function(assert) {
  var _ = new Namespace;
  var object = { foo: 'foo' };
  
  assert.equal(_(object).foo, object.foo,
               "namespaced property value matches non-namespaced one");

  _(object).foo = 'bar';

  assert.equal(_(object).foo, "bar",
               "namespaced property `foo` changed value");
  assert.equal(object.foo, "foo",
               "non-namespaced property `foo` has original value");

  object.foo = "baz";
  assert.equal(_(object).foo, "bar",
               "property changes do not affect overlaying namsepace");

  object.bar = "foo";
  assert.equal(_(object).bar, object.bar,
               "property changes are reflected if they are not overlayed");
};

exports["test shared namespaces"] = function(assert) {
  var _ = new Namespace({
    hello: function hello() {
      return 'hello world';
    }
  });

  var f1 = { hello: 1 };
  var f2 = { foo: 'foo' };

  assert.equal(_(f1).hello, _(f2).hello, "namespace can be shared");
  assert.notEqual(f1.hello, _(f1).hello, "shared namespace can overlay");
  assert.notEqual(f2.hello, _(f2).hello, "target is not affected");
  
  _(f1).hello = 2;

  assert.notEqual(_(f1).hello, _(f2).hello,
                  "namespaced property can be overided");
  assert.equal(_(f2).hello, _({}).hello, "namespace does not change");
};

exports["test mixed namespaces"] = function(assert) {
  var n1 = new Namespace({ foo: 'foo', conflict: 1 });
  var n2 = new Namespace({ bar: 'bar', conflict: 2 });
  var object = { baz: 1 };

  assert.ok(Namespace.hasNamespace(n1(object), n1),
            "n1 has n1 namespace");
  assert.ok(!Namespace.hasNamespace(n1(object), n2),
            "n1 does not has n2 namespace");

  assert.ok(Namespace.hasNamespace(n1(n2(object)), n1),
            "n1*n2 has n1 namespace");
  assert.ok(Namespace.hasNamespace(n1(n2(object)), n2),
            "n1*n2 has n2 namespace");
  assert.ok(Namespace.hasNamespace(n2(n1(object)), n1),
            "n2*n1 has n1 namespace");
  assert.ok(Namespace.hasNamespace(n2(n1(object)), n2),
            "n2*n1 has n2 namespace");

  assert.equal(n1(object).foo, n1(n2(object)).foo,
               "namespaced namespaces are possible");
  assert.equal(n1(object), n1(n2(object)),
                  "double namespaced object is different");
  assert.notEqual(n1(object), n2(n1(object)),
                  "double namespaced object is different");
  assert.notEqual(n2(object), n1(n2(object)),
                  "double namespaced object is different");
  assert.equal(n2(object), n2(n1(object)),
                  "double namespaced object is different");
  assert.notEqual(n2(n1(object)), n1(n2(object)),
                  "double namespaced object is different");

  assert.equal(n1(n2(object)), n1(n2(object)),
               "double namespaced object is cached");
  assert.equal(n1(n2(object)).foo, n1(object).foo,
               "double namespaced object property `foo` has correct value");
  assert.equal(n2(n1(object)).bar, n2(object).bar,
               "double namespaced object property `bar` has correct value");
  assert.equal(n2(n1(object)).valueOf(), n1(n2(object)).valueOf(),
               "double namespaced objects `valueOf()` is target object");
};

if (module == require.main)
  require("test").run(exports);

});
