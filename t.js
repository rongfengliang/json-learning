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
