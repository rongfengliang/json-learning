var json_merge = require("json-merge-patch");

var source = {
    "title": "Goodbye!",
    "author" : {
          "givenName" : "John",
          "familyName" : "Doe"
      }
  };
   
  var patch = {
      "author": {
          "familyName": null
      }
  }
   
  var source1 = {
    "title": "Goodbye!",
    "author" : "John Doe"
  };
   
  var target1 = {
      "title": "Hello!",
  };
  var target = json_merge.apply(source, patch);
  console.log(target)
  var patch1 = json_merge.generate(source1, target1);
  console.log(patch1)
