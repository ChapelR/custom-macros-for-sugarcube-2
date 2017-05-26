# Chapel's Custom Macros for SugarCube

## Contents

* [Simple Inventory](#simple-inventory)
* [Cycles System](#cycles-system)
* [Play Time System](#play-time-system)
* [Fading Macros](#fading-macros)
* [First Macro](#first-macro)
* [Message Macro](#message-macro)
* [Dialog API Macros](#dialog-api-macros)

## Simple Inventory

A collection of macros and functions for managing a basic, array-based inventory system for 'key’ style items, allowing items to be added to and removed from the inventory. It also includes its own simple if/else style macro that specifically checks for items (or lists of items) and runs code conditionally from there. Also provides support for displaying the inventory, sorting the inventory, and searching the inventory. Does not support more advanced items, like weapons or armor with their own stats, or stackable items, like potions, though it could be extended to at least help manage such systems.

You can use the simple inventory system for other things too, like achievements, titles, or any sort of in-game collection.

### Options

This system includes two options.  You can find the options object near the top of the script.  It should look like this:

```javascript
// options object:
setup.simpleInv.options = {
	storyVar  : 'inventory',
	tryGlobal : true
};
```

#### `storyVar` option
The simple inventory script automatically creates a story variable array to hold the inventory; this allows you to save and load the inventory via SugarCube's built-in save system and it allows you to access the inventory natively in the IDE using a `$variable`.  By default, the story variable is created with the name `'inventory'` and accessed via `$inventory` in the IDE.  You can change the name using the `storyVar` option.  Valid names are the same as all valid TwineScript variable names.

**Examples**:
```javascript
setup.simpleInv.options = {
	storyVar  : 'keyItems',    // changes the story variable to $keyItems
...
```

```javascript
setup.simpleInv.options = {
	storyVar  : 'achievements',    // changes the story variable to $achievements
...
```

```javascript
setup.simpleInv.options = {
	storyVar  : 'rockCollection',    // changes the story variable to $rockCollection
...
```

#### `tryGlobal` option
There are two 'helper' functions included in these scripts: `setup.simpleInv.invAll()` and `setup.simpleInv.invAny()`.  You can read more about how to use these functions below.  Obviously, both are a mouthful, so the function definitions get referenced by the global functions `invAll()` and `invAny()`.  These functions are only created if their names are undefined, to prevent any potential compatibility issues.  However, if you'd prefer to keep these functions out of the global scope, you can set this value to false and they won't be sent to the global scope at all, even if their names aren't taken.  You'll be forced to write out the longer `setup.someInv...` functions, though.

### Macros

This is a list of the macros included in the simple inventory system.

#### `<<inventory>>` macro

**Syntax**:
 `<<inventory (optional: separator)>>`
 
* separator: a string to separate each item in the inventory.

**Explanation**:
The `<<inventory>>` macro displays a list of the current items in the inventory array.  By default the items are listed on new lines, but you can provide a string as a separator instead.

**Examples**:
```javascript
// Assume the inventory includes: 'business card', 'keys', 'cellphone'

<<inventory>> will display:
	business card
	keys
	cellphone

<<inventory ', '>> will display:
	business card, keys, cellphone

<<inventory 'hello!'>> will display:
 business cardhello!keyshello!cellphone
 ```

 #### `<<pickup>>` macro
 
 **Syntax**:
 `<<pickup (list of items)>>`
 
* list of items: a list of items, provided as quoted strings, each seperated by a space.
 
 **Explanation**:
 The `<<pickup>>` macro adds new items to the inventory.  New items are added to the end of the inventory array.
 
 **Examples**:
```javascript
<<pickup 'rusty key'>> // adds 'rusty key' to the inventory
<<pickup 'key' 'ball'>> //adds 'key' and 'ball' to the inventory
<<pickup rusty key>> // !!! passing arguments that aren't quoted can cause problems.  in this case, 'rusty' and 'key' will be added to the inventory as two separate items.
```

#### `<<drop>>` macro

**Syntax**:
`<<drop (list of items)>>`
 
* list of items: a list of items, provided as quoted strings, each seperated by a space.
 
 **Explanation**:
 The `<<drop>>` macro removes items from the invenotory.  If an item provided to this macro cannot be found in the current inventory, nothing happens and no error is thrown.
 
 **Examples**:
```javascript
<<drop 'rusty key'>> // removes 'rusty key' from the inventory, if it is in the inventory
<<drop 'key' 'ball'>> //removes 'key' and 'ball' from the inventory, if either one is in the inventory
```

#### `<<has>>` macro

**Syntax:**
```javascript
<<has (list of items)>>
	...
<<otherwise>>
	...
<</has>>
```

* list of items: a list of items, provided as quoted strings, each seperated by a space.

**Explanation**:
The macros `<<has>><<otherwise>><</has>>` provide a simple alternative to `<<if>><<else>><</if>>` that specifically work within the inventory system.  If more than one item is passed to `<<has>>`, **all** of the items must be present for the `<<has>>` statement to be true.  If you need more control than that, use the helper functions `invAll()` and `invAny()` with normal `<<if>>` statements.

Note that these macros are not as flexible as standard `<<if>>` macros, and are meant to compliment them rather than replace them; it's a shortcut. 

**Examples**:
```javascript
<<has 'key'>>\
	You have the key!
	[[Unlock the door.]]
<</has>>

<<has 'key'>>\
	You have the key!
	[[Unlock the door.]]
<<otherwise>>
	The door is locked tight and you can't get it open.
<</has>>

// for more advanced/complex stuff, use <<if>>; still, the following does work:
<<has 'helmet' 'breastplate' 'greaves' 'gauntlets' 'boots'>>
	You have a full set of armor on.
<<otherwise>>
	<<has 'sword'>>
		At least you're armed.
	<<otherwise>>
		You're not prepared at all for this...
	<</has>>
<</has>>
```

#### `<<invSort>>` macro

**Syntax**:
`<<invSort>>`

**Explanation**:
The `<<invSort>>` macro sorts the inventory alphabetically.  The default inventory order is chronological.  Note that the default order cannot easily be restored.

**Examples**:
```javascript
// given the inventory array: 'keys', 'business card', 'cellphone'

<<invSort>><<inventory '; '>> will display:
		business card; cellphone; keys
```

#### `<<invWhatIs>>` and `<<invWhereIs>>` macros

**Syntax**:
```javascript
<<invWhatIs (index)>>
<<invWhereIs (item)>>
```

* item: A single item, provided as a quoted string.
* index: A positive integer (or zero) referring to a position within the inventory array.

**Explanation**:
These two macros are for debugging/extending the system.  Both set the temporary variable `_is` to some value.  `<<invWhatIs>>` accepts an index from the array and sets `_is` to the item found in that index, or the string `'nothing'` if the index is empty or undefined.  `<<invWhereIs>>` accepts an item's name and sets the value of `_is` to that item's index in the array.  If the item isn't currently in the array, it sets `_is` to `-1`.

It's unlikely that you'll need to use these macros much (if at all) if you're using the simple inventory system as-is, but they can help with finding bugs and extending the system's functionality.

**Examples**:
```javascript
// given the inventory: 'business card', 'keys', 'cellphone'

<<invWhatIs 0>>
<<print _is>> // prints 'business card'

<<invWhatIs 2>>
<<print _is>> // prints 'cellphone'

<<invWhatIs 3>>
<<print _is>> // prints 'nothing'

<<invWhatIs $inventory.length - 1>>
The last item in the inventory is <<print _is>>.

<<invWhereIs 'keys'>>
<<print _is>> // prints 1

<<invWhereIs 'wallet'>>
<<print _is>> // prints -1

<<invWhereIs 'notebook'>>
<<if _is is -1>>
	<<pickup 'notebook'>>
<</if>> // adds notebook is it doesn't exist in inventory

<<invWhereIs 'keys'>>
<<print _is>> // prints 1
<<invWhatIs _is>>
<<print _is>> // prints 'keys'
```

### Functions

*A note about the functions*:  The functions exist in both the `setup.simpleInv` namespace and as globals.  There is a very small chance that you'll need to use the nonglobal versions if the names of the functions are already taken.  To use the nonglobal versions, append the funtion's names with `setup.simpleInv.`.  For example, `invAll()` would become `setup.simpleInv.invAll()`.  If you set the `tryGlobal` option to `false` (see above), you'll have to use the nonglobal versions.

#### `invAll()` function

**Syntax**:
`invAll(item list)`

* item list: a list of quoted strings, seperated by commas.

**Explanation**:
The `invAll()` function returns true only if **all** of the provided items are found in the inventory.  Most useful when paired with `<<if>>` macros.  The `invAll()` function is essentially the same as the `<<has>>` macro.

**Examples**:
```javascript
<<if invAll('red key', 'blue key', 'yellow key')>>
	You have all the keys you need to open the vault!
<</if>>

<<set $surviveFireTrap to invAll('helmet', 'heat suit')>>
Flames explode out of the walls \
<<if $surviveFireTrap>>\
	but your helmet and heat suit protect you!
	
	[[You make it through the trap]].
<<else>>\
	and kill you!
	
	[[You die]].
<</if>>
```

#### `invAny()` function

**Syntax**:
`invAny(item list)`

* item list: a list of quoted strings, seperated by commas.

**Explanation**:
The `invAny()` function returns true if **any** of the provided items are found in the inventory.  Most useful when paired with `<<if>>` macros.

**Examples**:
```javascript
<<if invAny('lockpick', 'master key')>>
	You can [[unlock the door]].
<<else>>
	You'll need to find something to help you unlock this door.
<</if>>

<<if invAny('cellphone', 'walkie-talkie')>>
	You're getting a call.  [[Answer it]]?
<</if>>

<<set $isArmed to invAny('sword', 'axe', 'gun', 'baseball bat')>>
<<if $isArmed>>
	You have a weapon.
<</if>>

Flames explode out of the walls \
<<has 'helmet' 'heat suit'>>\
	but your helmet and heat suit protect you!
	
	[[You make it through the trap]].
<<otherwise>>\
	<<if invAny('helmet', 'heat suit')>>\
		and burn you badly!
	
		[[You barely survive]].
	<<else>>\	
		and kill you!
	
		[[You die]].
	<</if>>
<</has>>
```

## Cycles System

Simply put, a way to introduce 'cycles' into your game without having to fiddle around too much. You can declare a `<<newcycle>>` and assign it a name, a number of values, and a number of turns it lasts. For example, `<<newcycle ‘time’ 'morning’ ‘noon’ ‘night’ 5>>` would create a new cycle called `'time'` that would change at a rate of every 5 turns. You can have multiple cycles running at once, like one as a day-night cycle and another for seasons, or one for hours and another for days of the week. You can control and access your cycles via  the following passage tags, story variables, macros, and functions, depending on what you want to do with them.

Here's a few notes about how the system works that you should keep in mind:

* Cycles are independently tracked.  This means that cycles that are added later start their tracking later.  For example, if you create the cycle `<<newcycle 'time' 'morning' 'noon' 'night' 3>>` and then, after 1 turn (e.g. on the next passage), you create the cycle `<<newcycle 'days' 'Sunday' 'Monday' 'Tuesday' 'Wednesday' 'Thursday' 'Friday' 'Saturday' 9>>`, the two cycles will not line up: each new `'day'` will start at the `'time'` cycle's `'noon'`. Generally, it's best to include all your `<<newcycle>>` macros in the same passage (`StoryInit` is a good candidate), or, if you need your cycles to line up, use the startTag (default: 'startcycles') or the `<<resetallcycles>>` macro to reset all of your cycles to zero upon adding a new one.
* It is **not possible** to reclaim a cycle that has been deleted by the `<<deletecycle>>` macro.  Generally, it's better to simply hide the cycle's output than to delete it if you feel that you may need to use it again; you can always reset it via `<<resetcycle>>` if you need it to appear to have been 'stopped'.
* You do not have to delete a cycle to reconfigue it.  You can use the `<<newcycle>>` macro to make alterations to an existing cycle; the old cycle will be overwritten by the new.  Note that, like with `<<deletecycle>>`, it is impossible to reclaim an overwritten cycle.
* The macros that 'return' temporary variables (`<<cycleIs>>`, `<<whereIsCycle>>`, `<<cycleArrayIs>>`, `<<cycleAtIs>>` and `<<defineCycle>>`) are designed for debugging and extending the cycle system.  You will almost never need to resort to these macros if you are using the system as-is, though they can help you do some pretty dynamic things.

### Options

This system includes five options.  You can find the options object near the top of the script.  It should look like this:

```javascript
// options object:
setup.cycSystem.options = {
	storyVar  : 'cycles',
	startTag  : 'startcycles',
	pauseTag  : 'pausecycles',
	menuTag   : 'menupause',
	tryGlobal : true
};
```

#### `storyVar` option
The cycle system script automatically creates a story variable object to hold all the created cycles; this allows you to save and load the cycles via SugarCube's built-in save system and it allows you to access the cycles natively in the IDE using a `$variable`.  By default, the story variable is created with the name `'cycles'` and accessed via `$cycles` in the IDE.  You can change the name using the `storyVar` option.  Valid names are the same as all valid TwineScript variable names.

#### `startTag` option
The `startTag` value is a passage tag that will reset all cycles to `0` turns, and can be used instead of the `<<resetallcycles>>` macro.  By default, the tag is `'startcycles'`.  You can configure the name of the tag to your liking with this option.  **Note**: passage tags should not include spaces.

#### `pauseTag` option
The `pauseTag` value is a passage tag that will temporarily pause all cycles for the given passage, preventing them from collecting a turn.  By default, the tag is `'pausecycles'`.  You can configure the name of the tag to your liking with this option.  **Note**: passage tags should not include spaces.

#### `menuTag` option
The `menuTag` value is a passage tag that will prevent all cycles from collecting turns in both the tagged passage and the passage immediately following it.  The idea behind this tag is to use it for menu options, so that entering and exiting a menu-style passage will not cause cycles' turns to increment.  By default, the tag is `'menupause'`.  You can configure the name of the tag to your liking with this option.  **Note**: passage tags should not include spaces.

#### `tryGlobal` option
There is one 'helper' functions included in these scripts: `setup.cycSystem.checkCycle()`.  You can read more about how to use this function below.  Obviously, this is a mouthful, so the function definition gets copied over as the global function `checkCycle()`.  This function is only created if its name is undefined, to prevent any potential compatibility issues.  However, if you'd prefer to keep this function out of the global scope, you can set this value to false and it won't be sent to the global scope at all, even if its name isn't taken.  You'll be forced to write out the longer `setup.cycSystem.checkCycle()` function, though.

### Macros

This is a list of the macros included in the cycle system.

#### `<<newcycle>>` macro

 **Syntax**:
 `<<newcycle (name) (list of values) (turns)>>`
 
* name: the name of the new cycle to create, a string; should follow the rules for naming TwineScript variables
* list of values:  the values the cycle will rotate through
* turns: the number of turns it takes for the value of the cycle to change once
 
 **Explanation**:
The `<<newcycle>>` macro is used to construct a new cycle.  The cycle's definition will be saved automatically to a story variable (default `$cycles.(name)`).  The first argument provided should be a valid name; the name will need to be written like a valid TwineScript variable, though without any kind of sigil.  The following arguments should be strings defining the values associated with the cycle.  The final argument should always be a number, and will represent how many turns it takes the cycle to move from one value to the next.  When the last value is reached and the appropriate number of turns pass, the cycle will restart.
 
 **Examples**:
```javascript
<<newcycle 'timeOfDay' 'morning' 'afternoon' 'evening' 'night' 2>>
// creates a new cycle called 'timeOfDay', and change the value every other turn

<<newcycle 'days' 'Sunday' 'Monday' 'Tuesday' 'Wednesday' 'Thursday' 'Friday' 'Saturday' 8>>
// creates a new cycle called 'days' that changes the day of the week every 8 turns

<<newcycle 'seasons' 'spring' 'summer' 'fall' 'winter' 100>>
// creates a new cycle called 'seasons' that changes the season every 100 turns
```

#### `<<deletecycle>>` macro

 **Syntax**:
 `<<deletecycle (list of cycles)>>`

* list of cycles: a list of cycle names, provided as quoted strings and separated by spaces.
 
 **Explanation**:
The `<<deletecycle>>` macro deletes any and all of the cycles provided to it.  Deleted cycles are no longer tracked and cannot be recovered.  If a cycle provided to the macro does not exist, the macro will raise an error.
 
 **Examples**:
```javascript
<<deletecycle 'timeOfDay'>> // deletes the cycle named 'timeOfDay'

<<deletecycle 'day' 'seasons'>> // deletes the cycles 'day' and 'seasons'
```

#### `<<resetcycle>>` macro

 **Syntax**:
 `<<resetcycle (list of cycles)>>`

* list of cycles: a list of cycle names, provided as quoted strings and separated by spaces.
 
 **Explanation**:
The `<<resetcycle>>` macro resets all of the cycles provided to it back to their initial state, as though no turns had passed.  If a cycle provided to the macro does not exist, the macro will raise an error.
 
 **Examples**:
```javascript
<<resetcycle 'timeOfDay'>> // resets the cycle named 'timeOfDay' to 0 turns

<<resetcycle 'day' 'seasons'>> // resets the cycles 'day' and 'seasons' to 0 turns
```

#### `<<resetallcycles>>` macro

 **Syntax**:
 `<<resetallcycles>>`
 
 **Explanation**:
Resets all currently running cycles to `0` turns.  Similar to `<<resetcycle>>`, but affects all cycles.  Functionally the same at the `startTag` passage tag; though the tag is the preferred method to accomplish this if at all possible.
 
 **Examples**:
```javascript
<<resetallcycles>> // all currently running cycles will be reset
```

#### `<<showcycle>>` macro

**Syntax**:
`<<showcycle (cycle) (optional: 'format' keyword)>>`

* cycle: the name of an existing cycle, passed as a quoted string.
* 'format' keyword: if the keyword `format` is included, the cycle's current value will be displayed with the first letter upper-case and all other letters lower-case

**Explanation**:
The `<<showcycle>>` macro outputs the current value of the indicated cycle, and optionally formats it for display.

**Examples**:
```javascript
//given <<newcycle 'time' 'early' 'late' 2>>, and turn 3:
<<showcycle 'time'>> // outputs 'early'
<<showcycle 'time' format>> // outputs 'Early'

//given <<newcycle 'time' 'early' 'LATE' 2>>, and turn 4:
<<showcycle 'time'>> // outputs 'LATE'
<<showcycle 'time' format>> // outputs 'Late'
```

#### `<<cycleIs>>` macro

**Syntax**:
`<<cycleIs (cycle)>>`

* cycle: the name of an existing cycle, passed as a quoted string.
	
**Explanation**:
`<<cycleIs>>` is primarily for debugging/extending the system.  This macro sets the value of the temporary variable `_is` to the current value of the indicated cycle.

**Examples**:
```javascript
//given <<newcycle 'time' 'early' 'late' 2>>, and turn 3:
<<cycleIs 'time'>>
<<print _is>> // prints 'early'
```

#### `<<whereIsCycle>>` macro

**Syntax**:
`<<whereIsCycle (cycle)>>`

* cycle: the name of an existing cycle, passed as a quoted string.
	
**Explanation**:
`<<whereIsCycle>>` is primarily for debugging/extending the system.  This macro sets the value of the temporary variable `_is` to the current index of the indicated cycle in the `$(storyVar).all` array, an array that stores the names of all currently running cycles.

**Example**:
```javascript
<<whereIsCycle 'time'>>
<<print _is>> // returns the index of 'time' in the $(storyVar).all array
```

#### `<<cycleArrayIs>>` macro

**Syntax**:
`<<cycleArrayIs (cycle)>>`

* cycle: the name of an existing cycle, passed as a quoted string.
	
**Explanation**:
`<<cycleIs>>` is primarily for debugging/extending the system.  This macro sets the value of the temporary variable `_is` to the array of possible values of the indicated cycle.

**Examples**:
```javascript
//given <<newcycle 'time' 'early' 'late' 2>>:
<<cycleArrayIs 'time'>>
<<print _is.join(', ')>> // prints 'early, late'
```

#### `<<cycleAtIs>>` macro

**Syntax**:
`<<cycleAtIs (index)>>`

* index: a numeric position in the `$(storyVar).all` array.
	
**Explanation**:
`<<cycleAtIs>>` is primarily for debugging/extending the system.  This macro sets the value of the temporary variable `_is` to the name of the cycle in the indicated index of the `$(storyVar).all` array. Sets `_is` to undefined if no value exists in the provided index.

**Example**:
```javascript
<<cycleAtIs 1>>
<<print _is>> // returns the name of cycle in the $(storyVar).all array's second index
```

#### `<<defineCycle>>` macro

**Syntax**:
`<<defineCycle (cycle)>>`

* cycle: the name of an existing cycle, passed as a quoted string.
	
**Explanation**:
`<<defineCycle>>` is primarily for debugging/extending the system.  This macro sets the value of the temporary variable `_def` to a deep copy of the indicated cycle object.  Changes to the `_def` variable will not be reflected in the actual cycle.  You should generally treat cycles as read-only anyway, and overwrite cycles with new ones using the same name if you need to alter them.

**Examples**:
```javascript
<<cycleAtIs 0>>
<<defineCycle _is>>
<<cycleIs _def.name>>
<<print _def.name>>: <<print _is>> // prints the name and current value of the cycle in the first index
```

### Functions

*A note about the function*:  The `checkCycle()` function exists in both the `setup.cycSystem` namespace and as a global.  There is a very small chance that you'll need to use the nonglobal version if the name of the function is already taken.  The nonglobal version is `setup.cycSystem.checkCycle()`.

#### `checkCycle()` function

**Syntax**:
`checkCycle(cycle, value)`

* cycle: the name of an existing cycle, passed as a quoted string.
* value: the value to test for--should be one of the cycle's possible values

**Explanation**:
The `checkCycle()` function returns true if the *current* value of the named cycle is equal to the test value.  Probably most useful in `<<if>>` macros.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 2>>:
<<if checkCycle('time', 'early')>>\
	It's early. // will appear if the 'time' cycle's current value is 'early'
<<elseif checkCycle('time', 'late')>>\
	It's getting late. // will appear if the 'time' cycle's current value is 'late'
<</if>>
```

## Play Time System

Records the player's total play time in hours, minutes, and seconds and formats it for display via the `<<playtime>>` macro. You can pause the timer with the `‘pause’` tag, and format your own output, if desired, using the `$playTime` story variable object. The play time will persist across passage navigation, saved games, etc.

### Options

This system includes two options.  You can find the options object near the top of the script.  It should look like this:

```javascript
// options object:
setup.playTime.options = {
	storyVar : 'playTime',
	pauseTag : 'pausetimer'
};
```

#### `storyVar` option
The play time system script automatically creates a story variable object to hold all the timer; this allows you to save and load the timer via SugarCube's built-in save system and it allows you to access the timer natively in the IDE using a `$variable`.  By default, the story variable is created with the name `'playTime'` and accessed via `$playTime` in the IDE.  You can change the name using the storyVar option.  Valid names are the same as all valid TwineScript variable names.

#### `pauseTag` option
The timer will not record time from a passage that is tagged with the `pauseTag`.  By default, the `pauseTag` is `'pausetimer'`, but you can configure it to your preference.  **Note**: passage tags should not include spaces.

### Macros

This system only includes one macro and it's more of a shortcut.

#### `<<playtime>>` macro

**Syntax**: 
`<<playtime>>`

**Explanation**:
Displays the formatted string of the current play time.  You can use `<<print $(storyVar).str>>` as an alternative.

**Examples**:
```javascript
<<playtime>>
```

## Fading Macros

A simple macro set that causes the text between its tags to fade in or out over a period of time specified by the user, with an optional delay. Nothing crazy, but a feature I see requested frequently.

### Macros

#### `<<fadein>>` macro

**Syntax**:
`<<fadein (optional: delay) (animation length)>>...<</fadein>>`

* delay: the delay, in seconds, to wait before the animation starts.
* animation length: the length of the fading animation, in seconds.

**Explanation**:
The `<<fadein>>` macro causes its content to fade in (shocking).  You can delay the animation (and should if you're using SugarCube's default transitions) and set the length of the animation.  Both values must be in seconds, but you can use floating point values to emulate milliseconds.  Note that only *output* is delayed by this macro; code will still execute on passage load, meaning it shouldn't be used in the same way as `<<timed>>`, but it can be paired with `<<timed>>` to achieve that sort of effect.

**Examples**:
```javascript
<<fadein 10>>Fade me in over the course of ten seconds.<</fadein>>

<<fadein 0.2 0.5>>Fade me in over half a second, but give the passage transition a moment to finish.<</fadein>>

<<fadein 20 0.2>>Hide the way [[forward]] for 20 seconds...<</fadein>>
```

#### `<<fadeout>>` macro

**Syntax**:
`<<fadeout (optional: delay) (animation length)>>...<</fadein>>`

* delay: the delay, in seconds, to wait before the animation starts.
* animation length: the length of the fading animation, in seconds.

**Explanation**:
The `<<fadeout>>` macro causes its content to fade out.  You can delay the animation (and should if you're using SugarCube's default transitions) and set the length of the animation.  Both values must be in seconds, but you can use floating point values to emulate milliseconds.  Content is set to `{display: none;}` after the animation completes, so the page may reflow.

**Examples**:
```javascript
<<fadeout 10>>Fade me out over the course of ten seconds.<</fadeout>>

<<fadeout 0.2 4>>Fade me out over four seconds, but give the passage transition a moment to finish.<</fadeout>>

<<fadeout 20 2>>This text will disappear after 20 seconds...read fast!<</fadeout>>
```

## First Macro

Based loosely on Leon's `<<once>>` macro and similar, `<<first>>`, `<<then>>`, and `<<finally>>` create code or text that is shown based on how many times the player has visited a particular passage. While it's nothing that couldn't be handled with variables or `visited()` and an `<<if>>` or `<<switch>>`, I believe this lightweight set of macros feel a bit better to use in some stories. 

### Macros

#### `<<first>>` macro

**Syntax**:
`<<first>>...<<then>>...<<finally>>...<</first>>`

**Explanation**:
A simple, slightly sexier repalcement for `<<if visited()>>` and `<<switch visited()>>`, based loosely on Leon's `<<once>>` macro.  `<<first>>` shows text on the first visit to a passage, and you can use `<<then>>` to show different text on subsequent visits.  Use `<<finally>>` to show text that persists over *all* subsequent visits.  **Note**: Do not nest `<<first>>` macros inside each other; it won't cause an error, but it also likely won't work the way you expect.  If you need nesting, you'll need to use variables.

**Examples**:
```javascript
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

## Message Macro

This macro displays a link or, optionally, a button. The link or button can be clicked to display a message immediately below it in the passage text, and clicked again to collapse the message. 

### Options

The message macro comes with just one option.  You can find the option near the top of the script.  It should look like this:

```javascript
// default text option:
setup.messageMacro.default = 'Help';
```

#### `setup.messageMacro.default` option

You can change the value of this option to change the default link text used by the message macro when no link text is provided.

### Macros

#### `<<message>>` macro

**Syntax**:
`<<message (optional: link text) (optional: 'btn' keyword) (optional: id)>>`

* link text: the text of the link.  if omitted, default text is displayed (the default text can be edited above)
* 'btn' keyword: if `btn` is included in the macro's arguments, a button is generated instead of a link
* id: if multiple messages are displayed on the same page with the same link text, you need to provide each one with a unique id.

**Explanation**:
Creates a link (or button) on the page.  When clicked, the content between the tags is displayed on the next line, reflowing the following text.  The player can click the same link again to 'collpase' the message.

**Styling Options**:
Message content (but not the link/button) is given the class `.help`; you can control the appearance of the message's content using this selector in your CSS. (For example: `.help {color: green;}` would render the text of all message macros in green).

**Examples**:
```javascript
<<message>>Text<</message>>
// creates a link that reads 'Help' (by default) and can be clicked to display the content between the tags and clicked again to collapse the content.

<<message 'click me' btn>>Text<</message>>
// creates the message with the link text 'click me' and renders it as a button element

<<message 'Click here!' 'uniqueID'>>...<</message>>
<<message 'Click here!' 'anotherUniqueID'>>...<</message>>
// creates two messages with the same link text.  they must be given two different, unique IDs to appear in the same passage.
```

## Dialog API Macros

Macros for dealing with the dialog API. `<<dialog>>...<</dialog>>` lets you set up a dialog box, assign it a title and class(es), and write the code you want to appear inside it directly into your passage. `<<popup>>` is similar, but accepts a passage name as an argument, and uses that passage’s content as the content of the box.

### Macros

There are two macros included in this script.

#### `<<dialog>>` macro

**Syntax**:
`<<dialog (optional: title) (optional: class list)>>...<</dialog>>`

* title: the title of the resulting dialog box; if omitted, no title wil be shown.
* class list:  classes to add to the dialog box, for styling via CSS

**Explanation**:
Opens a dialog box and appends the content between the tags to its body.  This macro should generally be paired with some interactive element (like a button or link), or the dialog box will open instantly when the passage loads.  The first argument (if any are given) should always be the dialog's title.  All additional arguments will be set as classes for styling in the CSS.

**Examples**:
```javascript
// displays the content in between the tags in a dialog box with the title 'Character Sheet' and the class '.char-sheet':
<<link 'Show Character Sheet'>>
	<<dialog 'Character Sheet' 'char-sheet'>>\
\
$name
|!Stat|!Value|
|Strength|$strength|
|Agility|$agility|
|Magic|$magic|
\
	<</dialog>>
<</link>>

// displays a dialog box with no title and no additional classes:
<<dialog>>Hello!<</dialog>>

// displays a dialog box with no title and the classes '.tutorial':
<<button 'Show the Tutorial'>>
	<<dialog '' 'tutorial'>>
		Tutorial content.
	<</dialog>>
<</button>>
```

#### `<<popup>>` macro

**Syntax**:
`<<popup (passage) (optional: title) (optional: class names)>>`

* passage: the name of the passage whose content you want to append to the dialog box
* title: the title of the resulting dialog box; if omitted, no title wil be shown.
* class list:  classes to add to the dialog box, for styling via CSS
	
**Explanation**:
`<<popup 'passage' 'title' 'class'>>` is essentially the same as `<<dialog 'title' 'class'>><<inlcude 'passage'>><</dialog>>`, and can be used as a shortcut for displaying a passage's content in a dialog box.

**Examples**:
```javascript
<<link 'Show Character Sheet'>>
	<<popup 'character sheet' 'Character Sheet' 'char-sheet'>>
<</link>>
// displays a dialog box that shows the content of passage 'character sheet', with the title 'Character Sheet', and the class '.char-sheet'

<<button 'Help!'>>
	<<popup 'help' '' 'help'>>
<</button>>
// displays the content of the passage 'help' in a dialog box with no title and the class '.help'.
```


->If you find any errors in this documentation, pease let me know.