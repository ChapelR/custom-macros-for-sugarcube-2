## The Simple Inventory (v2.x) Guide

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

This is a guide for the simple inventory system (v2.0.0 and later).  This guide is intended to get you started with the system fast, by presenting some common use-cases and exploring certain features in plain English.  However, you should still familiarize yourself with the documentation, as not all functionality or use-cases will be covered here.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/simple-inventory.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/simple-inventory.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**DOCUMENTATION:** [Available](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/docs/simple-inventory.md).

## Contents

 * [Overview](#overview)
   * [Macros](#macros)
   * [Functions and methods](#functions-and-methods)
   * [Events](#events)
 * [Setting up an inventory](#setting-up-an-inventory)
 * [Manipulating an inventory](#manipulating-an-inventory)
 * [Testing an inventory for items](#testing-an-inventory-for-items)
 * [Displaying an inventory](#displaying-an-inventory)
 * [Multiple inventories](#multiple-inventories)

## Overview

The following is a brief list of all the macros, functions, methods, and other components included in the simple inventory system.  For a more detailed look, check out the complete documentation.

### Macros

 * `<<newinventory variableName [itemList]>>`: Creates a new inventory and stores a reference to it in the provided $variable, which must be quoted.  You can optionally provide a list of items to add to the inventory.  Your `StoryInit` special passage is the best place for these macros.  You must create an inventory and assign it to a variable to use it with the other macros and methods.
 * `<<pickup variableName [unique] itemList>>`: Use this macro to add items to the indicated inventory.  That inventory must have been previously setup using `<<newinventory>>` or similar.  You must provide at least one item, and can provide as many as you want.  If you start the list of items with the keyword `unique`, only items that are not currently in the inventory will be added to the inventory.
 * `<<drop variableName itemList>>`: Removes items from a previously declared inventory.  If an item in the **itemList** cannot be found in the inventory, it will be ignored.
 * `<<dropall variableName>>` and `<<clear variableName>>`: Removes all the items from the indicated inventory, emptying it.
 * `<<transfer variableName variableName itemList>>`: Removes the indicated items from the first inventory and adds them to the second.  If an item can't be found in the first inventory, it will be ignored and **not** added to the second inventory.
 * `<<sort variableName>>`: Sorts the indicated inventory alphanumerically.  The default ordering (chronological) cannot easily be restored.
 * `<<inventory [separator]>>`: Displays the inventory in list form, separated by the indicated string or by the default string if no arguments are provided.
 * `<<linkedinventory actionName variableName [variableName]>>`: Creates a list similar to `<<inventory>>`, but all items are separated by a newline and paired with a link.  You can name the link with the **actionName** argument.  If one inventory variable is provided to the macro, clicking the link drops the associated item.  If to inventories are provided to the macro, clicking the link transfers the associated item to the second inventory.

### Functions and Methods

 * `new Inventory([itemList])`: Creates a new inventory like `<<newinventory>>`.  Can be stored to a variable: `<<set $inventory to new Inventory()>>`.
 * `Inventory.is(variableName)`: Returns true if the passed variable is an inventory instance, false otherwise.
 * `Inventory.log(variableName)`: Logs the contents of the inventory in question to the console for debugging.  Also returns a string containing the same information that can be printed.
 * `Inventory.removeDuplicates(variableName)`: Returns an array that contains the items in the indicated inventory, but with all repeated items removed.  Can be used to enforce uniqueness.
 * `<inventory>.pickUp([unique], itemList)`: Similar to `<<pickup>>`.  Chainable.
 * `<inventory>.drop(itemList)`: Similar to `<<drop>>`.  Chainable.
 * `<inventory>.empty()`: Similar to `<<dropall>>` and `<<clear>>`.  Chainable.
 * `<inventory>.transfer(variableName, itemList)`: Similar to `<<transfer>>`.  Chainable.
 * `<inventory>.has(itemList)`: Returns true if **any** of the provided items were found in the inventory.
 * `<inventory>.hasAll(itemList)`: Returns true if **all** of the provided items were found in the inventory.
 * `<inventory>.toArray()`: Returns a reference to the inventory's contents, as an array.  Alterations to this array will be reflected in the inventory.
 * `<inventory>.sort()`: Similar to `<<sort>>`.  Chainable.
 * `<inventory>.show([separator])`: Returns a string list of the inventory's contents, similar to `<<inventory>>`.

### Events

One of two events is triggered in relation to the inventories:

 * `:inventory-init`: This event is fired whenever a new inventory is created.
 * `:inventory-update`: This event is fired whenever an inventory is updated, but only after it has been created.
 
Both of these events are sent to the handler with the following information you can use:

 * `<event>.instance`: A reference to the calling instance.  In transfers, that's the giving inventory.
 * `<event>.receiving`: A reference to the receiving instance, if it exists (i.e. in `<<transfer>>` and `<<linkedinventory>>` calls), or `null`.
 * `<event>.moved`: An array of items that have been moved into or out of the calling inventory, or null if nothing was moved (for example, if items the player doesn't have were dropped, or a `<<sort>>` was used).
 * `<event>.context`: The context of the event: it's always one of the following strings:
   * `'pickup'`: Some type of pickup action ocurred.  Does not fire on items added with `<<newinventory>>` or similar.
   * `'drop'`: Some type of drop action occured.  Emptying or clearing the inventory also cause this context.
   * `'transfer'`: A transfer between two inventories occured.
   * `'initialized'`: A new inventory was created.  If items were also added, they'll be in the `<event>.moved` property.
   * `'sort'`: The inventory was sorted.

## Setting up an inventory

Before you do anything else, you need to setup the inventory or inventories you want to use.  For starters, we'll create a player inventory and call it `$inventory`.  This inventory should start with no items; in other words, the player doesn't have anything at the start of the game.  While we can do this in JavaScript using the `Inventory()` constuctor function, we'll focus on the macros in this guide.

```
<<newinventory '$inventory'>>
``` 

The above code sets the story variable `$inventory` to a new *instance* of an `Inventory`.  This is similar to how we setup arrays and objects for use; in order to start treating the variable like an inventory we have to initialize it to be an inventory.

Although we're using a different macro call, you should think of this as initializing a variable, and the best place to do that is in your `StoryInit` special passage.

Once an inventory is initialized, we can use it with the other macros and methods.

**Warning**.  Failing to initalize an inventory and then using a simple inventory macro or method on it will cause an error.  You should always, always initialize your variables, but this is especially critical for an inventory.

## Manipulating an inventory.

Now that we've created an inventory for the player, we can start to manipulate it.  The most common actions you'll want to take with the inventory is to add and remove items from it. To add items, you'll use the `<<pickup>>` macro:

```
<<pickup '$inventory' 'a hammer'>>
<<inventory '$inventory'>>
```

Our inventory will now include `a hammer`, and when we print it with `<<inventory>>`, we'll now see it:

```
OUTPUT:
a hammer
```

If you were to add another `a hammer`, it **will not** stack them or ignore the duplicate by default, instead, a new hammer is added.

```
<<pickup '$inventory' 'a hammer', 'a wrench'>>
<<inventory '$inventory'>>
```
```
OUTPUT:
a hammer
a hammer
a wrench
```

This may be counter to your expectations, so be wary.

However, we can get around this using a variety of methods. Let's say that you want the hammers to stack, and show `2 hammers`. In this case, we can use an *inventory event* to catch the second hammer before it joins our inventory.

```javascript
$(document).on(':invetory-update', function (ev) {
    if (ev.context === 'pickup') {
        if (ev.instance.has('a hammer') && ev.moved.includes('a hammer')) {
            var arr = Inventory.removeDuplicates(ev.instance);
            ev.instance.empty().pickUp(arr);
            ev.instance.drop('a hammer');
            ev.instance.pickUp('2 hammers');
        }
    }
});
```

As you can see, this is a labor-intensive and difficult process. This inventory system is designed for key-type items, not stackable inventories. The more items you wish to allow to stack, the more complicated and messy this becomes. I *highly* recommend using a different system altogether if stackable items are important to your game.

If you instead want the player to only be able to carry a single item of each name in the inventory at a time, i.e., the player can only have one hammer at a time, this is much simpler to achieve.

```
<<pickup '$inventory' unique 'a hammer', 'a wrench'>>
<<inventory '$inventory'>>
```
```
OUTPUT:
a hammer
a wrench
```

In the above example, if they player already has either a hammer or a wrench, then they won't get duplicates of these items.

If you need to remove duplicates *later* or only when displaying the inventory, you may instead wish to use the `Inventory.removeDuplicates()` method. 

```
<<set _items to Inventory.removeDuplicates('$inventory')>>
```

This creates an **array** of item names made from the inventory's item list that doesn't include any duplicates. It does not edit the inventory you pass to it, but you can have it do that.

```
<<= _items.join(', ')>> /% prints a list with duplicates removed %/
<<dropall '$inventory'>><<pickup '$inventory' _items>> /% removes all duplicates from an inventory %/
```

Generally, if you need uniqueness, it's best to handle that via `<<pickup>>` macros rather than after the fact, but there are some reasons to do the latter.

-----

To remove items from an inventory, the `<<drop>>` macro will remove an item, and the `<<dropall>>` macro will completely empty the inventory.

```
<<drop '$inventory' 'a hammer'>>
```

Note that if the inventory has duplicates, `<<drop>>` will only remove one instance of each item, but it's possible to call it with several items in a row to remove multiples.

```
<<drop '$inventory' 'a hammer' 'a hammer' 'a hammer'>>
```

If the item(s) requested for the drop isn't in the inventory, nothing at all happens, and no errors are reported. Do to this, you generally want to check the inventory before `<<drop>>`ing; for example, if the player needs to use a key and then lose it, a common construction will probably look more like this:

```
There's a door leading into the castle here.

<<if hasVisited('inside') || $inventory.has('rusty key')>>\
    <<link [[Go into the castle.|inside]]>>
        <<drop '$inventory' 'rusty key'>>
    <</link>>\
<<else>>\
    The door's rusted lock won't budge.\
<</if>>\

[[Leave.|previous()]]
```

The above construction will let the player unlock the door if they have a key or if they've already been past the door (under the assumption the key is required for that).  It's possible to get more granular than this, reporting different messages based on whether the door was already unlocked or not:

```
There's a door leading into the castle here.

<<if hasVisited('inside')>>\
    The door is open a bit.

    [[Go into the castle.|inside]]\
<<elseif  $inventory.has('rusty key')>>\
    You believe you've found the key.

    <<link [[Unlock the gate.|inside]]>>
        <<drop '$inventory' 'rusty key'>>
    <</link>>\
<<else>>\
    The door's rusted lock won't budge.\
<</if>>\

[[Leave.|previous()]]
```

Clearing the entire inventory is probably suitably rare.

## Testing an inventory for items

The `has()` and `hasAll()` methods are used to test the inventory for items.

```
<<if $inventory.has('tree branch')>>
    You have a tree branch!
<</if>>
```

When checking for a single item, the `has()` method is recommended.  When you want to check for a collection of items, you can use either `has()` or `hasAll()` depending on your needs; the former returns `true` if *any* of the requested items are in the inventory,  while the latter only returns `true` if *all* of the requested items are found in the inventory.

```
<<if $inventory.hasAll('kindling', 'match')>>
    You can start a fire!
<</if>>

<<if $inventory.has('camera', 'smart phone')>>
    You can take a picture!
<</if>>
```

## Displaying an inventory

Descr.

## Multiple inventories

Descr.