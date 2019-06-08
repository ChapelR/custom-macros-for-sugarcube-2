(function () {
    'use sctrict';

    var options = {
        tryGlobal : true // attempt to send `Meter` to the global scope?
    };


    var defaultSettings = {
        full : '#2ECC40', // color when the bar is full
        empty : '#FF4136', // color when the bar is empty
        back : '#DDDDDD', // color of the backing
        height : '12px', // height of the bar
        width : '180px', // width of the bar
        animate : 400, // ms
        easing : 'swing', // animation easing
        text : '#111111', // label text color
        label : '', // label text
        align : 'center' // label alignment
    };

    var validAlignments = ['center', 'left', 'right'];
    var validEasing = ['swing', 'linear'];

    function _handleString (str, def) {
        if (str && typeof str === 'string') {
            str = str.toLowerCase().trim();
            if (str) {
                return str;
            }
            return def || '';
        }
        return def || '';
    }

    function Meter (opts, value) {
        if (!(this instanceof Meter)) {
            return new Meter(opts, value);
        }
        this.settings = Object.assign(defaultSettings, opts);

        // default malformed values

        this.settings.align = _handleString(this.settings.align);
        this.settings.easing = _handleString(this.settings.easing);

        if (!validAlignments.includes(this.settings.align)) {
            this.settings.align = 'center';
        }

        if (!validEasing.includes(this.settings.easing)) {
            this.settings.easing = 'swing';
        }

        value = Number(value);
        if (Number.isNaN(value)) {
            value = 1;
        }
        value = Math.clamp(value, 0, 1);
        this.value = value;

        // the backing of the meter, and the container
        var $wrapper = $(document.createElement('div'))
            .addClass('chapel-meter')
            .attr({
                'data-val' : value,
                'data-label' : this.settings.label
            })
            .css({
                'background-color' : this.settings.back,
                'height' : this.settings.height,
                'width' : this.settings.width,
                'overflow' : 'hidden'
            });

        var $label = $(document.createElement('div'))
            .addClass('meter-label')
            .css({
                'font-size' : this.settings.height,
                'font-weight' : 'bold',
                'line-height' : '100%',
                'width' : this.settings.width,
                'text-align' : this.settings.align,
                'color' : this.settings.text,
                'z-index' : 1,
                'position' : 'relative',
                'bottom' : '100%'
            })
            .wiki(this.settings.label);

        // this is just here to give the bar a smooth transitioning coloration
        var $barTop = $(document.createElement('div'))
            .addClass('meter-top')
            .css({
                'background-color' : this.settings.full,
                'opacity' : this.value,
                'width' : '100%',
                'height' : '100%',
                'z-index' : 0
            });

        // this actually holds the value and the 'real' bar color
        var $barBottom = $(document.createElement('div'))
            .addClass('meter-bottom')
            .css({
                'background-color' : this.settings.empty,
                'opacity' : 1,
                'width' : (this.value * 100) + '%',
                'height' : '100%'
            })
            .append($barTop, $label)
            .appendTo($wrapper);

        this.$element = $wrapper;
        this.$bars = {
            top : $barTop,
            bottom : $barBottom
        };
        this.$label = $label;

        $label.css('font-size', $wrapper.height());
    }

    Meter.is = function (thing) { // see if passed "thing" is a meter instance
        return thing instanceof Meter;
    };

    Meter._emit = function (inst, name) { // undocumented
        if (!Meter.is(inst)) {
            return;
        }
        inst.$element.trigger({
            type : ':' + name,
            meter : inst
        });
    };

    Object.assign(Meter.prototype, {
        constructor : Meter,
        _label : function () {
            this.$label.empty().wiki(this.settings.label);
            this.$label.css('font-size', this.$element.height());
            return this;
        },
        _width : function () { // undocumented
            var self = this;
            this.$bars.bottom.animate({
                'width' : (this.value * 100) + '%'
            }, this.settings.animate, this.settings.easing, function () {
                Meter._emit(self, 'meter-animation-complete');
            });
            return this;
        },
        _color : function () { // undocumented
            this.$bars.top.animate({
                'opacity' : this.value
            }, this.settings.animate, this.settings.easing);
            return this;
        },
        animate : function () { // animate bar changes
            Meter._emit(this, 'meter-animation-start');
            return this._color()._width()._label();
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
                console.warn('meter#place() -> no valid target');
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
            this._label();
            return this;
        },
        clone : function () {
            return new Meter(this.settings, this.value);
        },
        toJSON : function () {
            return JSON.reviveWrapper('new setup.Meter(' + JSON.stringify(this.settings) + ', ' + this.value + ')');
        }
    });

    // setup-spaced API
    setup.Meter = Meter;

    if (options.tryGlobal) {
        window.Meter = window.Meter || Meter;
    }

    // <<newmeter '$variable' [optional: starting value (between 0 and 1)]>>...<</newmeter>>
    // optional child tags: <<metercolors full [empty] [backing]>>, <<metersizing height [width]>>, <<meteranimation timeOrBool [easing]>>, <<meterlabel labelText [textColor] [alignment]>>
    Macro.add('newmeter', {
        tags : ['metercolors', 'metersizing', 'meteranimation', 'meterlabel'],
        handler : function () {

            if (this.args.length < 1) {
                return this.error('The `<<newmeter>>` macro requires at least one argument: the variable name to store the meter in.');
            }

            var varName = this.args[0], 
                colorsTag = null, 
                sizeTag = null, 
                animTag = null,
                labelTag = null;

            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('Invalid variable name.');
            }

            if (this.payload.length) {
                colorsTag = this.payload.find( function (pl) {
                    return pl.name === 'metercolors';
                });
                sizeTag = this.payload.find( function (pl) {
                    return pl.name === 'metersizing';
                });
                animTag = this.payload.find( function (pl) {
                    return pl.name === 'meteranimation';
                });
                labelTag = this.payload.find( function (pl) {
                    return pl.name === 'meterlabel';
                });
            }

            var options = {};

            if (colorsTag) {
                if (!colorsTag.args.length) {
                    return this.error('No arguments passed to the `<<metercolors>>` tag.');
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
                    return this.error('No arguments passed to the `<<metercolors>>` tag.');
                }

                options.width = sizeTag.args[0];

                if (sizeTag.args[1]) {
                    options.height = sizeTag.args[1];
                }

            }

            if (animTag) {
                if (!animTag.args.length) {
                    return this.error('No arguments passed to the `<<meteranimation>>` tag.');
                }

                if (typeof animTag.args[0] === 'boolean' && !animTag.args[0]) {
                    options.animate = 0; // functionally no animation--we still want the event, though, so we'll just 0 it out
                } else if (typeof animTag.args[0] === 'string') {
                    options.animate = Util.fromCssTime(animTag.args[0]);
                } else {
                    return this.error('The argument to the `<<meteranimation>>` tag should be `true`, `false`, or a valid CSS time value.');
                }

                if (animTag.args[1] && ['swing', 'linear'].includes(animTag.args[1])) {
                    options.easing = animTag.args[1];
                }
            }

            if (labelTag) {
                var text = labelTag.args[0];
                if (text && typeof text === 'string') {
                    options.label = text.trim();
                } else {
                   return this.error('The first argument to the `<<meterlabel>>` tag should is required.');
                }

                if (labelTag.args[1] && typeof labelTag.args[1] === 'string') {
                    options.text = labelTag.args[1];
                }
                if (labelTag.args[2] && typeof labelTag.args[2] === 'string') {
                    options.align = labelTag.args[2];
                }
            }

            State.setVar(varName, new Meter(options, this.args[1]));

        }
    });

    // <<showmeter '$variable' [value]>>
    Macro.add('showmeter', {
        handler : function () {

            if (this.args.length < 1) {
                return this.error('This macro requires at least one argument: the variable name.');
            }

            var varName = this.args[0];

            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('Invalid variable name.');
            }

            var meter = State.getVar(varName);

            if (!Meter.is(meter)) {
                return this.error('The variable "' + varName + '" does not contain a meter.');
            }

            meter.val(this.args[1]);

            meter.place(this.output, {
                classes : 'macro-' + this.name,
                attr : { id : 'meter-' + Util.slugify(varName) }
            });

        }
    });

    // <<updatebar '$variable' value>>
    Macro.add('updatemeter', {
        handler : function () {

            if (this.args.length < 2) {
                return this.error('This macro requires two arguments: the variable name and a value.');
            }

            var varName = this.args[0];

            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('Invalid variable name.');
            }

            var meter = State.getVar(varName);

            if (!Meter.is(meter)) {
                return this.error('The variable "' + varName + '" does not contain a meter.');
            }

            meter.val(this.args[1]); // if it's on the page, should update auto-magically, if not, just let it be.

        }
    });

}());