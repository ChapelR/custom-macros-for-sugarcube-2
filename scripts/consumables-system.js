// consumables system, by chapel; for sugarcube 2
// version 1.05

// create namespace
setup.consumables = {};

// options object
setup.consumables.options = {
	storyVar   : 'consumables',
	emptyMsg   : 'Not carrying any consumables.',
	tryGlobal  : true,
	macroAlts  : true,
	silentCode : true
};

// set up data structure in story variable
State.variables[setup.consumables.options.storyVar] = {
	carried : [],
	all     : []
};
// create a referencing function for internal use
setup.consumables.ref = () => State.variables[setup.consumables.options.storyVar];

// function definitions
setup.consumables.getConsumable = function (id) {
	// return deep copy of consumable
	var conRef = setup.consumables.ref();
	if (!conRef.all.includes(id)) {
		return null;
	}
	// return clone of reference
	return clone(conRef[id]);
};

setup.consumables.hasConsumable = function (id, number) {
	// returns true if number of carried consumable >= number (or 1)
	var conRef = setup.consumables.ref();
	if (!conRef.all.includes(id)) {
		throw new TypeError('no consumable named ' + id + ' exists.');
	}
	if (arguments.length < 2) {
		number = 1;
	}
	// return boolean via expression
	return (conRef[id].amt >= number);
};

setup.consumables.amtOfConsumable = function (id) {
	// return current number of consumable carried
	var conRef = setup.consumables.ref();
	if (conRef.carried.includes(id)) {
		return conRef[id].amt;
	} 
	if (conRef.all.includes(id)) {
		return 0;
	}
	// no such consumable exists at all
	return -1;
};

setup.consumables.consumableExists = function (id) {
	// return true if consumable is defined
	var conRef = setup.consumables.ref();
	if (conRef.all.includes(id)) {
		return true;
	}
	return false;
};

setup.consumables.getConsumableName = function (id) {
	// return name of consumable
	var conRef = setup.consumables.ref();
	if (!conRef.all.includes(id)) {
		return null;
	}
	return conRef[id].name;
};

setup.consumables.getConsumableCode = function (id) {
	// return raw code packet of consumable
	var conRef = setup.consumables.ref();
	if (!conRef.all.includes(id)) {
		return null;
	}
	return conRef[id].code;
};

setup.consumables.getConsumableDescr = function (id) {
	// return code and type of consumable's description
	var conRef = setup.consumables.ref();
	if (!conRef.all.includes(id)) {
		return null;
	}
	// return array: [0: type of description, 1: description code/passage]
	return [conRef[id].descr, conRef[id].dCode];
};

setup.consumables.getAllConsumables = function () {
	// return array of id's of all defined consumables
	var conRef = setup.consumables.ref();
	if (conRef.all.length === 0) {
		// array is empty, return null
		return null;
	}
	// return deep copy of array
	return clone(conRef.all);
};

setup.consumables.getCarriedConsumables = function () {
	// return array of id's of all carried consumables
	var conRef = setup.consumables.ref();
	if (conRef.carried.length === 0) {
		// array is empty, return null
		return null;
	}
	// return deep copy of array
	return clone(conRef.carried);
};

setup.consumables.findConsumableByIndex = function (index) {
	// return id of consumable in the indicated index of the all array
	var conRef = setup.consumables.ref();
	if (conRef.all.length < (index - 1)) {
		return null;
	}
	// return id of item in index
	return conRef.all[index];
};

setup.consumables.findIndexOfConsumable = function (id) {
	// return index of consumable in the all array, or -1 if it doesn't exist
	var conRef = setup.consumables.ref();
	return conRef.all.indexOf(id);
};

setup.consumables.deleteConsumable = function (id) {
	// delete consumable definition
	var conRef = setup.consumables.ref();
	var del;
	if (conRef.all.includes(id)) {
		// remove from all array
		del = conRef.all.indexOf(id);
		conRef.all.deleteAt(del);
	}
	if (conRef.carried.includes(id)) {
		// remove from carried array
		del = conRef.carried.indexOf(id);
		conRef.carried.deleteAt(del);
	}
	if (typeof conRef[id] != 'undefined') {
		// delete definition object
		delete conRef[id];
	}
};

// copy functions to global scope
if (setup.consumables.options.tryGlobal) {
	// check tryGlobal option
	if (typeof window.getConsumable == 'undefined') {
		window.getConsumable = setup.consumables.getConsumable;
	}
	if (typeof window.hasConsumable == 'undefined') {
		window.hasConsumable = setup.consumables.hasConsumable;
	}
	if (typeof window.amtOfConsumable == 'undefined') {
		window.amtOfConsumable = setup.consumables.amtOfConsumable;
	}
	if (typeof window.consumableExists == 'undefined') {
		window.consumableExists = setup.consumables.consumableExists;
	}
	if (typeof window.getConsumableName == 'undefined') {
		window.getConsumableName = setup.consumables.getConsumableName;
	}
	if (typeof window.getConsumableCode == 'undefined') {
		window.getConsumableCode = setup.consumables.getConsumableCode;
	}
	if (typeof window.getConsumableDescr == 'undefined') {
		window.getConsumableDescr = setup.consumables.getConsumableDescr;
	}
	if (typeof window.getAllConsumables == 'undefined') {
		window.getAllConsumables = setup.consumables.getAllConsumables;
	}
	if (typeof window.getCarriedConsumables == 'undefined') {
		window.getCarriedConsumables = setup.consumables.getCarriedConsumables;
	}
	if (typeof window.findConsumableByIndex == 'undefined') {
		window.findConsumableByIndex = setup.consumables.findConsumableByIndex;
	}
	if (typeof window.findIndexOfConsumable == 'undefined') {
		window.findIndexOfConsumable = setup.consumables.findIndexOfConsumable;
	}
	if (typeof window.deleteConsumable == 'undefined') {
		window.deleteConsumable = setup.consumables.deleteConsumable;
	}
}

	/* MACROS */
		
// <<newconsumable>> macro
Macro.add('newconsumable', {
	   tags : ['description'],
	handler : function () {
		
		var conRef = setup.consumables.ref();
		
		// check args
		if (this.args.length < 1) {
			return this.error('you must name your consumable');
		} else if (this.args.length > 2) {
			return this.error('you may only include a name and optional ID as arguments in a consumable definition');
		}
		
		// grab info from macro call
		var consumableCode = clone(this.payload[0].contents);
		var consumableName = clone(this.args[0]);
		var consumableID   = (this.args.length === 1) ? clone(this.args[0]) : clone(this.args[1]);
		var descrCode      = '';
		var description    = null;
		
		// check for description code
		if (this.payload.length > 2) {
			return this.error('only one <<description>> tag is allowed per consumable definition');
		} else if (this.payload.length === 2) {
			if (this.payload[1].args > 1) {
				return this.error('<<description>> tag has too many arguments');
			} else if (this.payload[1].args.length === 1) {
				descrCode   = this.payload[1].args[0];
				description = 'passage';
			} else {
				descrCode   = this.payload[1].contents;
				description = 'code';
			}
		}
		
		// delete old definition, if it exists
		setup.consumables.deleteConsumable(consumableID);
		
		// create new consumable definition
		conRef[consumableID] = {
			id    : consumableID,
			name  : consumableName,
			code  : consumableCode,
			descr : description,
			dCode : descrCode,
			amt   : 0
		};
		
		// add to array
		conRef.all.push(consumableID);
		
	}
});

// <<addconsumable>> macro
Macro.add('addconsumable', {
	handler : function () {
		
		var conRef = setup.consumables.ref();
		
		// check args
		if (this.args.length > 2) {
			return this.error('incorrect number of arguments');
		}
		
		var key   = this.args[0];
		var count = (this.args.length === 1) ? 1 : this.args[1];
		
		// make sure we got a number
		if (typeof count != 'number') {
			return this.error('optional second argument should be a number');
		}
		
		// make sure consumable is defined
		if (!conRef.all.includes(key)) {
			return this.error('no cosumable with id ' + key + ' is defined');
		}
		
		// add to carried array
		if (!conRef.carried.includes(key)) {
			conRef.carried.push(key);
		}
		
		var item = conRef[key];
		
		// make sure we aren't negative
		if (item.amt <= 0) {
			item.amt = 0;
		}
		
		// add consumables
		item.amt += count;
		
	}
});

// <<dropconsumable>> macro
Macro.add('dropconsumable', {
	handler : function () {
		
		var conRef = setup.consumables.ref();
		var del;
		
		// check args
		if (this.args.length > 2 || this.args.length < 1) {
			return this.error('incorrect number of arguments');
		}
		
		var key   = this.args[0];
		var count = (this.args.length === 1) ? 1 : this.args[1];
		
		// make sure we got a number
		if (typeof count != 'number') {
			return this.error('optional second argument should be a number');
		}
		
		// make sure consumable is defined
		if (!conRef.all.includes(key)) {
			return this.error('no cosumable with id ' + key + ' is defined');
		}
		
		var item = conRef[key];
		
		// remove consumables
		item.amt -= count;
		
		// make sure we aren't negative and remove from carried array if necesaary
		if (item.amt <= 0) {
			item.amt = 0;
			if (conRef.carried.includes(key)) {
				del = conRef.carried.indexOf(key);
				conRef.carried.deleteAt(del);
			}
		}
		
	}
});

// <<clearconsumables>> macro
Macro.add('clearconsumables', {
	handler : function () {
		
		var conRef = setup.consumables.ref();
		var keys   = this.args;
		var length = this.args.length;
		var item;
		var del;
		var i;
		
		// check args
		if (length < 1) {
			return this.error('you must provide the ID of at least one consumable');
		} else if (!conRef.all.includesAll(keys)) {
			return this.error('some or all of the provided consumable IDs do not exist');
		}
		
		for (i = 0; i < length; i++) {
			// set amt to 0 for each id
			item = conRef[keys[i]];
			item.amt = 0;
			if (conRef.carried.includes(keys[i])) {
				// check carried array
				del = conRef.carried.indexOf(keys[i]);
				conRef.carried.deleteAt(del);
			}
		}
		
	}
});

// <<deleteconsumables>>
Macro.add('deleteconsumables', {
	handler : function () {
		
		var conRef = setup.consumables.ref();
		var keys   = this.args;
		var length = keys.length; 
		var delAll = false;
		var i;

		if (length < 1) {
			// no args
			return this.error('no consumable ids provided');
		} else if ((length === 1) && (keys[0].trim().toLowerCase() === 'all')) {
			// keyword 'all' is only arg; delete all consumable definitions
			delAll = true;
		} else if (!conRef.all.includesAll(keys)) {
			// args are not recognized as consumables or as 'all' keyword
			return this.error('some or all of the provided ids are not defined as consumables');
		} 
	
		if (delAll) {
			// delete all consumables using all array
			keys   = conRef.all;
			length = keys.length;
		}
	
		// main loop
		for (i = 0; i < length; i++) {
			// delete each indicated consumable
			setup.consumables.deleteConsumable(keys[i]);
		}
	
	}
});

// <<useconsumable>> macro
Macro.add('useconsumable', {
	handler : function () {
		
		var $wrapper = $(document.createElement('span'));
		var conRef   = setup.consumables.ref();
		var silent;
		var check;
		var del;
		var key;
		var code;
		var item;
		
		// check default of silentCode option
		if (setup.consumables.options.silentCode) {
			silent = true;
		} else {
			silent = false;
		}
		
		// check args
		if ((this.args.length > 2) || (this.args.length < 1)) {
			return this.error('incorrect number of arguments');
		}
		
		key = this.args[0];
		 
		// check args[1]
		if (this.args.length === 2) {
			check = this.args[1].trim().toLowerCase();
			if ((check === 'silent') || (check === 'noop')) {
				// suppress output
				silent = true;
			} else if ((check === 'unsilent') || (check === 'op')) {
				// do not suppress output
				silent = false;
			}
		}
		
		// check for existence of consumable
		if (!conRef.all.includes(key)) {
			return this.error('no consumable with ID ' + key + ' exists');
		}
		
		// grab consumable's code
		code = conRef[key].code;
		
		// get number of consumables and take a look at it
		item = conRef[key];
		if (item.amt === 0) { // can't use 0 consumables; double check carried array
			code = '';
			if (conRef.carried.includes(key)) {
				del = conRef.carried.indexOf(key);
				conRef.carried.deleteAt(del);
			}
		} else if (item.amt === 1) { // if 1, remove from carried array and use
			item.amt = 0;
			del = conRef.carried.indexOf(key);
			conRef.carried.deleteAt(del);
		} else { // reduce count by 1 if player has 2 or more
			item.amt--;
		}
		
		// run consumable's code
		if (silent) {
			// discard output
			new Wikifier(null, code);
		} else {
			// display output
			$wrapper
				.wiki(code)
				.addClass('macro-' + this.name)
				.appendTo(this.output);
		}
		
	}
});

// <<sortconsumables>> macro
Macro.add('sortconsumables', {
	handler : function () {
		var conRef   = setup.consumables.ref();
		conRef.carried.sort();
	}
});

// <<listconsumables>> macro
Macro.add('listconsumables', {
	handler : function () {
		
		var $wrapper = $(document.createElement('span'));
		var conRef   = setup.consumables.ref();
		var content  = '';
		var sep;
		
		// check args
		if (this.args.length > 1) {
			return this.error('incorrect number of arguments');
		} else if (this.args.length === 1) {
			sep = this.args[0];
		} else {
			sep = '\n';
		}
		
		//v1.05b: fixed display issue
		// check for consumables
		if (conRef.carried.length > 0) {
			// create list
			conRef.carried.forEach( function (id, idx, arr) {
				var item = conRef[id];
				content = content + item.name + ': ' + item.amt;
				// omit separator if item is last consumable
				content = (idx === arr.length - 1) ? content : content + sep;
			});
		} else {
			// no carried consumables
			content = setup.consumables.options.emptyMsg;
		}
		
		// output list
		$wrapper
			.wiki(content)
			.addClass('macro-' + this.name)
			.appendTo(this.output);
		
	}
});

// <<usableconsumables>> macro
Macro.add('usableconsumables', {
	handler : function () { 
		
		var $wrapper = $(document.createElement('span'));
		var conRef   = setup.consumables.ref();
		
		// check for consumables
		if (conRef.carried.length > 0) {
			conRef.carried.forEach( function (id) {
				var $descr = $(document.createElement('a'));
				var $link  = $(document.createElement('a'));
				var item   = conRef[id];
				var itemID = conRef[id].id.replace(/[^A-Za-z0-9]/g, '');
				var descrCode;
				
				if ((!item.descr) || (item.descr == null)) {
					// no description code, no link
					$descr = item.name;
				} else {
					// make description link
					$descr
						.wiki(item.name)
						.addClass('descr-link macro-usableconsumables')
						.attr('id', itemID + '-descr');
					if (item.descr === 'passage') {
						// default (for passage-style descr)
						$descr.ariaClick( function () {
								Dialog.setup(item.name, 'consumable ' + item.name + ' ' + item.id);
								Dialog.wiki(Story.get(item.dCode).processText());
								Dialog.open();
							});
					} else {
						// for user-defined description code
						$descr.ariaClick( function () {
							new Wikifier(null, item.dCode);
						});
					}
				}
				
				// create 'Use' link
				$link
					.wiki('Use')
					.addClass('use-link macro-usableconsumables')
					.attr('id', itemID + '-use')
					.ariaClick( function () {
						// on click, fire useconsumable macro in silent mode
						new Wikifier(null, '<<useconsumable "' + item.id + '" "silent">>');
						$('#' + itemID).empty().wiki(item.amt);
					});
				
				// append to output
				$wrapper
					.append($descr)
					.wiki(': <span id="' + itemID + '">' + item.amt + '</span> ')
					.append($link)
					.wiki('<br />');
			});
		} else {
			// no carried consumables
			$wrapper.wiki(setup.consumables.options.emptyMsg);
		}
		
		// display output
		$wrapper
			.addClass('consumable-wrapper')
			.appendTo(this.output);
	}
	
});

// include alternate macro tags, if requested
if (setup.consumables.options.macroAlts) {
	// <<consumable>> macro
	Macro.add('consumable', 'newconsumable');
	// <<consumablemenu>> macro
	Macro.add('consumablemenu', 'usableconsumables');
}