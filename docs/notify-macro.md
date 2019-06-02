## The Notify Macro

[Back to the main readme](./README.md).

This macro pops a message up that slides out from the right side of the screen, a short notification that's less distracting than a dialog or alert, for things like inventory changes, experience gains, or even achievements.

?> Note that unlike most of my code, this macro requires you to install the CSS code as well in your story's Stylesheet section.

**THE CODE:** [Minified JS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/notify.min.js) [Minified CSS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/notify.min.css). [Pretty JS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/notify.js) [Pretty CSS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/notify.css).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=notify).  
**GUIDE:** Not available.

### Macro: `<<notify>>`

**Syntax**:`<<notify [delay] [classList]>>...<</notify>>`

The `<<notify>>` macro displays everything between it's tags in a small message box on the top right of the screen that slides in and slides out after a brief delay.

 * **delay**: (optional) The amount of time the notification should remain visible, in milliseconds (working on getting this to CSS time).  If omitted, the delay defaults to 2 seconds, or `2000`.
 * **classList**: (optional) An array of strings, list of space seperated stings, or some combination of the two, will be added to the notification as classes for styling.

**Usage**:
```
/% a simple, two-second-long notification with no added classes %/
<<notify>>Achievement unlocked!<</notify>>

/% a one-second-long notification with the 'inventory-update' class %/
<<notify 1000 'inventory-update'>>Found gold.<</notify>>

/% a lengthy five-second-long notification %/
<<notify 5000>>$xp experience points earned.<</notify>>
```

## Other Usage Notes:

!> Note that giving the player unlimited control over these notifications, or trying to show several at once or right after each other will cause them to trip over themselves as they try to animate, so try to keep them spaced out, and don't assign them to links or buttons you expect the player to press repeatedly.