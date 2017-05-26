// dialog API macro set, by chapel; for sugarcube 2
// version 1.0

/*
<<dialog>> macro

syntax:
<<dialog (optional: title) (optional: class list)>>...<</dialog>>

	* title: the title of the resulting dialog box; if omitted, no title wil be shown.
	* class list:  classes to add to the dialog box, for styling via CSS

explanation:
opens a dialog box and appends the content between the tags to its body.  should generally be paired with some interactive element (like a button or link), or the dialog box will open instantly when the passage loads.  the first argument should be the dialog's title.  all additional arguments will be set as classes for styling in the CSS.

examples:
// displays the content in between the tags in a dialog box with the title 'Character Sheet' and the class '.char-sheet':
<<link 'Show Character Sheet'>>
	<<dialog 'Character Sheet' 'char-sheet'>>\
$name
|!Stat|!Value|
|Strength|$strength|
|Agility|$agility|
|Magic|$magic|
	<</dialog>>
<</link>>

// displays a dialog box with no title and no additional classes:
<<dialog>>Hello!<</dialog>>

// displays a dialog box with no title and the classes '.tutorial':
<<button 'Show the Tutorial'>>
	<<dialog '' 'tutorial'>>
		Tutorial content.
	<</dialog>>
<</button>>
*/
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
/*
<<popup>> macro

Syntax:
<<popup (passage) (optional: title) (optional: class names)>>

	* passage: the name of the passage whose content you want to append to the dialog box
	* title: the title of the resulting dialog box; if omitted, no title wil be shown.
	* class list:  classes to add to the dialog box, for styling via CSS
	
Explanation:
<<popup 'passage' 'title' 'class'>> is essentially the same as <<dialog 'title' 'class'>><<inlcude 'passage'>><</dialog>>, and can be used as a shortcut for displaying a passage's content in a dialog box.

Examples:
<<link 'Show Character Sheet'>>
	<<popup 'character sheet' 'Character Sheet' 'char-sheet'>>
<</link>>
// displays a dialog box that shows the content of passage 'character sheet', with the title 'Character Sheet', and the class '.char-sheet'

<<button 'Help!'>>
	<<popup 'help' '' '.help'>>
<</button>>
// displays the content of the passage 'help' in a dialog box with no title and the class '.help'.
*/
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