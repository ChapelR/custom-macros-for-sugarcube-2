// play time system, by chapel; for SugarCube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#play-time-system

// intialize namespace
setup.playTime = {};

// options object:
setup.playTime.options = {
	storyVar : 'playTime',
	pauseTag : 'pausetimer'
};

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