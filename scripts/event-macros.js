// event macro set, by chapel; for sugarcube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#event-macros

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
		$el = (this.args.length === 1) ? $(document) : $(this.args[1]);
		
		// fire the event
		$el.trigger(evt);
		
	}
});

// the <<event>> macro
Macro.add('event', {
	   tags : ['which'],
	handler : function () {
		
		var payload = this.payload;
		var evt, sel = '', code = '', i;
		
		if (this.args.length > 2 || this.args.length === 0) {
			return this.error('incorrect number of arguments');
		}
		if (typeof this.args[0] != 'string') {
			return this.error('first argument should be a string and a valid event type');
		}
		if (this.args.length === 2 && typeof this.args[1] == 'string') {
			sel = this.args[1];
		}
		
		evt = this.args[0];
		
		$(document).on(evt, sel, function (e) {
			code = code + payload[0].contents;
			if (payload.length > 1) {
				for (i = 1; i < payload.length; i++) {
					if (e.which === payload[i].args[0]) {
						code = code + payload[i].contents;
					}
				}
			}
			new Wikifier(null, code);
		});
		
	}
});