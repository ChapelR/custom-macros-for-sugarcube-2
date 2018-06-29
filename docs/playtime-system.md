## The Playtime System

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

Records the player's total play time in hours, minutes, and seconds (though milliseconds are alos tracked) and formats it for display via the `<<playtime>>` macro. You can pause the timer with the `pausetimer` tag, and format your own output using the global `playTime()` function.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/playtime.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/playtime.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**GUIDE:** Not available.

### Macro: `<<playtime>>`

**Syntax**:`<<playtime [format]>>`

This macro shows the user their current playtime in hours, minutes and seconds.  It will not update itself, but a `<<repeat>>` macro can be used to cause it to automatically update.

 * **format**: (optional) if the keyword `format` is included, hours and minutes will be bolded in the output

**Usage**:
```
<<playtime>>

<<playtime format>>

<<repeat 1s>>
	<<playtime>>
<</repeat>>
```

### Function: `playTime()`

**Syntax**: `playTime(want)`

This function returns the player's playtime for the author to use.  You can return the number of hours, minutes, seconds, or milliseconds played, or return the formatted / unformatted time string that is used by the `<<playtime>>` macro.

* **want**: (optional) if omitted or falsy and not a string, returns the unformatted playtime string.  If the value is truthy and not a string, it returns the formatted playtime.  Otherwise, you can pass in the strings `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'` to get those times.

**Usage**:
```
<<if playTime('hours') > 10>>
	You must really like this game.
<</if>>

<<= playTime()>> /% same as <<playtime>> %/
<<= playTime(true)>> /% same as <<playtime format>> %/
```

### Passage Tag: `pausetimer`

Including the passage tag `pausetimer` will suspend the timer when the player is on said passage.  May be useful for menus and such.

## Other usage notes:

**Variable warning**:

This system uses a story variable (`$playtime` by default) to store information in your game's state.  You should avoid overwriting this variable, or change it using the configuration options.

**Passage tag warning**:

This system uses a passage tag (`pausetimer` by default) to control parts of its operation.  Avoid using this tag for other purposes, or change it using the configuration options.

**Configuration options**:

You can alter the story variable, passage tag, and whether the `playTime()` function is made global using the configuration options at the top of the script.  See the unminified script for more info.