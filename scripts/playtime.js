(function () {
    'use strict';
    // play time system, by chapel; for SugarCube 2
    // version 2.1.0

    // options object:
    var options = {
        tryGlobal : true,
        storyVar  : 'playtime',
        pauseTag  : 'pausetimer'
    };

    State.variables[options.storyVar] = Date.now();

    predisplay['start-playtime'] = function (t) {
        delete predisplay[t]; // single use
        // we need to grab a starting time so errors don't appear in user saves prior to adding this code:
        if (!State.variables[options.storyVar]) {
            State.variables[options.storyVar] = Date.now();
        }
    };

    // pause tag handling
    prehistory['pause-playtime'] = function (t) {
        if (tags().includes(options.pauseTag)) {
            State.variables[options.storyVar] += time();
        }
    };

    // the function:
    function _getMS () {
        return (Date.now() - State.variables[options.storyVar]);
    }

    function _getTimeArray (ms) {
        if (!ms || ms < 0 || typeof ms !== 'number') {
            return;
        }
        
        var time = [];
        
        time.push(Math.floor(ms / 1000) % 60); // second [0]
        time.push(Math.floor(ms / 60000) % 60); // minutes [1]
        time.push(Math.floor(ms / 3600000)); // hours [2]
        
        return time;
    }

    // set up valid args
    var hourNames = ['h', 'hr', 'hrs', 'hour', 'hours'];
    var minNames  = ['m', 'min', 'mins', 'minute', 'minutes'];
    var secNames  = ['s', 'sec', 'secs', 'second', 'seconds'];

    // user function
    function _getPlayTime (m) {
        var ms   = _getMS();
        var time = _getTimeArray(ms);
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
    }

    function _formatTime (arr, fmt) {
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
    }

    function _outputPlaytime (fmt) {
        var ms = _getMS();
        return _formatTime(_getTimeArray(ms), fmt);
    }

    /* 
        (setup|window).playTime(arg):
        
            if (arg) is a string, returns a positive integer:
                * hour, hours, h, hr, etc            : returns hours
                * min, minutes, minute, m, mins, etc : returns minutes
                * sec, secs, s, second, seconds, etc : returns seconds
                * anyother string                    : returns milliseconds

            if (arg) is not a string:
                * (arg) is truthy : returns formatted time string
                * (arg) is falsey : returns unformatted time string
    */

    // setup API
    setup.playTime = function (arg) {
        if (typeof arg === 'string') {
            return _getPlayTime(arg);
        }
        return _outputPlaytime(arg);
    };

    // global playTime() function
    if (options.tryGlobal) {
        window.playTime = window.playTime || setup.playTime;
    }

    // <<playtime>> macro
    // if given the format argument, bold hours and minutes
    Macro.add('playtime', {
        handler : function () {
            var arr = this.args.map(function (arg) {
                return String(arg).trim().toLowerCase();
            });
            var $wrapper = $(document.createElement('span'));
            var fmt      = arr.includesAny(['format', 'f', 'fmt', 'b', 'bold', 'true']);
            var string   = _outputPlaytime(fmt);
            
            $wrapper
                .wiki(string)
                .addClass('macro-' + this.name)
                .appendTo(this.output);
        }
    });
}());