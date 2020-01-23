## The Continue Macro Set

[Back to the main readme](./README.md).

Used to create basic "press any key" or "click anywhere to continue" style interactions. You can nest `<<cont>>` macros to create chains of such interactions, too. Something I see requested frequently, but had to sit down and really dwell on to develop a decent implementation that doesn't break other interactions or generally suck.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/continue.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/continue.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=continue).  
**GUIDE:** Not available.

### Macro: `<<cont>>`

**Syntax**: `<<cont [keywords]>>...<</cont>>`

This macro waits for user input before evaluating its contents, and can be used to create situations where the user can click anywhere, or press any key (with the right keywords), to continue.

**Arguments**:
- `keywords`: by default, the contents of the macro are executed silently, like a link. You can pass the macro the keyword `append` to cause it to instead display it's content in place. By default only mouse clicks will activate the macro, but you can use the keyword `keypress` to make any keypress also activate the macro.

**Examples**:

```
/* click anywhere to go to the next passage */
<<cont>><<goto 'Next'>><</cont>>

/* click anywhere or press any key to continue */
You slowly turn around...
<<cont append keypress>>The ghost is behind you!<</cont>>

/* nest <<cont>> macros to create text you can "advance" through, like so */
@@#exposition;
Many years ago, the knights of the round table were gathered in opposition to the witch Morgan La Fey.
@@

<<silently>>
	<<cont keypress>>
		<<replace '#exposition'>>\
			However, all but King Arthur fell in the ensuing battle.\
		<</replace>>
		<<cont keypress>>
            <<replace '#exposition'>>\
                King Arthur swore revenge, and set out from his castle!\
            <</replace>>
        <</cont>>
    <</cont>>
<</silently>>
```

### Macro: `<<ignore>>`

**Syntax**: `<<ignore selectorList>>`

By default clicks on any link or button elements or any elements with the `role="button"` attribute, and clicks on dialogs or the sidebar will not trigger the `<<cont>>` macro. Additionally, any element with the class `continue-macro-ignore` will also be ignored. You can use this macro to add more selectors to the ignore list. Note that this macro can only be triggered before the story starts&mdash;for example, from the `StoryInit` special passage.

**Arguments**:

- `selectorList`:  a list of jQuery-style selectors.

**Examples**:

```
/* ignore <i> elements */
<<ignore 'i'>>

/* ignore elements with the classes 'click' or 'hello' */
<<ignore '.click' '.hello'>>
```

### Function: `cont()`

**Syntax**: `cont(keypress, callback)` or `setup.cont(keypress, callback)`

The `cont()` function can be used to create a similar effect to the continue macro from JavaScript.

**Arguments**:

- `keypress` (*`boolean`*): whether keypresses should activate the continue effect. Similar in function to the `keypress` keyword of the `<<cont>>` macro.
- `callback` (*`function`*): the function to run when the continue effect is triggered.

### Function: `cont.ignore()`

**Syntax**: `cont.ignore(selectorList)` or `setup.cont.ignore(selectorList)`

Adds to the ignore list just like `<<ignore>>`. Must be used before the story starts.

**Arguments**:

- `selectorList` (*`string`*|*`string array`*):  a list of jQuery-style selectors.

### Function: `cont.reset()`

**Syntax**: `cont.reset(selectorList)` or `setup.cont.reset(selectorList)`

This function removes all current continue event handlers, and can be used to add to the ignore list if supplied with appropriate arguments.

**Arguments**:

- `selectorList` (*`string`*|*`string array`*):  a list of jQuery-style selectors.