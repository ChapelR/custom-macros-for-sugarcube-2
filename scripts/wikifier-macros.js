// wikifier macro set, by chapel; for sugarcube 2
// version 1.0
// see the documentation: 

// helper functions
setup.selectStore = function (storyVar) {
	var store, varName;
	
	if (storyVar.charAt(0) === '$') {
		store = State.variables;
	} else if (storyVar.charAt(0) === '_') {
		store = State.temporary;
	} else {
		return false; // error
	}
	
	varName = storyVar.slice(1);
	
	return [store, varName];
};

setup.storeCode = function (storyVar, code) {
	var store, varName;
	storyVar = setup.selectStore(storyVar);
	
	if (!storyVar) {
		return false; // error
	}
	if (typeof code != 'string') {
		return false; // error
	}
	
	store   = storyVar[0];
	varName = storyVar[1];
	
	store[varName] = code; // save TwineScript code
	return true;
};

setup.evalCode = function (code, silent, $element, stream) {
	if (typeof code != 'string') {
		return false; // error
	}
	
	if (silent) {
		new Wikifier(null, code);
		return true;
	} else {
		$element
			.wiki(code)
			.appendTo(stream);
		return true;
	}
	
	return false;
};

// the <<code>> macro
Macro.add('code', {
	   tags : null,
	handler : function () {
		
		var code, storyVar, check;
		
		// check for errors
		if (this.args.length !== 1) {
			return this.error('incorrect number of arguments');
		} 
		if (typeof this.args[0] != 'string') {
			return this.error('first argument should be a quoted variable name');
		}
		
		// store code chunk as string in variable
		storyVar = this.args[0];
		code     = this.payload[0].contents;
		check    = setup.storeCode(storyVar, code);
		
		if (!check) {
			return this.error('error in arguments');
		}
		
	}
});

// the <<wiki>> and <<eval>> macros
Macro.add(['wiki', 'eval'], {
	handler : function () {
		
		var $wrapper = $(document.createElement('span'));
		var code, silent, check;
		
		// check for errors
		if (this.args.length !== 1) {
			return this.error('incorrect number of arguments');
		}
		
		// some setup
		$wrapper.addClass('macro-' + this.name);
		code = this.args[0];
		
		// check for silent execution
		silent = (this.name === 'eval') ? true : false;
		
		// run the TwineScript
		check = setup.evalCode(code, silent, $wrapper, this.output);
		
		if (!check) {
			return this.error('unknown error; please check arguments');
		}
		
	}
});