## The UI Macro

[Back to the main readme](./readme.md).

This macro provides users access to parts of the UI and UIBar APIs from macros, and a few other, non-API functions.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/ui-macro.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/ui-macro.js).  
**DEMO:** Coming soon.  
**GUIDE:** Not available.

### Macro: `<<ui>>`

**Syntax**: `<<ui commandList>>`

The `<<ui>>` macro is a macro-wrapper around some SugarCube APIs, similar in concept to the [dialog API macro set](./dialog-api-macro-set.md). It allows you to control certain UI and UIBar APIs from macro code, and also adds a few extra commands of its own. You can run any number of actions in a single macro call, and they will execute in order. Calling two commands that essentially do the opposite, e.g. `stow` and `unstow` in the same `<<ui>>` macro call won't cause an error but it's also a wash: nothing will happen.

**Arguments**:

 * **commandList**: one or more commands from the list below.

**Command List**:

Some commands have aliases: alternate command names that do the same thing.

|**Command**|**Alias**|**Description**|
|---|---|---|
|`update`|`refresh`, `reload`|Updates all of the UI elements. If you have variables displayed in the UI bar (the `StoryCaption`, for example), their values will update.|
|`stow`| |Stows (collapses) the UI bar, similar to if the arrow button is pressed.|
|`unstow`| |Unstows the UI bar.|
|`toggle`| |Toggles the stowed state of the UI bar, stowing it if it's unstowed, and unstowing it if it's stowed.|
|`hide`| |Hides the UI bar, but doesn't reclaim the space it normally takes up.|
|`show`| |Unhides the UI bar after it is hidden using the `hide` command.|
|`kill`|`destroy`|Hides the UI bar and reclaims the space it normally takes up. This is different from the `UI.destroy()` method, as this doesn't remove the styles and can be undone.|
|`restore`|`revive`|Essentially undoes the `kill` command. It cannot undo a call to `UI.destroy()`.|
|`jump`|`jumpto`|Opens the jump dialog menu.|
|`saves`|`save`, `load`|Opens the saves dialog menu.|
|`settings`|`setting`|Opens the settings dialog menu.|
|`share`|`sharing`|Opens the share dialog menu.|

The last group of commands above can be used to access UI bar menus without needing the UI bar.

**Usage**:
```
/% create your own save button %/
:: PassageHeader
<<button "Saves">><<ui saves>><</button>>

/% hide the UI bar until the next passage %/
<<ui hide>>

Blah blah blah.

<<link [[Next|next passage]]>>
    <<ui show>>
<</link>>

/% remove the UI bar, but be able to restore it later %/
<<ui kill>>

/% update the player's health %/
:: StoryCaption
$currentHealth / $maxHealth

:: some passage
You took 15 damage!
<<ui update>>
```