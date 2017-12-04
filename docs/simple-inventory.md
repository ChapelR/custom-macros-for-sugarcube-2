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
   * [the `:inventory-init` event](#event-inventory-init)
   * [the `:inventory-upddate` event](#event-inventory-update)

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

**Syntax**: `<<pickup variableName [itemList]>>`

The `<<pickup>>` macro adds items to inventory indicated by the $variable.  These items are added to the end of the inventory.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 * **itemList**: (optional) A list of items to place in the inventory.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.
 
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
```

#### Macro: `<<drop>>`

**Syntax**: `<<drop variableName [itemList]>>`

The `<<drop>>` macro removes items from the inventory indicated by the $variable.  If one or more of the provided items can't be found in the inventory, nothing happens and no error is thrown, so some caution may be required in debugging certain situations.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 * **itemList**: (optional) A list of items to place in the inventory.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.
 
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

**Syntax**: `<<transfer variableName variableName [itemList]>>`

The `<<transfer>>` macro moves items from one inventory to another. The first inventory argument is the giver, and the second is the receiver. It's essentially the same as pairing a `<<pickup>>` and `<<drop>>`, but has a few benefits over doing it that way.  For one, if you were to `<<drop>>` an item from one inventory and have another `<<pickup>>` the same item, you run the risk of having the reveiving inventory getting an item that the first inventory never had, since `<<drop>>` does nothing if the item doesn't exist.  Using `<<transfer>>`, if an item isn't present in the first inventory, the second inventory will not recieve said item.  Like `<<drop>>` no error will be raised in this case.

**Arguments**:

 * **variableName**: The name of a $variable, which must be quoted, and which is storing an inventory created by `<<newinventory>>` or the `Inventory()` constructor.
 * **itemList**: (optional) A list of items to place in the inventory.  This list should be one or more arrays of quoted strings, a space-separated list of quoted strings, or any combination of the two.
 
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

The `<<sort>>` macro sorts the indicated inventory in alphanumeric order.  **Warning**: There's no easy way to restore the default chronological ordering.

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

#### The `Inventory()` Constructor

#### Static Methods

##### `Inventory.is()`

##### `Inventory.log()`

##### `Inventory.removeDuplicates()`

#### Instance Methods

#####`<inventory>.pickUp()`

##### `<inventory>.drop()`

##### `<inventory>.empty()`

##### `<inventory>.transfer()`

##### `<inventory>.has()`

##### `<inventory>.hasAll()`

##### `<inventory>.toArray()`

##### `<inventory>.sort()`

##### `<inventory>.show()`

### The Events

#### Event: `:inventory-init`

#### Event: `:inventory-update`