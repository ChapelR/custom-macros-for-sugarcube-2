## The CSS Macro

[Back to the main readme](./README.md).

This macro allows you to change a target element's styles.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/css-macro.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/css-macro.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=css).  
**GUIDE:** Not available.

### Macro: `<<css>>`

**Syntax**:`<<css selector styleRules>>`

This macro is used to target a specific element on the page and alter it's CSS. 

> [!DANGER]
> Note that, in general, using CSS classes and the `<<addclass>>` macro and its siblings makes more sense, and is typically recommended over using this macro--this macro can be seen as a brute-force method.  

> [!WARNING]
> This macro should be considered a **DOM macro**, meaning the same rules that apply to macros like `<<replace>>` also apply to this one--see the usage notes below for more.

**Arguments**:    
- `selector`: a CSS/jQuery selector representing an element on the page.  
- `styleRules`: either a single generic JavaScript object containing CSS properties and values, or a list of CSS property / value pairs passed as a space-separated list of strings.

**Examples**:
```
@@#hello; HI THERE @@

<<link 'change now'>>
    <<css '#hello' 'color' 'pink' 'test-style' 'underline' 'font-size' '0.8rem'>>
<</link>>

<span id='change-me'>CHANGE ME!</span>
<<set _styles to {
    'display' : 'block',
    'background-color' : 'red',
    'color' : 'white'
}>>
<<done>> /* `<<done>>` is a custom macro in this collection, not a default SugarCube macro */
    <<css '#change-me' _styles>>
<</done>>
```

### Other usage notes:

**DOM Macro warning**:

From [the SugarCube docs](http://www.motoslave.net/sugarcube/2/docs/#macros-dom):  

> **WARNING**: All DOM macros require the elements to be manipulated to be on the page. As a consequence, you cannot use them directly within a passage to modify elements within said passage, since the elements they are targeting are still rendering and not yet on the page. You must, generally, use them with a interactive macro (e.g. `<<link>>`) or within the `PassageDone` special passage. Elements which are already part of the page, on the other hand, present no issues.