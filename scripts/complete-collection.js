// chapel's custom macros complete collection for sugarcube 2
// version 1.2
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2

// create namespaces:
setup.cycSystem    = {};
setup.simpleInv    = {};
setup.playTime     = {};
setup.messageMacro = {};

// options objects:
	// cycles
setup.cycSystem.options = {
	storyVar  : 'cycles',
	resetTag  : 'resetcycles',
	pauseTag  : 'pausecycles',
	menuTag   : 'menupause',
	runNew    : true,
	tryGlobal : true
};
	// simple inventory
setup.simpleInv.options = {
	storyVar  : 'inventory',
	tryGlobal : true
};
	// play time
setup.playTime.options = {
	storyVar : 'playTime',
	pauseTag : 'pausetimer'
};
	// message macro
setup.messageMacro.default = 'Help';

// create the story variable and ref functions
	// cycles
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

	// simple inventory
State.variables[setup.simpleInv.options.storyVar] = [];
setup.simpleInv.invRef = () => State.variables[setup.simpleInv.options.storyVar];

	// play time
State.variables[setup.playTime.options.storyVar] = {
	 hr : 0,
	min : 0,
	sec : 0,
	 ms : 0,
	str : ''
};
setup.playTime.ptRef = () => State.variables[setup.playTime.options.storyVar];

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

	// simple inventory
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

// alias helper functions globally, if name is free
	// cycles
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

	// simple inventory
if (typeof window.invAll == 'undefined' && setup.simpleInv.options.tryGlobal) {
	window.invAll = setup.simpleInv.invAll;
}
if (typeof window.invAny == 'undefined' && setup.simpleInv.options.tryGlobal) {
	window.invAny = setup.simpleInv.invAny;
}

// play time's timeCount() function
setup.playTime.timeCount = function (timer) {
	// check for pause tag
	if (!tags().includes(setup.playTime.options.pauseTag)) {
		timer.ms += time();
		
		// get time in ms and split it into hr:min:sec
		if (timer.ms >= 1000) {
			timer.sec += Math.trunc(timer.ms / 1000);
			timer.ms   = timer.ms % 1000;
		}
		if (timer.sec >= 60) {
			timer.min += Math.trunc(timer.sec / 60);
			timer.sec  = timer.sec % 60;
		}
		if (timer.min >= 60) {
			timer.hr  += Math.trunc(timer.min / 60);
			timer.min  = timer.min % 60;
		}
		
		// add leading 0's (if necessary)
		var hh = (timer.hr < 10)  ? 
				'0' + timer.hr  : timer.hr;
		var mm = (timer.min < 10) ? 
				'0' + timer.min : timer.min;
		var ss = (timer.sec < 10) ? 
				'0' + timer.sec : timer.sec;
		
		// format time string and save to story variable property 'str'
		timer.str = '<b>' + hh + ':' + mm + '</b>:' + ss;
	}
} 

// task objects
	// set up predisplay task object to count turns for cycles
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

	// set up prehistory timer for play time
prehistory["logTime"] = function (taskName) {
	// log time before old passage transitions out
	var t = setup.playTime.ptRef();
	setup.playTime.timeCount(t);
};

			// MACROS

			/*  CYCLES SYSTEM MACROS */

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

			/* SIMPLE INVENTORY MACROS */

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

			/* MISC. MACROS */

// <<playtime>> macro
Macro.add('playtime', {
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = 'macro-' + this.name;
		var timer     = setup.playTime.ptRef();
		var content   = timer.str;

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);
		
	}

});

// <<fadein>> macro
Macro.add('fadein', {
	   tags : null,
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = ('macro-' + this.name);
		var content   = this.payload[0].contents;
		var delay     = 0;
		var time      = 0;

		if (this.args.length === 1) {
			var delay = 0;
			var time  = this.args[0] * 1000;
		} else if (this.args.length === 2) {
			var delay = this.args[0] * 1000;
			var time  = this.args[1] * 1000;
		} else {
			return this.error('incorrect number of arguments...');
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output)
			.hide()
			.delay(delay)
			.fadeIn(time);

	}
});

// <<fadeout>> macro
Macro.add('fadeout', {
	   tags : null,
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = ('macro-' + this.name);
		var content   = this.payload[0].contents;
		var delay     = 0;
		var time      = 0;

		if (this.args.length === 1) {
			var delay = 0;
			var time  = this.args[0] * 1000;
		} else if (this.args.length === 2) {
			var delay = this.args[0] * 1000;
			var time  = this.args[1] * 1000;
		} else {
			return this.error('incorrect number of arguments...');
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output)
			.delay(delay)
			.fadeOut(time);

	}
});

// <<first>> macro
Macro.add('first', {
	   tags : ['then', 'finally'],
	handler : function () {

		var $wrapper    = $(document.createElement('span'));
		var className   = 'macro-' + this.name;
		var length      = this.payload.length;
		var visits       = visited() - 1;
		var lastTag     = this.payload[ length - 1 ].name;
		var lastContent = this.payload[ length - 1 ].contents;
		var content;

		if (visits < length){
			content = this.payload[visits].contents;
		} else {
			content = (lastTag === 'finally') ? lastContent : '';
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);
	}

});

// <<message>> macro
Macro.add('message', {
	tags    : null,
	handler : function () {
		var message  = this.payload[0].contents;
		var $wrapper = $(document.createElement('span'));
		var $link    = $(document.createElement(this.args.includes('btn') ? 'button' : 'a'));
		var $content = $(document.createElement('span'));

		$link
			.wiki(this.args.length > 0 && this.args[0] !== 'btn' ? this.args[0] : setup.messageMacro.default)
			.ariaClick(function () {
				if ($wrapper.hasClass('open')) {
					$content
						.css('display', 'none')
						.empty();
				}
				else {
					$content
						.css('display', 'block')
						.wiki(message);
				}

				$wrapper.toggleClass('open');
			});

		$wrapper
			.attr('id', 'macro-' + this.name + '-' + this.args.join('').replace(/[^A-Za-z0-9]/g, ''))
			.addClass('message-text')
			.append($link)
			.append($content)
			.appendTo(this.output);
	}
});

// <<dialog>> macro
Macro.add('dialog', {
	   tags : null,
	handler : function () {

		var content = this.payload[0].contents;
		
		if (this.args.length > 1) {
			var title = this.args[0];
			this.args.deleteAt(0);
			this.args.push('macro-' + this.name);
			var classNames = this.args.join(' ');
		} else if (this.args.length === 1) {
			var title = this.args[0];
			var classNames = 'macro-' + this.name;
		} else {
			var title = '';
			var classNames = 'macro-' + this.name;
		}
		
		Dialog.setup(title, classNames);
		Dialog.wiki(content);
		Dialog.open();
		
	}

});

// <<popup>> macro
Macro.add('popup', {
	handler : function () {
		
		if (this.args.length > 2) {
			var passageName = this.args[0];
			var title = this.args[1];
			this.args.deleteAt(0, 1);
			this.args.push('macro-' + this.name);
			var classNames = this.args.join(' ');
		} else if (this.args.length === 2) {
			var passageName = this.args[0];
			var title = this.args[1];
			var classNames = 'macro-' + this.name;
		} else if (this.args.length === 1) {
			var passageName = this.args[0];
			var title = '';
			var classNames = 'macro-' + this.name;
		} else {
			return this.error('need at least one argument; the passage to display');
		}
		
		Dialog.setup(title, classNames);
		Dialog.wiki(Story.get(passageName).processText());
		Dialog.open();
		
	}

});

// custom macro collection for the twine story format sugarcube 2, by chapel