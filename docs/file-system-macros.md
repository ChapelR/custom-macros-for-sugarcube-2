## The File System Macro Set

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

A set of macros for importing and exporting data to the user's hard drive, or for importing exported saved games into different games.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/fs.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/fs.js).  
**DEMO:** Coming soon.  
**GUIDE:** Not available.

### Macro: `<<export>>`

**Syntax**:`<<export data fileName [dataType]>>`

The `<<export>>` macro is a way to save a little bit of data on your user's hard drive that exists outside of SugarCube's normal save systems.  This macro may be appropriate for certain very specific use cases, but generally having users export saves is better.  It is largely included here for completeness.

**Arguments**:

 * **data**: Some data, like a variable.
 * **fileName**: The default file name to save the file as.
 * **dataType**: (optional) By default, the macro saves the data as a string, and converts to JSON when that isn't possible.  This option gives you a bit more control, and accepts the following arguments:
	 * `text`: the file is saved as text, but may be converted to JSON anyway, if necessary.
	 * `json`: the file is saved as JSON data.
	 * `base64`: the file is saved in the compressed base64 format. The object will be converted to JSON first if necessary.

**Usage**:
```
<<set $player to { name : 'Bob', Level : 10 }>>

<<link 'Export Player Data'>>
	<<export $player 'player-info.twinedata' 'json'>>
<</link>>
```

### Macro: `<<import>>`

**Syntax**:`<<import variableName [dataType] [linkText]>>`

The `<<import>>` macro can be used to import some data you've previously saved to the user's hard disk.  This macro will create a button that, when clicked, will prompt the user to select a file.  That file will be read and the data stored in the indicated variable.  You can also import SugarCube 2 saved data and access it without loading it, such as to create an episodic game, or let users import characters or choices into sequels.  To import SugarCube 2 saves, use the `base64` data type option, and take a look at [the Save API](http://www.motoslave.net/sugarcube/2/docs/api-save.html) to get a handle on the data structure.

**Arguments**:

 * **variableName**: The name of a variable, passed in quotes.  The data pulled from the file will be saved to this variable.
 * **dataType**: (optional) The data will be imported as a string, but you can have the string be automatically included if you tell the macro what sort of data you expect:
	 * `text`: the file will be read and imported as a single string.
	 * `json`: the file will be read as JSON data and converted back into a JavaScript value or object.
	 * `base64`: the file will be as base64 format, and converted to a string or object as appropriate.
 * **llinkText**: (optional) The text the button should appear with.  Defaults to 'Import'.

**Usage**:
```
<<import '$player' 'json' 'Import Player Info'>>

<<import '$oldGame' 'base64' 'Import Saved Data'>>
```