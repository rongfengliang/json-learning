const jsonpatch =require("jsonpatch");
const oldob= {
    name:"dalong",
    age:333,
    appinfo:"demoapp"
}
const json8 =require("json8-patch");

const result =jsonpatch.apply_patch(oldob,
    [
        { "op": "replace", "path": "/name", "value": "boo" },
        { "op": "move", "from": "/appinfo", "path": "/appversion"},
        { "op": "add", "path": "/biscuits",value:[] },
        { "op": "add", "path": "/biscuits/0", "value": { "name": "dalong" } },
        { "op": "add", "path": "/biscuits/1", "value": { "name": "appdemo" } },
        { "op": "copy", "from": "/biscuits", "path": "/newbiscuits" }

    ])

const path = json8.diff(oldob,result)

console.log(path)