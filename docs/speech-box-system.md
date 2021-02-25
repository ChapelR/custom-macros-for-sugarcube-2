## The Speech Box System

[Back to the main readme](./README.md).

This set of macros, styles, and functions can be used to quickly generate simple speech boxes for character dialogue with a place for portraits, names, and text. Simply associate characters with image sources in your `StoryInit` passage or story JavaScript and the script will generate purpose-built macros at runtime, or you can supply character names and image sources to the `<<say>>` macro in any given passage for on-the-fly characters.

![Speech box example](https://i.imgur.com/CkI3K8Q.png)

The default look and styling is very bare bones, and meant to be a basic starting point. It is highly recommended you add your own styles to make the speech boxes better match your game. You can, of course, use them as-is if you want to, though.

> [!NOTE]
> Unlike most of my macros, this code relies on CSS files as well as JavaScript! Be sure to download and install the relevant CSS files as well!

> [!WARNING]
> If you want to use this system with the `typed.js` integration module, you'll need to use this custom JavaScript in place of that provided by the module: https://gist.github.com/tmedwards/4921bdcd7bfbb955530c135ee3feff83

**THE CODE:** [Minified JS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/speech.min.js). [Pretty JS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/speech.js). [Minified CSS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/speech.min.css). [Pretty CSS](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/speech.css).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=speech).  
**GUIDE:** Not available.

### Macro: `<<character>>`

**Syntax**:`<<character name [displayname] imageSrc>>`

This macro associates a character name, which will automatically become a macro, with an image resourcem provided as a URL (can be relative or absolute). This macro is essentially a macro factory&mdash;it creates other macros based on the arguments you pass. This means that the `name` argument must therefore follow the parameters of normal macros: it must not contain spaces or special characters outside what macro names ordiarily allow. If you need character names without these limitations, you can use the `<<say>>` macro (see below). 

> [!DANGER]
> This macro will only function if run *before* the story starts, that is before the first passage is loaded. The `StoryInit` special passage is therefore the best place to define characters.

**Arguments**:

- `name`: a character name that can be used as a macro name. This is used to create a macro, and to fill in the name area on the generated speech box. The latter will be automatically capitalized, so if you pass `"lisa"`, the generated macro will be `<<lisa>>` and the name in the speech box will display as `Lisa`. If you pass `"Lisa"`, the name in the speech box will appear `Lisa`, but the macro will be `<<Lisa>>`.
- `displayname` (optional) : if provided, will be displayed instead of the `name` in the speech box heading. This allows for naming such as `???` or `Maxine Delacroix`, which would otherwise be invalid due to being unable to be used as macro names.
- `imageSrc`: a URL to an image resource to be used as a character portrait. Portraits should generally be taller than they are wide, as the name suggests, though squares will work fine. Large images will be shrunk to a reasonable size, butvery  small images will not be enlarged to fit and may not look right.

**Usage**:

```
/* creating characters and associating them with images (goes in StoryInit) */
<<character 'lisa' 'images/portraits/lisa.jpg'>>
<<character 'bob' 'https://some.website.net/url/to/an/image_file.png'>>
<<character 'billy' 'data:image/jpg;base64, [base64 encoded data]'>>
<<character 'maxine' '???' 'images/portraits/unkown-person.jpg'>>

/* using the generated macros in passages */
<<lisa>>Hey there!<</lisa>>

<<maxine>>Do i know you?<</maxine>>

<<billy>>You just use the name you passed into the {{{<<character>>}}} macro as its own macro to create speech boxes!<</billy>>
```

### Macro: `<<say>>`

**Syntax**:`<<say name [imageSrc]>>...<</say>>`

This macro can be used to create speech boxes that aren't based on predefined characters, allowing you to use names that would be unsuitable as macro names, use bit characters that aren't worth defining, or change a character's name or image, or use characters that don't have associated images.

**Arguments**:

- `name`: a character name that can be used in the text box.
- `imageSrc`: (optional) a URL to an image resource to be used as a character portrait.

**Usage**:

```
<<say 'Lisa' 'images/portraits/lisa.jpg'>>Hey there!<</say>>

/* without an image */
<<say 'Some Guy'>>You n'wah!<</say>>
```

### Function: `setup.addCharacter()`

**Syntax**: `setup.addCharacter(name, [displayname,] imageSrc)`

This function serves the same purpose as the `<<character>>` macro, and creates macros in the exact same way.

**Returns**: nothing.

**Arguments**:

- `name` ( *`string`* ) a character name that can be used as a macro name. This is used to create a macro, and to fill in the name area on the generated speech box. The latter will be automatically capitalized, so if you pass `"lisa"`, the generated macro will be `<<lisa>>` and the name in the speech box will display as `Lisa`. If you pass `"Lisa"`, the name in the speech box will appear `Lisa`, but the macro will be `<<Lisa>>`.
- `displayname` ( *`string`* ) optional name that gets displayed, takes priority over the above mentioned `name` argument, but if not provided it will take `name` argument instead, allows for using special characters such as `???` or `Firstname Surname` display without having to name the macro firstnameLastname and then resulting in `FirstnameLastname`.
- `imageSrc` ( *`string`* ) a URL to an image resource to be used as a character portrait. Portraits should generally be taller than they are wide, as the name suggests, though squares will work fine. Large images will be shrunk to a reasonable size, butvery  small images will not be enlarged to fit and may not look right.

**Usage**:

```javascript
var $speechBox = setup.say('#passages', 'Lisa', 'Hey there!', 'images/portraits/lisa.jpg');
```

### Function: `setup.say()`

**Syntax**: `setup.say(outputElement, name [, content] [, imageSrc])`

This function is roughly equivalent to the `<<say>>` macro, and can be used to create speech boxes from arguments in a similar way, and then append the box to the indicated output element.

**Returns**: A reference to the jQuery-wrapped speech box element.

**Arguments**:

- `outputElement` ( *`string` | `jQuery object` | `HTMLElement object`* ) an output element for the speech box to be appended to.
- `name` ( *`string`* ) a character name that can be used in the text box.
- `content` ( *`string`* ) (optional) the content or dialogue lines that should go in the speech box.
- `imageSrc` ( *`string`* ) (optional) a URL to an image resource to be used as a character portrait. Note: if you want to exclude content but include an image, pass an empty string in as the `content` argument.

**Usage**:

```javascript
var $speechBox = setup.say('#passages', 'Lisa', 'Hey there!', 'images/portraits/lisa.jpg');
```

### Other usage notes:

**Styling options**

The generated HTML structure of the speech box element looks something like this:

```html
<div class="say">
    <img src="[imageSrc]">
    <p>[Name]</p>
    <p>[Content]</p>
</div>
```

The `.say` `<div>` is also given a class based on the slugified name given to the `<<say>>` or generated macro, so you can use per-character styles.

Selectors you may want to target:

- `.say`: the container and outer element.
- `.say img`: the portrait.
- `.say p:first-of-type`: the name text.
- `.say p:last-of-type`: the dialogue content text.