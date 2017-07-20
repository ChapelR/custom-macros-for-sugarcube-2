// passage-containers.js, an extension for simple inventory, by chapel; for sugarcube 2
// WARNING: this sytem is complicated, and has some pitfalls; it is recommended that you 
// read the documentation at scripts/extensions/extensions-readme.md carefully

// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/extensions/extensions-readme.md#containers
// v1.1

// check for simpleInv
if (setup.simpleInv == null || !setup.simpleInv) {
	throw new Error(' ... This extension requires simple-inventory.js.  If you have simple-inventory.js installed, you may need to reinstall it.  Note that if the passage-container.js script is placed before the contents of simple-inventory.js (Twine 1 and 2), or in a serparate script-tagged passage (Twine 1 only), this may cause errors.  Love, Chapel');
}

// namespace & setup
setup.simpleInv.containers = {};
setup.simpleInv.containers.passages = [];

// options object
// tryGlobal for functions is set by setup.simpleInv.options.tryGlobal
setup.simpleInv.containers.options = {
	storyVar : 'containers',
	skipTags : ['skip', 'menu', 'widget'],
	setLimit : 0
};

// story variable setup & ref function
State.variables[setup.simpleInv.containers.options.storyVar] = {};
setup.simpleInv.containers.ref = () => State.variables[setup.simpleInv.containers.options.storyVar];

// get passages and store names
// we use an IIFE here to make things easier on us
(function () {
	var containers = setup.simpleInv.containers;
	var contRef    = containers.ref();
	var psgA       = [];
	var name;
	var i;
	
	var psgO = Story.lookupWith( function (passageObj) {
		// check for skipTags
		if (passageObj.tags.includesAny(containers.options.skipTags)) {
			return false;
		}
		return true;
	});
	
	for (i = 0; i < psgO.length; i++) {
		// we only need the passages' names
		name = psgO[i].title;
		psgA.push(name);
	}
	
	for (i = 0; i < psgA.length; i++) {
		// create passage property on storyVar
		contRef[psgA[i]] = [];
	}
	
	// for key finding and debugging
	containers.passages = psgA;
	
}());

// functions (for making some fun puzzles; i.e. take all components and drop in same passage)
// containerAll() --> psgInv.all()
setup.simpleInv.containers.containerAll = function () {
	var containers = setup.simpleInv.containers; 
	var items      = [].slice.call(arguments);
	var psgInv     = setup.simpleInv.containers.getItems();
	
	if (Array.isArray(psgInv) && psgInv.includesAll(items)) {
		return true;
	}
	
	return false;
};

// containerAny() --> psgInv.any()
setup.simpleInv.containers.containerAny = function () {
	var containers = setup.simpleInv.containers; 
	var items      = [].slice.call(arguments);
	var psgInv     = setup.simpleInv.containers.getItems();
	
	if (Array.isArray(psgInv) && psgInv.includesAny(items)) {
		return true;
	}
	
	return false;
};

// send to global scope 
if (setup.simpleInv.options.tryGlobal) {
	if (typeof window.psgInv == 'undefined') {
		window.psgInv = {};
		window.psgInv.all = setup.simpleInv.containers.containerAll;
		window.psgInv.any = setup.simpleInv.containers.containerAny;
	}
}

// helper functions
// return container's array
setup.simpleInv.containers.getItems = function (psg) {
	var containers = setup.simpleInv.containers;
	var contRef    = containers.ref();
	
	if (!psg) {
		psg = passage(); // default to current passage
	}
	
	if ( !Story.has(psg) || 
		Story.get(psg).tags.includesAny(containers.options.skipTags) ) {
		return undefined; // passage does not / should not have any items
	}
	
	// get items reference
	console.log(psg + ': ' + contRef[psg]);
	return contRef[psg];
	
};

// placing
setup.simpleInv.containers.addItem = function (psg, item) {
	var containers = setup.simpleInv.containers;
	var psgInv     = containers.getItems(psg);
	
	if ( item && typeof psgInv != 'undefined') {
		psgInv.push(item);
		return true; // successful
	}
	
	return false; // unsuccessful
}

// taking
setup.simpleInv.containers.removeItem = function (psg, item) {
	var containers = setup.simpleInv.containers;
	var psgInv     = containers.getItems(psg);
	
	if ( item != null && typeof psgInv != 'undefined' && psgInv.includes(item) ) {
		psgInv.delete(item);
		return true; // successful
	}
	
	return false; // unsuccessful
}

// added v1.1b: return last viable passage
setup.simpleInv.containers.findLastViable = function () {
	var containers = setup.simpleInv.containers;
	var peekLimit  = containers.options.setLimit;
	var viable     = containers.passages;
	var i, check;
	
	if (peekLimit === 0) {
		// check ALL of history
		peekLimit = State.length - 1;
	}
	
	for (i = 1; i <= peekLimit; i++) {
		check = State.peek(i);
		if (viable.includes(check.title)) {
			return check.title;
			break;
		}
	}
	
	return false; // no passage found within limit
};

prerender['reset-resgister'] = function (_, t) { // junk args
	// we need to use a prerender here to reset the passage register 
	// before the code is wikified, but after transition fires
	setup.simpleInv.containers.register = passage();
};



// <<placeat>> macro
// <<placeat 'passage' 'item'>>
// place item in passage
Macro.add('placeat', {
	handler : function () {
		
		var psg, items, i;
		
		// simple error checking
		if (this.args.length < 2) {
			return this.error('invalid arguments');
		}
		if (!Story.has(this.args[0]) || 
			Story.get(this.args[0]).tags.includesAny(setup.simpleInv.containers.options.skipArgs)) {
			return this.error('passage "' + this.args[0] + '" does not exist or is not a container');
		}
		
		psg   = this.args.shift();
		items = this.args;
		
		for (i = 0; i < items.length; i++) {
			setup.simpleInv.containers.addItem(psg, items[i]);
		}
		
	}
});

// <<takefrom>> macro
// <<takefrom 'passage' 'item'>>
// remove item from passage
Macro.add('takefrom', {
	handler : function () {
		
		var psg, items, i;
		
		// simple error checking
		if (this.args.length < 2) {
			return this.error('invalid arguments');
		}
		if (!Story.has(this.args[0]) || 
			Story.get(this.args[0]).tags.includesAny(setup.simpleInv.containers.options.skipArgs)) {
			return this.error('passage "' + this.args[0] + '" does not exist or is not a container');
		}
		
		psg   = this.args.shift();
		items = this.args;
		
		for (i = 0; i < items.length; i++) {
			setup.simpleInv.containers.removeItem(psg, items[i]);
		}
		
	}
});

// <<take>> macro
// <<take 'item'>>
// remove item from current passage
Macro.add('take', {
	handler : function () {
		
		var psg = setup.simpleInv.containers.register;
		var items, i;
		
		// simple error checking
		if (this.args.length < 1) {
			return this.error('invalid arguments');
		}
		
		items = this.args;
		
		for (i = 0; i < items.length; i++) {
			setup.simpleInv.containers.removeItem(psg, items[i]);
		}
		
	}
});

// <<place>> macro
// <<place 'item'>>
// place item in current passage
// NOTE: has major limitations (see doucmentation)
Macro.add('place', {
	handler : function () {
		
		var psg    = setup.simpleInv.containers.register;
		var psgInv = setup.simpleInv.containers.getItems(psg);
		var items, i;
		
		// simple error checking
		if (this.args.length < 1) {
			return this.error('invalid arguments');
		}
		
		items = this.args;
		
		for (i = 0; i < items.length; i++) {
			if (!psgInv.includes(items[i]) && visited() === 1) {
				setup.simpleInv.containers.addItem(psg, items[i]);
			}
		}
		
	}
});

// <<placelist>> macro
// <<placelist (optional: 'sep')>>
// list place's inventory
Macro.add('placelist', {
	handler : function () {
		
		var $wrapper  = $(document.createElement('span'));
		var className = 'macro-' + this.name;
		var psg       = setup.simpleInv.containers.register;
		var content;
		var list;
		var sep;
		var c;
		
		// simple error checking
		if (this.args.length > 1) {
			return this.error('invalid arguments');
		}
		if (this.args.length === 1 &&
			typeof this.args[0] == 'string') {
				
			sep = this.args[0];
		} else {
			sep = ', ';
		}
		
		list = setup.simpleInv.containers.getItems(psg);
		
		if (!list) {
			content = '';
		} else {
			content = list.join(sep);
		}
		
		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);
			
	}
});


// <<pickupfromplace>> macro
// <<pickupfromplace 'list of items'>>
// if item is picked up here, removes it (if found)
// combination of <<pickup>> and <<take>>
Macro.add('pickupfromplace', {
	handler : function () {

		var items  = setup.simpleInv.invRef();
		var length = this.args.length;
		var psg    = setup.simpleInv.containers.register;
		var i;
		var c;
		
		// simple error checking
		if (length < 1) {
			return this.error('no arguments provided');
		}
		
		for (i = 0; i < length; i++) {
			items.push(this.args[i]);
		}
		
		// remove items from container
		for (i = 0; i < length; i++) {
			setup.simpleInv.containers.removeItem(psg, this.args[i]);
		}
		
	}
});

// <<setcontainer>> macro
// <<setcontainer 'passage'>><<dropinplace ...>><</setcontainer>>
// registers a passage as the current location for dropping;
// useful for menus (<<setcontainer>>..., <<setcontainer $return>>..., etc.)
// if no args, defaults to previous passage
Macro.add('setcontainer', {
	handler : function () {
		
		var check    = (Story.get(passage()).text.match('<<setcontainer').length > 1);
		var reg;
		
		// simple error checking
		if (check) { 
			return this.error('cannot assign this passage to multiple containers'); 
		}
		if (this.args.length > 1) { 
			return this.error('incorrect arguments'); 
		}
		if (this.args.length === 1) {
			if (!Story.has(this.args[0])) {
				return this.error('no passage named "' + this.args[0] + '" exists');
			}
			if (Story.get(this.args[0]).tags.includesAny(setup.simpleInv.containers.options.skipArgs)) {
				return this.error('passage "' + this.args[0] + '" includes one or more skipTags');
			}
		}
		
		if (this.args[0] != null) {
			setup.simpleInv.containers.register = this.args[0];
		} else {
			// v1.1b: now finds last viable
			setup.simpleInv.containers.register = setup.simpleInv.containers.findLastViable();
		}
		
	}
});

// <<dropinplace>> macro
// <<dropinplace 'list of items'>>
// if item is dropped here, add to passage
// combination of <<drop>> and <<placehere>>
Macro.add('dropinplace', {
	handler : function () {
		
		var items    = setup.simpleInv.invRef();
		var length   = this.args.length;
		var psg      = setup.simpleInv.containers.register;
		var i;
		var c;
		
		// simple error checking
		if (length < 1) {
			return this.error('no arguments provided');
		}
		
		for (i = 0; i < length; i++) {
			// updated v1.1b: now removes items only if passage drop is successful.
			// returns alert on failure
			c = setup.simpleInv.containers.addItem(psg, this.args[i]);
			if (c) { 
				items.delete(this.args[i]); 
			} else {
				UI.alert("You can't drop items here.");
			}
		}
		
	}
});

// <<container>> macro
// <<container (optional: separator)>>
// displays link list of items; 
// click link to pickup item, remove from container, and update list
Macro.add('container', {
	handler : function () {
		
		var $wrapper  = $(document.createElement('span'));
		var items     = setup.simpleInv.invRef();
		var psg       = setup.simpleInv.containers.register;
		var className = 'macro-' + this.name;
		var list      = setup.simpleInv.containers.getItems();
		var sep       = ', ';
		
		if (this.args.length === 1 && typeof this.args[0] == 'string') {
			sep = this.args[0];
		} // ignore anything else
		
		// check for items
		if (list) {
			list.forEach( function (i, idx, arr) {
				var itemID  = i.replace(/[^A-Za-z0-9]/g, '');
					itemID  = itemID + '-' + idx;
				
				var $link    = $(document.createElement('a'));
				var $listing = $(document.createElement('span'));
				
				// build link
				$link
					.wiki(i)
					.addClass('macro-container-link')
					.ariaClick( function () { // handler
						items.push(i);
						setup.simpleInv.containers.removeItem(psg, i);
						$('#' + itemID).empty();
					});
				// build removable listing and append link
				$listing
					.attr('id', itemID)
					.append($link);
				if (idx < arr.length - 1) {
					$listing.wiki(sep);
				}
				// append to output
				$listing.appendTo($wrapper);
			});
		}
		
		// finish up output
		$wrapper
			.addClass(className)
			.appendTo(this.output);
		
	}
});

// <<droplist>> macro
// <<droplist>>
// creates an inventory list with drop links
// use <<setcontainer>> to pass dropped items to new a container
Macro.add('droplist', {
	handler: function () {
		
		// initial declarations / references
		var items  = setup.simpleInv.invRef();
		var length = this.args.length;
		var psg    = setup.simpleInv.containers.register;
		
		var $wrapper = $(document.createElement('span'));
		
		// main function:
		items.forEach( function (current, i) {
			var $listing = $(document.createElement('span'));
			var $drop    = $(document.createElement('a'));
			var c;
			
			var itemID  = current.replace(/[^A-Za-z0-9]/g, '');
			itemID  = itemID + '-' + i; // add index in case of doubled items
			
			// first we'll do the complicated work and build the link...
			$drop
				.wiki('Drop')
				.addClass('droplist-link') // for user styling
				.ariaClick( function () {
					// push into passage 
					c = setup.simpleInv.containers.addItem(psg, current);
					// updated v1.1b: now displays alert if drop is impossible
					if (c) {
						// remove item from inventory
						items.delete(current);
						// delete listing
						$('#' + itemID).empty();
					} else {
						UI.alert("You can't drop items here.");
					}
				});
			
			// now construct the listing
			$listing
				.addClass('droplist-item')
				.attr('id', itemID) // for removal
				.wiki(current + ' ') // item name
				.append($drop); // drop link
			if (i !== (length - 1)) {
				// not last in list; include separator
				$listing.wiki('\n');
			}
			// append to output
			$listing.appendTo($wrapper);
			
		});
		
		// finish up output
		$wrapper
			.addClass('macro-' + this.name)
			.appendTo(this.output);
		
	}
});