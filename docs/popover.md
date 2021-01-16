## The Popover Macro

[Back to the main readme](./README.md).

Creates a special transparent dialog modal for images and text.

![The Popover Macro](https://i.imgur.com/vW7soRX.png)

**THE CODE:** [Minified JS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/popover.min.js). [Pretty JS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/popover.js).  
[Minified CSS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/popover.min.css). [Pretty CSS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/popover.css).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=popover).  
**GUIDE:** Not available.

### Macro: `<<popover>>`

**Syntax**: `<<popover [flags] [classList]>><</popover>>`

The `<<popover>>` macro creates a special transparent dialog modal for images and text, rendering the content between its tags into this special dialog element. Like a normal dialog, clicking on the overlay closes the popover, but this behavior may be suppressed. There are also a few additional options and you may add custom classes as well.

**Arguments**:

 * **flags**: (optional) A list of options for the popover. Valid options are:
    * `opaque`: makes the overlay opaque (alpha: 1). By default it's alpha is 0.8.
    * `transparent`: makes the overlay totally transparent (alpha: 0). By default it's alpha is 0.8. The overlay will still block user interaction from occurring on whatever is behind it, and will still, by default, dismiss the popover when clicked.
    * `noclick`: by default, clicks on the overlay close the popover. This option suppresses this behavior, meaning users will only be able to close the popover with the `X` button at the top right of the screen.
    * `invert`: inverts the colors of the overlay and it's default text color. By default the overlay is dark and the text is light. This does not effect the opacity of the overlay.
 * **classList**: (optional) A list of CSS classes to add to the popover, for styling. These classes are added to `#ui-overlay`, `#ui-dialog`, and `#ui-dialog-body`.  The classes should be a space-separated list of quoted class names (i.e. `'class-a' 'class-b' 'class-c'`), a quoted list of space-separated class names (i.e. `'class-a class-b class-c'`), or one or more string arrays (i.e. `['class-a', 'class-b', 'class-c']`), or any combination of thereof.

**Usage**:

```
<<popover 'invert' 'opaque'>>Hi there!<</popover>>

<<popover 'transparent' 'my-class'>>[img[assets/my-img.png]]<</popover>>

<<popover 'my-class'>>[img[assets/my-img.png]]<</popover>>

<<popover 'noclick'>>[[Move on]]<</popover>>

<<popover>>Welcome!<</popover>>
```

### Macro: `<<dismisspopover>>`

**Syntax**: `<<dismisspopover>>`

Closes the popover dialog. Can't be used to close other dialogs, but functions, methods, or macros that close other dialogs should generally also be able to close popovers, so `Dialog.close()` should work fine if you prefer.

**Usage**:

```
<<popover>>\
	Hi there! Welcome to my game!
	
	<<button "Continue">><<dismisspopover>><</button>>
<</popover>>
```

### Function: `setup.popover()`

**Syntax**: `setup.popover(content [, flagsAndClasses])`

A JavaScript function that is essentially the same as the `<<popover>>` macro

**Arguments**:

 * **content**: the content to render in the popover.
 * **flags**: (optional) A list of options for the popover. Valid options are:
    * `opaque`: makes the overlay opaque (alpha: 1). By default it's alpha is 0.8.
    * `transparent`: makes the overlay totally transparent (alpha: 0). By default it's alpha is 0.8.
    * `noclick`: by default, clicks on the overlay close the popover. This option suppresses this behavior, meaning users will only be able to close the popover with the `X` button at the top right of the screen.
    * `invert`: inverts the colors of the overlay and it's default text color. By default the overlay is dark and the text is light. This does not effect the opacity of the overlay.
 * **classList**: (optional) A list of CSS classes to add to the popover, for styling. These classes are added to `#ui-overlay`, `#ui-dialog`, and `#ui-dialog-body`.  The classes should be a space-separated list of quoted class names (i.e. `'class-a' 'class-b' 'class-c'`), a quoted list of space-separated class names (i.e. `'class-a class-b class-c'`), or one or more string arrays (i.e. `['class-a', 'class-b', 'class-c']`), or any combination of thereof.
