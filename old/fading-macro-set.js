// fading macro set, by chapel; for SugarCube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#fading-macros

// <<fadein>> macro
Macro.add('fadein', {
	   tags : null,
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = ('macro-' + this.name);
		var content   = this.payload[0].contents;
		var delay     = 0;
		var time      = 0;

		if (this.args.length === 1) {
			var delay = 0;
			var time  = this.args[0] * 1000;
		} else if (this.args.length === 2) {
			var delay = this.args[0] * 1000;
			var time  = this.args[1] * 1000;
		} else {
			return this.error('incorrect number of arguments...');
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output)
			.hide()
			.delay(delay)
			.fadeIn(time);

	}
});

// <<fadeout>> macro
Macro.add('fadeout', {
	   tags : null,
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = ('macro-' + this.name);
		var content   = this.payload[0].contents;
		var delay     = 0;
		var time      = 0;

		if (this.args.length === 1) {
			var delay = 0;
			var time  = this.args[0] * 1000;
		} else if (this.args.length === 2) {
			var delay = this.args[0] * 1000;
			var time  = this.args[1] * 1000;
		} else {
			return this.error('incorrect number of arguments...');
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output)
			.delay(delay)
			.fadeOut(time);

	}
});