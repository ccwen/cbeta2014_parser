var sethandler=function(context,parser,closetag) {
	var offset=0;
	var onopentag=function(e){
		if (e.name=="anchor") {
			var id=e.attributes["xml:id"];
			context.offsets[id]=offset;
		}
	}
	var onclosetag=function(name){
		if (name===closetag) {
			resethandler();
		}
	}
	var ontext=function(t){
		context.text+=t;
		offset+=t.length;
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