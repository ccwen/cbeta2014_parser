var p5tojson=require("./p5tojson");
var testfile=process.argv[2]||"./xml/T01/T01n0001_008.xml";
var fs=require("fs");
var testcontent=fs.readFileSync(testfile,"utf8");
var json=p5tojson(testcontent);
console.log("module.exports="+JSON.stringify(json,""," "));