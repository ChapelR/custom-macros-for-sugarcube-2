(function () {
    'use strict';
    // operations, by chapel; for sugarcube 2.x
    // v1.1.0
    // adds a dice roller and 'fairmath'
    var setup = setup || {};
    // options object
     var options = {
        tryGlobal : true, 
        nicknames : true, 
        fmRange   : [0, 100]
    };

    /*                  DICE                    */

    // dice helpers
    function _processDice (a, b) {
        // find the number of dice and the type of die
        var roll = [], i, result = 0, add = +1;
        if (typeof a === 'string') {
            roll = a.split('d');
        } else if (typeof a === 'number' && b) {
            roll = [a, b];
        } else if (Array.isArray(a) && a.length >= 2) {
            a.length = 2;
            roll = a;
        } else {
            throw new TypeError('dice(): could not process arguments...');
        }
        // check types
        roll[0] = Number(roll[0]);
        // handle fate/fudge dice
        if (typeof roll[1] === 'string' && roll[1].trim().toUpperCase() === 'F') {
            roll[1] = 3; // -1, 0, or 1
            add = -1;
        } else {
            roll[1] = Number(roll[1]);
        }
        if (roll.some( function (n) {
            return Number.isNaN(n);
        })) {
            throw new TypeError('dice(): could not process arguments...');
        }
        for (i = 0; i < roll[0]; i++) {
            /*
                we're going to roll each die.  we could generate a number
                between the max and min possible simply enough,
                but real dice have weights -- rolling 3d6 is far more likely to result 
                in 10 or 11 than in 3 or 18, and pure randomization will not emulate this
            */
            var die = 0;
            die = Math.floor(State.random() * roll[1]) + add;
            result += die; // update result
        }
        return result; // this prelimary result ignores modifiers; it only rolls the dice
    }

    function _processString (string) {
        // recieves strings like '1d6 + 6' or 1d20+3'
        var parsed = [];
        // remove all whitespace and trim
        string = string.trim().replace(/\s/g, '');
        // check for and return the parts of the roll (2 chunks: '1d6' and '+6')
        parsed = string.match(/(\d+[d][\df]d*)(.*)/i);
        return [parsed[1], Number(parsed[2])]; // send the data off as an array
    }

    function roll (a, b) {
        if (typeof a === 'string') {
            var result = _processString(a);
            /* 
                the expression below rolls the dice and adds the modifier, 
                which must be additive (i.e. +5 or -5, but never *5)
            */
            return _processDice(result[0]) + result[1];
        } else {
            // just run it, it'll toss out its own errors
            return _processDice(a, b);
        }
    }

    setup.dice = { roll : roll };

    // global dice() function: dice('[x]d[y] +/- [z]') or dice([x], [y]) + [z]
    if (options.tryGlobal) { // test options
        window.dice = window.dice || roll; 
    }
    // always available via setup.dice.roll() when unavailable here

    // dice method; Number.prototype.dice(number)
    // ex. (1).dice(6) + 10; $roll = $die.number.dice($die.type); etc
    if (!Number.prototype.dice) {
        Object.defineProperty(Number.prototype, 'dice', {
            configurable : true,
            writable     : true,
            
            value : function (val) {
                // errors and weirdness
                if (this === 0) {
                    return 0;
                } 
                if (this < 0) {
                    throw new TypeError('Number.prototype.dice: cannot roll a negative number of dice!');
                } 
                if (typeof val !== 'string' && val.trim().toUpperCase() !== 'F') {
                    if (val == null || typeof val !== 'number' || val <= 0 || !Number.isInteger(val)) {
                        throw new TypeError('Number.prototype.dice: error in argument');
                    }
                }
                if (!Number.isInteger(this)) {
                    throw new TypeError('Number.prototype.dice: cannot roll partial dice!');
                }
                
                // call the dice processing function
                return roll(this, val);
            }
        });
    }

    /*                  FAIRMATH                */

    // fairmath method; Number.prototype.fairmath(value)
    // ex. (20).fairmath(30); $var = $var.fairmath(-10); etc 
    if (!Number.prototype.fairmath) {
        Object.defineProperty(Number.prototype, 'fairmath', {
            configurable : true,
            writable     : true,
            
            value : function (val) {
                // errors
                var op = options.fmRange;
                
                if (this < op[0] || this > op[1]) {
                    throw new TypeError('Number.prototype.fairmath called on a number that is out of the defined range (the number was ' + this + ').');
                }
                if (val == null || typeof val != 'number' || val > 100 || val < -100 || arguments.length < 1) {
                    throw new TypeError('Number.prototype.fairmath given incorrect argument or an argument that is out of the valid 0-100 range.');
                }
                
                // do the 'fair' math!
                if (val === 0) { // a 0 increase or decrease; just trunc and clamp
                    return Math.clamp(Math.trunc(this), op[0], op[1]);
                }
                if (val < 0) { // number is negative, representing a decrease
                    val = val * -1; // make positive for the math below
                    return Math.clamp(Math.trunc(
                        this - ((this - op[0]) * (val / op[1]))
                    ), op[0], op[1]);
                }
                if (val > 0) { // number is positive, represeting an increase
                    return Math.clamp(Math.trunc(
                        this + ((op[1] - this) * (val / op[1]))
                    ), op[0], op[1]);
                }
                // something inexplicable happened
                throw new Error('Number.prototype.fairmath encountered an unspecified error.');
            }
        });
    }

    // Math.fairmath() method 
    if (!Math.fairmath) {
        Object.defineProperty(Math, 'fairmath', {
            configurable : true,
            writable     : true,
            
            value : function (base, val) { 
                return base.fairmath(val);
            }
        });
    }

    /*                  EXTRAS                  */

    // now for some shortcuts
    if (options.nicknames) {
        if (!Math.fm) { // Math.fm()
            Object.defineProperty(Math, 'fm', {
                configurable : true,
                writable     : true,
                
                value : function (base, val) { 
                    return base.fairmath(val);
                }
            });
        }
        if (!Number.prototype.fm) { // <number>.fm()
            Object.defineProperty(Number.prototype, 'fm', {
                configurable : true,
                writable     : true,
                
                value : function (val) { 
                    return this.fairmath(val);
                }
            });
        }
        if (!Number.prototype.d) { // <number>.d()
            Object.defineProperty(Number.prototype, 'd', {
                configurable : true,
                writable     : true,
            
                value : function (val) { 
                    return this.dice(val);
                }
            });
        }
    }
}());