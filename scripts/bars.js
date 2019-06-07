(function () {
    'use sctrict';

    var options = {
        tryGlobal : true // attempt to send `Bar` to the global scope?
    };


    var defaultSettings = {
        full : '#2ECC40', // color when the bar is full
        empty : '#FF4136', // color when the bar is empty
        back : '#DDDDDD', // color of the backing
        height : '10px', // height of the bar
        width : '180px', // width of the bar
        animate : 400, // ms
        easing : 'swing'
    };

    function Bar (opts, value) {
        if (!(this instanceof Bar)) {
            return new Bar(opts, value);
        }
        this.settings = Object.assign(defaultSettings, opts);

        value = Number(value);
        if (Number.isNaN(value)) {
            value = 1;
        }
        value = Math.clamp(value, 0, 1);
        this.value = value;

        // the backing of the bar, and the container
        var $wrapper = $(document.createElement('div'))
            .addClass('chapel-bar')
            .attr('data-val', value)
            .css({
                'background-color' : this.settings.back,
                'height' : this.settings.height,
                'width' : this.settings.width
            });

        // this is just here to give the bar a smooth transitioning coloration
        var $barTop = $(document.createElement('div'))
            .addClass('bar-top')
            .css({
                'background-color' : this.settings.full,
                'opacity' : this.value,
                'width' : '100%',
                'height' : '100%'
            });

        // this actually holds the value and the 'real' bar color
        var $barBottom = $(document.createElement('div'))
            .addClass('bar-bottom')
            .css({
                'background-color' : this.settings.empty,
                'opacity' : 1,
                'width' : (this.value * 100) + '%',
                'height' : '100%'
            })
            .append($barTop)
            .appendTo($wrapper);

        this.$element = $wrapper;
        this.$bars = {
            top : $barTop,
            bottom : $barBottom
        };
    }

    Bar.is = function (thing) { // see if passed "thing" is a bar
        return thing instanceof Bar;
    };

    Object.assign(Bar.prototype, {
        constructor : Bar,
        width : function () { // undocumented
            var self = this;
            this.$bars.bottom.animate({
                'width' : (this.value * 100) + '%'
            }, this.settings.animate, this.settings.easing, function () {
                self.$element.trigger(':bar-animation-complete');
            });
            return this;
        },
        color : function () { // undocumented
            this.$bars.top.animate({
                'opacity' : this.value
            }, this.settings.animate, this.settings.easing);
            return this;
        },
        animate : function () { // animate bar changes
            return this.width().color();
        },
        val : function (n) { // set and get bar value
            if (n !== undefined) {
                n = Number(n);
                if (Number.isNaN(n)) {
                    n = 1;
                }
                n = Math.clamp(n, 0, 1);

                this.value = n;
                this.animate();
            }
            return this.value;
        },
        settings : function (opts) {
            // set or get bar settings
            if (opts && typeof opts === 'object') {
                Object.assign(this.settings, opts);
            }
            return this.settings;
        },
        unwrap : function () {
            // return unwrapped container element
            return this.$element[0];
        },
        place : function ($target, options) { // put the bar in a known element, with a wrapper
            var $wrapper = $(document.createElement('span'));
            if (!($target instanceof jQuery)) {
                $target = $($target);
            }
            if (!$target[0]) {
                console.warn('bar#place() -> no valid target');
            }
            if (options && typeof options === 'object') {
                if (options.classes && (Array.isArray(options.classes) || typeof options.classes === 'string')) {
                    $wrapper.addClass(options.classes);
                }
                if (options.attr && typeof options.attr === 'object') {
                    $wrapper.attr(options.attr);
                }
            }
            $target.append($wrapper.append(this.$element));
            return this;
        },
        clone : function () {
            return new Bar(this.settings, this.value);
        },
        toJSON : function () {
            return JSON.reviveWrapper('new setup.Bar(' + JSON.stringify(this.settings) + ', ' + this.value + ')');
        }
    });

    // setup-spaced API
    setup.Bar = Bar;

    if (options.tryGlobal) {
        window.Bar = window.Bar || Bar;
    }

    // <<newbar '$variable' [optional: starting value (between 0 and 1)]>>...<</newbar>>
    // optional child tags: <<barcolors full [empty] [backing]>>, <<barsizing height [width]>>, <<baranimation timeOrBool [easing]>>
    Macro.add('newbar', {
        tags : ['barcolors', 'barsizing', 'baranimation'],
        handler : function () {

            if (this.args.length < 1) {
                return this.error('The `<<bar>>` macro requires at least one argument: the variable name to store the bar in.');
            }

            var varName = this.args[0], colorsTag = null, sizeTag = null, animTag = null;

            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('Invalid variable name.');
            }

            if (this.payload.length) {
                colorsTag = this.payload.find( function (pl) {
                    return pl.name === 'barcolors';
                });
                sizeTag = this.payload.find( function (pl) {
                    return pl.name === 'barsizing';
                });
                animTag = this.payload.find( function (pl) {
                    return pl.name === 'baranimation';
                });
            }

            var options = {};

            if (colorsTag) {
                if (!colorsTag.args.length) {
                    return this.error('No arguments passed to the `<<barcolors>>` tag.');
                }

                switch (colorsTag.args.length) {
                    case 1:
                        options.empty = colorsTag.args[0];
                        options.ful = 'transparent';
                        break;
                    case 2:
                        options.full = colorsTag.args[0];
                        options.empty = colorsTag.args[1];
                        break;
                    default:
                        options.full = colorsTag.args[0];
                        options.empty = colorsTag.args[1];
                        options.back = colorsTag.args[3];
                }
            }

            if (sizeTag) {
                if (!sizeTag.args.length) {
                    return this.error('No arguments passed to the `<<barcolors>>` tag.');
                }

                options.width = sizeTag.args[0];

                if (sizeTag.args[1]) {
                    options.height = sizeTag.args[1];
                }

            }

            if (animTag) {
                if (!animTag.args.length) {
                    return this.error('No arguments passed to the `<<baranimation>>` tag.');
                }

                if (typeof animTag.args[0] === 'boolean' && !animTag.args[0]) {
                    options.animate = 0; // functionally no animation--we still want the event, though, so we'll just 0 it out
                } else if (typeof animTag.args[0] === 'string') {
                    options.animate = Util.fromCssTime(animTag.args[0]);
                } else {
                    return this.error('The argument to the `<<baranimation>>` tag should be `true`, `false`, or a valid CSS time value.');
                }

                if (animTag.args[1] && ['swing', 'linear'].includes(animTag.args[1])) {
                    options.easing = animTag.args[1];
                }
            }

            State.setVar(varName, new Bar(options, this.args[1]));

        }
    });

    // <<showbar '$variable' [value]>>
    Macro.add('showbar', {
        handler : function () {

            if (this.args.length < 1) {
                return this.error('This macro requires at least one argument: the variable name.');
            }

            var varName = this.args[0];

            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('Invalid variable name.');
            }

            var bar = State.getVar(varName);

            if (!Bar.is(bar)) {
                return this.error('The variable "' + varName + '" does not contain a bar.');
            }

            bar.val(this.args[1]);

            bar.place(this.output, {
                classes : 'macro-' + this.name,
                attr : { id : 'bar-' + Util.slugify(varName) }
            });

        }
    });

    // <<updatebar '$variable' value>>
    Macro.add('updatebar', {
        handler : function () {

            if (this.args.length < 2) {
                return this.error('This macro requires two arguments: the variable name and a value.');
            }

            var varName = this.args[0];

            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('Invalid variable name.');
            }

            var bar = State.getVar(varName);

            if (!Bar.is(bar)) {
                return this.error('The variable "' + varName + '" does not contain a bar.');
            }

            bar.val(this.args[1]); // if it's on the page, should update auto-magically, if not, just let it be.

        }
    });

}());