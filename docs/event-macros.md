## The Event Macros

[Back to the main readme](./README.md).

This macro set allows Twine authors to create event handlers without needing to use JavaScript or jQuery.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/events.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/events.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=event).  
**GUIDE:** Not available.

### Macros: `<<on>>` and `<<one>>`

**Syntax**:
```
<<on type [selector] [once]>>
    ...
	<<which keycode>>
	    ...
	<<which keycode>>
	    ...
<</on>>
```

This macro be used to handle events in your game; things like keyboard hotkeys, controls, clickable non-link elements, and more. Note that the element the event is tied to does not need to be rendered (or currently on the page or in the passage) in order to attach an event to it.

This macro has three aliases: `<<on>>` set recurring event handlers, while `<<one>>` creates a single-use event handler. If you want the handler to run each and every time the event occurs, use `<<on>>`. If you want the event to occur only once, the next time the event occurs, use `<<one>>`.

> [!NOTE]
> The `<<event>>` macro exists as an alias for `<<on>>` for backwards-compatibility with code written for older version of this macro set. The `<<event>>` macro should be considered deprecated going forward.

* **type**: a valid jQuery event type. You may include a namespace with a dot, e.g., `click.my-namespace`.  Some events that may be of interest:
  * `click`: fires when an element is clicked on.
  * `dblclick`: fires when an element is double-clicked on.
  * `keyup`: fires when an key is pressed and released.
  * `keydown`: fires immediately when a key is pressed.
  * `mouseup`: fires when a mouse button is pressed and released.
  * `mousedown`: fires when a mouse button is pressed.
* **selector**: (optional) a valid jQuery/CSS selector.  with some events (such as key presses), this checks for focus; with others it checks for the target element of the event (such as mouse clicks).  if no selector is provided, the event is bound to the document element.
* **once**: (optional) the keyword `once`. If included, overrides the normal behavior of `<<on>>` (and `<<event>>`) to create a single-use event handler.
* **keycode**: an integer.  allows you to determine which key or mouse button triggered the event and react accordingly.  you can find keycodes [here](http://keycode.info/).

**Usage**:
```
/% stow/unstow the ui-bar on double-click %/
<<on 'dblclick' '#ui-bar'>>
    <<toggleclass '#ui-bar' 'stowed'>>
<</on>>

/% set up some hotkeys %/
<<on 'keyup'>>
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
<</on>>

/% run one time %/
<<one ':dialogclosed'>>
	<<run UI.alert("You closed a dialog!")>>
<</one>>

/% the above could also be written: %/
<<on ':dialogclosed' once>>
	<<run UI.alert("You closed a dialog!")>>
<</on>>
```

### Macro: `<<trigger>>`

**Syntax**:`<<trigger type [selector]>>`

Allows you to simulate any event on any element.  This macro is useful for triggering events you may not otherwise have easy access to.

* **type**: a valid jQuery event type
* **selector**: (optional) a valid jQuery/CSS selector.  if omitted, defaults to the document element

**Usage**:
```
/% close any dialog box when the player presses esc %/
<<on 'keydown'>>
<<which 27>>
	<<trigger 'click' '#ui-dialog-close'>>
<</on>>
```

### Macro: `<<off>>`

**Syntax**:`<<off type [selector]>>`

Allows you to remove an event handler.

* **type**: a valid jQuery event type; may include namespaces
* **selector**: (optional) a valid jQuery/CSS selector.  if omitted, defaults to the document element

**Usage**:

```
/% removes all events created through this macro set %/
<<off '.macro-event'>>

/% remove all `dblclick` handlers from the `#ui-bar` element %/
<<off 'dblclick' '#ui-bar'>>
```

### Setting: `setup.eventMacroNamespace`

Handlers set up via this macro set are given a namespace automatically. The default value of this name space is `"macro-event"`. You may change this value to change the namespace if you want. Omit the dot.