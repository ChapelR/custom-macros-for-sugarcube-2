## The Typing Simulation Macro

[Back to the main readme](./README.md).

> [!NOTE]
> As of v2.9.0 of the collection (v2.0.0 of this macro) the `<<typesim>>` macro is mobile friendly and should work on phones and other devices with software keyboards!

Some games, like *Superhot*, have a neat little feature where you can mash on the keyboard and no matter what you actually type in, a predefined message comes out.  This macro provides a similar function to Twine.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/type-sim.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/type-sim.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=typesim).  
**GUIDE:** Not available.

### Macro: `<<typesim>>`

**Syntax**:`<<typesim text>>...<</typesim>>`

The `<<typesim>>` macro creates a text area.  When focused, the user's keystrokes generate a predefined message one letter at a time, simulating typing but ignoring the actual input.  After the message is finished, any text or code between the macro tags is displayed / run.  

> [!NOTE]
> Any output is shown as a `<div>` beneath the text area; this means you'll need to watch your spacing.

* **text**: a string of text; a predefined message that is 'typed' out by the player.

**Usage**:
```
You begin typing the email to your boss:

<<typesim "Hey Jim, I won't be in to work today, sorry.">>[[Send the email.|next passage]]<</typesim>>
```

## Other usage notes:

**Styling Options**:

The `<textarea>` generated will just use SugarCube's standard styling.  If you want to alter its appearance, it has the class `.macro-typesim`.

**Event**:

When the typing simulation is finished, the event `:type-sim-end` is triggered on the document's root. The event object has a `message` property containing the message that was typed out.

```javascript
$(document).on(':type-sim-end', function (ev) {
    console.log('Typing simulation message: ', ev.message);
});
```

