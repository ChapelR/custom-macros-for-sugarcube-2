## The Disable Macro

[Back to the main readme](./README.md).

The `<<disable>>` macro allows the user to disable (and re-enable) various interactive elements.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/disable.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/disable.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=disable).  
**GUIDE:** Not available.

### Macro: `<<disable>>`

**Syntax**:`<<disable [expression]>>...<</disable>>`

The first interactive element (such as a button or text input) between the macro tags will be disabled. If an expression is passed to the macro, it will be evaluated. If the evaluated expression yields a truthy result, the interactive element will be disabled. If the expression is falsy, the element will not be disabled.

**Usage**:

```
This button should be disabled:
<<disable>><<button "Submit">><</button>><</disable>>

This textbox should also be disabled:
<<disable 1 === 1>><<textbox "$name" "">><</disable>>

This listbox, too:
<<disable true>><<listbox '$whee'>><<optionsfrom ["1", "2", "3"]>><</listbox>><</disable>>

This button should ''not'' be disabled:
<<disable false>><<button "Submit">><</button>><</disable>>

This textbox should ''not'' be disabled:
<<disable 1 === 0>><<textbox "$name" "">><</disable>>
```

## Other usage notes:

Disabled elements are also given the class `disabled`.