## The Preload Macro

[Back to the main readme](./README.md).

This macro allows you to preload image resources.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/preload.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/preload.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=preload).  
**GUIDE:** Not available.

### Macro: `<<preload>>`

**Syntax:** `<<preload urls>>`

This macro will preload a list of image resources so that they will be available and not have to take time to download as they are encountered during play. In general, only important or necessary images should be preloaded, and because the process of preloading merely moves the downloads to startup rather than eliminating them, preloading too many images or extremely large images can cause startup times to become excessive.  Still, judicious use of this macro can help a game feel snappier and more performant.

> [!DANGER]
> The `<<preload>>` macro will throw an error if used outside of the `StoryInit` special passage (or equivalent). If you absolutely need to preload at some other time, set `setup.preload.force` to `true`. This is not recommended, and only included as an option for bizarre use-cases.

**Arguments:**

- `urls` ( *`string`* | *`string array`* ) A list of URL paths to image resources to preload. You may pass individual URLs as separate arguments, or as an array, or as any combination of the two.

**Usage:**

```
<<preload 'assets/lisa/jpg' 'assets/bob.jgp'>>

/* you can also provide the arguments as an array if you prefer */
<<preload `['assets/lisa/jpg', 'assets/bob.jgp']`>>
```

### Function: `setup.preload()`

**Syntax:** `setup.preload(urls)`

This function does exactly the same thing as `<<preload>>` and is subject to the exact same restrictions.

**Arguments:**

- `urls` ( *`string`* | *`string array`* ) A list of URL paths to image resources to preload. You may pass individual URLs as separate arguments, or as an array, or as any combination of the two.

**Usage:**

```
setup.preload('assets/lisa/jpg', 'assets/bob.jgp');

// you can also provide the arguments as an array if you prefer
setup.preload(['assets/lisa/jpg', 'assets/bob.jgp'])
```
