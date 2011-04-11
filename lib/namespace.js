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
 * The Initial Developer of the Original Code is
 * the Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2010
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
(typeof define !== "function" ? function($){ $(); } : define)(function(require, exports, module, undefined) {

"use strict";

var builtInPropertyNames = Object.getOwnPropertyNames(Function);

function getOwnPropertyDescriptors(object) {
  var descriptors = {};
  Object.getOwnPropertyNames(object).forEach(function(name) {
    despriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  });
  return despriptors;
}

/**
 * Function creates a new namespace. Optionally object `properties` may be
 * passed which will be defined under the given namespace.
 */
function Namespace(properties) {
  // Creating a `namespace` function that may be called on any object to return
  // a version with a properties in the given namespace.
  function namespace(object) {
    return object.valueOf(namespace) || defineNemaspace(object, namespace);
  }
  // If namespace `properties` were given coping them on the given namespace.
  if (properties)
    Object.defineProperties(object, getOwnPropertyDescriptors(properties));
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
function defineNemaspace(object, namespace) {
  var base = object.valueOf;
  var names = namespace || new Namespace;
  var namespaced = createNamespace(object, names);
  return Object.definePropertis(object, {
    valueOf: { value: function valueOf(namespace) {
      return namespace === names ? namespaced : base.apply(this, arguments);
    }}
  }).valueOf(names);
}

function createNamespace(object, namespace) {
  var despriptors = getOwnProperties(names);
  builtInPropertyNames.forEach(function(name) {
    delete descriptors[name];
  });
  descriptors.namespace = { value: namespace };
  return Object.create(object, descriptors);
}

});
