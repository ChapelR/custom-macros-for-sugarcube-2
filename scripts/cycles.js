(function () {
    'use strict';
    // cycles.js, by chapel; for SugarCube 2
    // version 2.1.1

    // OPTIONS

    var options = {
        storyVar : '%%cycles',
        tryGlobal : true,
        pauseTag : 'cycles.pause',
        menuPauseTag : 'cycles.pause.menu',
        taskObject : 'cycles.postdisplay'
    };

    // stateful storage

    State.variables[options.storyVar] = {};

    // utilities

    function _get () {
        return State.variables[options.storyVar];
    }

    function _payloadMapper (pl) {
        if (pl.args.length < 1) {
            return null;
        }
        var phases = pl.args.flatten();
        if (!phases.every(function (ph) {
            return typeof ph === 'string';
        })) {
            return null;
        }
        return phases;
    }

    // CLASS

    /* 
        Cycle definition:
            {
                phases (array): the list of phases the cycle moves through
                period (number) (default 1): the number of turns that constitute a single cycle change
                increment (number) (default 1): the amount to increment a cycle per turn
                active (boolean) (default true): whether the cycle should start active or paused
            }
            stack (default 0)
    */

    function Cycle (def, stack) {
        if (!(this instanceof Cycle)) {
            return new Cycle(def, stack);
        }

        if (!def || typeof def !== 'object') {
            throw new Error('Cycle() -> invalid definition object');
        }

        if (!def.name || typeof def.name !== 'string' || !def.name.trim()) {
            throw new Error('Cycle() -> invalid name');
        }
        this.name = def.name;

        if (!def.phases || !Array.isArray(def.phases) || def.phases.length < 2) {
            throw new Error('Cycle() -> phases should be an array of at least two strings');
        }
        if (!def.phases.every( function (ph) {
            return ph && typeof ph === 'string' && ph.trim();
        })) {
            throw new Error('Cycle() -> each phase should be a valid, non-empty string');
        }
        this.phases = clone(def.phases);

        def.period = Number(def.period);
        if (Number.isNaN(def.period) || def.period < 1) {
            def.period = 1;
        }
        if (!Number.isInteger(def.period)) {
            def.period = Math.trunc(def.period);
        }
        this.period = def.period;

        def.increment = Number(def.increment);
        if (Number.isNaN(def.increment) || def.increment < 1) {
            def.increment = 1;
        }
        if (!Number.isInteger(def.increment)) {
            def.increment = Math.trunc(def.increment);
        }
        this.increment = def.increment;

        this.active = (def.active === undefined) ? true : !!def.active;

        stack = Number(stack);
        if (Number.isNaN(stack) || stack < 0) {
            stack = 0;
        }
        if (!Number.isInteger(stack)) {
            stack = Math.trunc(stack);
        }
        this.stack = stack;
    }

    Object.assign(Cycle, {
        is : function (thing) {
            return thing instanceof Cycle;
        },
        add : function (name, def) {
            if (!def || typeof def !== 'object') {
                throw new Error('Cycle.add() -> invalid definition object');
            }
            if (!name || typeof name !== 'string' || !name.trim()) {
                if (!def.name || typeof def.name !== 'string' || !def.name.trim()) {
                    throw new Error('Cycle.add() -> invalid name');
                }
            } else {
                def.name = name;
            }
            var c = new Cycle(def, 0);
            _get()[def.name] = c;
            return c;
        },
        has : function (name) {
            var got = _get();
            return got.hasOwnProperty(name) && Cycle.is(got[name]);
        },
        get : function (name) {
            if (Cycle.has(name)) {
                return _get()[name];
            }
            return null;
        },
        del : function (name) {
            if (Cycle.has(name)) {
                delete _get()[name];
                return true;
            }
            return false;
        },
        check : function (name) {
            if (Cycle.has(name)) {
                var phases = [].slice.call(arguments).flatten().slice(1);
                return Cycle.get(name).check(phases);
            }
        },
        clear : function (name) {
            var got = _get();
            got = {};
        },
        _emit : function (inst, type) {
            $(document).trigger({
                type : ':cycle-' + type,
                cycle : inst
            });
        },
        _retrieveCycles : _get
    });

    Object.assign(Cycle.prototype, {
        constructor : Cycle,
        revive : function () {
            var ownData = {};
            Object.keys(this).forEach(function (pn) {
                ownData[pn] = clone(this[pn]);
            }, this);
            return ownData;
        },
        clone : function () { // for SC
            return new Cycle(this.revive(), this.stack);
        },
        toJSON : function () { // for SC
            return JSON.reviveWrapper('new setup.Cycle(' + JSON.stringify(this.revive()) + ', ' + this.stack + ')');
        },
        current : function () {
            // returns the current phase based on the stack
            return this.phases[Math.trunc(this.stack / this.period) % this.phases.length];
        },
        length : function () {
            // returns the length (in increments)
            return this.period * this.phases.length;
        },
        turns : function () {
            return this.period / this.increment;
        },
        turnsTotal : function () {
            return this.length() / this.increment;
        },
        update : function (by) {
            // add or subtract from the stack
            by = Number(by);
            if (Number.isNaN(by)) {
                by = this.increment; // 0 is valid, increment is default, negatives are possible
            }
            var cache = this.current();
            this.stack += by;
            if (this.stack < 0) {
                this.stack = 0;
            }
            if (!Number.isInteger(this.stack)) {
                this.stack = Math.trunc(this.stack);
            }
            if (cache !== this.current()) {
                // the phase changed
                Cycle._emit('change');
            }
            return this;
        },
        reset : function () {
            // reset stack to 0, and phase
            this.stack = 0;
            Cycle._emit(this, 'reset');
            return this.update(0);
        },
        suspend : function () {
            // suspend a cycle (pause it)
            var cache = this.active;
            this.active = false;
            if (cache !== this.active) {
                Cycle._emit(this, 'suspend');
            }
            return this;
        },
        resume : function () {
            // resume a suspended cycle
            var cache = this.active;
            this.active = true;
            if (cache !== this.active) {
                Cycle._emit(this, 'resume');
            }
            return this;
        },
        toggle : function () {
            // toggle a cycle's active state
            if (this.active) {
                this.suspend();
            } else {
                this.resume();
            }
            return this;
        },
        isSuspended : function () {
            // what it says on the tin
            return !this.active;
        },
        editIncrement : function (set) {
            // get or set the increment (how much the stack goes up per turn)
            set = Number(set);
            if (!Number.isNaN(set) || set > 0) {
                if (!Number.isInteger(set)) {
                    set = Math.trunc(set);
                }
                this.increment = set;
            }
            return this.increment;
        },
        check : function () {
            var phases = [].slice.call(arguments).flatten();
            return phases.includes(this.current());
        }
    });

    // main postdisplay

    postdisplay[options.taskObject] = function () {
        var skipNext;
        if (tags().includes(options.pauseTag) || skipNext) {
            // pause tag handling
            skipNext = false;
            return;
        }
        if (tags().includes(options.menuPauseTag)) {
            skipNext = true; // skip next passage too
            return;
        }
        Object.keys(_get()).forEach( function (name) {
            // look at each defined cycle
            var cycle = Cycle.get(name);
            if (!cycle.active) {
                // suspended cycles
                return;
            }
            // active cycles
            cycle.update();
        });
    };

    // APIs

    setup.Cycle = Cycle;
    if (options.tryGlobal) {
        window.Cycle = window.Cycle || Cycle;
    }

    // MACROS

    /*
        <<newcycle name period increment suspend>>
            <<phase name [name]>> (requires at least two phases, can be in one phase tag or several)
            <<phase name>>
        <</newcycle>>

    */
    Macro.add('newcycle', {
        tags : ['phase'],
        handler : function () {

            if (this.args.length < 1) {
                return this.error('A cycle must at least be given a name.');
            }

            if (this.payload.length < 2) {
                return this.error('A cycle must be given at least two phases.');
            }

            // render the payload tags' args as cycles
            var phases = this.payload.slice(1).map( function (pl) {
                return _payloadMapper(pl);
            }).flatten();

            if (phases.includes(null)) {
                // throw on junk phases
                return this.error('Each `<<phase>>` tag must be given a valid name.');
            }

            try {
                Cycle.add(this.args[0], {
                    // create the cycle
                    phases : phases,
                    period : this.args[1],
                    increment : this.args[2],
                    // `suspend`` keyword
                    active : (this.args[3] && typeof this.args[3] === 'string' && (this.args[3].trim() !== 'suspend'))
                });
            } catch (err) {
                // render errors
                var preferredMessage = err.message && err.message.split('->')[1];
                preferredMessage = preferredMessage ? preferredMessage.trim() : false;
                return this.error(preferredMessage || err.message);
            }
        }
    });

    // <<editcycle name actionList>>
    // actions: suspend/toggle/resume, increment n, period n, reset/clear, change n
    Macro.add('editcycle', {
        handler : function () {

            if (this.args.length < 1 || typeof this.args[0] !== 'string' || !this.args[0].trim()) {
                return this.error('You must name the cycle you wish to act on.');
            }
            if (this.args.length < 2) {
                return this.error('You must provide an action to perform.');
            }

            var cycle = Cycle.get(this.args[0]);

            if (cycle === null) {
                return this.error('Cannot find a cycle named "' + this.args[0] + '".');
            }

            // suspend, resume, toggle
            if (this.args.includes('suspend')) {
                cycle.suspend();
            } else if (this.args.includes('toggle')) {
                cycle.toggle();
            } else if (this.args.includes('resume')) {
                cycle.resume();
            }

            // change increment or period
            if (this.args.includes('increment')) {
                var value = this.args[this.args.indexOf('increment') + 1];
                if (typeof value === 'number') {
                    cycle.editIncrement(value);
                }
            }

            // reset cycle
            if (this.args.includesAny('reset', 'clear')) {
                cycle.reset();
            }

            // increase / decrease cycle
            if (this.args.includes('change')) {
                var add = this.args[this.args.indexOf('change') + 1];
                add = Number(add);
                if (!Number.isNaN(add) && Number.isInteger(add)) {
                    cycle.update(add);
                }
            }

        }
    });

    // <<showcycle name [options]>> (options: uppercase, lowercase, upperfirst)
    Macro.add('showcycle', {
        handler : function () {

            if (this.args.length < 1 || typeof this.args[0] !== 'string' || !this.args[0].trim()) {
                return this.error('You must name the cycle you wish to act on.');
            }

            var cycle = Cycle.get(this.args[0]);

            if (cycle === null) {
                return this.error('Cannot find a cycle named "' + this.args[0] + '".');
            }

            // formatting keywords
            var display = cycle.current();
            if (this.args.includes('uppercase')) {
                display = display.toUpperCase();
            } else if (this.args.includes('lowercase')) {
                display = display.toLowerCase();
            } else if (this.args.includes('upperfirst')) {
                display = display.toUpperFirst();
            }

            $(document.createElement('span'))
                .addClass('macro-' + this.name)
                .append(display)
                .appendTo(this.output);

        }
    });

}());