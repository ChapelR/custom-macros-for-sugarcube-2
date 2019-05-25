## The Swap Macro Set

[Back to the main readme](./README.md).

A macro that lets users "swap" arbitrary text by clicking on one set of text and then another. You can also reset the text to its initial state, and run arbitrary code when certain texts are swapped. You know what, here's an example of what I mean:

![Swap it!](https://i.imgur.com/XBB1oRr.gif)

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/swap-macro-set.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/swap-macro-set.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=swap).  
**GUIDE:** Not available.

### Macro: `<<swap>>`

**Syntax**:`<<swap>>[content]<<onswap>>[code]<</swap>>`

The `<<swap>>` macro denotes some text that can be swapped. It is *highly* recommended that you only use plain text without macros or markup. While *some* things will work, I can't test everything, and enough things will break that I can't recommend doing anything other than plain text if you can avoid it. All swappable text on the current passage can be swapped with each other. You can optionally add a `<<onswap>>` tag after the swappable text, the code in here is run any time the swappable text is swapped. You can use the function `swapCurrent()` (also available as `setup.swap.current()`) inside the `<<onswap>>` tag to return the currenty swapped in text--this function only works inside the `<<onswap>>` tag, outside of it it will be `undefined` and return an error (think of it as being *scoped* into the `<<onswap>>` block, though the truth is far uglier).

**Usage**:
```
/% simple example %/
He picked up the <<swap>>picture<</swap>> the victim kept on the nightstand, next to the <<swap>>alarm clock<</swap>>. The <<swap>>pillow<</swap>> on the bed was cocked at an odd angle--the <<swap>>blanket<</swap>> was on the floor.

/% example using <<onswap>> %/
<<set _catsPred to 'They meow constantly.'>>\
I <<swap>>own<<onswap>>
    <<if swapCurrent() is 'love'>>
        <<set _catsPred to 'I wish I had more.'>>
     <<else>>
        <<set _catsPred to 'They meow constantly.'>>
    <</if>>
    <<replace '#catsPred'>>_catsPred<</replace>>
<</swap>> cats. <span id="catsPred">_catsPred</span> I <<swap>>love<</swap>> dogs. I <<swap>>hate<</swap>> birds, though.

/% a puzzle %/
<<set _correct to [false, false, false]>>\
Enter the code:

<<swap>>1<<onswap>>
    <<if swapCurrent() is '3'>>
        <<set _correct[0] to true>>
    <<else>>
        <<set _correct[0] to false>>
    <</if>>
<</swap>>
<<swap>>2<<onswap>>
    <<if swapCurrent() is '1'>>
        <<set _correct[1] to true>>
    <<else>>
        <<set _correct[1] to false>>
    <</if>>
<</swap>>
<<swap>>3<<onswap>>
    <<if swapCurrent() is '2'>>
        <<set _correct[2] to true>>
    <<else>>
        <<set _correct[2] to false>>
    <</if>>
<</swap>>

<span id="solved">\
    @@#not-right;@@

    <<button "Try the combination...">>
        <<if not _correct.includes(false)>>
            <<replace '#solved'>>[[You got it!|next passage]]<</replace>>
       <<else>>
            <<replace '#not-right'>>No, that's not it...<</replace>>
        <</if>>
    <</button>>

    <<resetswap 'Start Over'>>\
</span>
```

### Macro: `<<resetswap>>`

**Syntax**:`<<resetswap [linktext]>>`

The `<<resetswap>>` macro creates a button (or optionally a link) that, when clicked, resets all the swappable elements on the page back to the way they were initially.

**Arguments**:

 * **linktext**: (optional) the text of the link. if omitted, the button or link will be labeled `Reset`

**Usage**:
```
<<resetswap>>

<<resetswap 'Try Again'>>
```


### Function: `swapCurrent()`

This function only works from inside the `<<onswap>>` block of the `<<swap>>` macro, **using it anywhere else will result in an error**. It returns the current text content of it's parent `<<swap>>` macro, and can be used in `<<if>>` statements and similar to test the current swapped in value.

You can use this information to create puzzles, run arbitrary code, or even just fix some grammar issues with a/an or verb conjugation.

See above for some examples.

## Additional Usage Notes

**Styling Options**:

Swappable content is given the class `.swappable` for CSS styling. Selected elements have the selector `.swappable[data-swap-flag="true"]` to style the 'clicked' appearance.

**Configuration**:

You can alter the colors scheme of swappables, whether `<<resetswap>>` creates a button or link, and whether the `swapCurrent()` function is made global using the configuration options at the top of the script.  See the unminified script for more info.