## The Cycles System

[Back to the main readme](./README.md).

A new fangled version of the cycles system for your time-keeping needs. The old cycles system was a mess, this one seeks to clean up some of its biggest problems, while also giving authors the ability to fine tune them even more. The core idea of the system remains largely similar, however.

> [!DANGER]
> This new version of the cycles system has undergone some major changes compared to the original implementation. It's a better macro set and system overall, but it is unfortunately **not compatible with code written for version 1.x of the system**.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/cycles.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/cycles.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=cycles).  
**GUIDE:** Not available.

### Macro: `<<newcycle>>`

**Syntax**: 
```
<<newcycle name [period] [increment] [suspend]>>
    <<phase phaseName [phaseName] ...>>
    [<<phase ...>>]
<</newcycle>>
```

The `<<newcycle>>` macro creates a new cycle instance. A cycle is a time-keeping mechanism that is based on passage transitions: each passage transition is one *turn*, and each turn adds `1` to the cycle's *stack* *by default*. The `period` of the `<<newcycle>>` macro is the interval at which the stack count causes the cycle to change one phase. The `increment` argument can be used to increase how much the stack is increased each **turn**. The `increment` is usually best left as `1`, so that each turn increments the stack by one, unless you have unusual needs. If the increment is `1`, you can think of the `period` as simply an interval of turns.  

The `suspend` keyword can be passed as a third argument to make the cycle start off *suspended*, meaning it won't automatically increase its stack right from the start. You can use the `<<phase>>` child tags to pass *phases* to the macro, which must be strings; things like `"morning"`, `"noon"`, and `"night"` or `"player turn"` and `"enemy turn"`. Each cycle must have at least two phases, and they should be provided in the order you want them to cycle. You can use any number of phases in a single `<<phase>>` tag, and any number of `<<phase>>` tags in the macro, so set it up however you want.

> [!NOTE]
> **About the stack, periods and increments**: First, try not to get to hung up on the term "stack." It helped me visualize what I was doing, and the term worked its way into the code, there's no special meaning there. For most cycles, one turn (that is, one passage transition) should add one to the stack. A period is simply the number of increases to the stack it should take for the cycle's phase to change, which, if the increment is `1`, is simply the same as the number of turns (passage transitions) it should take. 
>
>Note that **the period of a cycle is set in stone** once you create your cycle, so an additional system to alter the period was needed, hence increments. Increments can allow you to shorten your periods: for example, you can make each turn add two to the stack to shorten your periods by half. The stack, periods, and increments should always be whole numbers: if you feel like you'll want to decrease the period by one quarter, you'd want to have a higher increment and period to compensate (I'm sorry, but yes, this is fractions math--lowest common denominator, etc). 
>
>For example, if a period typically takes `4` turns and you want it to later take `3`, your period should be `12` and your increment `3`, then you can increase the increment to `4` later to *shorten* the turns it takes to change a phase from `4` to `3`. If this seems a bit confusing, that's okay; chances are you *won't* need to mess with the increment and can think of the period as the same as a number of turns.

> [!TIP]
> You need to define your cycles before using them. Your `StoryInit` special passage is the best place to do so.

> [!WARNING]
> Any text, code, or content in the `<<newcycle>>` macro, outside its tags, will be ignored and discarded.

**Arguments**:

- `name`: the name to give your cycle. Each cycle should have a unique name.
- `period`: (optional) a whole number greater than 0. Represents at what value the stack should be to change to the next phase. Defaults to `1`.
- `increment`: (optional) determines much single turn is increased the stack by. Most authors will want this to be `1`, and defaults to that.
- `suspend`: (optional) the keyword `suspend`. If included, the cycle will start suspended (that is, paused and unable to automatically collect stacks on each turn).
- `phaseName`: a name for each phase you want to be part of the cycle. Every time a cycle gains enough stacks to reach its period, the next phase starts. Once the last phase ends, the first starts again. Phases should be strings. You need to give each cycle *at least* two phases.

**Usage**:
```
/* create a cycle for time that changes phases every 4 turns */
<<newcycle 'time' 4>>
    <<phase 'morning' 'midday' 'evening' 'night'>>
<</newcycle>>

/* create a cycle for a turn-based game */
<<newcycle 'turns' 1 1 suspend>>
    <<phase 'player'>>
    <<phase 'enemy'>>
<</newcycle>>

/* another example, with period and increment set to give an effective period of 4 turns */
<<newcycle 'meals' 12 3>>
    <<phase 'breakfast' 'lunch' 'dinner'>>
<</newcycle>>

/* you can use multiple child tags and multiple phaseNames per child tag, the order will still be preserved */
<<newcycle 'dayss' 10>>
    <<phase 'Sunday' 'Monday'>>
    <<phase 'Tuesday' 'Wednesday'>>
    <<phase 'Thursday' 'Friday' 'Saturday'>>
<</newcycle>>
```

### Macro: `<<editcycle>>`

**Syntax**: `<<editcycle name actions>>`

This macro can be used to edit a cycle in a variety of ways, such as increasing or decreasing its stacks, altering its increment, resetting it, or changing it's suspended state.

**Arguments**:

- `name`: The name of a previously defined cycle, by the [`<<newcycle>>` macro](#macro-ltltnewcyclegtgt) or the [`Cycle` API](#javascript-api).
- `actions`: A list of actions to perform. Available actions are:
    - `suspend`: suspends (pauses) a cycle. A suspended cycle cannot increase its stack automatically on each turn. If the cycle is already suspended, has no effect.
    - `resume`: resumes a cycle that is suspended. If the cycle isn't suspended, has no effect.
    - `toggle`: toggles the suspended state of a cycle--that is, suspends it if it is running, resumes it if it is suspended.
    - `increment` *`number`*: sets the increment to the indicated value. Should be a whole number greater than 0.
    - `change` *`number`*: changes the cycle's stack count *by* (not *to*) the indicated number. Positive numbers are added to the stack count, negative numbers are subtracted from it (technically still added, but you get the idea).
    - `reset`: reset the cycle, setting the stack count to zero.

> [!WARNING]
> Passing opposing actions, like `suspend` and `resume` to the same `<<editcycle>>` macro will not throw any errors, but is still a bad idea and unlikely to produce the results you want.

**Usage**:
```
/* reset and suspend a cycle */
<<editcycle 'turns' reset suspend>>

/* change the increment of a cycle, then resume it to make sure it's running */
<<editcycle 'time' increment 2 resume>> /* essentially halves the cycle's period */

/* toggle a cycle */
<<editcycle 'days' toggle>>

/* reduce the stack of a cycle */
<<editcycle 'meals' change -4>>
```

### Macro : `<<showcycle>>`

**Syntax**: `<<showcycle name [formatOptions]>>`

Prints the current phase of the indicated cycle to the page. You can optionally format the casing of the cycle with the keywords `uppercase`, `lowercase`, and `upperfirst`.

**Arguments**:

- `name`: The name of a previously defined cycle, by the [`<<newcycle>>` macro](#macro-ltltnewcyclegtgt) or the [`Cycle` API](#javascript-api).
- `formatOptions`: (optional) any one of the keywords `uppercase`, `lowercase`, or `upperfirst`.

**Usage**:
```
/* show the day of the week */
<<showcycle 'days'>>

/* show the time of day, Capitalized */
<<showcycle 'time' upperfirst>>

/* show the meal, UPPERCASED */
<<showcycle 'meals' uppercase>>

/* show the day of the week, lowercased */
<<showcycle 'days' lowercase>>
```

### Passage Tag: `cycles.pause`

Any passage with the tag `cycles.pause` (configurable in the pretty script) will suspend all cycles on that passage; so tagged passages will not automatically add to any cycle's stack count. Useful for things like menus (but see below), startup passages, etc.

### Passage Tag: `cycles.pause.menu`

This tag has the same effect as the one above, but also causes the *next* passage to also be paused; this allows users to navigate to a passage and back (such as a menu) without gaining any cycle's stack count increasing. Consider the following:

```
somePassage -> menuPassage -> somePassage
```

In the above, navigating to the menu and back takes *two* turns. If you were to tag the `menuPassage` with the `cycles.pause` tag, the cycles wouldn't count up on the first transition (going into the menu), but still would when leaving that passage and returning to the same passage. By using the `cycles.pause.menu` tag instead, neither passage transition will count toward the cycles' stacks.

## JavaScript API

The JavaScript API exists at `setup.Cycle` and (if possible) globally at `window.Cycle`. Note that there isn't much you can do in this API that you can't just as easily in the macros.

### Static Methods

These are the static methods of the `Cycle` API.

Of particular note to authors:

- [`Cycle.add()`](#method-cycleadd)
- [`Cycle.get()`](#method-cycleget)

#### Method: `Cycle.add()`

**Returns**: a new `Cycle` instance.

**Syntax**: `Cycle.add(name, definition)`

Creates a new `Cycle` instance with the indicated definition, and saves it to your story's state with all the necessary plumbing.

**Arguments**:

- `name`: (*string*) the name to give your cycle. Each cycle should have a unique name.
- `definition`: (*object*) the definition object for the cycle. Definition objects have the following properties. See [the `<<newcycle>>` macro documentation](#macro-ltltnewcyclegtgt) for more information.
    - `phases`: (*string array*) an array of phases for to cycle through.
    - `period`: (*number*) (optional) a whole number greater than 0. Defaults to 1. The period determines how often the phase should change.
    - `increment`: (*number*) (optional) a whole number greater than 0. Defaults to 1. The increment determines how much the stack increases by on each turn. The cycle changes phases at an interval determined by the stack and the period.
    - `active`: (*boolean*) (optional) if false, the cycle will start suspended. Defaults to true.

**Usage**:
```javascript
Cycle.add('time', {
    phases : ['morning', 'midday', 'evening', 'night'],
    period : 4
});

Cycle.add('days', {
    phases : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    period : 10
});

Cycle.add('turns', {
    phases : ['player', 'enemy'],
    active : false
});
```

#### Method: `Cycle.is()`

**Returns**: boolean.

**Syntax**: `Cycle.is(thing)`

Returns whether the passed *thing* is a `Cycle` instance.

**Arguments**:

- `thing`: (*any*) anything

**Usage**:
```javascript
var a = [];
var m = new Map();
var c = Cycle.add('blah', { phases : ['hey', 'hello'] });

Cycle.is(a); // false
Cycle.is(m); // false
Cycle.is(c); // true
```

#### Method: `Cycle.has()`

**Returns**: boolean.

**Syntax**: `Cycle.has(name)`

Returns whether a cycle with the given name exists.

**Arguments**:

- `name`: The name of a previously defined cycle, by the [`<<newcycle>>` macro](#macro-ltltnewcyclegtgt) or the [`Cycle` API](#javascript-api).

**Usage**:
```
<<if Cycles.has('blah')>>
    <<newcycle 'blah'>>
        <<phase 'hey' 'hello'>>
    <</newcycle>>
<</if>>
```

#### Method: `Cycle.get()`

**Returns**: a `Cycle` instance or `null`.

**Syntax**: `Cycle.get(name)`

Returns the `Cycle` instance with the given name, or `null` if it doesn't exist.

**Arguments**:

- `name`: The name of a previously defined cycle, by the [`<<newcycle>>` macro](#macro-ltltnewcyclegtgt) or the [`Cycle` API](#javascript-api).

**Usage**:
```javascript
var cycle = Cycle.get('blah');
```

#### Method: `Cycle.del()`

**Returns**: boolean.

**Syntax**: `Cycle.del(name)`

Deletes a cycle with the given name. Returns `true` if the cycle exists and was successfully deleted.

**Arguments**:

- `name`: The name of a previously defined cycle, by the [`<<newcycle>>` macro](#macro-ltltnewcyclegtgt) or the [`Cycle` API](#javascript-api).

**Usage**:
```javascript
Cycle.add('blah', { phases : ['hey', 'hello'] });
Cycle.del('blah');
Cycle.get('blah'); // null
```

#### Method: `Cycle.clear()`

**Returns**: nothing.

**Syntax**: `Cycle.clear()`

Deletes all registered cycles.

**Usage**:
```javascript
Cycle.add('blah', { phases : ['hey', 'hello'] });
Cycle.clear();
Cycle.get('blah'); // null
```

### Instance Methods

These are the methods of the `Cycle` instance. Methods that return the `Cycle` instance they are called on are *chainable*. You can get a `Cycle` instance to work on by saving the return value of a `Cycle.add()` call to a variable, or by using `Cycle.get()` to grab a valid cycle.

Of particular note to authors:

- [`cycle#current()`](#method-cyclecurrent)
- [`cycle#update()`](#method-cycleupdate)

#### Method: `cycle#current()`

**Returns**: String (a phase).

**Syntax**: `<cycle>.current()`

Returns the cycle's current phase, which is a string pulled from the cycle's phases.

**Usage**:
```javascript
// returns the phase
Cycle.get('blah').current();
```
```
/* roughly equivalent to `<<showcycle 'blah' upperfirst>>` */
<<= Cycle.get('blah').current().toUpperFirst()>>
```

#### Method: `cycle#update()`

**Returns**: This instance (chainable).

**Syntax**: `<cycle>.update([by])`

Updates the cycle's stack *by* the indicated amount: positive values increase it, negative values decrease it. You can also call this method without passing a value to force the cycle to update itself (for example, if you changed the stack value in another way).

**Arguments**:

- `by` (*number*) (optional): the value to change the cycle's stack by.

**Usage**:
```javascript
// add 3 to the stack
Cycle.get('blah').update(3);

// subtract 3 to the stack
Cycle.get('blah').update(-3);

// set the stack by hand and force it to update
var cycle = Cycle.get('blah');
blah.stack = 0;
blah.update();
```

#### Method: `cycle#reset()`

**Returns**: This instance (chainable).

**Syntax**: `<cycle>.reset()`

Resets the cycle's stack to 0, and then calls the `cycle#update()` method. Roughly equivalent to `<<editcycle 'name' reset>>`.

**Usage**:
```javascript
// reset the cycle
Cycle.get('blah').reset();
```

#### Method: `cycle#suspend()`

**Returns**: This instance (chainable).

**Syntax**: `<cycle>.suspend()`

Suspends the cycle. Suspended cycles will not automatically increase its stack on each turn. Has no effect on already suspended cycles.

**Usage**:
```javascript
// suspend the cycle
Cycle.get('blah').suspend();
```

#### Method: `cycle#resume()`

**Returns**: This instance (chainable).

**Syntax**: `<cycle>.resume()`

Resume a suspended the cycle, so that it will begin automatically increasing its stack count again *on the next turn*. Has no effect on cycles that aren't suspended.

**Usage**:
```javascript
// resume the cycle
Cycle.get('blah').resume();
```

#### Method: `cycle#toggle()`

**Returns**: This instance (chainable).

**Syntax**: `<cycle>.toggle()`

Toggles the suspended state of the cycle: if it's suspended it will resume, if it isn't, it will be suspended.

**Usage**:
```javascript
// toggle the cycle
Cycle.get('blah').toggel();
```

#### Method: `cycle#isSuspended()`

**Returns**: Boolean.

**Syntax**: `<cycle>.isSuspended()`

Returns whether the cycle is currently suspended.

**Usage**:
```javascript
Cycle.get('blah').suspend();

Cycle.get('blah').isSuspended(); // true
```

#### Method: `cycle#editIncrement()`

**Returns**: Number (the `increment` value).

**Syntax**: `<cycle>.editIncrement([set])`

Gets and returns the cycle's increment. If passed a value, it will set the increment to that value as well.

**Arguments**:

- `set`: (*number*) (optional) a number to set the increment to.

**Usage**:
```javascript
// get the cycle's increment
var inc = Cycle.get('blah').editIncrement();
// set the cycle's increment, effectively halving its period
Cycle.get('blah').editIncrement(inc * 2);
```

#### Method: `cycle#length()`

**Returns**: Number.

**Syntax**: `<cycle>.length()`

Returns the *length* of the cycle, which is how high the stack needs to be to move once through all of the cycle's phases. Found by multiplying the cycle's `period` by the length of its `phases` array. For most situations, [`cycles#turnsTotal()`](#method-cycleturnstotal) is probably a more useful measurement.

**Usage**:
```javascript
Cycle.add('time', {
    phases : ['morning', 'midday', 'evening', 'night'],
    period : 12,
    increment : 3
});

Cycle.get('time').length(); // 48
```

#### Method: `cycle#turns()`

**Returns**: Number.

**Syntax**: `<cycle>.turns()`

Returns the how many turns it takes to move one phase, based on the current `period` and `increment`. Found by dividing the `period` by the `increment`.

**Usage**:
```javascript
Cycle.add('time', {
    phases : ['morning', 'midday', 'evening', 'night'],
    period : 12,
    increment : 3
});

Cycle.get('time').turns(); // 4
```

#### Method: `cycle#turnsTotal()`

**Returns**: Number.

**Syntax**: `<cycle>.turnsTotal()`

Returns the how many turns it takes to move once through all of the cycle's phases. Found by dividing the cycle's length by its `increment`.

**Usage**:
```javascript
Cycle.add('time', {
    phases : ['morning', 'midday', 'evening', 'night'],
    period : 12,
    increment : 3
});

Cycle.get('time').turnsTotal(); // 16
```

#### Method: `cycle#clone()`

**Returns**: A new `Cycle` instance.

**Syntax**: `<cycle>.clone()` or `clone(<cycle>)`

For SugarCube's state, save, and history system. May also be useful to authors. Creates a deep copy/clone of the cycle.

#### Method: `cycle#toJSON()`

**Returns**: A JSON serialized string.

**Syntax**: `<cycle>.toJSON()` or `JSON.stringify(<cycle>)`

For SugarCube's state, save, and history system.

### Instance Properties

`Cycle` instances have the following properties:

- `name` (*string*): the cycle's name.
- `stack` (*number*): the cycle's current *total* stack count since it's creation or the last time it was reset.
- `increment`: (*number*): the cycle's increment value.

> [!DANGER]
> There are other properties as well, but these undocumented properties **should not be changed** unless you're sure you know what you're doing--if you decide to change them, you may break the whole system. Particularly, changing the length of the `phases` array or the `period` is dangerous.

### Cycle Events

Cycles emit events at certain points which you can plug code into. Each event object has a `cycle` property that holds a reference to the `Cycle` instance that sent the event. The events are:

- `:cycle-change`: fires when a cycle's phase changes.
- `:cycle-reset`: fires when a cycle is reset. Restting a cycle may also fire a `:cycle-change` event.
- `:cycle-suspend`: fires when a cycle is suspended.
- `:cycle-resume`: fires when a suspended cycle is resumed.

**Usage**:
```javascript
$(document).on(':cycle-change', function (ev) {
    alert('The cycle "' + ev.cycle.name + '" has changed to phase "' + ev.cycle.current() + '".');
});

$(document).on(':cycle-suspend :cycle-resume', function (ev) {
    if (ev.cycle.name === 'time') {
        var what = ev.cycle.isSuspended() ? 'suspended' : 'resumed';
        console.log('The time cycle has been ' + what + '.');
    }
});

$(document).on(':cycle-reset', function (ev) {
    if (ev.cycle.name === 'turns') {
        // reset player and enemy HP after battle
        State.variables.playerHP = 100;
        State.variables.enemyHP = 100;
    }
});
```

## Other Usage Notes

**Configuration options**:

There are several configuration options near the top of the pretty script you can use to change some options, including the names used for the task object, story variable, and passage tag.

**Story variable warning**:

This script creates a story variable called `%%cycles`. You can change the name if you need to in the pretty script.

**Task object warning**:

This script creates a `postdisplay` tack object called `cycles.postdisplay`. You can change the name if you need to in the pretty script.

**Passage tag warning**:

This script assigns meaning to a passage tag called `cycles.pause`. You can change the name if you need to in the pretty script.