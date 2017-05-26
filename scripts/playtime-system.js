// play time system, by chapel; for SugarCube 2
// version 1.0

// intialize namespace
setup.playTime = {};

// options object:
setup.playTime.options = {
	storyVar : 'playTime',
	pauseTag : 'pausetimer'
};
/* Explanation:
	storyVar:
		This system automatically creates a story variable object.  You can change the name of the created variable (default: '$playTime') to whatever you prefer.
	pauseTag:
		Tag passages with this tag to pause the timer.  !!!Should not inlcude spaces.  Defaults to 'pausetimer'.
*/

// create and initialize story variables
State.variables[setup.playTime.options.storyVar] = {
	 hr : 0,
	min : 0,
	sec : 0,
	 ms : 0,
	str : ''
};
setup.playTime.ptRef = () => State.variables[setup.playTime.options.storyVar];

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

prehistory["logTime"] = function (taskName) {
	// log time before old passage transitions out
	var t = setup.playTime.ptRef();
	setup.playTime.timeCount(t);
};

/*
<<playtime>> macro

syntax: 
<<playtime>>

description:
displays the formatted string of the current play time

alternative: <<print $(storyVar).str>>
*/
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