## The Mouseover Macro

[Back to the main readme](./README.md).

This macro allows you to use some fancy mouse events to create hover effects, tooltips, or just run arbitrary code when the mouse enters or leaves an element.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/mouseover.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/mouseover.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=mouseover).  
**GUIDE:** Not available.

### Macro: `<<mouseover>>`

**Syntax**: 
```
<<mouseover>>
    [content]
<<onmouseover>> (or <<onhover>>)
    [TwineScript to run on mouseover events]
<<onmousein>> (or <<onmouseenter>>)
    [TwineScript to run on mousenter events]
<<onmouseout>>
    [TwineScript to run on mouseout events]
<</mouseover>>
```

The `<<mouseover>>` macro causes some content on the page to be interactive with certain non-click mouse events. The content that becomes interactive is whatever is placed after the opening tag and before the first child tag. The child tags determine what code is run and when. The `<<onmouseover>>` tag (`<<onhover>>` also works) triggers on the `mouseover` event. The `<<onmousein>>` (`<<onmouseenter>>` also works) tag triggers on the `mouseenter` event. The `<<onmouseout>>` tag triggers on the `mouseout` event.

?> Generally speaking, there isn't a great deal of difference between `mouseenter` events and `mouseover` events for most code, but it's included here for completeness.
 
**Usage**:
```
/% create a link with a "tooltip" %/
<<mouseover>>\
    <<link 'Do it'>><</link>>\
<<onmousein>>
    <<replace '#tooltip'>>: Do the thing.<</replace>>
<<onmouseout>>
    <<replace '#tooltip'>><</replace>>
<</mouseover>>\
@@#tooltip;@@

/% play a sound on mouseover %/
<<mouseover>>Spooooooooky<<onmousein>><<audio 'boo' volume 1 play>><</mouseover>>

/% navigate on mouseover %/
Watch the <<mouseover>>[[pit!|fell in a pit]]<<onmousein>><<goto 'fell in a pit'>><</mouseover>>
```

### Other Usage Notes:

!> Using mouse-specific events for major gameplay mecahnics will have a negative effect on accesiblity and on touch devices and mobile users. You'll need to weigh any benefits against this fairly major drawback when using this macro, or limit yourself to only using it in ways that are non-essential to the user experience.