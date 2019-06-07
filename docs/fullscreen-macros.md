## The Fullscreen Macros

[Back to the main readme](./README.md).

Macros for making your story fullscreen when used in a browser.  Note: these macros may not work in the downloadable release of Twine 2's test and play modes, and may or may not work with various wrappers like NW.js or Electron.  For normal in browser play, they should do fine.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/fullscreen.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/fullscreen.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=fullscreen).  
**GUIDE:** Not available.

### Macro: `<<fullscreen>>`

**Syntax**: `<<fullscreen>>`

This macro causes the game to go into fullscreen mode, but it should probably be paired with some sort of interaction to work, like a link or a button. Calling the macro again causes the game to leave fullscreen mode.

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

**Syntax**: `<<fullscreenlink linkText>>`

Creates a link with user-defined text that, when clicked, toggles the fullscreen mode.

 * **linkText**: the text of the link.

**Usage**:
```
<<fullscreenlink 'Fullscreen Mode'>>
```

### Function: `setup.fullscreen()`

**Syntax**: `setup.fullscreen([bool])`

This function can be used to control the game's fullscreen state from JavaScript.

**Arguments**:

- **bool**: (optional) pass `true` to enter fullscreen mode, or `false` to exit it. Omit the argument to toggle fullscreen mode.

**Usage**:
```javascript
setup.fullscreen(true); // causes the game to go into fullscreen mode, if it isn't already
```

### Function: `setup.isFullscreen()`

**Syntax**: `setup.isFullscreen()`

Returns whether the game is currently in fullscreen mode.

**Usage**:
```javascript
if (setup.isFullscreen()) {
    // do something when the game is in fullscreen mode
}
```