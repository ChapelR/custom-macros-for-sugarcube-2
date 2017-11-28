// insert macro set, by chapel; for sugarcube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#insert-macros

// <<insert>> macro
Macro.add('insert', {
	   tags : null,
	handler : function () {
		
		var $wrapper  = $(document.createElement('span'));
		var content   = this.payload[0].contents;
		var className = 'macro-' + this.name;
		var el;
		
		// check args
		if (this.args.length !== 1) {
			return this.error('incorrect number of arguments');
		} else {
			el = this.args[0].trim();
		}
		
		// use a postdisplay to get at the fully-rendered DOM
		postdisplay['insert-task-' + el] = function (taskName) {
			$(el).empty();  // clear target element
			
			// append payload
			$wrapper
				.wiki(content)
				.addClass(className)
				.appendTo(el);
				
			delete postdisplay[taskName]; // single-use task
		};
	
	}
});

// <<insertappend>> macro
Macro.add('insertappend', {
	   tags : null,
	handler : function () {
		
		var $wrapper  = $(document.createElement('span'));
		var content   = this.payload[0].contents;
		var className = 'macro-' + this.name;
		var el;
		
		// check args
		if (this.args.length !== 1) {
			return this.error('incorrect number of arguments');
		} else {
			el = this.args[0].trim();
		}
		
		// use a postdisplay to get at the fully-rendered DOM
		postdisplay['insert-append-' + el] = function (taskName) {
			
			// append payload
			$wrapper
				.wiki(content)
				.addClass(className)
				.appendTo(el);
				
			delete postdisplay[taskName]; // single-use task
		};
	
	}
});

// <<clearelement>> macro
Macro.add('clearelement', {
	handler : function () {

		var el;
		
		// check args
		if (this.args.length !== 1) {
			return this.error('incorrect number of arguments');
		} else {
			el = this.args[0].trim();
		}
		
		// use a postdisplay to get at the fully-rendered DOM
		postdisplay['clear-element-' + el] = function (taskName) {
			$(el).empty();  // clear target element
				
			delete postdisplay[taskName]; // single-use task
		};
	
	}
});