//const tempalte = require("json-templater")
var jsonpatch =require("jsonpatch");
var render = require('json-templater/string');
console.log(render('<div class="font-size:{{size}}">{{xfoo}} {{say.what}}</div>', { xfoo: 'yep', say: { what: 'yep' },size:"100px" }));
var object = require('json-templater/object');
var template={
  "magic_key_{{magic}}": {
    "key": "interpolation is nice {{value}}"
  },
  "appname_{{name}}":{
    "value":"{{name}}"
  },
  "appinfo":"{{appinfo}}",
  "appversion":"{{appversion}}",
  "biscuits":"{{biscuits}}"
}

var deprecateditems={
  "appinfo":true,
  "appurl":false
}

var oldob= {
    name:"dalong",
    age:333,
    appinfo:"demoapp",
    magic: 'key', 
    value: 'value' 
}
console.log(object(
  template,
  jsonpatch.apply_patch(oldob,
    [
        { "op": "replace", "path": "/name", "value": "boo" },
        { "op": "move", "from": "/appinfo", "path": "/appversion"},
        { "op": "add", "path": "/biscuits",value:[] },
        { "op": "add", "path": "/biscuits/0", "value": { "name": "dalong" } },
        { "op": "add", "path": "/biscuits/1", "value": { "name": "appdemo" } },
        { "op": "copy", "from": "/biscuits", "path": "/newbiscuits" }

    ]),
    function(value, data, key){
      if(deprecateditems[key]) {
        return "my default value"
      }
      return render(value, data);
   }));