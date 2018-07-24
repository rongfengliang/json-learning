(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var renderString = require('./string');

function walkObject(object, handler) {
  if (Array.isArray(object)) return walkArray(object, handler);
  var result = {};

  for (var key in object) {
    result[walk(key, handler, null)] = walk(object[key], handler, key);
  }

  return result;
}

function walkArray(array, handler) {
  return array.map(function(input) {
    return walk(input, handler, null);
  });
}

/**
Walk the object and invoke the function on string types.

Why write yet-another cloner/walker? The primary reason is we also want to run
template functions on keys _and_ values which most clone things don't do.

@param {Object} input object to walk and duplicate.
@param {Function} handler handler to invoke on string types.
@param {?String} [key] key corresponding to input, if the latter is a value in object
*/
function walk(input, handler, key) {
  switch (typeof input) {
    // object is slightly special if null we move on
    case 'object':
      if (!input) return input;
      return walkObject(input, handler);

    case 'string':
      return handler(input, key);
    // all other types cannot be mutated
    default:
      return input;
  }
}

function render(object, view, handler) {
  handler = handler || renderString;

  return walk(object, function(value, key) {
    return handler(value, view, key);
  }, null);
}

module.exports = render;

},{"./string":2}],2:[function(require,module,exports){
/**
Convert a dotted path to a location inside an object.

@private
@example

  // returns xfoo
  extractValue('wow.it.works', {
    wow: {
      it: {
        works: 'xfoo'
      }
    }
  });

  // returns undefined
  extractValue('xfoo.bar', { nope: 1 });

@param {String} path dotted to indicate levels in an object.
@param {Object} view for the data.
*/
function extractValue(path, view) {
  // Short circuit for direct matches.
  if (view && view[path]) return view[path];

  var parts = path.split('.');

  while (
    // view should always be truthy as all objects are.
    view &&
    // must have a part in the dotted path
    (part = parts.shift())
  ) {
    view = (typeof view === 'object' && part in view) ?
      view[part] :
      undefined;
  }

  return view;
}

var REGEX = new RegExp('{{([a-zA-Z.-_0-9]+)}}', 'g');
var TEMPLATE_OPEN = '{{';

/**
NOTE: I also wrote an implementation that does not use regex but it is actually slower
      in real world usage and this is easier to understand.

@param {String} input template.
@param {Object} view details.
*/
function replace(input, view) {
  // optimization to avoid regex calls (indexOf is strictly faster)
  if (input.indexOf(TEMPLATE_OPEN) === -1) return input;
  var result;
  var replaced = input.replace(REGEX, function(original, path) {
    var value = extractValue(path, view);
    if (undefined === value || null === value) {
      return original;
    }

    if (typeof value === 'object') {
      result = value;
      return;
    }

    return value;
  });
  return (undefined !== result) ? result : replaced;
}

module.exports = replace;

},{}],3:[function(require,module,exports){
//const tempalte = require("json-templater")

var render = require('json-templater/string');
console.log(render('<div class="font-size:{{size}}">{{xfoo}} {{say.what}}</div>', { xfoo: 'yep', say: { what: 'yep' },size:"100px" }));
var object = require('json-templater/object');
var template={
  "magic_key_{{magic}}": {
    "key": "interpolation is nice {{value}}"
  }
}
console.log(object(
  template,
  { magic: 'key', value: 'value' }
));

},{"json-templater/object":1,"json-templater/string":2}]},{},[3]);
