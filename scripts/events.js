// event macro set, by chapel; for sugarcube 2
// version 2.0.0

(function () {
    setup.eventMacroNamespace = 'macro-event';

    // the <<trigger>> macro
    Macro.add('trigger', {
        handler : function () {
            
            // declare vars
            var evt, $el;
            
            // check for errors
            if (this.args.length > 2 || this.args.length === 0) {
                return this.error('incorrect number of arguments');
            }
            if (typeof this.args[0] != 'string') {
                return this.error('first argument should be a string and a valid event type');
            }
            
            // some setup
            evt = this.args[0];
            $el = (this.args.length === 1 ||
                (this.args[1] && typeof this.args[1] === 'string' &&
                this.args[1].toLowerCase().trim() === 'document')) ?
                $(document) : $(this.args[1]);
            
            // fire the event
            $el.trigger(evt);
            
        }
    });

    // the <<event>> macro: <<event type [selector] [once]>>
    Macro.add(['event', 'on', 'one'], {
           tags : ['which'],
        handler : function () {
            
            var payload = this.payload;
            var method = 'on';
            var evt, sel = '', code = '', i;
            
            if (this.args.length > 3 || this.args.length === 0) {
                return this.error('incorrect number of arguments');
            }
            if (typeof this.args[0] != 'string') {
                return this.error('first argument should be a string and a valid event type');
            }
            if (this.args.length === 2 && typeof this.args[1] == 'string' && this.args[1] !== 'once') {
                sel = this.args[1];
            }
            
            if (this.args.includes('once') || this.name === 'one') {
                method = 'one';
            }

            evt = this.args[0];
            
            $(document)[method](evt + '.' + setup.eventMacroNamespace, sel, function (e) {
                code = payload[0].contents;
                if (payload.length > 1) {
                    for (i = 1; i < payload.length; i++) {
                        if (payload[i].args.includes(e.which)) {
                            code = code + payload[i].contents;
                        }
                        if ('used' == e.context && payload[i].args.includes(e.moved[0])) {
                            code = code + payload[i].contents;
                        }
                    }
                }
                new Wikifier(null, code);
            });
            
        }
    });

    Macro.add('off', {
        handler : function () {
            
            // declare vars
            var evt, $el;
            
            // check for errors
            if (this.args.length > 2 || this.args.length === 0) {
                return this.error('incorrect number of arguments');
            }
            if (typeof this.args[0] != 'string') {
                return this.error('first argument should be a string and a valid event type or namespace');
            }
            
            // some setup
            evt = this.args[0];
            $el = (this.args.length === 1 ||
                (this.args[1] && typeof this.args[1] === 'string' &&
                this.args[1].toLowerCase().trim() === 'document')) ?
                $(document) : $(this.args[1]);
            
            // fire the event
            $el.off(evt);
            
        }
    });

}());