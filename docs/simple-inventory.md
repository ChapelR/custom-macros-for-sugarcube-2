## The Simple Inventory System (v2.x)

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

The simple inventory allows Twine authors to create and manipulate array-based inventories for 'key' style items (as opposed to consumables or equipment).  This system provides a great deal of functionality, including sorting, displaying item lists (with drop / transfer links), and creating multiple inventories (for creating 'rooms' or other containers, or party members) and transfering items between them.  All of the functionality here has both a JavaScript API and a TwineScript Macro-based API, meaning the features are easily available from within your passages and inside scripts.

**Note** The simple inventory has undergone some pretty major changes since it first debuted.  Version 1 was mostly a bit of syntactic sugar over an array system designed to help less-experienced authors utilize standard JavaScript arrays and methods in a scripting style they were more comfortable with (that is, macros).  On rewriting this system, it seemed like a good idea to push things a little farther and create something that could be useful even to more experienced authros (hopefully, anyway).  The changes make simple inventory a much more robust and feature-rich system, but unfortunately, **old code written for v1.x of simple inventory is not compatible with the new simple inventory system**.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/simple-inventory.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/simple-inventory.js).

### Contents

 * [The Options Object](#the-options-object)
   * [the `tryGlobal` option](#option-tryglobal)
   * [the `defaultStrings` option](#option-defaultstrings)
 * [The Macros](#the-macros)
   * [the `<<newinventory>>` macro](#macro-newinventory)
   * [the `<<pickup>>` macro](#macro-pickup)
   * [the `<<drop>>` macro](#macro-drop)
   * [the `<<dropall>>` and `<<clear>>` macros](#macro-dropall-and-clear)
   * [the `<<transfer>>` macro](#macro-transfer)
   * [the `<<sort>>` macro](#macro-sort)
   * [the `<<inventory>>` macro](#macro-inventory)
   * [the `<<linkedinventory>>` macro](#macro-linkedinventory)
 * [Functions and Methods](#functions-and-methods)
   * [the `Inventory()` contructor](#the-inventory-constructor)
   * [Static Methods](#static-methods)
   * [Instance Methods](#sinstance-methods)
 * [Events](the-events)

### The Options Object
	
The options object can be found near the top of the script (in either version, minified or not).  It looks like this:
		
```javascript
setup.simpleInv.options = {
	tryGlobal  : true, // send constructor to global scope
		defaultStrings : {
		empty     : 'The inventory is empty...',
		listDrop  : 'Discard',
		separator : '\n'
	}
};
```
		
It is recommended that you leave the `tryGlobal` option as `true` unless you know what you're doing.

#### Option: `tryGlobal`
		
The functions, methods, and variables used by these systems all exist in the `setup.simpleInv` namespace.  For ease of access to authors, everything that might be of use to them is then sent to the global scope asa reference as `window.Inventory`.  If you don't want to send this object to the global scope, you can change this option to `false`.  Note that even if it's set to `true`, the script will check to make sure `window.Inventory` is undefined before overwriting it.

If the global `Inventory` object is unavailable, either because you changed this setting or because it was already in use, you can still access things: replace `Inventory...` with `setup.simpleInv.inventory...` in your code, or create your own gobal reference.

#### Option: `defaultStings`
			
This set of options represents the default strings used for certain situations:

 * `empty`: when the inventory is empty, this text is displayed instead of a list of items.  You can use valid TwineScript syntax in the string, i.e. `empty:  "<<include 'EmptyMessagePassage'>>"` would be a valid value.
 * `listDrop`: the inventory system includes a  macro called `<<linkedinventory>>` for constructing a list of items with links that allow dropping and transfering items when clicked.  These links' text *should* be set up in the macro, but you can set up default link text that will appear in case an invalid argument is passed; you can then pass an empty string (`''`) as a shortcut to display this as the link.
 * `separator`: when using the `<<inventory>>` macro or the `<inventory>.show()` method to display a list of items, you can determine how you want the items to be serparated when using those macros by supplying a string.  If no string is supplied, this default separator is used instead (the default value of `'\n'` represents a newline in JavaScript).

### The Macros

The following is a list of macros included in the simple inventory system.

#### Macro: `<<newinventory>>`

**Syntax**: `<<newinventory variableName [itemList]>>`

This macro creates a new inventory.  Creating a new inventory is much like initializing a variable, and the best place to use this macro is in your `StoryInit` special passage.  You must provide the macro with a valid TwineScript variable, passed in quotes (similar to how you might pass it to a `<<textbox>>` macro).  The new inventory will be stored in the provided variable.  You can optionally pass the inventory a list of items and the inventory will be initialized with these items inside it.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, in which to store the newly created inventory.
 * **itemList**: (optional) A list of items to place in the inventory.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.
 
**Usage**:
```
/% create a new, empty inventory in the $inventory variable %/
<<newinventory '$inventory'>>

/% create an inventory in the $playerInventory variable and place two items in it %/
<<newinventory '$playerInventory' 'a pair of shoes' 'the shirt on your back'>>

/% create an inventory for the kitchen room and call it $kitchenInventory and place some items in it %/
<<newinventory '$kitchenInventory' ['a steak knife', 'a blender'] 'a calender'>>

/% create a suit case called $suitCase always contains a key, but also includes some random items %/
<<set _items to ['keys', 'a suit', 'a laptop', 'a cellphone', 'a wallet', 'sixteen cents', 'a hairpin', 'toothpaste', 'glue'].pluckMany(3)>>
<<newinventory '$suitCase' _items 'car key'>>
```

#### Macro: `<<pickup>>`

**Syntax**: `<<pickup variableName [unique] itemList>>`

The `<<pickup>>` macro adds items to inventory indicated by the $variable.  These items are added to the end of the inventory.  If the keyword `unique` is included before the item list, items that are already in the inventory will not be added to it.  **Caution**: if the `unique` keyword is placed after the first item in the item list, an item called `unique` will be added to the inventory.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 * **unique**: (optional) The keyword `unique`.  If passed before the item list, will enforce uniqueness--that is, items already in the inventory will not be picked up.
 * **itemList**: A list of items to place in the inventory.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.
 
**Usage**:
```
/% add an item to the inventory %/
<<pickup '$inventory' 'baseball card'>>

/% you may wish to check if the player already has the item: %/
@@#link;
<<link 'Pick up the gun.'>>
	<<if $playerInventory.has('a gun')>>
		<<replace '#links'>>You already have a gun, you don't need another...<</replace>>
	<<else>>
		<<pickup '$playerInventory' 'a gun'>>
		<<replace '#links'>>You take the gun and hide it in your coat.<</replace>>
	<</if>>
<</link>>
@@

/% you can also add several items at once %/
You recieved your inheritance!
<<set _randomItem to either('a bust of George Washinton', 'a pearl necklace', 'a statue of a cherub')>>
<<pickup '$maryInventory _randomItem 'a large sum of money' 'a sealed letter'>>

/% unique items: %/
:: StoryInit
<<newinventory '$inventory' 'sword'>>

:: A Later Passage
<<pickup '$inventory' unique 'sword' 'shield'>>
/% only shield is added %/

:: Some Other Passage
/% however, be warned: %/
<<pickup '$inventory' 'armor' unique 'sword'>>
/%
	an item named 'unique' is added to the inventory, 
	and the other items are also added, regardless of whether 
	they were already in the inventory
%/
```

#### Macro: `<<drop>>`

**Syntax**: `<<drop variableName itemList>>`

The `<<drop>>` macro removes items from the inventory indicated by the $variable.  If one or more of the provided items can't be found in the inventory, nothing happens and no error is thrown, so some caution may be required in debugging certain situations.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 * **itemList**: A list of items to remove from the inventory.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.
 
**Usage**:
```
/% drop an item %/
<<drop '$inventory' 'baseball card'>>

/% have a random item stolen %/
<<set _stolen to $playerInventory.toArray().random()>>
<<drop '$playerInventory' _stolen>>

/% drop all weapons %/
:: StoryInit
<<newinventory '$player' 'a sword'>>
<<set $weaponsList to ['a sword', 'a gun', 'shotgun', 'the magic blade of null']>>

:: Prison
The guards frisk you and take your weapons.
<<drop '$player' $weaponList>>
/% drops any item from _weaponList, if present %/
```

#### Macro: `<<dropall>>` and `<<clear>>`

**Syntax**: `<<dropall variableName>>` or `<<clear variableName>>`

The `<<dropall>>` macro removes **all** items from the inventory indicated by the $variable.  The `<<clear>>` macro is an alternative that does the same thing.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 
**Usage**:
```
/% clears the inventory %/
<<dropall '$inventory'>>

/% <<clear>> also works %/
A fire destroyed the mansion's kitchen!
<<clear '$kitchenInventory'>>
```

#### Macro: `<<transfer>>`

**Syntax**: `<<transfer variableName variableName itemList>>`

The `<<transfer>>` macro moves items from one inventory to another. The first inventory argument is the giver, and the second is the receiver. It's essentially the same as pairing a `<<pickup>>` and `<<drop>>`, but has a few benefits over doing it that way.  For one, if you were to `<<drop>>` an item from one inventory and have another `<<pickup>>` the same item, you run the risk of having the reveiving inventory getting an item that the first inventory never had, since `<<drop>>` does nothing if the item doesn't exist.  Using `<<transfer>>`, if an item isn't present in the first inventory, the second inventory will not recieve said item.  Like `<<drop>>` no error will be raised in this case.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 * **itemList**: A list of items to transfer between the inventories.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.
 
**Usage**:
```
/% containers %/
<<link 'Leave the kitchen knife here?'>>
	<<transfer '$playerInventory' '$kitchenInventory' 'kitchen knife'>>
<</link>>

/% transfer weapons, so the player can get them back %/
:: StoryInit
<<newinventory '$player' 'a sword'>>
<<newinventory '$holding'>>
<<set $weaponsList to ['a sword', 'a gun', 'shotgun', 'the magic blade of null']>>

:: Prison
The guards frisk you and take your weapons.
<<trandfer '$player' '$holding' $weaponList>>

:: Release
You've been released from prison, and your weapons are returned to you.
<<transfer '$holding' '$player' $weaponList>>
```

#### Macro: `<<sort>>`

**Syntax**: `<<sort variableName>>`

The `<<sort>>` macro sorts the indicated inventory in alphanumeric order.  **Warning**: There's no easy way to restore the default chronological ordering.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 
**Usage**:
```
<<sort '$inventory'>>
```

#### Macro: `<<inventory>>`

**Syntax**: `<<inventory variableName [separator]>>`

The `<<inventory>>` macro displays a list of the items in the indicated inventory.  This list can be separated by a provided string.  If no serparator argument is provided, the default separator is used.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 * **separator**: (optional) The string used to separate the list of items.  If omitted, the [default string](#option-defaultstrings) is used.
 
**Usage**:

Assume the inventory `$playerInv` contains: `'wallet'`, `'keys'`, `'phone'`, `'pocket knife'`, and `'candy bar'`.

Example:

```
<<inventory '$playerInv' '\n'>> /% or just <<inventory '$playerInv'>> if the default strings aren't changed %/
```

Result:

```
wallet
keys
phone
pocket knife
candy bar
```

Example:

```
<<inventory '$playerInv' ', '>>
```

Result:

```
wallet, keys, phone, pocket knife, candy bar
```

Example:

```
<<sort>>
<<inventory '$playerInv' ' - '>>
```

Result:

```
candy bar - keys - phone - pocket knife - wallet
```

#### Macro: `<<linkedinventory>>`

**Syntax**: `<<linkedinventory actionName variableName [variableName]>>`

The `<<linkedinventory>>` macro creates a list of items from the indicated inventory, and pairs each item with a link.  If only one inventory variable is provided, the links, when clicked, will cause the items to be dropped from their current inventory as though the `<<drop>>` macro had been used.  If a second inventory variable is included, items will instead be move from the first inventory to the second, as though the `<<transfer>>` macro had been called.  The **actionName** argument should be used to contextualize this action for the player.

**Arguments**:

 * **actionName**: The name the link should be given for each entry.  Use an empty string to shortcut to the [default action](#option-defaultstrings).
 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 
**Usage**:
```
/% containers %/
You open the box.  Want to take anything with you?
<<linkedinventory 'Pick Up' '$boxInventory' '$playerInventory'>>

/% let the player drop items %/
<<linkedinventory 'Drop' '$inventory'>>

/% let the player place items %/
You open the closet.  Lots of space in here.
<<linkedinventory 'Store' '$inventory' '$storage'>>
```

### Functions and Methods

The following are the functions and methods that are included in the simple inventory.  Most of these allow access to the simple inventory's features in pure JavaScript, while some of these features are only available through this JavaScript API: even if you aren't planning on interacting with this system through JavaScript, you should still read the documentation for `Inventory.removeDuplicates()`, `<inventory>.has()`, and `<inventory>.hasAll()`, all of which are either only available through JavaScript, or contain features that are only available for your TwineScript expressions through JavaScript.

**Note on chaining**: Methods that don't return an explicit value will return the inventory they are called on (listed with the return value of 'this inventory' in the below documentation), meaning you can **chain many of the instance method calls**.  For example, `<inventory>.pickUp()` adds items to the inventory, but doesn't need to return anything in specific, so it returns the inventory object is was called on and allows chaining.  On the other hand, `<inventory>.show()` returns a string, so it can't be chained with other inventory methods.  For example:

```
-> The following is valid:
<<print $inventory.pickUp('toothpick').show()>>

-> The following is not valid and will raise an error
<<run $inventory.show().pickUp('toothpick')>> 
```

#### The `Inventory()` Constructor

**Return Value**: A new inventory instance.

**Syntax**: `new Inventory([itemList])`

The `Inventory()` constructor creates a new inventory just as the `<<newinventory>>` macro does.  While some checks are in place to help forgetful authors, this function should **always** be called with the `new` operator, as failing to do so could leak the inventory to the global scope or create other issues.  Further, the call should always be saved to a variable (a story $variable, a temporary _variable, or a JavaScript variable) or the call might pollute the global scope.

**Arguments**:

 * **itemList**: (optional) A list of items to place in the inventory.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.

**Usage**:

All of the following examples are equivalent to `<<newinventory '$inventory' 'the shirt on your back'>>`:

```
/% using in a <<set>> macro (also works in <<run>>) %/
<<set $inventory to new Inventory('the shirt on your back')>>

// in JavaScript or in <<script>> macro tags:
State.variables.inventory = new Inventory('the shirt on your back')>>

// using a function (for some reason):
setup.makeAnInventory = (var) {
	var sv = State.variables;
	sv[var] = new Inventory('the shirt on your back');
	return sv[var];
};
setup.makeAnInventory(inventory);
```

#### Static Methods

Static methods are methods accessed through the `Inventory` object, as opposed to being accessed through a specific instance.  The biggest difference authors need to worry about is the syntax.

Of particular note to authors: `Inventory.removeDuplicates()`

##### `Inventory.is()`

**Return Value**: Boolean.

**Syntax**: `Inventory.is(variable)`

This method checks the provided variable or object and returns true if the variable is a reference to an inventory, and false otherwise.  May be useful to some authors creating extensions or new features, but all methods and macros that expect an inventory in the simple inventory system will throw an error if they aren't given an inventory.

**Arguments**:

 * **variable**: A variable of some kind, TwineScript or JavaScript.

**Usage**:
```
/% given the following: %/
<<newinventory '$inventory'>>

<<set _treasureList to ['magic sword', 'ancient statue', 'gems']>>
<<set $treasureChest to []>>

<<set $treasureChest[0] to new Inventory(_treasureList.random(), 'some gold')>>
<<set $treasureChest[1] to new Inventory(_treasureList.random(), 'some gold')>>
<<set $treasureChest[2] to new Inventory(_treasureList.random(), 'some gold')>>

/% test the objects %/
<<if Inventory.is($inventory)>> /% true %/
	{{{$inventory}}} is an inventory.
<</if>>

<<if Inventory.is($treasureChest[1])>> /% true %/
	{{{$treasureChest[1]}}} is an inventory.
<</if>>

<<if Inventory.is($treasureChest)>> /% false, it's an array of inventories, but not an inventory itself %/
	{{{$treasureChest}}} is an inventory.
<</if>>

<<if Inventory.is(_treasureList)>> /% false %/
	{{{_treasureList}}} is an inventory.
<</if>>
```

##### `Inventory.log()`

**Return Value**: String.

**Syntax**: `Inventory.log(inventory)`

This method logs the indicated inventory's contents to the console, and returns a string representation of the same information.  If the object or variable passed is not an inventory instance, the string and log will state as much. Mostly useful for debugging purposes; these calls should probably be deleted or omitted in release code.

**Arguments**:

* **inventory**: An inventory instance, or a variable referencing an inventory instance.

**Usage**:
```
/% log to console %/
<<run Inventory.log($inventory)>>

/% log to console and print %/
<<set $log to Inventory.log($container)>>
<<= $log>>
```

##### `Inventory.removeDuplicates()`

**Return Value**: Array.

**Syntax**: `Inventory.removeDuplicates(inventory)`

This method is useful for enforcing uniqueness; that is, preventing doubles or duplicates from being included in the inventory or in displays of the inventory.  It returns a new array that includes only unique items that can be used to overwrite the original or print to the player.

**Arguments**:

 * **inventory**: An inventory instance, or a variable referencing an inventory instance.

**Usage**:
```
/% keep the duplicates, but don't display them to the player %/
<<= Inventory.removeDuplicates($inventory).join('\n')>>

/% overwrite the inventory's contents with the unique array %/
<<set _uniqueOnly to Inventory.removeDuplicates($inventory)>>\
<<run $inventory.empty().pickUp(_uniqueOnly)>>

/% same as above using macros where possible: %/
<<set _uniqueOnly to Inventory.removeDuplicates($inventory)>>\
<<dropall '$inventory'>><<pickup '$inventory' _uniqueOnly>>
```

#### Instance Methods

Instance methods, unlike static methods, are called directly on the inventory object, so you replace `<inventory>` with the variable you're using to store / reference the inventory instance you want to work on.  See the examples for the methods below if that confuses you.

Of particular note to authors: `<inventory>.has()`, `<inventory>.hasAll()`, and `<inventory>.toArray()`

##### `<inventory>.pickUp()`

**Return Value**: This inventory (chainable).

**Syntax**: `<inventory>.pickUp([unique], itemList)`

This method is functionally the same as the `<<pickup>>` macro and accepts the same type of arguments.  Like with the macro version, if the `unique` keyword (must be quoted in the method call) is the first item in the itemList, it enforces uniqueness.  If the keyword appears in any other position in the list, the keyword is instead treated as an item and added to the inventory, and uniqueness is not enforced.  See [the `<<pickup>>` macro documentation](#macro-pickup) for more

**Arguments**:

 * **unique**: The string `'unique'`, which, if includes before the **itemList**, enforces uniqueness (see the `<<pickup>>` macro for more).
 * **itemList**: A list of items to place in the inventory.  This list should be one or more arrays of quoted strings, a comma-separated list of quoted strings, or any combination of the two.

**Usage**:
```
/% pick up an item while enforcing uniqueness %/
<<run $inventory.pickUp('unique', 'marble')>>

// pick up a couple randomized items in JavaScript
var treasures = ['gold ingot', 'statue', 'gem', 'pearl'];
State.variables.playerInv.pickUp(treasures.randomMany(2));
```

##### `<inventory>.drop()`

**Return Value**: This inventory (chainable).

**Syntax**: `<inventory>.drop(itemList)`

This method is functionally the same as the `<<drop>>` macro and accepts the same type of arguments.

**Arguments**:

 * **itemList**: A list of items to remove from the inventory.  This list should be one or more arrays of quoted strings, a comma-separated list of quoted strings, or any combination of the two.

**Usage**:
```
/% drop an item %/
<<run $inventory.drop('marble')>>

// drop a couple randomized items in JavaScript
var pickPocket = State.variables.playerInv.toArray().randomMany(3);
State.variables.playerInv.drop(pickPocket);
```

##### `<inventory>.empty()`

**Return Value**: This inventory (chainable).

**Syntax**: `<inventory>.empty()`

This method is functionally the same as the `<<clear>>` and `<<dropall>>` macros; it removes all items from the calling inventory.

**Usage**:
```
/% clear an inventory %/
<<run $inventory.empty()>>

// clear an inventory in JavaScript
State.variables.playerInv.empty();
```

##### `<inventory>.transfer()`

**Return Value**: This inventory (chainable).

**Syntax**: `<inventory>.transfer(inventory, itemList)`

This method is functionally the same as the `<<transfer>>` macro and accepts the same type of arguments.  The listed items are tansferred from the calling inventory to receiving inventory, which must be a valid inventory instance and must be passed as the first argument.

**Arguments**:

 * **inventory**: A second inventory instance to receive the transferred items.
 * **itemList**: A list of items to transfer from the calling inventory to the indicated inventory.  This list should be one or more arrays of quoted strings, a comma-separated list of quoted strings, or any combination of the two.

**Usage**:
```
/% transfer an item %/
<<run $inventory.transfer($container, 'marble')>>

// tansfer all items in JavaScript
var allItems = State.variables.kitchenInventory.toArray();
State.variables.playerInv.transfer(State.variables.kitchenInventory, allItems);
```

##### `<inventory>.has()`

**Return Value**: Boolean.

**Syntax**: `<inventory>.has(itemList)`

This method is returns whether the calling inventory contains the indicated item or items.  If more than one item is passed, the method returns true if any one of the items is found in the calling inventory.  To check for all items in a set, you must use `<inventory>.hasAll()` instead.

**Arguments**:

 * **itemList**: A list of items to check the calling inventory for.  This list should be one or more arrays of quoted strings, a comma-separated list of quoted strings, or any combination of the two.

**Usage**:
```
/% check for an item %/
<<if $playerInv.has('car key')>>
	You can [[start the car|start car]].
<<else>>
	You don't remember where you left the keys.
<</if>>

/% checking for one item out of a group %/
<<if $inventory.has('sledgehammer', 'lock pick', 'office key')>>
	You have found a way into the room!
<</if>>
```

##### `<inventory>.hasAll()`

**Return Value**: Boolean.

**Syntax**: `<inventory>.hasAll(itemList)`

This method is returns whether the calling inventory contains the indicated item or items.  If more than one item is passed, the method returns true only if all of the items are found in the calling inventory.  To check for any of the items in a set, you must use `<inventory>.has()` instead.

**Arguments**:

 * **itemList**: A list of items to check the calling inventory for.  This list should be one or more arrays of quoted strings, a comma-separated list of quoted strings, or any combination of the two.

**Usage**:
```
/% check for an item (generally, you should use <inventory>.has() for a single item, but this also works)%/
<<if $playerInv.hasAll('car key')>>
	You can [[start the car|start car]].
<<else>>
	You don't remember where you left the keys.
<</if>>

/% checking for all of the required items %/
<<if $inventory.hasAll('lighter', 'kindling', 'branches', 'bucket of water')>>
	You have enough to start a camp fire!
<</if>>
```

##### `<inventory>.toArray()`

**Return Value**: Array.

**Syntax**: `<inventory>.toArray()`

This method returns an array made up of the items in the calling inventory.  Useful for allowing the author to use standard JavaScript array methods on the inventory.  Caution is required because changes to this array will be reflected in the calling inventory, unless the `clone()` function is used.

**Usage**:
```
/% create an array based on the inventory %/
<<set _array to $inventory.toArray()>>

/% pluck random items from the inventory: the inventory will be updated %/
<<set _randomItems to $playerInv.toArray().pluckMany(2)>>

/% using clone() to get an array that doesn't affect the calling inventory %/
<<set _items to clone($container.toArray())>>
<<set _items to ['uh oh']>> /% empty the clone %/
<<= $container.show(', ')>> /% shows the original inventory %/
<<= _items.join(', ')>> /% shows 'uh oh' %/
```

##### `<inventory>.sort()`

**Return Value**: This inventory (chainable).

**Syntax**: `<inventory>.sort()`

This method is the same as the `<<sort>>` macro, it sorts the calling inventory in alpha-numeric order.  The default ordering, which is chronological, cannot easily be restored after using this method.

**Usage**:
```
/% sort the inventory %/
<<run $inventory.sort()>>
```

##### `<inventory>.show()`

**Return Value**: String.

**Syntax**: `<inventory>.show([separator])`

This method is similar to the `<<inventory>>` macro, it creates a sting representation of the calling inventory for printing, and allows the author to optionally set the separator.

**Arguments**:

 * **separator**: (optional) The string used to separate the list of items.  If omitted, the [default string](#option-defaultstrings) is used.

**Usage**:
```
/% yiedls the same output as <<inventory '$inventory'>> %/
<<= $inventory.show()>>

/% yiedls the same output as <<inventory '$playerInv' ', '>> %/
<<= $playerInv.show(', ')>>
```

### The Events

The simple inventory automatically triggers one of two events as inventories are manipulated.  You can use these events to perform functions and run other code in real time as the inventories are manipulated during gameplay.  These events are also targetable by my `<<event>>` macro set.

#### The Event Object:

When an event is fired, a variety of information is sent to the event handlers.  That information is detailed here:

 * `<event>.instance`: A reference to the calling instance.  In transfers, that's the giving inventory.
 * `<event>.receiving`: A reference to the receiving instance, if it exists (i.e. in `<<transfer>>` and `<<linkedinventory>>` calls), or `null`.
 * `<event>.moved`: An array of items that have been moved into or out of the calling inventory, or null if nothing was moved (for example, if items the player doesn't have were dropped, or a `<<sort>>` was used).
 * `<event>.context`: The context of the event: it's always one of the following strings:
   * `'pickup'`: Some type of pickup action ocurred.  Does not fire on items added with `<<newinventory>>` or similar.
   * `'drop'`: Some type of drop action occured.  Emptying or clearing the inventory also cause this context.
   * `'transfer'`: A transfer between two inventories occured.
   * `'initialized'`: A new inventory was created.  If items were also added, they'll be in the `<event>.moved` property.
   * `'sort'`: The inventory was sorted.
   
 When defining an event handler, you can access these propertied on the event object like so:
 ```javascript
 $(document).on(':inventory-update', function (ev) {
	alert('Context: ' + ev.context);
	if (ev.moved && ev.moved.length) {
		console.log(ev.moved.join(', '));
	}
	if (ev.context === 'transfer') {
		console.log('a transfer happened!');
	}
 });
 ```

#### Event: `:inventory-init`

This event is only triggered when a new inventory is defined.  It's context is always `'initialized'`.

#### Event: `:inventory-update`

This event is triggered any time an inventory is altered, but **not** when it is created.  In can never have the context `'initialized'`.