// message macro, by chapel (with help from T.M. Edwards); for sugarcube 2
// version 1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#message-macro

//intialize namespace
setup.messageMacro = {};

// default text option:
setup.messageMacro.default = 'Help';

// <<message>> macro
Macro.add('message', {
	tags    : null,
	handler : function () {
		var message  = this.payload[0].contents;
		var $wrapper = $(document.createElement('span'));
		var $link    = $(document.createElement(this.args.includes('btn') ? 'button' : 'a'));
		var $content = $(document.createElement('span'));

		$link
			.wiki(this.args.length > 0 && this.args[0] !== 'btn' ? this.args[0] : setup.messageMacro.default)
			.ariaClick(function () {
				if ($wrapper.hasClass('open')) {
					$content
						.css('display', 'none')
						.empty();
				}
				else {
					$content
						.css('display', 'block')
						.wiki(message);
				}

				$wrapper.toggleClass('open');
			});

		$wrapper
			.attr('id', 'macro-' + this.name + '-' + this.args.join('').replace(/[^A-Za-z0-9]/g, ''))
			.addClass('message-text')
			.append($link)
			.append($content)
			.appendTo(this.output);
	}
});