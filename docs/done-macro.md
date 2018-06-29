## The Done Macro

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

The `<<done>>` macro serves the same purpose as the `PassageDone` special passage, a `postdisplay` task, or a `:passagedisplay` event; it runs it's content just after the current passage finished loading.  This is primarily useful for things like DOM macro manipulation; you normally can't use macros like `<<replace>>` directly in your passage code without placing the in `<<links>>` or other interactive elements, or in the `PassageDone` special passage, since the HTML elements you want to manipulated haven't been drawn yet.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/done.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/done.js).  
**DEMO:** Coming soon.  
**GUIDE:** Not available.

### Macro: `<<done>>`

**Syntax**:`<<done>>...<</done>>`

The code between the tags is run after the passage content has finished rendering, ensuring that the DOM had finished rendering.  You can have multiple `<<done>>` macros on a single page, but generally shouldn't need to; if you have multiples, they will work, but it's likely you're doing something wrong.

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

This macro registers a `postdisplay` task object called `:chapel-done-macro`, so you'll want to avoid using that name for your own task objects to prevent potential bugs.  There is no configuration option to change this, but it's fairly easy to see and change in the unminified source code, where it should appear three times in total.

-----

Thanks to @Zachac for the idea and original implementation example.