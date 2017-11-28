// dialog API macro set, by chapel; for sugarcube 2
// version 1.2.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#dialog-api-macros

// <<dialog>> macro
Macro.add('dialog', {
	   tags : null,
	handler : function () {
		
		// handle args (if any)
		var content = (this.payload[0].contents) ? this.payload[0].contents : '';
		var title = (this.args.length > 0) ? this.args[0] : '';
		var classes = (this.args.length > 1) ? this.args.slice(1).flatten() : [];
		
		// add the macro- class
		classes.push('macro-' + this.name);
		
		// dialog box
		Dialog.setup(title, classes.join(' '));
		Dialog.wiki(content);
		Dialog.open();
		
	}

});

// <<popup>> macro
Macro.add('popup', {
	handler : function () {
		
		// errors
		if (this.args.length < 1) {
			return this.error('need at least one argument; the passage to display');
		}
		if (!Story.has(this.args[0])) {
			return this.error('the passage ' + this.args[0] + 'does not exist');
		}
		
		// passage name and title
		var psg   = this.args[0];
		var title = (this.args.length > 1) ? this.args[1] : '';
		var classes = (this.args.length > 2) ? this.args.slice(2).flatten() : [];
		
		// add the macro- class
		classes.push('macro-' + this.name);
		
		// dialog box
		Dialog.setup(title, classes.join(' '));
		Dialog.wiki(Story.get(psg).processText());
		Dialog.open();
		
	}

});