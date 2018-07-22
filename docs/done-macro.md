## The Done Macro

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

The `<<done>>` macro serves the same purpose as the `PassageDone` special passage, a `postdisplay` task, or a `:passagedisplay` event; it runs its content just after the current passage has finished loading.  This is primarily useful for things like DOM macro manipulation; you normally can't use macros like `<<replace>>` directly in your passage code without placing them in `<<link>>`s or other interactive elements, or in the `PassageDone` special passage, since the HTML elements you want to manipulate haven't been rendered yet.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/done.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/done.js).  
**DEMO:** Coming soon.  
**GUIDE:** Not available.

### Macro: `<<done>>`

**Syntax**:`<<done>>...<</done>>`

The code between the tags is run after the passage content has finished rendering, ensuring that the DOM is ready for all sorts of hijinks.  You *can* have multiple `<<done>>` macros in a single passage, but generally shouldn't need to; if you have multiples, they will work, but it's likely you're doing something wrong or unwise, so think your code through carefully.

**Usage**:
```
Replace: @@#my-element;@@

Done + Replace: @@#my-other-element;@@

<<replace '#my-element'>>This won't work...<</replace>> /% does nothing and raises an error %/

<<done>>
	<<replace '#my-other-element'>>This will though!<</replace>>
<</done>>
/% with the done macro, the <<replace>> works %/
```

## Other usage notes:

**Task object warning**:

This macro registers one or more `postdisplay` task object called `:chapel-done-macro-#`, where the `#` is a number. So you'll want to avoid using these names for your own task objects to prevent potential bugs.  There is no configuration option to change this, but it's fairly easy to see and change in the unminified source code, where it should appear only once.

-----

Thanks to @Zachac for the idea and original implementation example.