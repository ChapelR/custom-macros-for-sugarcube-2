## The Fullscreen Macros

[Back to the main readme](./README.md).

Macros for making your story fullscreen when used in a browser.  Note: these macros may not work in the downloadable release of Twine 2's test and play modes, and may or may not work with various wrappers like NW.js or Electron.  For normal in browser play, they should do fine.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/fullscreen.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/fullscreen.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**GUIDE:** Not available.

### Macro: `<<fullscreen>>`

**Syntax**:`<<fullscreen>>`

This macro causes the game to go into fullscreen mode, but it must be paired with some sort of interaction to work, like a link or a button.

**Usage**:
```
<<link 'Fullscreen Mode'>>
	<<fullscreen>>
<</link>>

<<button 'Fullscreen Mode'>>
	<<fullscreen>>
<</button>>
```

### Macro: `<<fullscreenlink>>`

**Syntax**:`<<fullscreenlink linkText>>`

Creates a link with user-defined text that, when clicked, launches fullscreen mode.

 * **linkText**: the text of the link.

**Usage**:
```
<<fullscreenlink 'Fullscreen Mode'>>
```