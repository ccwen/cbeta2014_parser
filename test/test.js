var p5tojson=require("../p5tojson");
var testfile="./xml/T01/T01n0001_001.xml";
var fs=require("fs");
var testcontent=fs.readFileSync(testfile,"utf8");
describe("test",function(){
	it("format",function(){
		var json=p5tojson(testcontent);
		//console.log(json)
	});
})