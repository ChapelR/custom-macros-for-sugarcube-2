## The Simple Inventory System (v2.x)

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

The simple inventory allows Twine authors to create and manipulate array-based inventories for 'key' style items (as opposed to consumables or equipment).  The simple inventory gives you a great deal of functionality, including sorting, displaying item lists (with drop / transfer links), and creating multiple inventories (for creating 'rooms' or other containers, or party members) and transfering items between them.  All of the functionality here has both a JavaScript API and a TwineScript Macro-based API, meaning the features are easily available from within your passages and inside scripts.

**Note** The simple inventory has undergone some pretty major changes since it first debuted.  Version 1 was mostly a but of syntactic sugar over an array system designed to help less-experienced authors utilize standard JavaScript arrays and methods in a scripting style they were more comfortable with (that is, macros).  On rewriting this system, it seemed like a good idea to push things a little farther and create something that could be useful even to more experienced authros (hopefully, anyway).  The changes make simple inventory a much more robust and feature-rich system, but unfortunately, **old code written for v1.x of simple inventory is not compatible with the new simple inventory system**.

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
   * [the `Inventory()` contructor](#constructor-inventory)
   * [the `Inventory.is()` method](#static-method-inventory-is)
   * [the `Inventory.log()` method](#static-method-inventory-log)
   * [the `Inventory.removeDuplicates()` method](#static-method-inventory-removeduplicates)
   * [the `<inventory>.pickUp()` method](#method-inventory-pickup)
   * [the `<inventory>.drop()` method](#method-inventory-drop)
   * [the `<inventory>.empty()` method](#method-inventory-empty)
   * [the `<inventory>.transfer()` method](#method-inventory-transfer)
   * [the `<inventory>.has()` method](#method-inventory-has)
   * [the `<inventory>.hasAll()` method](#method-inventory-hasall)
   * [the `<inventory>.toArray()` method](#method-inventory-toarray)
   * [the `<inventory>.sort()` method](#method-inventory-sort)
   * [the `<inventory>.show()` method](#method-inventory-show)
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

		#### Macro: `<<newinventory>>`

		#### Macro: `<<pickup>>`
		
		#### Macro: `<<drop>>`
		
		#### Macro: `<<dropall>>` and `<<clear>>`
		
		#### Macro: `<<transfer>>`
		
		#### Macro: `<<sort>>`
		
		#### Macro: `<<inventory>>`
		
		#### Macro: `<<linkedinventory>>`

	### Functions and Methods

		#### Constructor: `Inventory()`

		#### Static Method: `Inventory.is()`
		
		#### Static Method: `Inventory.log()`
		
		#### Static Method: `Inventory.removeDuplicates()`
		
		#### Method: `<inventory>.pickUp()`
		
		#### Method: `<inventory>.drop()`
		
		#### Method: `<inventory>.empty()`
		
		#### Method: `<inventory>.transfer()`
		
		#### Method: `<inventory>.has()`
		
		#### Method: `<inventory>.hasAll()`
		
		#### Method: `<inventory>.toArray()`
		
		#### Method: `<inventory>.sort()`
		
		#### Method: `<inventory>.show()`

	### The Events

		#### Event: `:inventory-init`

		#### Event: `:inventory-update`