var Sax=require("sax");
var notes=require("./notes");
var textbody=require("./textbody");


var p5tojson=function(content){
	var tagstack=[],context={notes:{},versions:{},offsets:{},text:""};
	var defaulthandler=function(parser)	{
		parser.onopentag=onopentag;
		parser.onclosetag=onclosetag;
		parser.ontext=ontext;
	}
	var onopentag=function(e){
		tagstack.push(e.name);
		if (tagstack.length==3 && e.name=="body") {
			textbody(context,parser,"body");
		}
		if (tagstack.length==5 && e.name=="cb:div" ) {
			if (e.attributes.type=="taisho-notes") {
				notes(context,parser,"cb:div");
			}
		}
	}
	var onclosetag=function(name){
		if (tagstack[tagstack[tagstack.length-1] != name]) {
			throw "unbalance tag"
		}
		tagstack.pop();
	}
	var ontext=function(t){
	//	console.log(t)
	}

	var parser=Sax.parser(true);
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	parser.write(content);

	return {
		text:context.text
		,notes:context.notes
		,versions:context.versions
		,offsets:context.offsets
	}
	
}
module.exports=p5tojson;