# Chapel's Custom Macros for SugarCube

# Contents

* [Installation](#installation)
* [Quick Start](#quick-start)
* [Detailed Documentation](#detailed-documentation)
  * [Simple Inventory](#simple-inventory)
  * [Consumables System](#consumables-system)
  * [Cycles System](#cycles-system)
  * [Play Time System](#play-time-system)
  * [Event Macros](#event-macros)
  * [Wikifier Macros](#wikifier-macros)
  * [Fading Macros](#fading-macros)
  * [First Macro](#first-macro)
  * [Message Macro](#message-macro)
  * [Dialog API Macros](#dialog-api-macros)
  * [Dropdown Macro](#dropdown-macro)
  * [Simulated Typing Macro](#simulated-typing-macro)
  * [Insert Macros](#insert-macros)
  * [Fullscreen Macros](#fullscreen-macros)
* [Other Information](#other-information)

# Installation

These scripts work with both Twine 1 and Twine 2.  They have been tested with SugarCube 2.18, and should be compatible with most recent versions of SugarCube 2.x, including most future versions.

### For Twine 2:

Navigate to the script or scripts you want and copy the contents.  In Twine 2, paste the contents of each script you wish to install into your story's JavaScript area.

### For Twine 1:

Create a new passage with the tag `script`, or right click on the editor and select `New Script Here`.  Paste the contents of the script or scripts you want into one or more of these script-tagged passages.

# Quick Start

This is just a fast and dirty look at what's included.  If you need more information or examples, you can find detailed documentation further down.

## Story Variables and Passage Tags

Some of the scripts do things like create story variables or assign meaning to passage tags.  You can control the names of the variables and tags through each script's options object.  They usually look something like this:

```javascript
// options object:
setup.cycSystem.options = {
	storyVar  : 'cycles',
	resetTag  : 'resetcycles',
	pauseTag  : 'pausecycles',
	menuTag   : 'menupause',
	runNew    : true,
	tryGlobal : true
};
```

You can find these objects near the top of each scripts in which they are included.

## The Simple Inventory System

[See the detailed documentation.](#simple-inventory)

The simple inventory system creates a story variable array (`$inventory` by default) and helps you manage it with the following functions and macros.

### Macros

`<<inventory (optional: separator)>>` : Displays the inventory.  If no separator is included, each item is listed on a new line.  The separator you provide should be a string (I imagine `', '` will be a popular choice, for example).

`<<pickup (list of items)>>`: Adds items to the inventory.  Care must be taken to avoid doubles if you need to do so--the macro does not check.  You should provide one or more items as a space-separated list of quoted strings.

`<<drop (list of items)>>`: Removes items from the inventory, if they can be found.  Does not raise an error if an item isn't found, just silently does nothing.

`<<has (list of items)>>...(optional: <<otherwise>>)...<</has>>`: Just a simple `<<if>>`-style macro for checking the inventory.  Checks for the presence of **all** items if multiple items are provided.

`<<invSort>>`: Sorts the inventory alphabetically.

`<<invWhatIs (index)>> and <<invWhereIs (item)>>`:  Utility macros for debugging and extending the system.  See the detailed documentation below for more.

### Functions

`invAll('list', 'of', 'items')`: Returns true if **all** of the listed items are in the inventory.

`invAny('list', 'of', 'items')`: Returns true if **any** of the listed items are in the inventory.

## Consumables

[See the detailed documentation.](#consumables-system)

Used to create and track consumable items, like health potions, grenades or aything else.  Consumables differ from the "key" style items used by the simple inventory; consumables stack (meaning the player can carry more than one of each, and adding more consumables increases the count associated with each consumable) and can be set up to fire a bit of TwineScript code whenever they're used (sort of like widgets).  Each consumable item has to be defined before it can be manipulated, and these definitions are stored in a story variable (`$consumables` by default).

### Macros

`<<newconsumable (name) (optional: ID)>>(optional: TwineScript code)(optional: <<description (optional: passage name)>>(optional: TwineScript Code))<</newconsumable>>`: Creates a new consumable definition.  You must provide name your consumable, and you may optionally include an ID.  If no ID is provided the name is used as the ID.  If your consumable's name includes spaces or non-aphlanumeric characters, it is highly recommended that you provide an ID.  You may associate your consumable with a snippet of valid TwineScript code that will be fired every time the consumable is used.  You may optionally provide a description for your consumable.  You can either give the description tag an argument corresponding to a passage name--the passage will be shown in a dialog box when the description is requested, or you can provide your own code.  You should only do one or the other.  Consumable  definitions are complicated, see the [detailed documentation](#consumables-system) for examples.

`<<addconsumable (ID) (optional: positive integer)>>`: Adds an amount of the ID'd consumable to the player's inventory.  If you don't provide a number, only one is added.  Will raise an error if a consumable with the given ID can't be found.

`<<dropconsumable (ID) (optional: positive integer)>>`: Removes an amount of the ID'd consumable from the player's inventory.  If you don't provide a number, only one is removed.  Will raise an error if a consumable with the given ID can't be found.

`<<clearconsumables (list of consumables)>>`: Removes all instances of the ID'd consumables from the player's inventory.  You can provide any number of consumables and all will be removed.  Provide the IDs as a space-seperated list of quoted strings.

`<<deleteconsumables (list of consumables)>>`: Deletes the definitions of the provided consumables.  If you pass this macro the keyword `all` as the only argument, it will delete all consumable definitions.  WARNING: It is impossible to recover deleted consumables.

`<<useconsumable (ID) (optional: 'silent' or 'unsilent' keywords)>>`: 'Uses' the ID'd consumable.  One instance of said consumable will be removed from the player's inventory, and the code associated with the consumable definition will run silently (by default).  If you wish for this code to be run without being silenced, you can include the keyword `unsilent`, or change the option `silentCode` to false.  If the `silentCode` option is set to false, you can force code to run silently by including the `silent` keyword.

`<<sortconsumables>>`: Sorts the consumable inventory alphabetically.

`<<listconsumables (optional: separator)>>`: Creates and outputs a static list of consumables, including the name and amount of each consumable in the player's inventory.  By default the list is separated by new lines, but you can optionally include your own separator.

`<<usableconsumables>>`: Similar to `<<listconsumables>>` except that each consumable's name can be clicked on, causing the description code to fire, and each consumable is supplied with a 'Use' link that fires `<<useconsumable>>` macro on that consumable when clicked.

`<<consumable>>`: Same as `<<newconsumable>>`.

`<<consumablemenu>>`: Same as `<<usableconsumables>>`.

### Functions

`getConsumable(ID)`: Returns an object: a deep copy of the indicated consumable's definition.

`hasConsumable(ID, NUM)`: Returns a boolean: whether the player has an amount of the indicated consumables in the inventory that is greater than or equal to the provided number, or 1, if no number is provided.

`amtOfConsumables(ID)`: Returns a number: how many of a given consumable the player has in the inventory, or 0, if there are none in the inventory, or -1 if the consumable doesn't exist.

`consumableExists(ID)`: Returns a boolean: whether or not a consumable with the indicated ID is defined.

`getConsumableName(ID)`: Returns a string: the name of the indicated consumable.

`getConsumableCode(ID)`: Returns a string of TwineScript code: the indicated consumable's use code.

`getConsumableDescr(ID)`: Returns a string array: the consumable's description type (`'passage'`, `'code'`, or `null`) is returned in the first index (`[0]`), and the passage name or code associated with the indicated consumables description is returned in the second index (`[1]`).

`getAllConsumables()`: Returns a string array: all of the IDs of all of the currently defined consumables.

`getCarriedConsumables()`: Returns a string array: all of the IDs of all of the consumables currently in the player's inventory.

`findConsumableByIndex(index)`: Returns a string or null: the ID of the consumable in the indicated index of the `$consumables.all` array, or null if there are no consumable IDs in the indicated index.

`findIndexOfConsumable(ID)`: Returns a number: returns the index of the indicated consumable in the `$consumables.all` array, or -1 if no such consumable exists.

`deleteConsumable(ID)`: Deletes the indicated consumable definition; similar to the `<<deleteconsumables>>` macro.

## The Cycles System

[See the detailed documentation.](#cycles-system)

Used to create cycles.  A lot of things can be cycles: day/night, days of the week, months of the year, seasons, turns in an RPG game, etc.  Cycles are given a name, a list of values to cycle through, and a number of turns to wait before changing the value.  You can have multiple cycles running at once, but using a lot can cause a performance hit.  All cycle definitions are stored in a story variable (`$cycles` by default).

### Macros

`<<newcycle (name) (list of values) (number of turns)>>`:  Creates a new cycle.  For example: `<<newcycle 'time' 'day' 'night' 1>>` would create a cycle called `'time'` that changes between `'day'` and `'night'` every turn.

`<<suspendcycle (list of cycle names)>>` and `<<resumecycle (list of cycle names)>>`: You can use these macros to target individual cycles and suspend them, preventing them from collecting turns until they are resumed.  Suspended cycles are essentially 'frozen' in place.

`<<deletecycle (list of cycle names)>>`: Deletes all of the cycles provided to it.  Deleted cycles are gone for good.

`<<resetcycle (list of cycle names)>>`: Cycles track the number turns that have passed since their creation.  You can reset this count using this macro.  The cycle will be like new again.

`<<resetallcycles>>`: Does what it says and says what it means.

`<<showcycle (name of cycle) (optional: 'format' keyword)>>`: Prints the indicated cycle's current value.  If the keyword `format` is included, it will format the output to be lower case with the first letter capitalized (i.e. `day` becomes `Day`, `NIGHT` becomes `Night`).

`<<cycleIs>>, <<whereIsCycle>>, <<cycleArrayIs>>, <<cycleAtIs>>, and <<defineCycle>>`: Utility macros for debugging and extending the system.  See the detailed documentation below for more.

### Functions

`checkCycle('name of cycle', 'value')`: Returns true if the named cycle's current value is the same as the indicated value.

`cycleTurns('name of cycle')`: Returns the number of turns it takes for the named cycle to change values once.

`cycleCurrentTurns('name of cycle')`: Returns the total number of turns the cycle has collected since the time it was created or the last time it was reset.

`cycleTotal('name of cycle')`: Returns the number of turns it takes for the named cycle to rotate through *all* of its values once.

`cycleExists('name of cycle')`: Returns true if the indicated cycle currently exists.

`cycleStatus('name of cycle')`: Returns 'running' (the named cycle is currenlty counting), 'suspended' (the named cycle is currently suspended), or null (the named cycle doesn't exist).

`cycleSinceLast('name of cycle')`: Returns the number of turns that have passed since the cycle last changed values.

`getCycle('name of cycle', 'name of property')`: Returns the value of the indicated property from the indicated cycle.

### Passage Tags

`resetcycles`: Initializes all cycles, setting all of their turns to `0`.  Similar in function to `<<resetallcycles>>`.  The default name of the tag can be changed via the options object.

`pausecycles`: Prevents all cycles from collecting a turn on the tagged passage.  The default name of the tag can be changed via the options object.

`menupause`: Prevents all cycles from collecting a turn on the tagged passage and the one immediately following it.  The default name of the tag can be changed via the options object.

## The Play Time System

[See the detailed documentation.](#play-time-system)

The play time system tracks the total time the player has been playing, even across passages and saved games.  It also formats a sting for display.  The play time system creates a story variable object to hold the timer (`$playTime` by default).

### Macros

`<<playtime>>`: Displays the formatted play time.  `<<print $playTime.str>>` also works and does the same thing.  You can use the `$playTime` object's `hr`, `min`, `sec`, and `ms` properties to create your own string for output if you'd prefer.

### Passage Tags

`pausetimer`: Time will not increase in passages tagged `pausetimer`.

## The Event Macro Set

[See the detailed documentation.](#event-macros)

A set of macros for adding events to your game.  Events come in many types, but some of the most common are key presses and mouse clicks.  These macros allow you to define JavaScript/jQuery style events in TwineScript.

### Macros

`<<event (type) (optional: selector)>>...(optional: <<which (code)>>)...<</event>>`: Allows you to create an event listener and respond to it with TwineScript code.  Events are attached to the document element by default, but you can provide a jQuery/CSS style selector to target instead.  You can additionally include various `<<which>>` child tags and use them to define events that respond to specific key strokes or mouse clicks.  By default, like `<<link>>`s, there is no output.

`<<trigger (type) (optional: selector)>>`:  You can trigger events through code by using this macro by providing it a selector and event type.  If no selector is provided, it defaults to the document element.

## The Wikifier Macro Set

[See the detailed documentation.](#wikifier-macros)

This set of macros allows you to register a chunk of TwineScript to a variable to be parsed later.  Functionally similar to the `<<widget>>` and `<<include>>`/`<<display>>` macros, but allows for some additional functionality--like concatenating code chunks, passing the code chunks around, and other things.

### Macros

`<<code (variable)>>(valid TwineScript)<</code>>`: Registers the TwineScript between the tags to the provided variable.  The variable must be passed as a string (i.e. `<<code '$var'>>...`, not `<<code $var>>...`).  It excepts both story variables (`$var`) and temporary variables (`_var`), but not JavaScript variables.

`<<wiki (string of TwineScript)>>`: When passed a variable or string containing TwineScript code to be evaluated, this macro evaluated the code and displays any output.

`<<eval (string of TwineScript)>>`: Similar to `<<wiki>>`, but output is supressed.  Care must be taken, as errors in the code will also be suppressed.

## Misc. Macros

Here's a list of other macros included in this set of scripts.

### Fading Macro Set

[See the detailed documentation.](#fading-macros)

`<<fadein (optional: delay) (animation length)>>...<</fadein>>` and `<<fadeout (optional: delay) (animation length)>>...<</fadeout>>`: Create text that fades in or out over a period of time, with an optional delay.  Times should be in seconds, but milliseconds can be approximated using floating-point values.

### The First Macro

[See the detailed documentation.](#first-macro)

`<<first>>...(optional: <<then>>)...(optional: <<finally>>)...<</first>>`: Creates text or code that runs according to the number of times a player has visited the passage.  The `<<first>>` tag only runs it's content on the first visit.  `<<then>>` tags will run their content on subsequent visits: you can include as many `<<then>>`s as you like.  The `<<finally>>` tag runs its content on its visit, like a `<<then>>`, and on **all** subsequent visits.

### The Message Macro

[See the detailed documentation.](#message-macro)

`<<message (optional: link text) (optional: 'btn' keyword) (optional: unique id)>>...<</message>>`: Creates a link (or button, if the 'btn' keyword is included).  When the link is clicked, the content between the tags is shown on the next line.  The content can be collapsed by clicking the link again.  You will need to provide unique identifiers to the macro if two or more `<<message>>`s exist on the same page with the same link text.  The default link text, if none is provided, can be altered using an option toward the top of the script.

### Dialog API Macro Set

[See the detailed documentation.](#dialog-api-macros)

`<<dialog (optional: title) (optional: list of classes)>>...<</dialog>>`:  Creates a dialog box with the provided title and adds the list of classes to it for styling.  The content between the tags is parsed into the dialog box's body.

`<<popup (passage name) (optional: title) (optional: list of classes)>>`: Creates a dialog box with the provided title and adds the list of classes to it for styling.  The content in the indicated passage is parsed into the dialog box's body.

### The Dropdown Macro

[See the detailed documentation.](#dripdown-macro)

A simple macro for generating a dropdown list input.

`<<dropdown (variable) (list of options)>>`: When passed a variable (as a string; that it `<<dropdown '$var'...`, not `<<dropdown $var...`) and a list of options, also as strings (requires at least one option), this macro creates a dropdown-style input.  The item from the list that is selected is set to the indicated variable.

### Typing Simulation Macro

[See the detailed documentation.](#simulated-typing-macro)

`<<typesim (text)>>...<</typesim>>`:  Creates a text area that the user can type in; the actual text the user types is ignored, and a predefined message is typed out instead.  After the message is complete, any code or text between the tags is fired.

### Insert Macro Set

[See the detailed documentation.](#insert-macros)

This set of macros is similar to SugarCube's default DOM manipulation macros, except that they hold off and fire after the page is loaded, meaning you can manipulate the DOM without having to use interaction or the PassageDone special passage.  You should use SugarCube's default macros when you don't need this feature, and these otherwise.  See the detailed documentation for an example if that doesn't make sense to you.

`<<insert (element)>>...<</insert>>`:  Similar in function to the default macro `<<replace>>`, except as noted above.

`<<insertappend (element)>>...<</insertappend>>`:  Similar in function to the default macro `<<append>>`, except as noted above.

`<<clearelement (element)>>`:  Similar in function to an empty `<<insert>>` macro, simply clears an element of all content.

### Fullscreen Macro Set

[See the detailed documentation.](#fullscreen-macros)

Macros for engaging fullscreen mode in browsers.

`<<fullscreen>>`: Enters fullscreen mode.  Needs to be paired with a user interaction, like a `<<link>>` or a `<<button>>`.

`<<fullcreenlink (link text)>>`: Creates a link that, when clicked, enters fullscreen mode.

# Detailed Documentation

Detailed documentation on all the systems, macros, and functions can be found below, along with examples and syntax.

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

## Consumables System

A system for adding consumable items to your game. Similar to the cycles system, a consumable must first be defined (using `<<newconsumable>>`). Once a consumable definition is created, the consumable item can be added to the player’s inventory, removed from it, used, and otherwise manipulated. Consumable definitions should go in your StoryInit special passage.

A consumable definition includes: 
* A name, for displaying. 
* An ID for manipulation. The ID should generally follow the rules of a normal TwineScript variable. If the name meets these conditions, you can omit the ID. 
* A code snippet to run when the consumable is used. By default, output is suppressed (i.e. the code runs silently), though you can change this if you want. You can still use the dialog API or DOM macros for output, though. You can omit this, though it's the main draw of this system. 
* A description. You can provide a second code chunk as a description, or a passage name. If you provide a passage name, that passage will be rendered in a dialog box as a description when used. You should either provide a passage name to the `<<description>>` tag as an argument or enter code following the tag, not both. Descriptions are completely optional. 

Some notes. 
* This system works in two phases; you define a consumable, and then you manipulate it in relation to the player’s inventory. 
* Consumables are not widgets, though they fire code chunks on use. These code chunks are not as functional as widgets, so don't use them as a replacement for widgets. 
* The consumable inventory is its own entity, and can be used alongside the the simple inventory, but they cannot be used to help manage each other (you can't use functions and macros from one system to effect the other).

The consumables system could also be extended to help manage other things, such as spell systems or even rudimentary equipment systems.

### Options

This system includes five options.  You can find the options object near the top of the script.  It should look like this:

```javascript
setup.consumables.options = {
	storyVar   : 'consumables',
	emptyMsg   : 'Not carrying any consumables.',
	tryGlobal  : true,
	macroAlts  : true,
	silentCode : true
};
```

#### `storyVar` option
The consumables system script automatically creates a story variable object to hold all of the created consumable definitions; this allows you to save and load the consumables via SugarCube's built-in save system and it allows you to access the consumables natively in the IDE using a `$variable`.  By default, the story variable is created with the name `'consumables'` and accessed via `$consumables` in the IDE.  You can change the name using the `storyVar` option.  Valid names are the same as all valid TwineScript variable names.

#### `emptyMsg` option

When the you attempt to display a list of consumables currently in the player's inventory (through the `<<listconsumables>>` or `<<usableconsumables>>` macros) and the inventory is empty, this string is parsed (wikified).  You can use valid TwineScript code in the string; for example, you could change the option to `"<<include 'no-items-passage'>>"` to display a passage called `no-items-passage` instead of printing a string.

#### `tryGlobal` option

There are several 'helper' functions included in this script: `setup.consumables.getConsumable`, for example.  You can read more about these function below.  Obviously, this is a mouthful, so the function definitions get copied over as global functions, i.e. `getConsumable()`.  These global functions are only created if their names are undefined, to prevent any potential compatibility issues.  However, if you'd prefer to keep the functions out of the global scope all together, you can set this value to false and they won't be sent to the global scope at all, even if their names are available.  You'll be forced to write out the longer `setup.consumables.getConsumable()` style functions, though.

#### `macroAlts` option

This script includes two macros that can be called by different names: you can use the macro `<<consumable>>` instead of `<<newconsumable>>` and the macro `<<consumablemenu>>` instead of `<<usableconsumables>>`.  If you switch this option to false, these additional macro definitions are not inlcuded.

#### `silentCode` option

By default, the code associated with a consumable is silent, though you can override this in the `<<useconsumable>>` macro call.  Set this option to false to change this default behavior and allow code to output normally.  Note that the code run by the `<<usableconumables>>` macro is **always** run silently, regardless, as output would break the listing.  Note that you can still generate output using DOM macros or the dialog API, regardless of how you set this option.

### Macros

This is a list of macros included in the consumables system.

#### `<<newconsumable>>` macro

Also known as `<<consumable>>`.

 **Syntax**:
 ```
<<newconsumable (name) (optional: ID)>>
	(optional: use code)
(optional: <<description (optional: passage name)>>)
	(optional: description code)
<</newconsumable>>
 ```
 
* name: the name of the new consumable to create, a string for displaying to the end-user
* ID:  an ID to refer to the consumable by, should be a valid TwineScript identifier.  if omitted, the name is used as the ID
* use code: TwineScript code to fire when the consumable is used.
* passage name: the name of a passage containing the consumable's description
* description code: code to use when a description is requested, if a passage name isn't provided
 
 **Explanation**:
The `<<newconsumable>>` macro is used to construct a new consumable definition.  A consumable needs to be given a name, and the name will be used as the ID if none is provided.  It is highly, highly recommended that you inlcude an ID if the consumables name would not function as a TwineScript variable (like, for example, if it starts with something other than a letter or if it includes spaces).  You'll use the ID (not the name) to interact with your consumable throughout the rest of the macros and functions.  

Next, you can include TwineScript code after the `<<newconsumable>>` tag and before the `<<description>>` or closing tag.  This code will be run every time the consumable is used, making it somewhat like a widget.  (**WARNING**: Consumables should not be used as a replacement for widgets.)  Finally, you can optionally include a description, either as a passage name (passed as an argument to the `<<description>>` tag), or as your own snippet of code following the `<<description>>` tag and before the closing tag.  The description it run when the player clicks on the name of the consumable in the `<<usableconsumables>>` macro.  If a passage is given, the passage is rendered and displayed by the Dialog API.  Note that you need to choose one or the other--do not include both a passage name and your own description code. 

Note that if a consumable is created and given the ID of another consumable that already exists, the new consumable will overwrite the old without raising an error.  The `StoryInit` special passage is the best place to define consumables.

 **Examples**:
```
/% a health potion %/
<<newconsumable 'health potion' 'hpPot'>>
	<<if $hp gte 100>>
		<<run UI.alert('Already at full health.')>>
		<<addconsumable 'hpPot'>>
	<<else>>
		<<set $hp += 20>>
		<<if $hp gte 100>>
			<<set $hp to 100>>
		<</if>>
		<<run UI.alert('Recovered some health.')>>
	<</if>>
<<description 'health-potion-description'>>
<</newconsumable>>

/% mana potion %/
<<newconsumable 'mana potion' 'mpPot'>>
	<<set $mp++>>
	<<set $mp.clamp(0, 10)
<<description>>
	<<run UI.alert('A mana potion.')>>
<</newconsumable>>

/% a poison vial %/
<<consumable 'poison'>>
	/% no ID needed %/
	<<set $hp -= 10>>
	/% no description %/
<</consumable>>
```

#### `<<addconsumable>>` macro

**Syntax**:
`<<addconsumable (ID) (optional: number)>>`

* ID: The ID of a defined consumable.
* number: The number of said consumables you wish to add to the player's inventory.  If no number is provided, defaults to 1.

**Explanation**:
You can use the `<<addconsumable>>` macro to add consumables to the player's inventory, either one at a time, or in bulk.  If the consumable is already present in the inventory, it's amount will increase by the indicated number.  If the item isn't in the player's inventory at all, it will be added with the indicated number as the total amount.

**Examples**:
```
<<addconsumable 'potion' 3>>
/% adds three potions to the player's inventory %/

<<addconsumable 'mpPot'>>
/% adds one 'mpPot' consumable to the player's inventory %/
```

#### `<<dropconsumable>>` macro

**Syntax**:
`<<dropconsumable (ID) (optional: number)>>`

* ID: The ID of a defined consumable.
* number: The number of said consumables you wish to remove from the player's inventory.  If no number is provided, defaults to 1.

**Explanation**:
You can use the `<<dropconsumable>>` macro to remove consumables from the player's inventory, either one at a time, or in bulk.  If the consumable's amount reaches 0, it will be completely removed from the inventory.  If it would become less than zero, it will be set to 0 instead and removed.  If the item isn't in the player's inventory at all, nothing happens and no error is thrown.

**Examples**:
```
<<dropconsumable 'potion' 3>>
/% removes three potions from the player's inventory %/

<<addconsumable 'mpPot'>>
/% removes one 'mpPot' consumable from the player's inventory %/
```

#### `<<clearconsumables>>` macro

**Syntax**:
`<<clearconsumables (list of IDs)>>`

* list of IDs: a list of consumable IDs passed as a space separated list of quoted strings.

**Explanation**:
The `<<clearconsumables>>` macro reduces the amount of consumables in the players inventory to zero for all the provided consumables, effectively removing them from the inventory, regardless of how many there are.  Functionally works as a 'drop all' command, except that the macro can accept any number of consumable IDs.

**Examples**:
```
<<clearconsumables 'mpPot' 'hpPot'>>
/% removes all hp and mp potions from the player's inventory %/

<<clearconsumables 'poison'>>
/% removes all posion vials from the player's inventory %/
```

#### `<<deleteconsumables>>` macro

**Syntax**:
`<<deleteconsumables (list of IDs -OR- 'all' keyword)>>`

* list of IDs: a list of consumable IDs passed as a space separated list of quoted strings.
* 'all' keyword: the keyword `all`.

**Explanation**:
The `<<deleteconsumables>>` macro deletes the definitions of the consumables provided to it.  These definitions cannot be recovered.  If the `all` keyword is used instead, all consumable definitions will be deleted.  **NOTE**: This literally deletes the definitions--it does not just remove consumables from the inventory.  The definitions set up by the `<<newconsumable>>` macro are gone and forgotten.  You probably won't ever need to use this macro.  (If you need to adjust a consumable definition, overwrite it with `<<newconsumable>>`.)

**Examples**:
```
<<deleteconsumables 'mpPot' 'hpPot'>>
/% deletes the consumable definitions for 'hpPot' and 'mpPot' %/

<<deleteconsumables all>>
/% deletes all consumable definitions -- no earth like scorched earth %/
```

#### `<<useconsumable>>` macro

**Syntax**:
`<<useconsumable (ID) (optional: output keyword)>>`

* ID: the ID of a defined consumable.
* output keyword: the keyword `silent` causes the output of the use code to be suppressed, while the `unsilent` keyword unsuppresses the output

**Explanation**:
The `<<useconsumable>>` macro fires the indicated consumable's code and reduces the amount of that consumable in the player's inventory by 1.  If the player doesn't have any consumables, the macro does nothing, but won't raise an error.  By default, the `silentCode` option is set to true, meaning that the code that is run by this macro does not output anything.  You can change the `silentCode` option in the options object, and override it regardless of its setting via the `silent` and `unsilent` keywords.

**Examples**:
```

<<link 'Use a health potion.'>>
	<<useconsumable 'hpPot'>>
	/% reduce stack of 'hpPot' by one and fire code %/
<</link>>\


<<useconsumable 'posion' silent>> 
/% suppress output, regardless of silentCode option %/

<<useconsumable 'mpPot' unsilent>> 
/% display output, regardless of silentCode option %/
```

#### `<<sortconsumables>>` macro

**Syntax**:
`<<sortconsumables>>`

**Explanation**:
Sorts the list of consumables in the player's inventory (and only in the player's inventory) alphabetically.  The default order is chronological.

#### `<<listconsumables>>` macro

**Syntax**:
`<<listconsumables (optional: separator)>>`

* separator: a string to separate the consumables list; defaults to a new line if omitted.

**Explanation**:
Prints a static, text-only, non-interactive list of the consumables currently in the player's inventory, along with their amounts.  By default, each consumable is separated by a new line, but you can provide your own string as an argument to separate the list.

**Examples**:
```
/% given an inventory containing 1 health potion, 3 mana potions, and 6 phoenix downs %/

<<listconsumables>>
/%
yields:
health potion: 1
mana potion: 3
phoenix down: 6
%/

<<listconsumables ', '>>
/%
yields:
health potion: 1, mana potion: 3, phoenix down: 6
%/

<<listconsumables 'blah'>>
/%
yields:
health potion: 1blahmana potion: 3blahphoenix down: 6
%/
```

#### `<<usableconsumables>>` macro

Also known as `<<consumablemenu>>`.

**Syntax**:
`<<usableconsumables>>`

**Explanation**:
The `<<usableconsumables>>` macro creates a dynamic, linked list of consumables.  The list is always separated by new lines, and otherwise is the same as the list generated by the `<<listconsumables>>` macro except that, (1) if the consumable has a description, the name of the consumable is clickable, and clicking on it will run the description code, and (2) a 'Use' link is added after the amount, and clicking on this link fires the `<<useconsumable>>` macro on the selected consumable (always in silent mode).  The displayed amount will be updated if a consumable is used.

**Examples**:
```
<<usableconsumables>>

<<consumablemenu>>
```

### Functions

*A note about the functions*:  The functions exists in both the `setup.consumables` namespace and as globals.  There is a very small chance that you'll need to use the nonglobal versions if the name of a function is already taken.  The nonglobal versions are in the `setup.consumables` namespace.  You'll have to use the longer syntax if the `tryGlobal` option is set to false (see above).

#### `getConsumable()` function

**Syntax**:
`getConsumable(ID)`:

* ID: the ID of a defined consumable.

**Explanation**:
Returns a deep copy of the indicated consumable's definition object.  Changes to this copy object will not be reflected in the consumable, so treat the resulting data as read-only.  Returns null if the consumable cannot be found.

A consumable has the following properties that you may wish to access:
* **id**: the consumable's id (string)
* **name**: the consumable's name (string)
* **code**: the consumable's 'use' TwineScript code (string)
* **descr**: the consumable's description type (string - either `'passage'` or `'code'`)
* **dCode**: the consumable's description code, either a passage name or a chunk of user-defined TwineScript code (string)
* **amt**: the consumable's current amount, i.e. how many the player has in the inventory, or 0 if the consumable isn't currently in the inventory (number)

You can also access the consumable's definition via the story variable and use it's ID as the first property (`$consumables[ID]` by default). 

**Examples**:
```
<<set _item to getConsumable('hpPot')>>
<<print _item.name>>

<<print getConsumable('hpPot').amt>>

<<print $consumables['hpPot'].amt === getConsumable('hpPot').amt>> /% true %/
/% accessing the individual properties compares their literal values, 
   however accessing them as objects: %/
<<print $consumables['hpPot'] === getConsumable('hpPot')>> /% false %/
/% the getConsumable() function returns a copy, which is a different (though equivalent) object,
   and objects are only equal if both they are the same... 
   note that == would yield same result here as === %/
```

#### `hasConsumable()` function

**Syntax**:
`getConsumable(ID, [optional: number])`:

* ID: the ID of a defined consumable.
* number: the number to check against; defaults to 1 if omitted.

**Explanation**:
Returns true if the player has an amount of the indicated conusmable that is greater than or equal to the number provided.  If no number is provided, returns true if the player has at least one.

**Examples**:
```
<<if hasConsumable('hpPot', 10)>>
	You have more than ten potions.
<<elseif hasConsumable('hpPot')>>
	You have at least one potion.
<</if>>

<<if hasConsumable('hpPot')>>\
	<<link 'Use a health potion.'>>
		<<useconsumable 'hpPot'>>
	<</link>>\
<</if>>
```

#### `amtOfConsumable()` function

**Syntax**:
`amtOfConsumable(ID)`

* ID: the ID of a defined consumable.

**Explanation**:
Returns the amount of the indicated consumable in the player's inventory.  If the consumable isn't in the player's inventroy, returns 0.  If the consumable cannot be found, returns -1.

**Examples**:
```
<<if amtOfConsumable('hpPot') gte 20>>
	You have enough potions to fight the dragon!
<</if>>

You have <<print amtOfConsumable('hpPot')>> potions.
```

#### `consumableExists()` function

**Syntax**:
`consumableExists(ID)`

* ID: the ID of a defined consumable.

**Explanation**:
Returns true if the indicated consumable is defined.

**Examples**:
```
<<if !consumableExists('hpPot')>>
	<<newconsumable 'health potion' 'hpPot'>>...
	
<<if consumableExists('hpPot')>>
	HEALTH POTIONS ARE REAL!!!!!!
<</if>>
```

#### `getConsumableName()`, `getConsumableCode()`, and `getConsumableDescr()` functions

**Syntax**:
```
getConsumableName(ID)
getConsumableCode(ID)
getConsumableDescr(ID)
```

* ID: the ID of a defined consumable.

**Explanation**:
Returns the indicated property of the consumable.  `getConsumableCode()` returns TwineScript code which may be parsed if you attempt to print it.  `getConsumableDescr()` returns a two part string array; the first index (0) is the type of code (`'passage'`, `'code'`, or `'null'`), and the second index (1) includes the code or passage name used by the description.  If the consumable is not defined, or if it doesn't include the property in question, these functions will return null.

**Examples**:
```
<<print getConsumableName('hpPot')>>

/% run a consumable's code without reducing it's amt: %/
<<print getConsumableCode('hpPot')>>
/% the code will be wikified by the print statement, if it's valid %/

<<set _descr to getConsumableDescr('hpPot')>>
<<if _descr[0] is 'passage'>>
	<<goto _descr[0]>>
<</if>>

<<if getConsumableDescr('hpPot')[0] is null>>
	No description.
<</if>>
```

#### `getAllConsumables()` and `getCarriedConsumables()` functions

**Syntax**:
```
getAllConsumables()
getCarriedConsumables()
```

**Explanation**:
The `getAllConsumables()` function returns a string array of all of the IDs of all of the currently defined consumables, while the `getCarriedConsumables()` function returns an array of the IDs of all the consumables currently in the player's inventory.

**Examples**:
```
<<print getAllConsumables().join(', ')>>
/% lists all the consumables in the game %/

<<print getCarriedConsumables().join(', ')>>
/% lists all the consumables in the player's inventory %/
```

#### `findConsumableByIndex()` and `findIndexOfConsumable()` functions

**Syntax**:
```
findConsumableByIndex(index)
findIndexOfConsumable(ID)
```

* index: an index in the `$consumables.all` array
* ID: the ID of a defined consumable.

**Explanation**:
Primarily for debugging and extending the system, these functions are used to locate consumables in the `$(storyVar).all` array.  `findIndexOfConsumable()` returns the index of the indicated consumable, or -1 if it isn't defined.  `findConsumableByIndex()` returns the ID of the consumable in the indicated index, or null if there is no consumable in said index.

**Example**:
```
<<set _index to findIndexOfConsumable('hpPot')>>
<<print findConsumableByIndex(_index)>>
/% prints 'hpPot' %/
```

## Cycles System

Simply put, a way to introduce 'cycles' into your game without having to fiddle around too much. You can declare a `<<newcycle>>` and assign it a name, a number of values, and a number of turns it lasts. For example, `<<newcycle ‘time’ 'morning’ ‘noon’ ‘night’ 5>>` would create a new cycle called `'time'` that would change at a rate of every 5 turns. You can have multiple cycles running at once, like one as a day-night cycle and another for seasons, or one for hours and another for days of the week. You can control and access your cycles via  the following passage tags, story variables, macros, and functions, depending on what you want to do with them.

Here's a few notes about how the system works that you should keep in mind:

* Cycles are independently tracked.  This means that cycles that are added later start their tracking later.  For example, if you create the cycle `<<newcycle 'time' 'morning' 'noon' 'night' 3>>` and then, after 1 turn (e.g. on the next passage), you create the cycle `<<newcycle 'days' 'Sunday' 'Monday' 'Tuesday' 'Wednesday' 'Thursday' 'Friday' 'Saturday' 9>>`, the two cycles will not line up: each new `'day'` will start at the `'time'` cycle's `'noon'`. Generally, it's best to include all your `<<newcycle>>` macros in the same passage (`StoryInit` is a good candidate), or, if you need your cycles to line up, use the `resetTag` (default: `'resetcycles'`) or the `<<resetallcycles>>` macro to reset all of your cycles to zero upon adding a new one.
* It is **not possible** to reclaim a cycle that has been deleted by the `<<deletecycle>>` macro.  Generally, it's better to suspend a cycle via `<<suspendcycle>>` than to delete it if you feel that you may need to use it again; you can always reset it via `<<resetcycle>>` if you need it to appear to be 'new'.
* You do not have to delete a cycle to reconfigue it.  You can use the `<<newcycle>>` macro to make alterations to an existing cycle; the old cycle will be overwritten by the new.  Note that, like with `<<deletecycle>>`, it is impossible to reclaim an overwritten cycle.
* The macros that 'return' temporary variables (`<<cycleIs>>`, `<<whereIsCycle>>`, `<<cycleArrayIs>>`, `<<cycleAtIs>>` and `<<defineCycle>>`) are designed for debugging and extending the cycle system.  You will almost never need to resort to these macros if you are using the system as-is, though they can help you do some pretty dynamic things.

### Options

This system includes six options.  You can find the options object near the top of the script.  It should look like this:

```javascript
// options object:
setup.cycSystem.options = {
	storyVar  : 'cycles',
	resetTag  : 'resetcycles',
	pauseTag  : 'pausecycles',
	menuTag   : 'menupause',
	runNew    : true,
	tryGlobal : true
};
```

#### `storyVar` option
The cycle system script automatically creates a story variable object to hold all the created cycles; this allows you to save and load the cycles via SugarCube's built-in save system and it allows you to access the cycles natively in the IDE using a `$variable`.  By default, the story variable is created with the name `'cycles'` and accessed via `$cycles` in the IDE.  You can change the name using the `storyVar` option.  Valid names are the same as all valid TwineScript variable names.

#### `resetTag` option
The `resetTag` value is a passage tag that will reset all cycles to `0` turns, and can be used instead of the `<<resetallcycles>>` macro.  By default, the tag is `'resetcycles'`.  You can configure the name of the tag to your liking with this option.  **Note**: passage tags should not include spaces.

#### `pauseTag` option
The `pauseTag` value is a passage tag that will temporarily pause all cycles for the given passage, preventing them from collecting a turn.  By default, the tag is `'pausecycles'`.  You can configure the name of the tag to your liking with this option.  **Note**: passage tags should not include spaces.

#### `menuTag` option
The `menuTag` value is a passage tag that will prevent all cycles from collecting turns in both the tagged passage and the passage immediately following it.  The idea behind this tag is to use it for menu options, so that entering and exiting a menu-style passage will not cause cycles' turns to increment.  By default, the tag is `'menupause'`.  You can configure the name of the tag to your liking with this option.  **Note**: passage tags should not include spaces.

#### `runNew` option
By default, newly declared cycles set up via `<<newcycle>>` automatically start counting turns as soon as they are created.  You can change this behavior to start new cycles suspended by turning this option to false.  If you do, you will need to use the `<<resumecycle>>` macro to get a newly created cycle counting. 

#### `tryGlobal` option
There are several 'helper' functions included in these scripts: `setup.cycSystem.checkCycle()`, for example.  You can read more about these function below.  Obviously, this is a mouthful, so the function definitions get copied over as global functions, i.e. `checkCycle()`.  These global functions are only created if their names are undefined, to prevent any potential compatibility issues.  However, if you'd prefer to keep the functions out of the global scope all together, you can set this value to false and they won't be sent to the global scope at all, even if their names are available.  You'll be forced to write out the longer `setup.cycSystem.checkCycle()` style functions, though.

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
// creates a new cycle called 'timeOfDay', and changes the value every other turn

<<newcycle 'days' 'Sunday' 'Monday' 'Tuesday' 'Wednesday' 'Thursday' 'Friday' 'Saturday' 8>>
// creates a new cycle called 'days' that changes the day of the week every 8 turns

<<newcycle 'seasons' 'spring' 'summer' 'fall' 'winter' 100>>
// creates a new cycle called 'seasons' that changes the season every 100 turns
```

#### `<<suspendcycle>>` macro

 **Syntax**:
 `<<suspendcycle (list of cycles)>>`

* list of cycles: a list of cycle names, provided as quoted strings and separated by spaces.
 
 **Explanation**:
The `<<suspendcycle>>` macro indefinitely stops the named cycle(s) from collecting turns, essentially freezing the indicated cycle or cycles in place at their current number of turns and at their current values.
 
 **Examples**:
```javascript
<<suspendcycle 'timeOfDay'>> // suspends the cycle named 'timeOfDay'

<<suspendcycle 'day' 'seasons'>> // suspends the cycles 'day' and 'seasons'
```

#### `<<resumecycle>>` macro

 **Syntax**:
 `<<resumecycle (list of cycles)>>`

* list of cycles: a list of cycle names, provided as quoted strings and separated by spaces.
 
 **Explanation**:
The `<<resumecycle>>` macro resumes a cycle that is suspended by `<<suspendcycle>>`, allowing it to start collecting turns again.
 
 **Examples**:
```javascript
<<resumecycle 'timeOfDay'>> // resumes the cycle named 'timeOfDay', if it is suspended

<<resumecycle 'day' 'seasons'>> // resumes the cycles 'day' and 'seasons', if either is suspended
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
 `<<resetallcycles (optional: group)>>`
 
 * group: you can include the keyword `running` or `suspended` to target only cycles that are currently running or suspended
 
 **Explanation**:
Resets all currently running cycles to `0` turns.  Similar to `<<resetcycle>>`, but affects all cycles.  Functionally the same as the `resetTag` passage tag; though the tag is the preferred method to accomplish this if at all possible.  If you include one of the group keywords, only the cycles matching that status (running or suspended) will be affected.
 
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
`<<cycleArrayIs>>` is primarily for debugging/extending the system.  This macro sets the value of the temporary variable `_is` to the array of possible values of the indicated cycle.

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

*A note about the functions*:  The functions exists in both the `setup.cycSystem` namespace and as globals.  There is a very small chance that you'll need to use the nonglobal versions if the name of a function is already taken.  The nonglobal versions are in the `setup.cycSystem` namespace.  You'll have to use the longer syntax if the `tryGlobal` option is set to false (see above).

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
<<else>>
	It's late. // will appear if the 'time' cycle's current value is 'night'
<</if>>
```

#### `cycleTurns()` function

**Syntax**:
`cycleTurns(cycle)`

* cycle: the name of an existing cycle, passed as a quoted string.

**Explanation**:
The `cycleTurns()` function returns the number of turns the cycle takes to change its value once.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 2>>:
<<print cycleTurns('time')>> // prints 2
```

#### `cycleCurrentTurns()` function

**Syntax**:
`cycleCurrentTurns(cycle)`

* cycle: the name of an existing cycle, passed as a quoted string.

**Explanation**:
The `cycleCurrentTurns()` function returns the total number of turns that have passed since the indicated cycle was created or last reset.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 2>>, turn 8:
<<print cycleCurrentTurns('time')>> // prints 8
```

#### `cycleTotal()` function

**Syntax**:
`cycleTotal(cycle)`

* cycle: the name of an existing cycle, passed as a quoted string.

**Explanation**:
The `cycleTotal()` function returns the number of turns the cycle takes to rotate completely through all its values and start over one time.  It can also be calculated by multiplying the number of turns a cycle takes to change its value once and the total number of values it has.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 2>>:
<<print cycleTotal('time')>> // prints 6 (3 values [early, late, and night] * turn length 2)
```

#### `cycleExists()` function

**Syntax**:
`cycleExists(cycle)`

* cycle: the name of an existing cycle, passed as a quoted string.

**Explanation**:
The `cycleExists()` function returns true if the indicated cycle exists, whether it is running or suspended.  If the cycle does not exist, returns false.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 2>> and assuming it is the only cycle:
<<if cycleExists('time')>>True<<else>>False<</if>> // displays 'True'

<<if cycleExists('seasons')>>True<<else>>False<</if>> // displays 'False'
```

#### `cycleStatus()` function

**Syntax**:
`cycleStatus(cycle)`

* cycle: the name of an existing cycle, passed as a quoted string.

**Explanation**:
The `cycleStatus()` function returns `'running'` if the indicated cycle is running, `'suspended'` if the indicated cycle is suspended, or `null` if the indicated cycle cannot be found.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 2>><<suspendcycle 'time'>> and assuming it is the only cycle:
<<if cycleStatus('time') is 'suspended'>>True<<else>>False<</if>> // displays 'True'

<<if cycleStatus('seasons') is 'running'>>True<<else>>False<</if>> // displays 'False'
```

#### `cycleSinceLast()` function

**Syntax**:
`cycleSinceLast(cycle)`

* cycle: the name of an existing cycle, passed as a quoted string.

**Explanation**:
The `cycleSinceLast()` function returns the number of turns that have passed since the last time the indicated cycle changed.  Suspended cycles return -1.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 3>>, turn 7:
<<print cycleSinceLast('time')>> // prints 1
```

#### `getCycle()` function

**Syntax**:
`getCycle(cycle, property)`

* cycle: the name of an existing cycle, passed as a quoted string.
* property: the name of the property to return, passed as a quoted string.

**Explanation**:
The `getCycle()` function returns the value of one of the properties of the indicated cycle.  Properties are a part of the cycle definition.  Here's some properties you might wish to return:
 * `name`: the cycle's name
 * `values`: an array of the cycle's possible values
 * `current`: the current value of the cycle
 * `length`: the total number of values in the value array
 * `turns`: the number of turns the cycle takes to change its value once
 
You can usually use the other functions to return much of this information.

**Examples**:
```javascript
// given <<newcycle 'time' 'early' 'late' 'night' 2>>:
<<print getCycle('time', 'name')>> // prints 'time'
<<print getCycle('time', 'values').join('-')>> // prints 'early-late-night'
<<print getCycle('time', 'length')>> // prints 3
<<print getCycle('time', 'turns')>> // prints 2
```

## Play Time System

Records the player's total play time in hours, minutes, and seconds and formats it for display via the `<<playtime>>` macro. You can pause the timer with the `pausetimer` tag, and format your own output, if desired, using the `$playTime` story variable object. The play time will persist across passage navigation, saved games, etc.

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
The play time system script automatically creates a story variable object to hold the timer; this allows you to save and load the timer via SugarCube's built-in save system and it allows you to access the timer natively in the IDE using a `$variable`.  By default, the story variable is created with the name `'playTime'` and accessed via `$playTime` in the IDE.  You can change the name using the `storyVar` option.  Valid names are the same as all valid TwineScript variable names.

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

## Event Macros

This macro set allows Twine authors to create event programming without needing to use JavaScript or jQuery.

### Macros

#### `<<event>>` macro

**Syntax**:
```
<<event (type) (optional: selector)>>
    ...
	<<which (keycode)>>
	    ...
	<<which (keycode)>>
	    ...
<</event>>
```

* type: a valid jQuery event type.  Some events that may be of interest:
  * 'click': fires when an element is clicked on.
  * 'dblclick': fires when an element is double-clicked on.
  * 'keyup': fires when an key is pressed and released.
  * 'keydown': fires immediately when a key is pressed.
  * 'mouseup': fires when a mouse button is pressed and released.
  * 'mousedown': fires when a mouse button is pressed.
* selector: a valid jQuery/CSS selector.  with some events (such as key presses), this checks for focus; with others it checks for the target element of the event (such as mouse clicks).  if no selector is provided, the event is bound to the document element.
* keycode: an integer.  allows you to determine which key or mouse button triggered the event and react accordingly.  you can find keycodes [here](http://keycode.info/).

**Explanation**:
This macro set can be used to add more interaction to your game; things like keyboard hotkeys, controls, clickable non-link elements, and more.  Once registered, events are essentially permanent (though they can be removed via JavaScript and suppressed via code logic); therefore, the best place to create events is your StoryInit special passage.  Note that the element the event is tied to does not need to be rendered (or currently on the page or in the passage) in order to attach an event to it.

**Examples**:
```
/% stow/unstow the ui-bar on double-click %/
<<event 'dblclick' '#ui-bar'>>
    <<toggleclass '#ui-bar' 'stowed'>>
<</event>>

/% set up some hotkeys %/
<<event 'keyup'>>
<<which 67>> /% the c key %/
	<<if not tags().includes('menu')>> /% avoid menu loop %/
		<<goto 'character-menu'>>
	<</if>>
<<which 83>> /% the s key %/
	<<if not tags().includes('menu')>> /% avoid menu loop %/
		<<goto 'spells-menu'>>
	<</if>> 
<<which 77>> /% the m key %/
	<<masteraudio mute>>
<</event>>
```

#### `<<trigger>>` macro

**Syntax**:
`<<trigger (type) (optional: selector)>>`

* type: a valid jQuery event type
* selector: a valid jQuery/CSS selector.  if omitted, defaults to the document element

**Explanation**:
Allows you to simulate any event on any element.  This macro is useful for triggering events you may not otherwise have easy access to.

**Examples**:
```
/% close any dialog box when the player presses esc %/
<<event 'keydown'>>
<<which 27>>
	<<trigger 'click' '#ui-dialog-close'>>
<</event>>
```

## Wikifier Macros

These macros allow you to save any chunk of valid TwineScript code to a variable for later use, and allow you to parse any string or variable on demand.  This provides Twine authors with the ability to pass TwineScript code around in new and interesting ways.  These macros are not intended to replace `<<print>>`, `<<inlcude>>`/`<<display>>`, and `<<widget>>` for the things those macros are best at; intead, they are meant to provide more options for code reuse and dynamic programming.

### Macros

#### `<<code>>` macro

**Syntax**:
```
<<code (variable)>>
	(TwineScript)
<</code>>
```

* variable: a story (`$var`) or temporary (`_var`) variable, passed in quotes.
* TwineScript: any amount of valid TwineScript code

**Explanation**:
The `<<code>>` macro allows you to save TwineScript code to a variable as an unparsed string.

**Examples**:
```
/% a pronoun switcher %/
<<code '$pronoun'>>\
	<<nobr>>
		<<if $gender is 'boy'>>
			he
		<<elseif $gender is 'girl'>>
			she
		<<else>>
			they
		<</if>>
	<</nobr>>\
<</code>>

/% a verb creator %/
<<code '$verb'>>\
    <<nobr>>
		<<if $gender is 'boy' or $gender is 'girl'>>
		    <<if $pastTense>>
			    was
			<<else>>
			    is
			<</if>>
		<<else>>
			<<if $pastTense>>
				were
			<<else>>
				are
		<</if>>
	<</nobr>>\
<</code>>

/% concatenating TwineSctipt %/
<<set $phrase to $pronoun + $verb>>
```

#### `<<wiki>>` macro

**Syntax**:
`<<wiki (string of TwineScript)>>`

* string of TwineScript: a string or variable containing a string of valid TwineScript

**Explanation**:
The `<<wiki>>` macro parses and displays TwineScript code that is passed to it as a string.

**Examples**:
```
/% continuing our <<code>> example %/
<<wiki $phrase>> not here yet.

<<code '$var'>>
    <<set $otherVar++>>\
	$otherVar has increased!
<</code>>
<<wiki $var>>
```

#### `<<eval>>` macro

**Syntax**:
`<<eval (string of TwineScript)>>`

* string of TwineScript: a string or variable containing a string of valid TwineScript

**Explanation**:
The `<<eval>>` macro parses TwineScript code that is passed to it as a string, but unlike the `<<wiki>>` macro, output is supressed.

**Examples**:
```
<<code '$dontWorryAboutLineBreaks'>>
	<<if $this is 'that'>>
		<<set $that to 'this'>>
		<<set $another++>>
		<<set $var to 1000>>
	<<else>>
		<<switch $count>>
		<<case 1>>
			<<set $that to 'no'>>
			<<set $var to false>>
		<<case 2 3>>
			<<set $that to 'never'>>
		<<case 4>>
			<<set $var to 500>>
		<<default>>
			<<set $var to 0>>
		<</switch>>
	<</if>>
<</code>>

<<eval $dontWorryAboutLineBreaks>>
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
Message content is given the class `.message-text`; you can control the appearance of the message's content using this selector in your CSS. (For example: `.message-text {color: green;}` would render the text of all messages in green).

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

* title: the title of the resulting dialog box; if omitted, no title will be shown.
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

// displays a dialog box with no title and the classes '.tutorial' and '.help':
<<button 'Show the Tutorial'>>
	<<dialog '' 'tutorial' 'help'>>
		Tutorial content.
	<</dialog>>
<</button>>
```

#### `<<popup>>` macro

**Syntax**:
`<<popup (passage) (optional: title) (optional: class list)>>`

* passage: the name of the passage whose content you want to append to the dialog box
* title: the title of the resulting dialog box; if omitted, no title will be shown.
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

## Dropdown Macro

A simple macro for creating a drop-down list selection, one of the only html inputs that is missing from SugarCube.

### Macros

#### `<<dropdown>>` macro

**Syntax**:
`<<dropdown (variable) (list of options)>>`

* variable: a TwineSctipt story (`$var`) or temproray (`_var`) variable, passed in quotes
* list of options: a list of options to populate the dropdown, passed as space-separated quoted strings.  if no options are given, an error will be raised.

**Explanation**:
The `<<dropdown>>` macro creates a dropdown-style input.  When a selection is made, the option is saved to the provided variable as a string.

**Examples**:
```
::some passage
<<set $color to ''>>\
<<dropdown '$color' 'red' 'blue' 'green' 'purple' 'yellow' 'white' 'black' 'pink' 'orange'>>

[[continue|next passage]]

::next passage
<<run $(body).css('background-color', $color)>>
<<- $color>>
```

## Simulated Typing Macro

Some games, like Superhot, have a neat little feature where you can mash on the keyboard and no matter what you actually type in, a predefined message comes out.  This macro provides a similar function to Twine.

### Macros

#### `<<typesim>>` macro

**Syntax**:
`<<typesim (text)>>...<</typesim>>`

* text: a string of text; a predefined message that is 'typed' out by the player.

**Explanation**:
The `<<typesim>>` macro creates a text area.  When focused, the user's keystrokes generate a predefined message one letter at a time, simulating typing but ignoring the actual input.  After the message is finished, any text or code between the macro tags is displayed / run.  Any output is shown as a `<div>` beneath the text area; this means you'll need to watch your spacing.

**Styling Options**:
The text area generated will just use SugarCube's standard text area.  If you want to alter its appearance, it has the class `.macro-typesim`.

**Examples**:
```
You begin typing the email to your boss:

<<typesim "Hey Jim, I won't be in to work today, sorry.">>[[Send the email.|next passage]]<</typesim>>
```

## Insert Macros

This set of macros is designed to solve a fairly specific problem.  Consider the following code:

```
<div id='box'></div>

<<replace '#box'>>HELLO<</replace>>
```

This code will raise an error, as the TwineScript is parsed *before* the div we created ever renders.  You can solve this problem a few ways, but the easiest solution, in my book, is a set of macros that just does this:

```
<div id='box'></div>

<<insert '#box'>>HELLO<</insert>>

/% no errors, replacement successful %/
```

There's a trade-off, though.  Because these macros hold off on execution until after the passage loads, their exectuion becomes tied to the passage transition.  This means that they can only be used during passage transition--not with links, or timed macros.

### Macros

#### `<<insert>>` macro

**Syntax**:
`<<insert (element)>>...<</insert>>`

* element: a valid jQuery or CSS selector

**Explanation**:
Functionally the same as `<<replace>>`, except that the macro fires after the page has rendered and only then.

**Examples**:
```
<div id='box'></div>

<<insert '#box'>>HELLO<</insert>>
```

#### `<<insertappend>>` macro

**Syntax**:
`<<insertappend (element)>>...<</insertappend>>`

* element: a valid jQuery or CSS selector

**Explanation**:
Functionally the same as `<<append>>`, except that the macro fires after the page has rendered and only then.

**Examples**:
```
<div id='box'>Hello</div>

<<insert '#box'>> GOODBYE<</insert>>

/% renders as 'hello GOODBYE' %/
```

#### `<<clearelement>>` macro

**Syntax**:
`<<clearelement (element)>>`

* element: a valid jQuery or CSS selector

**Explanation**:
Empties the content from an element--functionally similar to an empty `<<insert>>`, though marginally more efficient.

**Examples**:
```
<div id='box'>HELLLLLLLOOOOOOOOO</div>

<<clearelement '#box'>>
```

## Fullscreen Macros

Macros for making your story fullscreen when used in a browser.  Note: these macros may not work in the downloadable release of Twine 2's test and play modes, and may or may not work with various wrappers like NW.js or Electron.  For normal in browser play, they should do fine.

### Macros

#### `<<fullscreen>>` macro

**Syntax**:
`<<fullscreen>>`

**Explanation**:
This macro causes the game to go into fullscreen mode, but it must be paired with some sort of interaction to work, like a link or a button.

**Examples**:
```
<<link 'Fullscreen Mode'>>
	<<fullscreen>>
<</link>>

<<button 'Fullscreen Mode'>>
	<<fullscreen>>
<</button>>
```

#### `<<fullscreenlink>>` macro

**Syntax**:
`<<fullscreenlink (link text)>>`

* link text: the text of the link.

**Explanation**:
Creates a link with user-defined text that, when clicked, launches fullscreen mode.

**Examples**:
```
<<fullscreenlink 'Fullscreen Mode'>>
```

# Other Information

I decided to write this section like a FAQ since that seemed easier to me.

### Should I credit you if I use these macros or these scripts?

You are certainly allowed to if you for some reason feel that you need to. You absolutely don't have to.

### Can I edit/repost/fork/fix this code?

Yes.

### Can you write me a macro that does X?

I can certainly try. You might not need a macro, though--a lot of stuff can be handled via widgets and task objects. At any rate, I've been known to do requests, so let me know what you want and I'll see what I can do.

### Why did you make X macro when you could have just used Y macro/function/API?

Macros are easier to implement for Twine creators because they're native to the IDE. In other words, they're sexier.

It's really the same reason link markup exists. We could all write out `<<link>>` macros (or anchor elements, for that matter), but `[[link]]` is sexy, easy, and fast. These macros are designed to wrap up some often requested features into a scripting style that twine creators are already comfortable with.

### Some of your macros seem easy to break/confuse?

Some of them aren't quite as stable or flexible as I'd like.  If a macro seems to not be working the way you think it should, feel free to open an issue or drop me a line.

### Some of these scripts seem to include more than just a macro definition.

Some of the macros rely on external (in the sense of being outside of the macro definition) nuts-and-bolts scripting, functions, or task objects to work. These are included in the scripts when appropriate, and are required for their associated macros to function.

### I have a suggestion/found a bug.

Please alert me to any bugs or weirdness. I'm also open to suggestions, whether a feature request or an improvement to some of my stupidly written code. You can either open an issue or PM me on reddit (u/ChapelR).  I can also be located in various Twine communities under the name Chapel or ChapelR.

### What's with `_is`?

I use `_is` a lot as a lazy man's return value for a lot of my own widgets, macros, and code chunks, and saw no reason to get rid of them. There's something that just seems very well-designed about code that reads: `<<isBoy>><<if _is>>...` 

That might just be me though. Most of the `_is` parts of these macros can be ignored and are more for testing/debugging/extending the code than for actual day-to-day use.

**NOTE** ->If you find any errors in this documentation, pease let me know.
