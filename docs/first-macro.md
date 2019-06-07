## The First Macro

[Back to the main readme](./README.md).

Based loosely on Leon's `<<once>>` macro and similar, `<<first>>`, `<<then>>`, and `<<finally>>` create code or text that is shown based on how many times the player has visited a particular passage. While it's nothing that couldn't be handled with variables or `visited()` and an `<<if>>` or `<<switch>>`, I believe this lightweight set of macros feel a bit better to use in some stories. 

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/first-macro.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/first-macro.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=first).  
**GUIDE:** Not available.

### Macro: `<<first>>`

**Syntax**:`<<first>>...<<then>>...<<finally>>...<</first>>`

A simple, slightly sexier repalcement for `<<if visited()>>` and `<<switch visited()>>`, based loosely on Leon's `<<once>>` macro.  `<<first>>` shows text on the first visit to a passage, and you can use `<<then>>` to show different text on subsequent visits.  Use `<<finally>>` to show text that persists over *all* subsequent visits.  

> [!DANGER]
> Do not nest `<<first>>` macros inside each other; it won't cause an error, but it also likely won't work the way you expect.  If you need nesting, you'll need to use variables.

**Usage**:
```
// show something or run code only on first visit to any given passage:
<<first>>Show only on first visit.<</first>>

// show something only on second and all subsequent visits:
<<first>><<finally>>Show me on every visit except the first.<</first>> 

// show different text on first three visits, then nothing:
<<first>>\
	First visit text.
<<then>>\
	Second visit text.
<<then>>\
	Third visit text.
<</first>>

// show different text on first two visits then different text on the third visit and subsequent visits: 
<<first>>\
	First visit text.
<<then>>\
	Second visit text.
<<finally>>\
	Third visit and subsequent visits text.
<</first>>
```