// cycles system, by chapel; for sugarcube 2
// version 1.1
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#cycles-system

// create namespace:
setup.cycSystem = {};

// options object:
// v1.1b: added runNew option: if false, <<newcycle>>s start suspended; changes startTag to resetTag
setup.cycSystem.options = {
	storyVar  : 'cycles',
	resetTag  : 'resetcycles',
	pauseTag  : 'pausecycles',
	menuTag   : 'menupause',
	runNew    : true,
	tryGlobal : true
};

// create the story variable and ref functions
// v1.1b: added $(storyVar).rng array and $(storyVar).spd array for running and suspended cylces;
// v1.1b: $(storyVar).all still holds all defined cycles
State.variables[setup.cycSystem.options.storyVar] = {
	all : [],
	rng : [],
	spd : []
};
setup.cycSystem.cycRef = () => State.variables[setup.cycSystem.options.storyVar];
setup.cycSystem.tag = function(type) { 
	if (type === 'reset') {
		return setup.cycSystem.options.resetTag;
	} else if (type === 'pause') {
		return setup.cycSystem.options.pauseTag;
	} else if (type === 'menu') {
		return setup.cycSystem.options.menuTag;
	}
}

// helper functions:
setup.cycSystem.checkCycle = function(name, value) {
	// returns true if value of named cycle === named cycle's current value
	var cycles = setup.cycSystem.cycRef();
	var check  = clone(cycles[name].current);
	var check  = check.toLowerCase();
	var value  = value.toLowerCase();
	
	if (check === value) {
		return true;
	}
	return false;
}

setup.cycSystem.cycleTurns = function(name) {
	// returns length of one cycle change
	var cycles = setup.cycSystem.cycRef();
	var turns  = clone(cycles[name].turns);
	return turns;
}

setup.cycSystem.cycleCurrentTurns = function(name) {
	// returns current *total* number of turns
	var cycles = setup.cycSystem.cycRef();
	var time   = clone(cycles[name].time);
	return time;
}

setup.cycSystem.cycleTotal = function(name) {
	// returns length of one complete cycle rotation
	var cycles = setup.cycSystem.cycRef();
	var turns  = clone(cycles[name].turns);
	var length = clone(cycles[name].length);
	return turns * length;
}

setup.cycSystem.cycleStatus = function(name) {
	// returns cycle status
	// v1.1b: added tests for 'running' and 'suspended' status; now returns null for nonexistant cycles
	var cycles = setup.cycSystem.cycRef();
	var test;
	if (cycles.all.includes(name)) {
		test = (cycles.spd.includes(name)) ? 'suspended' : 'running';
	} else {
		test = null;
	}
	return test;
}

// v1.1b: new function cycleExists()
setup.cycSystem.cycleExists = function(name) {
	// returns true if cycle exists, false if cycle cannot be found
	var cycles = setup.cycSystem.cycRef();
	if (cycles.all.includes(name)) {
		return true
	}
	return false;
}

setup.cycSystem.cycleSinceLast = function(name) {
	// returns number of turns since last change
	// v1.1b: returns -1 on suspended cycles
	var cycles = setup.cycSystem.cycRef();
	if (cycles.rng.includes(name)){
		var time   = clone(cycles[name].time);
		var turns  = clone(cycles[name].turns);
		return (time % turns) + 1;
	} else if (cycles.spd.includes(name)) {
		return -1;
	}
}

setup.cycSystem.getCycle = function(name, prop) {
	// returns a property from cycle definition
	var cycles   = setup.cycSystem.cycRef();
	var property = clone(cycles[name][prop]);
	return property;
}

// alias helper functions globally, if name is free
if (setup.cycSystem.options.tryGlobal) {
	// check tryGlobal option
	if (typeof window.checkCycle == 'undefined') {
		window.checkCycle = setup.cycSystem.checkCycle;
	}
	if (typeof window.cycleTurns == 'undefined') {
		window.cycleTurns = setup.cycSystem.cycleTurns;
	}
	if (typeof window.cycleCurrentTurns == 'undefined') {
		window.cycleCurrentTurns = setup.cycSystem.cycleCurrentTurns;
	}
	if (typeof window.cycleTotal == 'undefined') {
		window.cycleTotal = setup.cycSystem.cycleTotal;
	}
	if (typeof window.cycleStatus == 'undefined') {
		window.cycleStatus = setup.cycSystem.cycleStatus;
	}
	if (typeof window.cycleExists == 'undefined') {
		window.cycleExists = setup.cycSystem.cycleExists;
	}
	if (typeof window.cycleSinceLast == 'undefined') {
		window.cycleSinceLast = setup.cycSystem.cycleSinceLast;
	}
	if (typeof window.getCycle == 'undefined') {
		window.getCycle = setup.cycSystem.getCycle;
	}
}

// set up predisplay task object to count turns:
predisplay['cycleSystem'] = function (taskName) {

	var cycles      = setup.cycSystem.cycRef();
	var resetTag    = setup.cycSystem.tag('reset');
	var pauseTag    = setup.cycSystem.tag('pause');
	var menuTag     = setup.cycSystem.tag('menu');
	var totalCycles = cycles.rng.length;
	var prev        = previous();
	
	var i;
	var clock;
	var time;
	var turns;
	var length;
	var current;
	
	// test for pause tag and existence of cycles
	// v 1.1b: add tests for menuTag
	if (totalCycles > 0 && 
		!tags().includes(pauseTag) && 
		!tags().includes(menuTag) && 
		!tags(prev).includes(menuTag) ) {
	
		// main loop
		// v1.1b: fixed repeat pause; pulls cycles from rng instead of all
		for (i = 0; i < totalCycles; i++) {
			// cycles through the (running) cycles!
			current = cycles.rng[i];
				
			if (tags().includes(resetTag)) {
			// test for reset tag
				cycles[current].time = 0;
			} else {
			// collect turn if tags are acceptable
				cycles[current].time++;
			}
				
			// set up some variables
			time    = cycles[current].time;
			time    = (time < 0) ? 0 : time;
			turns   = cycles[current].turns;
			length  = cycles[current].length; 
				
			// set the current value of each cycle according to turns
			clock = Math.trunc(time / turns);
			clock = clock % length;
			
			// the finale:
			cycles[current].current = cycles[current].values[clock];
		}
	}
	
};

// <<newcycle>> macro
// v1.1b: improved overwriting features, added rng and spd tests, test for runNew option
Macro.add('newcycle', {
	handler : function () {

		// get basic defintion
		var cycles = setup.cycSystem.cycRef();
		var length = this.args.length;
		var key    = clone(this.args[0]);        // deep copy
		var turns  = clone(this.args[length-1]); // deep copy
		var run    = setup.cycSystem.options.runNew;
		var del;

		// get values
		var cycleArray  = clone(this.args);       // deep copy
		cycleArray.shift();
		cycleArray.pop();
		length = cycleArray.length;

		// create cycle definition (will overwrite cycles with same name)
		cycles[key] = {
			name    : key,
			values  : cycleArray,
			length  : length,
			turns   : turns,
			current : cycleArray[0],
			time    : 0
		};
		
		// overwrite existing cycles if same name is provided, without duplicating in arrays;
		// doubles will get counted twice, and eat processing power
		if (cycles.all.includes(key)) {
			del = cycles.all.indexOf(key);
			cycles.all.deleteAt(del);
			if (cycles.rng.includes(key)) {
				del = cycles.rng.indexOf(key);
				cycles.rng.deleteAt(del);
			}
			if (cycles.spd.includes(key)) {
				del = cycles.spd.indexOf(key);
				cycles.spd.deleteAt(del);
			}
		}
		
		// add references to $(storyVar).all array (and rng or spd arrays, conditionally)
		cycles.all.push(key);
		if (run) {
			cycles.rng.push(key);
		} else {
			cycles.spd.push(key);
		}

	}

});

// <<deletecycle>> macro
// v1.1b: added deletion fro rng and spd arrays
Macro.add('deletecycle', {
	handler : function () {
	
		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var keys   = this.args;
		
		var current;
		var i;
		var del;
		
		// throw error if no such cycles exist
		if (!cycles.all.includesAll(keys)) {
			return this.error('cannot find cycles with all of the given names');
		}
		
		// find and delete indicated cycles and all references to them 
		for (i = 0; i < length; i++) {
			current = cycles.all[i];
			if (keys.includes(current)) {
				// remove reference from rng array
				if (cycles.rng.includes(current)) {
					del = cycles.rng.indexOf(current)
					cycles.rng.deleteAt(del);
				}
				// remove reference from spd array
				if (cycles.spd.includes(current)) {
					del = cycles.spd.indexOf(current)
					cycles.spd.deleteAt(del);
				}
				// delete cycle definition and reference from all array
				delete cycles[current];
				cycles.all.deleteAt(i);
			}
		}
		
	}
	
});

// <<resetcycle>> macro
Macro.add('resetcycle', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var keys   = this.args;
		
		var current;
		var i;
		
		// throw error if no such cycles exist
		if (!cycles.all.includesAll(keys)) {
			return this.error('cannot find cycles with all of the given names');
		}
		
		// find and reset indicated cycles
		for (i = 0; i < length; i++) {
			current = cycles.all[i];
			if (keys.includes(current)) {
				cycles[current].time = 0;
			}
		}

	}

});

// <<resetallcycles>> macro
// v1.1b: you can now provide keyword 'running' or 'suspended' to target a group of cycles
Macro.add('resetallcycles', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		var length;
		var i;
		var key;
		var group;
		
		// throw error if more than one argument is passed
		if (this.args.length > 1) {
			return this.error('incorrect number of arguments');
		
		// identify the group
		} else if (this.args.length === 0 || this.args[0] === 'all') {
			group = 'all';
		} else if (this.args[0] === 'running' || this.args[0] === 'rng') {
			group = 'rng';
		} else if (this.args[0] === 'suspended' || this.args[0] === 'spd') {
			group = 'spd';
		
		// throw error if argument is not a recognized group
		} else {
			return this.error('unknown cycle group: ' + this.args[0] +
			'.  groups can be "running", "suspended", or "all". cannot reset.');
		}
		
		// set up group array and get the length
		group  = cycles[group];
		length = group.length;
		
		// reset every cycle in the group
		for (i = 0; i < length; i++) {
			key = group[i];
			cycles[key].time = 0;
		}

	}

});

// <<suspendcycle>> macro [added: v1.1b]
Macro.add('suspendcycle', {
	handler : function () {

		var cycles  = setup.cycSystem.cycRef();
		var length  = cycles.all.length;
		var keys    = this.args;
		var running = true;
		
		var current;
		var del;
		var i;
		
		// check the cycles (save on processing)
		if (!cycles.all.includesAny(keys)) {
			running = false; // none of the provided cycles exists
		} else if (cycles.spd.includesAll(keys)) {
			running = false; // none of the provided cycles is running
		}
		
		// find and suspend the indicated cycles
		if (running) { // if any provided cycles can be suspended
			// main loop
			for (i = 0; i < length; i++) {
				current = cycles.all[i];
				// test for cycle
				if (keys.includes(current) && cycles.rng.includes(current)) {
					cycles.spd.push(current);
					del = cycles.rng.indexOf(current);
					cycles.rng.deleteAt(del);
				}
			}
		}
		// don't throw errors if cycle isn't found

	}

});

// <<resumecycle>> macro [added: v1.1b]
Macro.add('resumecycle', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var keys   = this.args;
		var susp   = true;
		
		var current;
		var del;
		var i;
		
		// check the cycles (save on processing)
		if (!cycles.all.includesAny(keys)) {
			susp = false; // none of the provided cycles exists
		} else if (cycles.rng.includesAll(keys)) {
			susp = false; // none of the provided cycles is suspended
		}
		
		// find and resume the indicated cycles
		if (susp) { // if any provided cycles can be resumed
			// main loop
			for (i = 0; i < length; i++) {
				current = cycles.all[i];
				// test for cycle
				if (keys.includes(current) && cycles.spd.includes(current)) {
					cycles.rng.push(current);
					del = cycles.spd.indexOf(current);
					cycles.spd.deleteAt(del);
				}
			}
		}
		// don't throw errors if cycle isn't found

	}

});

// <<showcycle>> macro
Macro.add('showcycle', {
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = 'macro-' + this.name;
		var cycles    = setup.cycSystem.cycRef();
		var content;
		
		if (this.args.length > 2){
			// check args
			return this.error('incorrect number of arguments');
		} else {
			// does cycle exist?
			var key = this.args[0];
			if (!cycles.all.includes(key)) {
				return this.error('no cycle named ' + key + ' exists');
			}
		}
		
		// format string if needed
		if (this.args.length === 2) {
			var check  = this.args[1].toLowerCase();
			var format = (check === 'format') ? true : false;
		}
		
		// set content and output
		content = cycles[key].current;
		content = (format) ? content.toLowerCase().toUpperFirst() : content;
		
		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);

	}

});

					// utilities :

// <<cycleIs>> macro
Macro.add('cycleIs', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		
		if (this.args.length !== 1){
			return this.error('you must provide one argument: the name of the cycle to check');
		} else {
			var key = this.args[0];
			if (!cycles.all.includes(key)) {
				return this.error('no cycle named ' + key + ' exists');
			}
		}
		
		State.temporary.is = clone(cycles[key].current); // deep copy

	}

});

// <<whereIsCycle>> macro
Macro.add('whereIsCycle', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		
		if (this.args.length !== 1){
			return this.error('you must provide one argument: the name of the cycle to check');
		} else {
			var key = this.args[0];
			if (!cycles.all.includes(key)) {
				return this.error('no cycle named ' + key + ' exists');
			}
		}
		
		State.temporary.is = clone(cycles.all.indexOf(key)); // deep copy

	}

});

// <<cycleArrayIs>> macro
Macro.add('cycleArrayIs', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		
		if (this.args.length !== 1){
			return this.error('you must provide one argument: the name of the cycle to check');
		} else {
			var key = this.args[0];
			if (!cycles.all.includes(key)) {
				return this.error('no cycle named ' + key + ' exists');
			}
		}
		
		State.temporary.is = clone(cycles[key].values); // deep copy

	}

});

// <<cycleAtIs>> macro
Macro.add('cycleAtIs', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		
		if (this.args.length !== 1){
			return this.error('you must provide one argument: the index of the $(storyVar).all array to check');
		} else {
			var index = this.args[0];
			if (index >= cycles.all.length) {
				return this.error('no cycle exists at index ' + index);
			} else {
				var key = clone(cycles.all[index]); // deep copy
			}
		}
		
		State.temporary.is = key;

	}

});

// <<defineCycle>> macro
Macro.add('defineCycle', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		
		if (this.args.length !== 1){
			return this.error('you must provide one argument: the name of the cycle to check');
		} else {
			var key = this.args[0];
			if (!cycles.all.includes(key)) {
				return this.error('no cycle named ' + key + ' exists');
			}
		}
		
		// make deep copy to preserve cycle definition
		State.temporary.def = clone(cycles[key]);

	}

});