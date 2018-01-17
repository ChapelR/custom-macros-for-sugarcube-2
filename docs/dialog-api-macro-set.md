## The Dialog API Macro Set

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

This macro set helps you work with SugarCube's Dialog API without having to touch any JavaScript.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/dialog-api-macro-set.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/dialog-api-macro-set.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**GUIDE:** Not available.

### Macro: `<<dialog>>`

**Syntax**: `<<dialog [title] [classList]>> <</dialog>>`

The `<<dialog>>` macro creates a new dialog box, with an optional title and an optional list of classes for styling.  The content between the macro tags is parsed and appended to the dialog box's body.  You will generally want to pair this with some type of interaction, like a link or button.

**Arguments**:

 * **title**: (optional) A title to appear at the top of the dialog box.  If you want to omit a title but include classes, this argument can be an empty string (`''`).
 * **classList**: (optional) A list of CSS classes to add to the dialog, for styling.  The classes should be a space-separated list of quoted class names (i.e. `'class-a' 'class-b' 'class-c'`), a quoted list of space-separated class names (i.e. `'class-a class-b class-c'`), or one or more string arrays (i.e. `['class-a', 'class-b', 'class-c']`), or any combination of thereof.
 
**Usage**:
```
/% creates a link that opens a dialog box called 'Character Sheet' with the classes .char-sheet and .stats %/
<<link 'View Character Sheet'>>
	<<dialog 'Character Sheet' 'char-sheet stats'>>\
		|Strength|$str|
		|Dexterity|$dex|
		|Wisdom|$wis|\
	<</dialog>>
<</link>>

/% create an about button for your credits %/
<<button 'About'>>
	<<dialog 'Credits'>>\
		This game was made by John P. Nottingham in Twine!\
	<</dialog>>
<</button>>

/% a dialog with no title or classes %/
<<link 'Hello!'>>
	<<dialog>>Greetings!<</dialog>>
<</link>>
```

### Macro: `<<popup>>`

**Syntax**: `<<popup passageName [title] [classList]>>`

The `<<popup>>` macro provides a similar result to what you might get by pairing a `<<dialog>>` macro and an `<<include>>` macro.  The macro is generally the same as `<<dialog>>`, but the first argument must be the name of a passage, and instead of rendering content from between tags, that passage's content will be rendered into the dialog box.

**Arguments**:

 * **passageName**: The name of one of your passages.  The indicated passage's content will be rendered into the dialog box's body.
 * **title**: (optional) A title to appear at the top of the dialog box.  If you want to omit a title but include classes, this argument can be an empty string (`''`).
 * **classList**: (optional) A list of CSS classes to add to the dialog, for styling.  The classes should be a space-separated list of quoted class names (i.e. `'class-a' 'class-b' 'class-c'`), a quoted list of space-separated class names (i.e. `'class-a class-b class-c'`), or one or more string arrays (i.e. `['class-a', 'class-b', 'class-c']`), or any combination of thereof.
 
**Usage**:
```
/% 
	creates a link that opens a dialog box called 'Character Sheet' 
	with the classes .char-sheet and .stats
	and renders the content of the passage 'charsheet' into it 
%/
<<link 'View Character Sheet'>>
	<<popup 'charsheet' 'Characer Sheet' 'char-sheet stats'>>
<</link>>

/% create an about button for your credits that uses the content of the 'credits-passage' passage %/
<<button 'About'>>
	<<popup 'credits-passage' 'Credits'>>
<</button>>
```