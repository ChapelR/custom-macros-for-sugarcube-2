## The Fading Macro Set

[Back to the main readme](./README.md).

A simple macro set that causes the text between its tags to fade in or out over a period of time specified by the user, with an optional delay. Nothing crazy, but a feature I see requested frequently.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/fading-macro-set.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/fading-macro-set.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=fading).  
**GUIDE:** Not available.

### Macro: `<<fadein>>`

**Syntax**:`<<fadein animationLength  [delay]>> <</fadein>>`

The `<<fadein>>` macro causes the content between its tags to fade in (shocking).  You can delay the animation (and should if you're using SugarCube's default transitions) and set the length of the animation.  Both values must be expressed using [CSS time values](https://developer.mozilla.org/en-US/docs/Web/CSS/time).  Note that only *output* is delayed by this macro; code will still execute on passage load, meaning it shouldn't be used in the same way as `<<timed>>`, but it can be paired with `<<timed>>` to achieve that sort of effect.

**Arguments**:

 * **animationLength**: The length of the fading animation.  Should be a valid CSS time (e.g. 5s, 500ms, etc).
 * **delay**: (optional) The delay, in seconds, to wait out before the animation starts.  Should be a valid CSS time (e.g. 5s, 500ms, etc).


**Usage**:
```
<<fadein 10s>>Fade me in over the course of ten seconds.<</fadein>>

<<fadein 500ms 200ms>>Fade me in over half a second, but give the passage transition a moment to finish.<</fadein>>

<<fadein 200ms 20s>>Hide the way [[forward]] for 20 seconds...<</fadein>>
```

### Macro: `<<fadeout>>`

**Syntax**:`<<fadeout animationLength [delay]>> <</fadeout>>`

The `<<fadeout>>` macro causes its content to fade out.  You can delay the animation (and should if you're using SugarCube's default transitions) and set the length of the animation.  Both values must be expressed using [CSS time values](https://developer.mozilla.org/en-US/docs/Web/CSS/time).  Content will not re-flow once the content is faded out.

**Arguments**:

 * **animationLength**: The length of the fading animation.  Should be a valid CSS time (e.g. 5s, 500ms, etc).
 * **delay**: (optional) The delay, in seconds, to wait out before the animation starts.  Should be a valid CSS time (e.g. 5s, 500ms, etc).

**Usage**:
```
<<fadeout 10s>>Fade me out over the course of ten seconds.<</fadeout>>

<<fadeout 4s 200ms>>Fade me out over four seconds, but give the passage transition a moment to finish.<</fadeout>>

<<fadeout 2s 20s>>This text will begin to disappear after 20 seconds...read fast!<</fadeout>>
```

## Other usages notes:

Both macros may be used together to fade content in and then out, or out and back in:

```
<<fadein 1s 3s>>\
	<<fadeout 1s 6s>>\
		And this content uses both macros.  Spooky!\
	<</fadeout>>\
<</fadein>>
```