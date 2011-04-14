/* vim:set ts=2 sw=2 sts=2 et: */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is namespace library.
 *
 * The Initial Developer of the Original Code is the Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Irakli Gozalishvili <rfobic@gmail.com> (Original Author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

(typeof define !== "function" ? function($){ $(require, exports, module); } : define)(function(require, exports, module, undefined) {

"use strict";

function getOwnPropertyDescriptors(object) {
  var descriptors = {};
  Object.getOwnPropertyNames(object).forEach(function(name) {
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  });
  return descriptors;
}

/**
 * Function creates a new namespace. Optionally object `properties` may be
 * passed which will be defined under the given namespace.
 */
function Namespace(prototype) {
  // Creating a `namespace` function that may be called on any object to return
  // a version with a properties in the given namespace.
  function namespace(object) {
    return hasNamespace(object, namespace) ? object.valueOf(namespace) :
           defineNamespace(object, namespace);
  }
  namespace.prototype = prototype || namespace.prototype;
  return namespace;
}
exports.Namespace = Namespace;

/**
 * Returns `true` if given object has a given `namespace`.
 */
function hasNamespace(object, namespace) {
  return object.valueOf(namespace).namespace === namespace
}
exports.hasNamespace = Namespace.hasNamespace = hasNamespace;

/**
 *
 */
function defineNamespace(object, namespace) {
  var base = object.valueOf;
  var names = namespace || new Namespace;
  var namespaced = createNamespace(object, names);
  return Object.defineProperties(object, {
    valueOf: {
      value: function valueOf(namespace) {
        return namespace === names ? namespaced : base.apply(object, arguments);
      },
      configurable: true
    }
  }).valueOf(names);
}

function createNamespace(object, namespace) {
  var descriptors = getOwnPropertyDescriptors(namespace.prototype);
  descriptors.namespace = { value: namespace };
  return Object.create(object, descriptors);
}

});
