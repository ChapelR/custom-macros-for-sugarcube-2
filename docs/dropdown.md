## The Drop Down Macro

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

A simple macro for creating a drop-down list selection, one of the only input styles that is missing from SugarCube.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/dropdown.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/dropdown.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**GUIDE:** Not available.

### Macro: `<<dropdown>>`

**Syntax**: `<<dropdown variableName optionList>>`

The `<<dropdown>>` macro creates a dropdown-style input.  When a selection is made, the option is saved to the provided variable as a string (if the data wasn't a string before, it will be coerced into one, so watch out).  The first argument must always be a variable name passed in quotes.  The remaining arguments may be any combination of strings, variables (non-quoted), or arrays.  To pass an array literal, you must use back-ticks to force it to be evaluated as a single argument, or store it as a variable.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, in which to store the newly created inventory.
 * **optionList**: A list of mutually exclusive options for the player to choose between.  This list can be made up of numbers, strings, arrays, or any combination of thereof, but the player's selections will always be returned as strings, and arrays given to the macro will be flattened.
 
**Usage**:
```
::some passage
<<set $color to ''>>\
<<dropdown '$color' 'red' 'blue' 'green' 'purple' 'yellow' 'white' 'black' 'pink' 'orange'>>

[[continue|next passage]]

::next passage
<<run $(body).css('background-color', $color)>>
$color

/% example using mixed types %/
<<set $a to ''>>
<<set $b to ['hello', 'woot', 'live']>>
<<set $c to 'purple'>>
<<set $d to ['1', '2']>>
<<dropdown '$a' $b $c $d 'blue' `['yay', 'never!', 'this example is dumb']`>>
/% ***note the backticks for the array literal %/
```