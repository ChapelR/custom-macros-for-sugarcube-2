// simple inventory system, by chapel; for SugarCube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#simple-inventory

// intialize namespace
setup.simpleInv = {};

// options object:
setup.simpleInv.options = {
	storyVar  : 'inventory',
	tryGlobal : true
};

// set up our inventory story variable
State.variables[setup.simpleInv.options.storyVar] = [];
setup.simpleInv.invRef = () => State.variables[setup.simpleInv.options.storyVar];

// helper functions:
setup.simpleInv.invAll = function() {
	// check for all provided items
	var inv  = setup.simpleInv.invRef();
	var args = [].slice.call(arguments);
	
	if (inv.includesAll(args)) {
		return true;
	}
	return false;
}
setup.simpleInv.invAny = function() {
	// check for any provided items
	var inv  = setup.simpleInv.invRef();
	var args = [].slice.call(arguments);
	
	if (inv.includesAny(args)) {
		return true;
	}
	return false;
}

// make helper functions global, unless it'd cause a conflict
if (typeof window.invAll == 'undefined' && setup.simpleInv.options.tryGlobal) {
	window.invAll = setup.simpleInv.invAll;
}
if (typeof window.invAny == 'undefined' && setup.simpleInv.options.tryGlobal) {
	window.invAny = setup.simpleInv.invAny;
}

// <<inventory>> macro
Macro.add('inventory', {
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = 'macro-' + this.name;
		var items     = setup.simpleInv.invRef();
		var length    = items.length;
		var separator = (this.args[0]) ? this.args[0] : '\n';
		var content;
		
		if (length > 0) {
			content = items.join(separator);
		} else {
			content = 'The inventory is currently empty.';
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);
		
	}

});

// <<pickup>> macro
Macro.add('pickup', {
	handler : function () {
	
		var items  = setup.simpleInv.invRef();
		var length = this.args.length;
		var i;
		
		if (length < 1) {
			return this.error('no arguments provided');
		}
		
		for (i = 0; i < length; i++) {
			items.push(this.args[i]);
		}
	
	}

});

// <<drop>> macro
Macro.add('drop', {
	handler : function () {
	
		var items  = setup.simpleInv.invRef();
		var length = this.args.length;
		var i;
		
		if (length < 1) {
			return this.error('no arguments provided');
		}
		
		for (i = 0; i < length; i++) {
			items.delete(this.args[i]);
		}
	
	}

});

// <<invWhereIs>> macro
Macro.add('invWhereIs', {
	handler : function () {
	
		var items  = setup.simpleInv.invRef();
		var length = this.args.length;
		
		if (length !== 1) {
			return this.error('incorrect number of arguments provided');
		} else if (typeof this.args[0] !== 'string') {
			return this.error('argument should be a string');
		} else {
			var find = this.args[0];
			State.temporary.is = items.indexOf(find);
		}
	
	}

});

// <<invWhatIs>> macro
Macro.add('invWhatIs', {
	handler : function () {
	
		var items  = setup.simpleInv.invRef();
		var length = this.args.length;
		
		if (length !== 1) {
			return this.error('incorrect number of arguments provided');
		} else if (typeof this.args[0] !== 'number') {
			return this.error('argument should be a numeric index');
		} else {
			var find = this.args[0];
			State.temporary.is = (items[find]) ? items[find] : 'nothing';
		}
	
	}

});

// <<invSort>> macro
Macro.add('invSort', {
	handler : function () {
	
		var items = setup.simpleInv.invRef();
		var items = items.sort();
	}
});

// <<has>> macro
Macro.add('has', {
	tags: ['otherwise'],
	handler : function () {
	
		var $wrapper  = $(document.createElement('span'));
		var className = 'macro-' + this.name;
		var items     = setup.simpleInv.invRef();
		var length    = this.args.length;
		
		var check;
		var content;
		
		if (length < 1) {
			return this.error('no arguments provided');
		} else if (length === 1) {
			check = (items.includes(this.args[0])) ? true : false;
		} else {
			check = (items.includesAll(this.args)) ? true : false;
		}
		
		if (check) {
			content = this.payload[0].contents;
		} else {
			content = (this.payload.length > 1) ? this.payload[1].contents : '';
		}
		
		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);
	
	}

});