// simple inventory system, by chapel; for SugarCube 2
// version 1.0

// intialize namespace
setup.simpleInv = {};

// options object:
setup.simpleInv.options = {
	storyVar  : 'inventory',
	tryGlobal : true
};
/* Explanation:
	storyVar:
		This set of macros automatically creates a story variable array.  You can change the name of the created variable (default: '$inventory') to whatever you prefer.
	tryGlobal:
		The functions included in this script are scoped into the setup.simpleInv namespace, and references to those functions are passed to the global scope as long as their names aren't taken.  Set this option to false to force the functions to remain in the setup.simpleInv namespace.
*/

// set up our inventory story variable
State.variables[setup.simpleInv.options.storyVar] = [];
setup.simpleInv.invRef = () => State.variables[setup.simpleInv.options.storyVar];

// helper functions
setup.simpleInv.invAll = function() {
	var inv  = setup.simpleInv.invRef();
	var args = [].slice.call(arguments);
	
	if (inv.includesAll(args)) {
		return true;
	}
	return false;
}
setup.simpleInv.invAny = function() {
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

/*
usage: <<if invAll('list', 'of', 'items')>>...
usage: <<if invAny('list', 'of', 'items')>>...

non-global versions: 
setup.simpleInv.invAll() and 
setup.simpleInv.invAny() 
*/

/*
<<inventory>> macro

syntax:
<<inventory (optional: separator)>>

	*separator: a string

description:
displays the inventory with each item separated by the provided string.  if no argument is given, each item appears on a new line.

examples:
assume the inventory includes: 'business card', 'keys', 'cellphone'

<<inventory>> will yield:
	business card
	keys
	cellphone

<<inventory ', '>> will yield:
	business card, keys, cellphone

<<inventory 'hello!'>> will yield:
 business cardhello!keyshello!cellphone
 
etc.
*/
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

/*
<<pickup>> macro

syntax:
<<pickup (list of items)>>

	*list of items: items should generally be strings
	
description:
adds items to the inventory.  new items are added to the end of the inventory.

examples:
<<pickup 'rusty key'>> // adds 'rusty key' to the end of the inventory
<<pickup 'key' 'ball'>> //adds 'key' and 'ball' to the inventory
<<pickup rusty key>> // !!! passing arguments that aren't quoted can cause problems.  in this case, 'rusty' and 'key' will be added to the inventory as two separate objects.
*/
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

/*
<<drop>> macro

syntax:
<<drop (list of items)>>

	*list of items: items should generally be strings
	
description:
removes items from the inventory.  if an item can't be found, nothing happens (it won't raise an error).

examples:
<<drop 'rusty key'>> // removes 'rusty key' from the inventory, if it is in the inventory
<<drop 'key' 'ball'>> //removes 'key' and 'ball' from the inventory, if either is found in the inventory
*/
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

/*
<<invWhereIs>> macro

syntax:
<<invWhereIs (item)>>

	*item: a single item, passed as a string
	
description:
for debugging/extending the system.  stashes the index of the requested item in the temporary variable _is.  if no such item exists in the array, _is is set to -1
*/
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

/*
<<invWhatIs>> macro

syntax:
<<invWhatIs (index)>>

	*index: a number corresponding to a position in the inventory array
	
description:
for debugging/extending the system.  stashes the item found in the index in the temporary variable _is.  if no such item exists at the provided index, _is is set to 'nothing'
*/
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

/*
<<invSort>> macro

syntax:
<<invSort>>
	
description:
sorts the inventory alphabetically.  the default inventory order is chronological.  note that the default order cannot easily be restored.
*/
Macro.add('invSort', {
	handler : function () {
	
		var items = setup.simpleInv.invRef();
		var items = items.sort();
	}
});

/*
<<has>> macro

syntax:
<<has (list of items)>>...<<otherwise>>...<</has>>

	*list of items: items should generally be strings
	
description:
a simple alternative to <<if>><<else>><</if>> that specifically works within the inventory system.  if more than one item is passed to <<has>>, !!!all of them must be present for the <<has>> statement to be true.  if you need more control than that, use the helper functions invAll() and invAny() with normal <<if>> statements.

examples:
<<has 'key'>>\
	You have the key!
	[[Unlock the door.]]
<</has>>

<<has 'key'>>\
	You have the key!
	[[Unlock the door.]]
<<otherwise>>
	The door is locked tight and you can't get it open.
<</has>>

!!!At this point, use <<if>>.  Still, it does work:
<<has 'helmet' 'breastplate' 'greaves' 'gauntlets' 'boots'>>
	You have a full set of armor on.
<<otherwise>>
	<<has 'sword'>>
		At least you're armed.
	<<otherwise>>
		You're not prepared at all for this...
	<</has>>
<</has>>
*/
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
			content = (this.payload[1].contents) ? this.payload[1].contents : '';
		}
		
		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);
	
	}

});