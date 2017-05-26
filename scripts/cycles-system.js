// cycles system, by chapel; for sugarcube 2
// version 1.0

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
/* Explanation:
	storyVar:
		This system automatically creates a story variable object.  You can change the name of the created variable (default: '$cycles') to whatever you prefer.
	startTag:
		The startTag's value is a passage tag that will reset all cycles to 0 turns, and can be used instead of the <<resetallcycles>> macro.  By default, the tag is 'startcycles'.  You can configure the name of the tag to your liking with this option.  !!!Note: passage tags should not include spaces.
	pauseTag:
		The pauseTag's value is a passage tag that will temporarily pause all cycles for the given passage, preventing them from collecting a turn.  By default, the tag is 'pausecycles'.  You can configure the name of the tag to your liking with this option.  !!!Note: passage tags should not include spaces.
	menuTag:
		The menuTag's value is a passage tag that will prevent all cycles from collecting turns in both the tagged passage and the passage immediately following it.  The idea behind this tag is to use it for menu options, so that entering and exiting a menu will not cause cycles' turns to increment.  By default, the tag is 'menupause'.  You can configure the name of the tag to your liking with this option.  !!!Note: passage tags should not include spaces.
	tryGlobal:
		The functions included in this script are scoped into the setup.cycSystem namespace, and references to those functions are passed to the global scope as long as their names aren't taken.  Set this option to false to force the functions to remain in the setup.cycSystem namespace.
*/

/* A few notes:
	1. Cycles are independently tracked.  This means that cycles that are added later start their tracking later.  For example, if you create the cycle <<newcycle 'time' 'morning' 'noon' 'night' 3>> and then, after 2 turns, create the cycle <<newcycle 'days' 'Sunday' 'Monday' 'Tuesday' 'Wednesday' 'Thursday' 'Friday' 'Saturday' 9>>, the two cycles will not line up: each new 'day' will start at the 'time' cycle's 'noon'. Generally, it's best to include all your <<newcycle>> statements in the same passage (StoryInit is a good candidate), or, if you need your cycles to line up, use the startTag (default: 'startcycles') or the <<resetallcycles>> macro to reset all of your cycles to zero upon adding a new one.
	
	2. It is **not possible** to reclaim a cycle that has been deleted by the <<deletecycle>> macro.  Generally, it's better to simply hide the cycle's output than to delete it if you feel that you may need to use it again; you can always reset it via <<resetcycle>> if you need it to appear to have been 'stopped'.
	
	3. You do not have to delete a cyle to reconfigue it.  You can use the <<newcycle>> macro to make alterations to an existing cycle; the old cycle will be overwritten.  Note that, like with <<deletecycle>>, it is impossible to reclaim an overwritten cycle.
	
	4. The macros that 'return' temporary variables (<<cycleIs>>, <<whereIsCycle>>, <<cycleArrayIs>>, <<cycleAtIs>> and <<defineCycle>>) are designed for debugging and extending the cycle system.  You will almost never need to resort to these macros if you are using the system as-is.
*/

// create the story variables
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

// checkCycle() helper function
setup.cycSystem.checkCycle = function(name, value) {
	var cycles = setup.cycSystem.cycRef();
	var check  = clone(cycles[name].current);
	var check  = check.toLowerCase();
	var value  = value.toLowerCase();
	
	if (check === value) {
		return true;
	}
	return false;
}

// alias helper function in global scope, if name is free
if (typeof window.checkCycle == 'undefined' && setup.cycSystem.options.tryGlobal) {
	window.checkCycle = setup.cycSystem.checkCycle;
}

/*
global    : <<if checkCycle('name of cycle', 'value of cycle')>>...
nonglobal : <<if setup.cycSytem.checkCycle('name of cycle', 'value of cycle')>>...
*/

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

/*
<<newcycle>> macro

syntax:
<<newcycle (name) (list of values) (turns)>>

	*name: the name of the new cycle to create, a string; should follow the rules for naming TwineScript variables
	*list of values:  the values the cycle will rotate through
	*turns: the number of turns it takes for the value of the cycle to change once

explanation:
the <<newcycle>> macro is used to contruct a new cycle.  the cycle's definition will be saved automatically to a story variable (default $cycles.nameOfCycle).  the first argument provided should be a valid name; the name will need to be written like a valid TwineScript variable, though without any kind of sigil.  the following arguments should be strings defining the values associated with the cycle.  the final argument should always be a number, and will represent how many turns it take the cycle to move from one value to the next.  when the last value is reached and the appropriate number of turns pass, the cycle will restart.

examples:
<<newcycle 'timeOfDay' 'morning' 'afternoon' 'evening' 'night' 2>>
// creates a new cycle called 'timeOfDay', and change the value every other turn

<<newcycle 'days' 'Sunday' 'Monday' 'Tuesday' 'Wednesday' 'Thursday' 'Friday' 'Saturday' 8>>
// creates a new cycle called 'days' that changes the day of the week every 8 turns

<<newcycle 'seasons' 'spring' 'summer' 'fall' 'winter' 100>>
// creates a new cycle called 'seasons' that changes the season every 100 turns
*/
Macro.add('newcycle', {
	handler : function () {

		var cycles      = setup.cycSystem.cycRef();
		var length      = this.args.length;

		var key         = clone(this.args[0]);
		var turns       = clone(this.args[length-1]);

		var cycleArray  = clone(this.args);
		cycleArray.shift();
		cycleArray.pop();
		length = cycleArray.length;

		cycles[key] = {
			name    : key,
			values  : cycleArray,
			length  : length,
			turns   : turns,
			current : cycleArray[0],
			time    : 0
		};
		
		cycles.all.push(key);

	}

});

/*
<<deletecycle>> macro

syntax:
<<deletecycle (list of cycles)>>

	*list of cycles: a list of cycle names, provided as quoted strings and separated by spaces.

explanation:
the <<deletecycle>> macro deletes any and all of the cycles provided to it.  deleted cycles are no longer tracked and cannot be recovered.  if a cycle provided to the macro does not exist, the macro will raise an error.

examples:
<<deletecycle 'timeOfDay'>> // deletes the cycle named 'timeOfDay'
<<deletecycle 'day' 'seasons'>> // deletes the cycles 'day' and 'seasons'
*/
Macro.add('deletecycle', {
	handler : function () {
	
		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var keys   = this.args;
		
		var current;
		var i;
		
		if (!cycles.all.includesAll(keys)) {
			return this.error('cannot find cycles with all of the given names');
		}
		
		for (i = 0; i < length; i++) {
			current = cycles.all[i];
			if (keys.includes(current)) {
				cycles.all.deleteAt(i);
				delete cycles[current];
			}
		}
		
	}
	
});

/*
<<resetcycle>> macro

syntax:
<<resetcycle 'list of cycles'>>

	*list of cycles: a list of cycle names, provided as quoted strings and separated by spaces.

explanation:
the <<resetcycle>> macro resets all of the cycles provided to it back to their initial state, as though no turns had passed.  if a cycle provided to the macro does not exist, the macro will raise an error.

<<resetcycle 'timeOfDay'>> // resets the cycle named 'timeOfDay' to 0 turns
<<resetcycle 'day' 'seasons'>> // resets the cycles 'day' and 'seasons' to 0 turns
*/
Macro.add('resetcycle', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var keys   = this.args;
		
		var current;
		var i;
		
		if (!cycles.all.includesAll(keys)) {
			return this.error('cannot find cycles with all of the given names');
		}
		
		for (i = 0; i < length; i++) {
			current = cycles.all[i];
			if (keys.includes(current)) {
				cycles[current].time = 0;
			}
		}

	}

});

/*
<<resetallcycles>> macro

syntax:
<<resetallcycles>>

explanation:
resets all currently running cycles to 0 turns.  similar to <<resetcycle>>, but affects all cycles.  functionally the same at the startTag passage tag.

examples:
<<resetallcycles>>
*/
Macro.add('resetallcycles', {
	handler : function () {

		var cycles = setup.cycSystem.cycRef();
		var length = cycles.all.length;
		var i;
		var key;
		
		for (i = 0; i < length; i++) {
			key = cycles.all[i];
			cycles[key].time = 0;
		}

	}

});

/*
<<showcycle>> macro

syntax:
<<showcycle (cycle) (optional: 'format' keyword)>>

	*cycle: the name of an existing cycle, passed as a quoted string.
	*'format' keyword: if the keyword 'format' is included, the cycle's current value will be displayed with the first letter upper-case and all other letters lower-case

explanation:
the <<showcycle>> macro outputs the current value of the indicated cycle, and optionally formats it for display.

examples:
//given <<newcycle 'time' 'early' 'late' 2>>, and turn 3:
<<showcycle 'time'>> // outputs 'early'
<<showcycle 'time' format>> // outputs 'Early'

//given <<newcycle 'time' 'early' 'LATE' 2>>, and turn 4:
<<showcycle 'time'>> // outputs 'LATE'
<<showcycle 'time' format>> // outputs 'Late'
*/
Macro.add('showcycle', {
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = 'macro-' + this.name;
		var cycles    = setup.cycSystem.cycRef();
		var content;
		
		if (this.args.length > 2){
			return this.error('incorrect number of arguments');
		} else {
			var key = this.args[0];
			if (!cycles.all.includes(key)) {
				return this.error('no cycle named ' + key + ' exists');
			}
		}
		
		if (this.args.length === 2) {
			var check  = this.args[1].toLowerCase();
			var format = (check === 'format') ? true : false;
		}
		
		content = cycles[key].current;
		content = (format) ? content.toLowerCase().toUpperFirst() : content;
		
		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output);

	}

});

/*
<<cycleIs>> macro

syntax:
<<cycleIs (cycle)>>

	*cycle: the name of an existing cycle, passed as a quoted string.
	
explanation:
<<cycleIs>> is primarily for debugging/extending the system.  this macro sets the value of the temporary variable _is to the current value of the indicated cycle.
*/
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
		
		State.temporary.is = cycles[key].current;

	}

});

/*
<<whereIsCycle>> macro

syntax:
<<whereIsCycle (cycle)>>

	*cycle: the name of an existing cycle, passed as a quoted string.
	
explanation:
<<whereIsCycle>> is primarily for debugging/extending the system.  this macro sets the value of the temporary variable _is to the current index of the indicated cycle in the $(storyVar).all array, an array that stores the name of all currently running cycles.
*/
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
		
		State.temporary.is = cycles.all.indexOf(key);

	}

});

/*
<<cycleArrayIs>> macro

syntax:
<<cycleArrayIs (cycle)>>

	*cycle: the name of an existing cycle, passed as a quoted string.
	
explanation:
<<cycleIs>> is primarily for debugging/extending the system.  this macro sets the value of the temporary variable _is to the array of possible values of the indicated cycle.
*/
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
		
		State.temporary.is = cycles[key].values;

	}

});

/*
<<cycleAtIs>> macro

syntax:
<<cycleAtIs (index)>>

	*index: a numeric position in the $(storyVar).all array.
	
explanation:
<<cycleAtIs>> is primarily for debugging/extending the system.  this macro sets the value of the temporary variable _is to the name of the cycle in the indicated index of the $(storyVar).all array. sets _is to undefined if no value exists in the provided index.
*/
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
				var key = cycles.all[index];
			}
		}
		
		State.temporary.is = key;

	}

});

/*
<<defineCycle>> macro

syntax:
<<defineCycle (cycle)>>

	*cycle: the name of an existing cycle, passed as a quoted string.
	
explanation:
<<defineCycle>> is primarily for debugging/extending the system.  this macro sets the value of the temporary variable _def to a deep copy of the indicated cycle object.  changes to the _def variable will not be reflected in the actual cycle.  you should generally treat cycles as read-only anyway, and overwrite cycles with new ones using the same name if you need to alter them.
*/
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
		
		State.temporary.def = clone(cycles[key]);

	}

});