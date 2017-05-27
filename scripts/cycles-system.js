// cycles system, by chapel; for sugarcube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#cycles-system

// create namespace:
setup.cycSystem = {};

// options object:
setup.cycSystem.options = {
	storyVar  : 'cycles',
	startTag  : 'startcycles',
	pauseTag  : 'pausecycles',
	menuTag   : 'menupause',
	tryGlobal : true
};

// create the story variable and ref functions
State.variables[setup.cycSystem.options.storyVar] = {
	all  : [],
};
setup.cycSystem.cycRef = () => State.variables[setup.cycSystem.options.storyVar];
setup.cycSystem.tag = function(type) { 
	if (type === 'start') {
		return setup.cycSystem.options.startTag;
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
	// returns true if cycle exists, false otherwise
	var cycles = setup.cycSystem.cycRef();
	var test   = cycles.all.includes(name);
	return test;
}

setup.cycSystem.cycleSinceLast = function(name) {
	// returns number of turns since last change
	var cycles = setup.cycSystem.cycRef();
	var time   = clone(cycles[name].time);
	var turns  = clone(cycles[name].turns);
	return (time % turns) + 1;
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
	var startTag    = setup.cycSystem.tag('start');
	var pauseTag    = setup.cycSystem.tag('pause');
	var menuTag     = setup.cycSystem.tag('menu');
	var totalCycles = cycles.all.length;
	
	var i;
	var clock;
	var time;
	var turns;
	var length;
	var current;
	
	// test for pause tag and existence of cycles
	if (!tags().includes(pauseTag) && totalCycles) {
	
		// main loop
		for (i = 0; i < totalCycles; i++) {
			// cycles through the cycles!
			current = cycles.all[i];
				
			if (tags().includes(menuTag)) {
			// test for repeat pause tag
				cycles[current].time--;
			} else if (tags().includes(startTag)) {
			// test for start tag
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
Macro.add('newcycle', {
	handler : function () {

		// get basic defintion
		var cycles      = setup.cycSystem.cycRef();
		var length      = this.args.length;
		var key         = clone(this.args[0]);
		var turns       = clone(this.args[length-1]);

		// get values
		var cycleArray  = clone(this.args);
		cycleArray.shift();
		cycleArray.pop();
		length = cycleArray.length;

		// create cycle definition
		cycles[key] = {
			name    : key,
			values  : cycleArray,
			length  : length,
			turns   : turns,
			current : cycleArray[0],
			time    : 0
		};
		
		// add reference to $(storyVar).all array
		cycles.all.push(key);

	}

});

// <<deletecycle>> macro
Macro.add('deletecycle', {
	handler : function () {
	
		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var keys   = this.args;
		
		var current;
		var i;
		
		// throw error if no such cycle exists
		if (!cycles.all.includesAll(keys)) {
			return this.error('cannot find cycles with all of the given names');
		}
		
		// find and delete indicated cycles
		for (i = 0; i < length; i++) {
			current = cycles.all[i];
			if (keys.includes(current)) {
				cycles.all.deleteAt(i);
				delete cycles[current];
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
		
		// throw error if no such cycle exists
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
Macro.add('resetallcycles', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var i;
		var key;
		
		// reset every cycle
		for (i = 0; i < length; i++) {
			key = cycles.all[i];
			cycles[key].time = 0;
		}

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
		
		State.temporary.is = clone(cycles[key].current);

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
		
		State.temporary.is = clone(cycles.all.indexOf(key));

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
		
		State.temporary.is = clone(cycles[key].values);

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
				var key = clone(cycles.all[index]);
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