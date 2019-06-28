## Dice Roller and Fairmath Functions

[Back to the main readme](./README.md).

This is a bunch of functions and methods for performing some useful number- or math-based operations.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/operations.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/operations.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=dice).  
**GUIDE:** Not available.

### Function: `dice()`

**Syntax**:`dice(diceNotation)` or `dice(numberOfDice, sidesOfDice)`

A function for rolling dice.  The dice to be rolled can be provided as a string of dice notation (i.e. `1d6 + 10`, `4d4-1`, `1d20`), or as sperate arguments (`3d6` becomes `dice(3, 6)`, for example).  This funciton is global, but if it's unavailable, it can be found on the `setup` object under `setup.dice.roll()`.

* **diceNotation**: a string representing dice notation (`'1d6'`, `'6d8'`, `'4d20+8'`, `'3dF'`, etc).
* **numberOfDice**: the number of dice to roll.
* **sidesOfDice**: the sides of each rolled die, or the string `'F'`, for Fate/Fudge dice.

**Usage**:
```
/% each <<set>> macro below rolls three six-sided dice and adds to (3d6+2) %/

<<set _roll to dice('3d6+2')>>
<<set _roll to dice('3d6') + 2>>
<<set _roll to dice(3, 6) + 2>>
```

### Method: `Number.prototype.dice()` and `Number.prototype.d()`

**Syntax**:`<numberOfDice>.dice(sidesOfDice)` or `<numberOfDice>.d(sidesOfDice)`

Similar to the `dice()` function, this is another way to roll dice, and exists on the `Number` prototype, meaning it can be called directly on numbers.  `<number>.d()` and `<number>.dice()` do the same thing and can be used interchangeably.

* **numberOfDice**: the number of dice to roll.
* **sidesOfDice**: the sides of each rolled die, or the string `'F'`, for Fate/Fudge dice.

**Usage**:
```
/% each <<set>> macro below rolls three six-sided dice and adds two (3d6+2) %/
<<set _sides to 6, _num to 3>>

<<set _roll to (3).d(6) + 2>>
<<set _roll to _num.d(6) + 2>>
<<set _roll to (3).dice(_sides) + 2>>
<<set _roll to _num.dice(_sides) + 2>>
```

### Method: `Number.prototype.fairmath()` and `Number.prototype.fm()`

**Syntax**:`<value>.fairmath(change)` or `<value>.fm(change)`

Read more on what fairmath is [here](http://choicescriptdev.wikia.com/wiki/Arithmetic_operators#Fairmath). Basically, a number is changed in a percentile way, and the lower its value, the greater the effect of adding to it, and vice versa, etc.

* **value**: the base value to apply a fairmath change to.
* **change**: the number to add or subtract from the base value.

**Usage**:
```
<<set $stat to 90>>
<<set $otherStat to 50>>
<<set $otherOtherStat to 10>>

<<set $stat to $stat.fm(20)>>
<<set $otherStat to $otherStat.fairmath(20)>>
<<set $otherOtherStat to $otherOtherStat.fairmath(-20)>>

<<= $stat>> /% 92 %/
<<= $otherStat>> /% 60 %/
<<= $otherOtherStat>> /% 8 %/
```

### Method: `Math.fairmath()` and `Math.fm()`

**Syntax**:`Math.farimath(value, change)` or `Math.fm(value, change)`

The same as `<number>.fairmath()` above, but on the `Math` object, which you may or may not prefer.

* **value**: the base value to apply a fairmath change to.
* **change**: the number to add or subtract from the base value.

**Usage**:
```
<<set $stat to 90>>
<<set $otherStat to 50>>
<<set $otherStat to 10>>

<<set $stat to Math.fm($stat, -20)>>
<<set $otherStat to Math.fairmath($otherStat, -20)>>
<<set $otherOtherStat to Math.fairmath($otherOtherStat, 20)>>

<<= $stat>> /% 72 %/
<<= $otherStat>> /% 40 %/
<<= $otherOtherStat>> /% 28 %/
```

## Other usage notes:

**Configuration options**:

There are some configuration options you can mess with if you know what you're doing.  Take a look at the unminified script for more.
