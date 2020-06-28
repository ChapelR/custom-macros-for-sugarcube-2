(function () {
    // v1.0.0
    'use strict';

    function mapper (args) {
        if (args.length % 2 !== 0) {
            // check the pairs are even
            return 'Style rules should be a list of key/value pairs; you\'ve passed an odd number.';
        }
        var map = {};

        args.forEach(function(item, idx) {
            // even val (0, 2, 4, etc) is paired with the next value
            if (idx % 2 === 0) {
               map[item] = args[idx + 1];
            }
        });

        return map;
    }

    function getStyledOn ($el, map) {
        try {
            if (typeof map === 'string') {
                // was an error
                return map;
            }
            if (!($el instanceof jQuery)) {
                // wrap if needed
                $el = $($el);
            }
            // run the method
            return $el.css(map);
        } catch (err) {
            // return error message strings
            return err.message;
        }
    }

    function cssChanger (/*element, args...*/) {
        try {
            var args = [].slice.call(arguments).flatten(),
                $el = args.shift(),
                map;
            if (typeof args[0] === 'string') {
                map = mapper(args);
            } else if (typeof args[0] === 'object') {
                map = clone(args[0]);
            }
            return getStyledOn($el, map);
        } catch (err) {
            return err.message;
        }
    }

    // <<css selector stylerules>>
    // style rules can be a list of key/value pairs or a single object
    Macro.add('css', {
        handler : function () {
            var worked = cssChanger(this.args);
            if (typeof worked === 'string') {
                // output error message
                return this.error(worked);
            }
        }
    });

}());