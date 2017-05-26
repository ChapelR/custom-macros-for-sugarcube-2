// first macro, by chapel; for sugarcube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#first-macro

// <<first>> macro
Macro.add('first', {
	   tags : ['then', 'finally'],
	handler : function () {

			var $wrapper    = $(document.createElement('span'));
			var className   = 'macro-' + this.name;
			var length      = this.payload.length;
			var visits       = visited() - 1;
		    var lastTag     = this.payload[ length - 1 ].name;
		    var lastContent = this.payload[ length - 1 ].contents;

			if (visits < length){
				content = this.payload[visits].contents;
            } else {
                content = (lastTag === 'remains') ? lastContent : '';
            }

			$wrapper
				.wiki(content)
				.addClass(className)
				.appendTo(this.output);
		}

	});