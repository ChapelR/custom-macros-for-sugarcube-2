## The Meter Macro Set

[Back to the main readme](./README.md).

A set of macros and JavaScript APIs for creating and working with dynamic, animated meters. Useful for creating things like health bars, progress meters, and visual timers.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/meters.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/meters.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=meters).  
**GUIDE:** Coming soon.

### Macro: `<<newmeter>>`

**Syntax**: 
```
<<newmeter name [value]>>
    ... optional child tags (see below) ...
<</newmeter>>
```

The `<<newmeter>>` macro can be used to create a new meter instance. You must provide a name for the meter, in quotes, and can optionally pass a starting value (between `0` and `1`, inclusive) for the meter. You can configure a number of other meter options using the optional child tags `<<metercolors>>`, `<<metersizing>>`, and `<<meteranimation>>`. You do not have to include any of the child tags.

Each `<<newmeter>>` macro call defines a set of attributes that the meter will use, and allows the meter system to reference and alter the meter's value and animate it. **Each meter profile should be unique on the page**; if you want to create a health bar meter for both enemy health and player health and the configurations are largely the same, for example, you will still need to create two different meters via the `<<newmeter>>` macro to show them on the same passage / page.

> [!DANGER]
> You should define your meters before using them, and you should **always** do so in your `StoryInit` special passage. Meters are **not** stateful, thus you *must* to define them here (or in your Story JavaScript via the API) or they won't work across browser refreshes and saved games.

> [!WARNING]
> Any other code or text in the `<<newmeter>>` macro, other than its child tags, will have no effect, and will simply be discarded.

**Arguments**:

- `name`: a string name to save the meter profile to.   
- `value`: (optional) a value for the meter to start at, must be a number between `0` and `1` (inclusive). Defaults to `1`.

#### Child tag: `<<metercolors>>`

**Syntax**: 
```
<<newmeter ...>>
    <<metercolors full [empty] [backing]>>
<</newmeter>>
```

The `<<metercolors>>` child tag can be used to configure the color scheme of the meter, and should be valid CSS color values. If only the `full` color is provided, or if `full` and `empty` are the same, the meter will appear as a single color, regardless of its value. On the other hand, if both a `full` and `empty` value are provided, the meter will blend the colors as its value changes. The `backing` argument controls the color for the empty portions outside the meter.

**Arguments**:

- `full`: the color of the meter itself. If an `empty` value is also provided, this represents the color the meter should be when completely full. Accepts any valid CSS color value.  
- `empty`: (optional) the color the meter should be when completely empty (it won't be visible, obviously, but this color is blended with full according to the value of the meter). Accepts any valid CSS color value.  
- `backing`: (optional) the color of the empty portions outside the meter. Accepts any valid CSS color value.

#### Child tag: `<<metersizing>>`

**Syntax**: 
```
<<newmeter ...>>
    <<metersizing width [height]>>
<</newmeter>>
```

The `<<metersizing>>` child tag can be used to determine the width and height of the meter. These values can be in any valid CSS size units, like `px`, `em`, `%`, `vw`, etc.

**Arguments**:

- `width`: the width you want the meter to be. Can be any valid CSS size value.  
- `height`: (optional) the height you want the meter to be. Can be any valid CSS size value.

#### Child tag: `<<meteranimation>>`

**Syntax**: 
```
<<newmeter ...>>
    <<meteranimation timeOrFalse [easing]>>
<</newmeter>>
```

The `<<meteranimation>>` child tag can be used to configure the timing and easing of meter animations for whenever meters are updated. By default, the animation lasts `400ms` and is eased with jQuery's "swing" easing.

**Arguments**:

- `timeOrFalse`: assign to a valid CSS time (e.g. `250ms` or `1s`) or `false` to shut off the animations.  
- `easing`: (optional) the type of easing to apply, must be either the keyword `swing` or `linear`.

----

#### Child tag: `<<meterlabel>>`

**Syntax**: 
```
<<newmeter ...>>
    <<meterlabel labelText [textColor] [alignment]>>
<</newmeter>>
```

The `<<meterlabel>>` child tag can be used to configure label for your meter which can include TwineScript values, like `$health`.

> [!TIP]
> Any time a meter is animated, the string content of the `labelText` is reprocessed, meaning variables and the like will be dynamically updated.

**Arguments**:

- `labelText`: the text of the label. Can include TwineScript; eg `"HP: $health"` is a valid value, and the variable will be parsed and its value will be interpolated.  
- `textColor`: (optional) the color of the text label text, which will be displayed inside the meter. Accepts any valid CSS color value.  
- `alignment`: (optional) can be any one of the keywords `center`, `right`, or `left`.

----

#### Examples for `<<newmeter>>` and its child tags:

```
/* setting up a meter for player health */
<<newmeter 'healthBar'>>
    <<meteranimation 300ms>>
    <<metercolors 'yellow' 'red' 'black'>>
    <<meterlabel '$health' 'black' center>>
<</newmeter>>

/* setting up an experience bar */
<<newmeter 'xpBar' 0>>
    <<meteranimation false>>
    <<metersize '100%'>>
<</newmeter>>

/* setting up a timer meter */
<<newmeter 'timer' 0>>
    <<meteranimation 10s linear>>
<</newmeter>>
```

### Macro: `<<showmeter>>`

**Syntax**: `<<showmeter name [value]>>`

Renders the indicated meter into the passage, optionally setting the value. If you set the value, the meter will animate to that value after rendering.

**Arguments**:

- `name`: the name of a Meter created via the `Meter` API or the `<<newmeter>>` macro.  
- `value`: (optional) a value to set the meter to, must be a number between `0` and `1` (inclusive).

**Usage**:
```
/* render the player's health bar */
<<showmeter '$healthBar' `$health / $maxHealth`>>

/* render the experience meter */
<<set _xp to $exp / $neededForNextLevel>>
<<showmeter '$xpBar' _xp>>

/* create a timer meter */
Given the following in StoryInit:
<<newmeter '_tenSeconds' 0>>
    <<meteranimation 10s linear>>
<</newmeter>>

In passage:
You have ten seconds until the bomb explodes...

<<showmeter '_tenSeconds' 1>>

<<timed 10s>>BOOM!<</timed>>
```

### Macro: `<<updatemeter>>`

**Syntax**: `<<updatemeter name value>>`

Changes the value of a meter; if the meter is on the page, it will be automatically changed, with an animation, depending on how the meter was set up

**Arguments**:

- `name`: the name of a Meter created via the `Meter` API or the `<<newmeter>>` macro.  
- `value`: (optional) a value to set the meter to, must be a number between `0` and `1` (inclusive).

**Usage**:
```
Given the follwing in StoryInit:
<<newmeter '$healthBar'>><<meterlabel '$health'>><</newmeter>>
<<newmeter '$xpBar'>><</newmeter>>

/* change the player's health */
<<set $health to 23, $maxHealth to 130>>\
<<showmeter '$healthBar' `$health / $maxHealth`>>

<<link 'take a potion'>>
    <<set $health to Math.clamp($health + random(20, 35), 0, $maxHealth)>>
    <<updatemeter '$healthBar' `$health / $maxHealth`>>
<</link>>

<<link 'take damage'>>
    <<set $health to Math.clamp($health - random(10, 25), 0, $maxHealth)>>
    <<updatemeter '$healthBar' `$health / $maxHealth`>>
<</link>>
    

/* gain some experience */
<<show '$xpBar'>>

You earned 100xp!
<<set $xp += 100>>
<<set _xp to $xp / $neededForNextLevel>>
<<updatemeter '$xpBar' _xp>>
```

## JavaScript API

The following are all methods of the `Meter` API, which is available on the `setup` and (if possible) the global `window` objects. Meters created via the API and meters created via the `<<newmeter>>` macro are exactly the same--you can use the JavaScript APIs and the meter macros to interact with any meter, no matter how it was created.

### Static Methods

#### Method: `Meter.add()`

**Returns**: A new `Meter` instance.

**Syntax**: `Meter.add(name [, options] [, value])`

Functionally the same as the `<<newmeter>>` macro and its child tags, this method creates a new meter instance with a given name. Unlike the macro version and its tags, you just need to pass a flat object of options (see below) to configure the meter's settings.

**Arguments**:

- `name`: a string name to save the meter instance as.  
- `options`: (optional) you can use this to edit the options of the meter; which overwrite the default settings.  
- `value`: (optional) a value for the meter to start at, must be a number between `0` and `1` (inclusive). Defaults to `1`.

The default settings you can overwrite with you options object looks like this:
```javascript
{
    full    : "#2ECC40", // color when the meter is full
    empty   : "#FF4136", // color when the meter is empty
    back    : "#DDDDDD", // color of the backing
    height  : "10px",    // overall height of the meter
    width   : "180px",   // overall width of the meter
    animate : 400,       // animation time in ms
    easing  : "swing",   // the animation easing
    label   : "",        // the text (including TwineScript expressions) to display in the label
    text    : "#111111", // the text color for the label
    align   : "center"   // the text alignment for the label
}
```

**Usage**:
```javascript
Meter.add('healthBar', {}, 1);

Meter.add('timer', { animate : 10000 }, 0);

Meter.add('xpBar');
````

#### Method: `Meter.is()`

**Returns**: Boolean.

**Syntax**: `Meter.is(thing)`

Tests if the passed *thing* is an instance of the `Meter` constructor.

**Arguments**:

- `thing`: anything.

**Usage**:
```javascript
var d = new Date();
var a = [];
var s = 'hi';
var m = Meter.add('blah');

Meter.is(d); // false
Meter.is(a); // false
Meter.is(s); // false
Meter.is(m); // true
```

#### Method: `Meter.has()`

**Returns**: Boolean.

**Syntax**: `Meter.has(name)`

Tests if a meter with the given name exists.

**Arguments**:

- `name`: a meter name

**Usage**:
```javascript
if (!Meter.has('blah')) {
    Meter.add('blah');
}
```

#### Method: `Meter.get()`

**Returns**: A meter instance.

**Syntax**: `Meter.get(name)`

Returns the meter instance with the given name, or `null`, if it doesn't exist.

**Arguments**:

- `name`: a meter name

**Usage**:
```javascript
var blah = Meter.get('blah');
```

#### Method: `Meter.del()`

**Returns**: Boolean.

**Syntax**: `Meter.has(name)`

If a meter with the given name exists, it is deleted.

**Arguments**:

- `name`: a meter name

**Usage**:
```javascript
Meter.add('blah');
Meter.has('blah'); // true
Meter.del('blah');
Meter.has('blah'); // false
```

### Instance Methods

These instance methods can be used on any meter instance. The easiest way to get the meter instance is with a `Meter.get()` call, but you can also save the return value of the `Meter.add()` call to a variable and use that.

```javascript
var meter = Meter.add('myMeter', {}, 0.6);

meter.val(); // 0.6
Meter.get('myMeter').val(); // 0.6
```

The below code will generally use `Meter.get()`, but you don't have to, nor is it necessarily the recommended way, since you'll save yourself a lot of calls by assigning a the instance to a variable.

#### Method: `meter#animate()`

**Returns**: This instance (chainable).

**Syntax**: `<meter>.animate()`

Causes the meter to animate according to its settings after a new value has been set.

> [!NOTE]
> As part of the animation process, the meter's label text is reprocessed, meaning dynamic content, like variables, can be used in labels and will update with the meter.

**Usage**:
```javascript
Meter.get('blah').value = 0.8;
Meter.get('blah').animate();
```

#### Method: `meter#val()`

**Returns**: The meter's value.

**Syntax**: `<meter>.val([value])`

Sets or returns the meter's value. If you set the meter's value with this method, it is instantly updated and automatically animated if possible.

**Arguments**:

- `value`: (optional) a value to set the meter to, must be a number between `0` and `1` (inclusive).

**Usage**:
```javascript
Meter.add('blah', {}, 0.4);
Meter.get('blah').val(); // 0.4
Meter.get('blah').val(0.1); // sets the meter to 0.1, and returns 0.1
```

#### Method: `meter#settings()`

**Returns**: The meter's settings object.

**Syntax**: `<meter>.settings([options])`

Sets or returns the meter's settings

> [!TIP]
> This method can be used to change a meter's colors, animations, or other properties after it's been created.

**Arguments**:

- `options`: (optional) an object of settings to change. 

**Usage**:
```javascript
Meter.get('blah').settings(); // returns the settings of the meter 
Meter.get('blah').settings({ animate : 1000 }); // changes the meter's `animate` setting, and returns the settings object

if (Meter.get('blah').settings().animate < 500) {
    // do something if the meter's animation time is less than half a second
}
```

#### Method: `meter#place()`

**Returns**: This instance (chainable).

**Syntax**: `<meter>.place(target)`

Places the meter on the page in the `target` element.

**Arguments**:

- `target`: a jQuery selector string, a jQuery obect, or an HTMLElement object to place the meter in.

**Usage**:
```javascript
Meter.get('blah').place('#some-element');
```

### Instance Properties

Instances of `Meter` have the following properties:

- `$element`: the jQuery object representing the entire meter element.
- `value`: the current value of the meter, which is a number between `0` and `1` (inclusive).

### Events

The meter's animations trigger two events you can plug into, should you need to. These are triggered on the meter's element (`<meter>.$element`) but should bubble up to the document for you to catch. The event object is given a `meter` property that represents the `Meter` instance that sent the event. The events are:


- `:meter-animation-start`: sent as the animation on any meter starts.  
- `:meter-animation-complete`: sent after animation on any meter finishes.

#### Usage:

```javascript
Meter.add('healthBar');

Meter.get('healthBar').$element.on(':meter-animation-start', function () {
    alert('Your health has changed.');
});
```

The JavaScript above could also be adapted to work with TwineScript:

```
<<newmeter 'healthBar'>><</newmeter>>
<<script>>
   Meter.get('healthBar').$element.on(':meter-animation-start', function () {
        alert('Your health has changed.');
    });
<</script>>
```

## Other usage notes

**Configuration options**:

You can alter whether the system attempts to make the `Meter` constuctor global at the top of the un-minified script. You can also change the default settings meters are created with just below the options--use this so you can spend less time configuring your meters.

**HTML Structure**:

The HTML structure of the generated meter looks like this:  
```html
<div class='chapel-meter' data-val='value*' data-label='label*'> <!-- the wrapper element -->
    <div class='meter-bottom'> <!-- holds the 'empty' meter -->
        <div class='meter-top'></div> <!-- holds the 'full' meter -->
        <div class='meter-label'>label*</div> <!-- holds the label -->
    </div>
</div>
```

\* Filled in by the appropriate property of the meter instance.

**Styling options**:

You can adjust some meter styles via CSS using the above HTML structure. The styles set via the meter's configuration are applied via jQuery on the element itself, and cannot be easily overridden without liberal use of the `!important` rule.