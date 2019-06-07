## The Bars Macro Set

[Back to the main readme](./README.md).

A set of macros and JavaScript APIs for creating and working with dynamic, animated bars. Useful for creating things like health bars, progress bars, and visual timers.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/bars.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/bars.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=bars).  
**GUIDE:** Coming soon.

### Macro: `<<newbar>>`

**Syntax**: 
```
<<newbar variableName [value]>>
    ... optional child tags (see below) ...
<</newbar>>
```

The `<<newbar>>` macro can be used to create a new bar instance and save it to a story variable. You must provide a variable for the bar to be saved to, in quotes, and can optionally pass a starting value (between `0` and `1`) for the bar. You can configure a number of other bar options using the optional child tags `<<barcolors>>`, `<<barsizing>>`, and `<<baranimation>>`. You should define your bars before using them, but you don't need to do so in `StoryInit`; in some cases it may be better not to. You can get rid of bars you don't need anymore with the `<<unset>>` macro.

**Arguments**:

- `variableName`: a valid TwineScript variable name, passed to the macro in quotes.  
- `value`: (optional) a value for the bar to start at, must be a number between `0` and `1` (inclusive). Defaults to `1`.

#### Child tag: `<<barcolors>>`

**Syntax**: 
```
<<newbar ...>>
    <<barcolors full [empty] [backing]>>
<</newbar>>
```

The `<<barcolors>>` child tag can be used to configure the color scheme of the bar, and should be valid CSS color values. If only the `full` color is provided, or if `full` and `empty` are the same, the bar will appear as a single color, regardless of its value. On the other hand, if both a `full` and `empty` value are provided, the bar will blend the colors as its value changes. The `backing` argument controls the color for the empty portions outside the bar.

**Arguments**:

- `full`: the color of the bar itself. If an `empty` value is also provided, this represents the color the bar should be when completely full. Accepts any valid CSS color value.  
- `empty`: (optional) the color the bar should be when completely empty (it won't be visible, obviously, but this color is blended with full according to the value of the bar). Accepts any valid CSS color value.  
- `backing`: (optional) the color of the empty portions outside the bar. Accepts any valid CSS color value.

#### Child tag: `<<barsizing>>`

**Syntax**: 
```
<<newbar ...>>
    <<barsizing width [height]>>
<</newbar>>
```

The `<<barsizing>>` child tag can be used to determine the width and height of the bar. These values can be in any valid CSS size units, like `px`, `em`, `%`, `vw`, etc.

**Arguments**:

- `width`: the width you want the bar to be. Can be any valid CSS size value.  
- `height`: (optional) the height you want the bar to be. Can be any valid CSS size value.

#### Child tag: `<<baranimation>>`

**Syntax**: 
```
<<newbar ...>>
    <<baranimation timeOrFalse [easing]>>
<</newbar>>
```

The `<<baranimation>>` child tag can be used to configure the timing and easing of bar animations for whenever bars are updated. By default, the animation lasts `400ms` and is eased with jQuery's "swing" easing.

**Arguments**:

- `timeOrFalse`: assign to a valid CSS time (e.g. `250ms` or `1s`) or `false` to shut off the animations.  
- `easing`: (optional) the type of easing to apply, must be either the keyword `swing` or `linear`.

----

#### Examples for `<<newbar>>` and its child tags:

```
/* setting up a bar for player health */
<<newbar '$healthBar'>>
    <<baranimation 300ms>>
    <<barcolors 'yellow' 'red' 'black'>>
<</newbar>>

/* setting up an experience bar */
<<newbar '$xpBar' 0>>
    <<baranimation false>>
    <<barsize '100%'>>
<</newbar>>

/* setting up a timer bar */
<<newbar '$tenSeconds' 0>>
    <<baranimation 10s linear>>
<</newbar>>
```

### Macro: `<<showbar>>`

**Syntax**: `<<showbar variableName [value]>>`

Renders the indicated bar into the passage, optionally setting the value. If you set the value, the bar will animate to that value after rendering.

**Arguments**:

- `variableName`: a valid TwineScript variable name, passed to the macro in quotes.  
- `value`: (optional) a value to set the bar to, must be a number between `0` and `1` (inclusive).

**Usage**:
```
/* render the player's health bar */
<<showbar '$healthBar' `$health / $maxHealth`>>

/* render the experience bar */
<<set _xp to $exp / $neededForNextLevel>>
<<showbar '$xpBar' _xp>>

/* create a timer bar */
<<silently>>
    <<newbar '_tenSeconds' 0>>
        <<baranimation 10s linear>>
    <</newbar>>
<</silently>>\
You have ten seconds until the bomb explodes...

<<showbar '_tenSeconds' 1>>

<<timed 10s>>BOOM!<</timed>>
```

### Macro: `<<updatebar>>`

**Syntax**: `<<updatebar variableName value>>`

Changes the value of a bar; if the bar is on the page, it will be automatically changed, with an animation, depending on how the bar was set up

**Arguments**:

- `variableName`: a valid TwineScript variable name, passed to the macro in quotes.  
- `value`: (optional) a value to set the bar to, must be a number between `0` and `1` (inclusive).

**Usage**:
```
/* change the player's health */
<<set $health to 10, $maxHealth to 100>>\
<<showbar '$healthBar' `$health / $maxHealth`>>

<<link 'take a potion'>>
    <<set $health to Math.clamp($health + 35, 0, $maxHealth)>>
    <<updatebat '$healthBar' `$health / $maxHealth`>>
<</link>>
    

/* gain some experience */
<<show '$xpBar'>>

You earned 100xp!
<<set $xp += 100>>
<<set _xp to $xp / $neededForNextLevel>>
<<update '$xpBar' _xp>>
```

### Constructor: `Bar()`

**Returns**: A new `Bar` instance.

**Syntax**: `Bar([options] [, value])`

Underlying the macros is a constructor called `Bar()` which is exposed to user code via `setup.Bar()` and (if possible) `window.Bar()`. You can use this constructor to create bars from within JavaScript.

**Arguments**:

- `options`: (optional) you can use this to edit the options of the bar; which overwrite the default settings.  
- `value`: (optional) a value for the bar to start at, must be a number between `0` and `1` (inclusive). Defaults to `1`.

The default settings you can overwrite with you options object looks like this:
```
{
    full    : '#2ECC40', // color when the bar is full
    empty   : '#FF4136', // color when the bar is empty
    back    : '#DDDDDD', // color of the backing
    height  : '10px',    // overall height of the bar
    width   : '180px',   // overall width of the bar
    animate : 400,       // animation time in ms
    easing  : 'swing'    // the animation easing
};
```

**Usage**:
```javascript
var bar = new Bar({
    full : 'purple',
    empty : '#222',
    backing : '#eee'
}, 1);

var otherBar = new setup.Bar({}, 0.5);
````

### Static Methods

#### Method: `Bar.is()`

**Returns**: Boolean.

**Syntax**: `Bar.is(thing)`

Tests if the passed *thing* is an instance of the Bar constructor.

**Arguments**:

- `thing`: anything.

**Usage**:
```javascript
var d = new Date();
var a = [];
var s = 'hi';
var b = new Bar();

Bar.is(d); // false
Bar.is(a); // false
Bar.is(s); // false
Bar.is(b); // true
```

### Instance Methods

#### Method: `bar#animate()`

**Returns**: This instance (chainable).

**Syntax**: `<bar>.animate()`

Causes the bar to animate according to its settings after a new value has been set.

**Usage**:
```javascript
bar.value = 0.8;
bar.animate();
```

#### Method: `bar#val()`

**Returns**: The bar's value.

**Syntax**: `<bar>.val([value])`

Sets or returns the bar's value. If you set the bar's value with this method, it is instantly updated and automatically animated if possible.

**Arguments**:

- `value`: (optional) a value to set the bar to, must be a number between `0` and `1` (inclusive).

**Usage**:
```javascript
var b = new Bar({}, 0.4);

b.val(); // 0.4
b.val(0.1); // sets the bar to 0.1, and returns 0.1
```

#### Method: `bar#settings()`

**Returns**: The bar's settings object.

**Syntax**: `<bar>.settings([options])`

Sets or returns the bar's settings.

**Arguments**:

- `options`: (optional) an object of settings to change. 

**Usage**:
```javascript
bar.settings(); // returns the settings of the bar 
bar.settings({ animate : 1000 }); // changes the bar's `animate` setting, and returns the settings object
```

#### Method: `bar#place()`

**Returns**: This instance (chainable).

**Syntax**: `<bar>.place(target)`

Places the bar on the page in the `target` element.

**Arguments**:

- `target`: a jQuery selector string, a jQuery obect, or an HTMLElement object to place the bar in.

**Usage**:
```javascript
bar.place('#some-element'); // returns the settings of the bar 
```

### Instance Properties

Instances of `Bar` have the following properties:

- `$element`: the jQuery object representing the entire bar element.
- `value`: the current value of the bar, which is a number between `0` and `1` (inclusive).