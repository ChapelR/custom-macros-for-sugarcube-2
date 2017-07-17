# Contents
* [About Extensions](#about-extensions)
* [Simple Inventory](#simple-inventory-extensions)
  * [Containers](#containers)

# About Extensions

I'd like to periodically make extensions for these systems based on requests I see (whether those requests are actually for my systems or not--if I can jam it in I will).  These extensions will feature additional options, macros, and functions that, while helpful, are espensive / specific enough to warrant not being a part of the generic release.  I.E. these features usually have some drawbacks.

If you have any ideas for extensions, catch up with me on Reddit (u/ChapelR), or open an issue and make a feature request here.

# Simple Inventory Extensions

Refer to the documentation for the simple inventory system in the main `readme.md` file for more information on this system.

## Containers

The file `passage-containers.js` includes the containers system, which requires the Simple Inventory script to function.  The containers systems allows you to treat passages like rooms/containers with regard to your inventory.  For example, you can drop an item from your inventory into a room, or pickup an item from a room and place it in your inventory.  In this way, items are effectively 'passed' around to different inventories, so you can make sure that they won't magically reappear in their original locations when dropped, but they also won't simply vanish.

There's some built-in support here for simple puzzles: you could, for example, check to see if select items are in a given room, and if they are cause the environment to change in some way.  This system also includes options for displaying the inventory with a drop command for each item, displaying the inventories of passages, either as a static list or as a list of 'pickup' link, and for treating passages as though they were other passages to get around the problem of menu screens (i.e. you can have dropped items from your inventory menu go to the previous passage instead of the menu's passage). 

### Installation:

To install `passage-containers.js`, you must first install either `simple-inventory.js` or `complete-collection.js`.  Copy and paste the contents of `passage-containers.js` after one of these two scripts.  If you're using Twine 1, make sure to include this script in the same script-tagged passage as `simple-inventory.js` to ensure that the scripts load in the correct order.  If you've signifcantly altered the code of the simple inventory script, you may need to change it back or reinstall it for this system to function.

### Options

This system includes a few options, and its options object can be found at the top of the script.  Note that some options, such as the `tryGlobal` option, are omitted; for these options, the script will use the options provided to `simple-inventory.js`.  The options object looks like this:

```javascript
setup.simpleInv.containers.options = {
	storyVar : 'containers',
	skipTags : ['skip', 'menu', 'widget']
};
```

#### `storyVar` option

This script defines a story variable to hold the passage's inventories.  By default, the name of the variable is `container` and can be accessed in the IDE with the identifier `$container`.  You can change the identifier used by changing this option.

#### `skipTags` option

You can prevent passages from being registered as containers by adding one of the tags included in this array literal.  By default, if you tag a passage with `menu`, `skip`, or `widget`, it won't be included.  Note that you really, really should tag all non-container passages; registering the passages as containers is a computationally expensive process, and can dramatically increase startup load times for your game.

### Macros

The following macros are included in this script:

#### `<<placeat>>` macro

**Syntax**:
`<<placeat (passage) (list of items)>>`

* passage: the name of a passage that is registered as a container.
* list of items: a list of items, provided as quoted strings, each seperated by a space.

**Explanation**:
This macro adds an item or a list of items to the indicated passage's inventory, and is the recommended method of placing items.  Your `StoryInit` special passage is the best place for these macros.

**Examples**:
```
<<placeat 'some passage' 'sword' 'rusty key'>>
<<placeat 'the temple' 'the book of life'>>
<<placeat 'bedroom' 'keys' 'cell phone' 'wallet' 'notebook'>>
```

#### `<<place>>` macro

**Syntax**:
`<<place (list of items)>>`

* list of items: a list of items, provided as quoted strings, each seperated by a space.

**Explanation**:
This macro adds an item or a list of items to the current passage's inventory.  The `<<place>>` macro has few important limitations, and it is generally recommended that you use the `<<palceat>>` macro unless you are certain you need this macro instead.

As for the limitations:  For one, this macro will not add duplicates--if an item with the same name exists in the passage's inventory, nothing happens.  Second, the item will only be added on the player's first visit to the passage.  Finally, the item is added to the inventory during the rendering process, meaning it won't actually be added in time for it to be displayed by `<<container>>` or `<<placelist>>`, unless you wrap them in `<<timed>>` macros or similar.

Generally speaking, this macro is best used as a part of interaction, such as in a link.

**Examples**:
```
<<place 'sword' 'rusty key'>>
<<place 'keys' 'cell phone' 'wallet' 'notebook'>>
```

#### `<<take>>` macro

**Syntax**:
`<<take (list of items)>>`

* list of items: a list of items, provided as quoted strings, each seperated by a space.

**Explanation**:
This macro removes an item or a list of items from the current passage's inventory.  Unlike `<<place>>`, there aren't really any problems to look out for here, just be sure to include it before you interact with the passage's inventory.

**Examples**:
```
The guards confiscated the weapons you left here!

<<take 'gun' 'sword' 'dagger'>>
```

```
There's some boards covering a hole in the floor.  

If you dropped something heavy on it, you may be able to break it open.

<<if psgInv.any('heavy rock') or $floorOpen>>\
	<<set $floorOpen to true>>\
	<<take 'heavy rock'>>\
	The boards break under the weight of the rock!
	
	[[Enter the hole.]]
<</if>>\

<<return>>
```

#### `<<takefrom>>` macro

**Syntax**:
`<<takefrom (passage) (list of items)>>`

* passage: the name of a passage that is registered as a container.
* list of items: a list of items, provided as quoted strings, each seperated by a space.

**Explanation**:
This macro removes an item or a list of items from the indicated passage's inventory.

**Examples**:
```
<<takefrom 'some passage' 'sword' 'rusty key'>>
<<takefrom 'the temple' 'the book of life'>>
<<takefrom 'bedroom' 'keys' 'cell phone' 'wallet' 'notebook'>>
```

#### `<<pickupfromplace>>` macro

**Syntax**:
`<<pickupfromplace (list of items)>>`

**Explanation**:
This macro works as a combination of `<<take>>` and `<<pickup>>`; it simultaneously removes the items from the current passage and adds the items to the player's inventory.  If an item can't be found in the passage, it is still added to the player's inventory, but it has no effect on the passage's inventory.

**Examples**:
```
<span id='item'>There's a sword on the ground.</span>

<<link 'Grab the sword'>>
	<<pickupfromplace 'sword'>>
	<<replace '#item'>>\
		There's nothing here...
	<</replace>>
<</link>>
```

#### `<<dropinplace>>` macro

**Syntax**:
`<<dropinplace (list of items)>>`

**Explanation**:
This macro works as a combination of `<<place>>` and `<<drop>>`; it simultaneously adds the items to the current passage and removes the items from the player's inventory.  If an item can't be found in the player's inventory, it is still added to the passage, but it has no effect on the player's inventory.

**Examples**:
```
<span id='item'>There's nothing here...</span>

<<link 'Drop the sword'>>
	<<dropinplace 'sword'>>
	<<replace '#item'>>\
		There's a sword on the ground.
	<</replace>>
<</link>>
```

#### `<<setcontainer>>` macro

**Syntax**:
`<<setcontainer (optional: passage)>>`

* passage: the name of a passage that is registered as a container.  If no passage is provided, this argument defaults to the previous passage.

**Explanation**:
Many of the macros use the current passage as a target for various actions.  For example, if, in your inventory menu, you inlcude the `<<dropinplace>>` macro, and dropped item will be added to the inventory menu's passage container, assuming it exists.  This is probably not what you want to have happen.  The `<<setcontainer>>` macro allows you to change this behavior for **all such macros** in a given passage--the passage indicated by the macro will act as the inventory for the current passage.  If you don't provide a passage name to the macro, it defaults to the previous passage, as provided by the `previous()` function.

Some important usage notes:
* You may only include **one** `<<setcontainer>>` macro in a single passage.  If more thatn one of these macros is found in the same passage, you will recieve an error.
* The target passage can be passed a function as an argument using the backtick syntax (see example) or a story variable, but if the passage doesn't exist or isn't registered as a container, it will return an error.
* Functions that default to the current passage, such as `psgInv.all()` (see below) are unaffected by this macro.
* **IMPORTANT!** You should include this macro before and other container system macros.  Generally, your safest bet is to make it the first macro in any passage where it is used.

**Examples**:
```
!!Inventory
<<setcontainer>><<droplist>>
```

```
<<setcontainer 'inside-well'>>\
<<has 'coin'>>
	Throw the coin down the well?

	<<link 'Yes'>>
		<<dropinplace 'coin'>>
	<</link>>

	[[No|previous()]]
<</has>>
```

#### `<<placelist>>` macro

**Syntax**:
`<<placelist (optional: separator)>>`

* separator: a string to separate each item in the inventory.

**Explanation**:
Creates a static list of the current passage's inventory and spearates each element with the indicated separator, or a comma and a space, if no separator is provided.

**Examples**:
```
/% 
	given a passage with the inventory ['keys', 'wallet', 'cell phone']
%/
<<placelist>> /% keys, wallet, cell phone %/
<<placelist '; '>> /% keys; wallet; cell phone %/
<<placelist '\n'>> 
/% 
	keys
	wallet 
	cell phone 
%/
```

#### `<<container>>` macro

**Syntax**:
`<<container (optional: separator)>>`

* separator: a string to separate each item in the inventory.

**Explanation**:
The `<<container>>` macro is similar in most ways to the `<<placelist>>` macro, except that each item in the list is a link that, when clicked, adds the item to the player's inventory and removes it from the current passage's inventory.  The link is removed after it's clicked.


#### `<<droplist>>` macro

**Syntax**:
`<<droplist>>`

**Explanation**:
The `<<droplist>>` macro displays the player's inventory, but includes a 'Drop' link appended to each item.  When clicked, the link causes the associated item to be removed from the player's inventory and added to the passage's inventory.  This macro is a good candidate for use with the `<<setcontainer>>` macro if you're using a separate passage to display the inventory, such as in the story menu.  Dropped items are removed immediately from the list.

**Examples**:
Creating a StoryMenu inventory:
```
::StoryMenu
[[Inventory]]

::Inventory
!!Inventory
<<setcontainer>><<droplist>>

<<return>>
```

Creating a footer-style inventory:
```
::PassageFooter
!!!Your Inventory:
<<droplist>>
```

### Functions

The following functions are included in this script:

#### `psgInv.all()` and `psgInv.any()` functions

**Syntax**:
```
psgInv.all('list', 'of', 'items')
psgInv.any('list', 'of', 'items')
```

**Explanation**:
These functions are similar to the `invAll()` and `invAny()` functions included in the simple inventory.  `psgInv.all()` returns true if all the items passed to the function are found in the current passage's inventory, and `psgInv.any()` returns true if any are found.  Both will return false on passages that aren't registered as containers, and neither of these functions is effected by the `<<setcontainer>>` macro's passage-bending wizardry.

You can use these functions to set up some interesting puzzles that require players to place certain sets of items in certain places.

**Examples**:
```
<<set $onFire to psgInv.all('matches', 'gas can')>>\
<<if $onFire>>\
	This passage is on fire!
<<else>>\
	There's nothing much going on here, but there is a lot of dry grass...
<</if>>\

<<return>>
	
```

### Pitfalls and Warnings

Here's a few things to keep in mind when you use this system:

* `<<place>>` may not work the way you think/want, so I recommend using `<<placeat>>` ninety percent of the time.
* As touched on earlier, registering passages as containers is expensive and will slow down your game.  To alleviate this, you should set the `Config.history.maxStates` setting as low as possible in your game (to 1, if at all possible), and make liberal use of the `skipTags` you define in the options object.  I can't stress this enough--you will encounter meaningfully longer load times and even potentially some slow down in lengthier games as the State history gets cluttered up with all these inventories at all these different moments.
* This system is complicated, and I tested it as much as I could within a reasonable time frame.  It's not something I'm going to be using in my own projects, at least not right away, so please report any errors or weirdness via the issue tracker.
* I would not recommend that you install this system just to have it or as a workaround to solve some other, simpler problem--that's why it's being added as an optional extension and not being featured as part of the complete collection.

-> [Thanks to @AccreditedDesign on the Twinery.org forums for the concept](https://twinery.org/forum/discussion/8961/twine-2-sugarcube-2-x-inventory-system-modifications#latest).