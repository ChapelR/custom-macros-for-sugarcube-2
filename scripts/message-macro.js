// message macro, by chapel (with help from T.M. Edwards); for sugarcube 2
// version 1.0

//intialize namespace
setup.messageMacro = {};

// default text option:
setup.messageMacro.default = 'Help';
// Change the above value to what you want the macro's default text to be if no link text is provided

/*
<<message>> macro

Syntax:
<<message (optional: link text) (optional: 'btn' keyword) (optional: id)>>

	*link text: the text of the link.  if omitted, default text is displayed (the default text can be edited above)
	*'btn' keyword: if 'btn' is included in the macro's arguments, a button is generated instead of a link
	*id: if multiple messages are displayed on the same page with the same link text, you need to provide each one with a unique id.

Explanation:
Creates a link (or button) on the page.  When clicked, the content between the tags is displayed on the next line, reflowing the following text.  The player can click the same link again to 'collpase' the message.

Styling Options:
Message content (but not the link/button) is given the class '.help'; you can control the appearance of the message's content using this selector in your CSS. (For example: .help {color: green;} would render the text of all message macros in green).

Examples:
<<message>>Text<</message>>
// creates a link that reads 'Help' (by default) and can be clicked to display the content between the tags and clicked again to collapse the content.

<<message 'click me' btn>>Text<</message>>
// creates the message with the link text 'click me' and renders it as a button element

<<message 'Click here!' 'uniqueID'>>...<</message>>
<<message 'Click here!' 'anotherUniqueID'>>...<</message>>
// creates two messages with the same link text.  they must be given two different, unique IDs to appear in the same passage.
*/
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
			.addClass('help')
			.append($link)
			.append($content)
			.appendTo(this.output);
	}
});