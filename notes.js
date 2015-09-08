
var sethandler=function(context,parser,closetag) {
	var noteid="",notetext="", from="";
	var onopentag=function(e){
		if (e.name==="note") noteid=e.attributes.target.substr(1);
	}

	var getversion=function(t){
		var versions=[];
		t.replace(/【(.+?)】/g,function(m,v){
			if (v==="三") {
				versions=versions.concat(["宋","元","明"]);
			} else {
				if (!context.versions[v]) context.versions[v]=0;
				context.versions[v]++;
				versions.push(v);	
			}
		});
		return versions;
	}
	var getoperation=function(t,oldfrom){
		var m=t.match(/(.+?)＝(.+?)【/);
		if (m) {
			from=m[1];
			return [0,from.length,m[2]];
		}

		m=t.match(/＝(.*?)【/);
		if (m) return [0,from.length,m[1]];
		m=t.match(/〔.*?〕－/);
		if (m) return [0,from.length,""];
		m=t.match(/（(.+)）＋(.+)/);
		if (m) return [0,0,m[1]];
		m=t.match(/(.*?)＋（(.*)）/);
		if (m) return [m[1].length,0,m[2]];
	}
	var parsenotetext=function(text,noteid){
		var groups=text.split("，");

		for (var i=0;i<groups.length;i++) {
			var g=groups[i];
			var versions=getversion(g);
			var op=getoperation(g);
			if (op) for (var j=0;j<versions.length;j++){
				var offset=context.offsets[noteid];
				context.notes[noteid+"_"+i+j]= {type:"rev",s:offset+op[0], l:op[1], t:op[2], author:versions[j]};
			}
		}
	}
	var onclosetag=function(name){
		if (name===closetag) {
			resethandler();
			//console.log(JSON.stringify(context.notes,""," "))
		}

		if (name=="note") {
			var apparatus=parsenotetext(notetext,noteid);
			notetext="";
		}
	}
	var ontext=function(t){
		notetext+=t;
	}
	var resethandler=function() {
		parser.onopentag=oldhandler.onopentag;
		parser.onclosetag=oldhandler.onclosetag;
		parser.ontext=oldhandler.ontext;
	}

	var oldhandler={onopentag:parser.onopentag,onclosetag:parser.onclosetag,ontext:parser.ontext};
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
}
module.exports=sethandler;