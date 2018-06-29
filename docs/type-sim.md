## The Typing Simulation Macro

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

Macros for making your story fullscreen when used in a browser.  Note: these macros may not work in the downloadable release of Twine 2's test and play modes, and may or may not work with various wrappers like NW.js or Electron.  For normal in browser play, they should do fine.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/type-sim.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/type-sim.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**GUIDE:** Not available.

### Macro: `<<typesim>>`

**Syntax**:`<<typesim text>>...<</typesim>>`

The `<<typesim>>` macro creates a text area.  When focused, the user's keystrokes generate a predefined message one letter at a time, simulating typing but ignoring the actual input.  After the message is finished, any text or code between the macro tags is displayed / run.  Any output is shown as a `<div>` beneath the text area; this means you'll need to watch your spacing.

* **text**: a string of text; a predefined message that is 'typed' out by the player.

**Usage**:
```
You begin typing the email to your boss:

<<typesim "Hey Jim, I won't be in to work today, sorry.">>[[Send the email.|next passage]]<</typesim>>
```

## Other usage notes:

**Styling Options**:

The `<textarea>` generated will just use SugarCube's standard styling.  If you want to alter its appearance, it has the class `.macro-typesim`.