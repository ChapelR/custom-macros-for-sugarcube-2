## The Event Macros

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

This macro set allows Twine authors to create event programming without needing to use JavaScript or jQuery.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/events.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/events.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**GUIDE:** Not available.

### Macro: `<<event>>`

**Syntax**:
```
<<event type [selector]>>
    ...
	<<which keycode>>
	    ...
	<<which keycode>>
	    ...
<</event>>
```

This macro set can be used to add more interaction to your game; things like keyboard hotkeys, controls, clickable non-link elements, and more.  Once registered, events are essentially permanent (though they can be removed via JavaScript and suppressed via code logic); therefore, the best place to create events is your StoryInit special passage.  Note that the element the event is tied to does not need to be rendered (or currently on the page or in the passage) in order to attach an event to it.

* **type**: a valid jQuery event type.  Some events that may be of interest:
  * `click`: fires when an element is clicked on.
  * `dblclick`: fires when an element is double-clicked on.
  * `keyup`: fires when an key is pressed and released.
  * `keydown`: fires immediately when a key is pressed.
  * `mouseup`: fires when a mouse button is pressed and released.
  * `mousedown`: fires when a mouse button is pressed.
* **selector**: (optional) a valid jQuery/CSS selector.  with some events (such as key presses), this checks for focus; with others it checks for the target element of the event (such as mouse clicks).  if no selector is provided, the event is bound to the document element.
* **keycode**: an integer.  allows you to determine which key or mouse button triggered the event and react accordingly.  you can find keycodes [here](http://keycode.info/).

**Usage**:
```
/% stow/unstow the ui-bar on double-click %/
<<event 'dblclick' '#ui-bar'>>
    <<toggleclass '#ui-bar' 'stowed'>>
<</event>>

/% set up some hotkeys %/
<<event 'keyup'>>
<<which 67>> /% the c key %/
	<<if not tags().includes('menu')>> /% avoid menu loop %/
		<<goto 'character-menu'>>
	<</if>>
<<which 83>> /% the s key %/
	<<if not tags().includes('menu')>> /% avoid menu loop %/
		<<goto 'spells-menu'>>
	<</if>> 
<<which 77>> /% the m key %/
	<<masteraudio mute>>
<</event>>
```

### Macro: `<<trigger>>`

**Syntax**:`<<trigger (type) (optional: selector)>>`

Allows you to simulate any event on any element.  This macro is useful for triggering events you may not otherwise have easy access to.

* **type**: a valid jQuery event type
* **selector**: a valid jQuery/CSS selector.  if omitted, defaults to the document element

**Usage**:
```
/% close any dialog box when the player presses esc %/
<<event 'keydown'>>
<<which 27>>
	<<trigger 'click' '#ui-dialog-close'>>
<</event>>
```