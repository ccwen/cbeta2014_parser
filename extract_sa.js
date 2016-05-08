/* extract Samyutta Agama from Cbeta xml*/

var p5tojson=require("./p5tojson");
var fs=require("fs");
var Sax=require("sax");
var lst=fs.readFileSync("sa.lst","utf8").split(/\r?\n/);
var filename="",outputtext=false,inSid=false,sid="";
var tagstack=[],context={text:""};
var writeToDisk=true,hasP=false,hasLg=false;
var handlers={
	"cb:div_open":function(e){
		if (e.attributes.type=="jing"){
			outputtext=true;	
		}
	}
	,lg_open:function(e){
		context.text+="<lg>";
		hasLg=true;
	}
	,lg_close:function(){
		context.text+="</lg>";
		hasLg=false;
	}
	,"cb:div_close":function(){
		outputtext=false;
	}
	,"cb:mulu_open":function(e){
		if (e.attributes.type=="經") {
			inSid=true;
		}
	}
	,"cb:mulu_close":function(name) {
		if (inSid){
			if (context.text) context.text+='</sid>';
			context.text+='<sid n="'+sid+'">';
			inSid="";
		}

	}
	,"pb_open":function(e) {
		var shortfilename=filename.substr(filename.length-7,3).replace(/^0+/,"");
		context.text+='<pb n="'+shortfilename+"."+e.attributes.n.replace(/^0+/,"")+'"/>';
	}
	,"p_open":function(e) {
		if (e.attributes["xml:id"]) {
			//context.text+="<p>";
			hasP=true;
		}
	}
	,"p_close":function(name) {
		//if (hasP) context.text+="</p>";
		hasP=false;
	}

}
var extract_jin=function(content,fn){
	filename=fn;
	var ontext=function(text){
		if (inSid) {
			sid=text; //cannot use <cb:mulu n="this is not correct sid" type="經"
		} else if (outputtext) {
			if (hasP || hasLg){
				context.text+=text;	
			}
		}
	}

	var onopentag=function(e){
		var offset=context.text.length;
		var T=[e.name,e.attributes,e.isSelfClosing];

		var handler=handlers[e.name+"_open"];
		handler&&handler(e);

		tagstack.push({name:e.name,isSelfClosing:e.isSelfClosing});
	}
	var onclosetag=function(name){
		if (tagstack[tagstack[tagstack.length-1][0] != name]) {
			throw "unbalance tag"
		}
		var handler=handlers[name+"_close"];
		var T=tagstack.pop();
		handler && handler(name);
	}

	var parser=Sax.parser(true);
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	parser.write(content);

	if (tagstack.length) {
		throw "tagstack no null" + tagstack.join("/");
	}
	context.text=context.text.replace(/\r?\n\r?\n/g,"\n").trim();
	context.text+="\n</sid>";
}

var processfile=function(fn){
	var content=fs.readFileSync(fn,"utf8");
	extract_jin(content,fn);
}
lst.map(processfile);


if (writeToDisk) {
	fs.writeFileSync("t99.xml",context.text,"utf8");
}