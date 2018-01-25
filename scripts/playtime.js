// play time system, by chapel; for SugarCube 2
// version 2.0.2

// intialize namespace
setup.playTime = {};

// options object:
setup.playTime.options = {
	tryGlobal : true,
	storyVar  : 'playtime',
	pauseTag  : 'pausetimer'
};

State.variables[setup.playTime.options.storyVar] = Date.now();

// grab starting time for story:
predisplay['start-playtime'] = function (t) {
	delete predisplay[t]; // single use
	if (!State.variables[setup.playTime.options.storyVar]) {
		State.variables[setup.playTime.options.storyVar] = Date.now();
	}
};

// pause tag handling
prehistory['pause-playtime'] = function (t) {
	if (tags().includes(setup.playTime.options.pauseTag)) {
		State.variables[setup.playTime.options.storyVar] += time();
	}
};

// the function:
setup.playTime.getMS = function () {
	return (Date.now() - State.variables[setup.playTime.options.storyVar]);
};

setup.playTime.getTimeArray = function (ms) {
	if (!ms || ms < 0 || typeof ms !== 'number') {
		return;
	}
	
	var time = [];
	
	time.push(Math.floor(ms / 1000) % 60); // second [0]
	time.push(Math.floor(ms / 60000) % 60); // minutes [1]
	time.push(Math.floor(ms / 3600000) % 24); // hours [2]
	
	return time;
};

// for users
var hourNames = ['h', 'hr', 'hrs', 'hour', 'hours'];
var minNames  = ['m', 'min', 'mins', 'minute', 'minutes'];
var secNames  = ['s', 'sec', 'secs', 'second', 'seconds'];
setup.playTime.get = function (m) {
	var ms   = setup.playTime.getMS();
	var time = setup.playTime.getTimeArray(ms);
	if (hourNames.includes(m)) {
		return time[2];
	}
	if (minNames.includes(m)) {
		return time[1];
	}
	if (secNames.includes(m)) {
		return time[0];
	}
	return ms;
};

setup.playTime.formatTime = function (arr, fmt) {
	if (!arr || !Array.isArray(arr) || arr.length < 3) {
		return;
	}
	
	var hr  = (arr[2] < 10) ? '0' + arr[2] : '' + arr[2],
		min = (arr[1] < 10) ? '0' + arr[1] : '' + arr[1],
		sec = (arr[0] < 10) ? '0' + arr[0] : '' + arr[0];
		
	if (fmt) {
		return '<b>' + hr + ':' + min + '</b>' + ':' + sec;
	}
	return hr + ':' + min + ':' + sec;
};

setup.playTime.output = function (fmt) {
	var ms = setup.playTime.getMS();
	return setup.playTime.formatTime(setup.playTime.getTimeArray(ms), fmt);
};

// global playTime() function
if (setup.playTime.options.tryGlobal) {
	window.playTime = window.getPlayTime || function (arg) {
		if (typeof arg === 'string') {
			return setup.playTime.get(arg);
		}
		return setup.playTime.output(arg);
	};
}
/* 
	playTime(arg):
		if (arg) is a string, returns a positive integer:

			* hour, hours, h, hr, etc            : returns hours
			* min, minutes, minute, m, mins, etc : returns minutes
			* sec, secs, s, second, seconds, etc : returns seconds
			* anyother string                    : returns milliseconds
			
		if (arg) is not a string:

			* (arg) is truthy : returns formatted time string
			* (arg) is falsey : returns unformatted time string
*/

// <<playtime>> macro
// if given the format argument, bold hours and minutes
Macro.add('playtime', {
	handler : function () {
		var arr = this.args.map(function (arg) {
			return String(arg).trim().toLowerCase();
		});
		var $wrapper = $(document.createElement('span'));
		var fmt      = arr.includesAny(['format', 'f', 'fmt', 'b', 'bold', 'true']);
		var string   = setup.playTime.output(fmt);
		
		$wrapper
			.wiki(string)
			.addClass('macro-' + this.name)
			.appendTo(this.output);
	}
});