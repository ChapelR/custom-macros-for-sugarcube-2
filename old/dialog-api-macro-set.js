// dialog API macro set, by chapel; for sugarcube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#dialog-api-macros

// <<dialog>> macro
Macro.add('dialog', {
	   tags : null,
	handler : function () {

		var content = this.payload[0].contents;
		
		if (this.args.length > 1) {
			var title = this.args[0];
			this.args.deleteAt(0);
			this.args.push('macro-' + this.name);
			var classNames = this.args.join(' ');
		} else if (this.args.length === 1) {
			var title = this.args[0];
			var classNames = 'macro-' + this.name;
		} else {
			var title = '';
			var classNames = 'macro-' + this.name;
		}
		
		Dialog.setup(title, classNames);
		Dialog.wiki(content);
		Dialog.open();
		
	}

});

// <<popup>> macro
Macro.add('popup', {
	handler : function () {
		
		if (this.args.length > 2) {
			var passageName = this.args[0];
			var title = this.args[1];
			this.args.deleteAt(0, 1);
			this.args.push('macro-' + this.name);
			var classNames = this.args.join(' ');
		} else if (this.args.length === 2) {
			var passageName = this.args[0];
			var title = this.args[1];
			var classNames = 'macro-' + this.name;
		} else if (this.args.length === 1) {
			var passageName = this.args[0];
			var title = '';
			var classNames = 'macro-' + this.name;
		} else {
			return this.error('need at least one argument; the passage to display');
		}
		
		Dialog.setup(title, classNames);
		Dialog.wiki(Story.get(passageName).processText());
		Dialog.open();
		
	}

});