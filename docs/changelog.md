## Changelog

[Back to the main page](./README.md).

### January 22, 2021 (v2.7.1)

- **[Update]** Fixed the `:cycle-change` event so that it is now properly emitted.

### November 24, 2020 (v2.7.0)

- **[New]** Added the `<<disable>>` macro.
- **[Update]** Updated the meter macro set. Now has a `this.settings.id` property.

### August 2, 2020 (v2.6.1)

- **[Update]** Updated the event macro set.
  - Added `<<on>>`,`<<one>>`, and `<<off>>`. Deprecated `<<event>>`.
  - Support for single-use event handlers.
  - Added default namespaces.
  - Internal improvements.

### July 24, 2020 (v2.6.0)

- **[New]** New macros.
  - Added the preload macro for preloading images.
  - Added the popover macro for creating special transparent dialogs and splash screens.
- **[Meta]** Repository changes.
  - Overhauled build and code quality check processes.
  - Spun out demo project into its own repo.

### June 28, 2020 (v2.5.5)

- **[Update]** Updated `Cycle.check()` and `cycle#check()` to accept multiple phases to check.

### June 27, 2020 (v2.5.4)

- **[Update]** Added `Cycle.check()` and `cycle#check()` methods to the cycles system.
- **[Docs]** Added link to custom `typed.js` module code (from Thomas M. Edwards) to the speech box system docs.
- **[Meta]** Replaced Uglify with Terser for JS minification.

### March 31, 2020 (v2.5.3)

- **[Update]** Several improvements to the pronoun macros:
  - Additional verb support.
  - Manually setting pronouns from code, either via presets or otherwise, is now possible.
  - Added a set of templates for the common "to be" contractions like "he's" and "they're."
  - Thanks to AcademyOfFetishes on the Twine Discord server for suggestions, feedback, and implementation ideas.

### March 31, 2020 (v2.5.2)

- **[Retired]** Removed the fullscreen macros. 
  - As of v2.31.0, SugarCube 2 now has a [built-in `Fullscreen` API](http://www.motoslave.net/sugarcube/2/docs/#fullscreen-api).
- **[Update]** Added a synthetic event to the `<<import>>` macro, `:import-macro`, that fires when the data is finished loading, or when said loading fails.
- **[Docs]** Updated docs.
  - Removed the fullscreen macro docs and marked it as removed in the contents.
  - Added the `:import-macro` synthetic event to the file system macro docs.
- **[Demo]** Updated demo.
  - Removed fullscreen macro demo.
  - Updated to SugarCube v2.31.0.
  - Updated bundled macros.
- **[Meta]** Removed fullscreen macros from download utility.

### March 29, 2020 (v2.5.1)

- **[Update]** Fixed the `<<cont>>` macro so that expired event handlers are properly removed.
- **[Docs]** Typos and grammar fixes.

### January 23, 2020 (v2.5.0)

- **[New]** Added the Speech Box System.
- **[New]** Added the `<<cont>>` continue macro set.
- **[Demo]** Updated demo.
  - Added new scripts.
  - Fixed issues.
  - Updated `<<notify>>` example.
- **[Docs]** Added new scripts.
- **[Meta]** Added new scripts.

### January 22, 2020 (v2.4.1)

- **[Update]** Fixed bug in `<<notify>>` CSS time parsing.
- **[Demo]** Typos and grammar fixes.
- **[Docs]** Changed defunct Q&A links to point to Twine category at IntFiction.org.
- **[Docs]** Typos and grammar fixes.
- **[Meta]** Added missing scripts to download utility.

### Jul 16, 2019 (v2.4.0)

- **[Update]** The `<<dialog>>` macro now accepts an `<<onopen>>` and `<<onclose>>` macro tag to set up handlers. These tags set up single-use event handlers for the dialog open and close events.
- **[Update]** The `<<notify>>` macro now accepts CSS time in its `delay` argument and is paired with a function, `setup.notify()` for usage in JS, plus some additional cleanup.
- **[New]** Added the articles (a/an) macro set.
- **[Docs]** Removed the note about retirement from the `<<mouseover>>` macro.
- **[Docs]** Reorganized / grouped macros in the main readme.
- **[Demo]** Added new macros / updates to demo file.
- **[Meta]** Created a [downloading utility](./download ':ignore') that creates custom bundles and generates downloads for them.

### Jun 28, 2019 (v2.3.0)

- **[Update]** Simple Inventory:  
    - Refactored code base.  
    - The `setup` API is now at `setup.Inventory`. `setup.simpleInv.inventory` continues to exist for legacy code.  
    - Several other internal improvements.  
    - Sent more data to `<<linkedinventory>>` wrappers to allow easier live updates for receiving inventories.  
    - Several dozen small clean-ups and fixes.  
- **[Update]** Playtime System:  
    - Refactored code base.  
    - Internal improvements.  
- **[Update]** Operations API (dice and fairmath):  
    - Refactored code base.  
    - Dice functions now respect PRNG settings.  
    - Internal improvements.  
    - Added support for Fate/Fudge dice.  
- **[Update]** The Fullscreen Macros now toggle the fullscreen state and now include a little bit of a JavaScript API on the `setup` object.  
- **[Update]** Small fixes and internal improvements to several other macros.  
- **[New]** Added the CSS Macro.  
- **[New]** Added the Pronoun Templates system.  
- **[New]** Added the Meter Macro Set.  
- **[New]** Added the Cycles System (v2).  
- **[Demo]** Updated demo.  
    - Added examples for new macros.  
    - Cleanup and fixed typos.  
- **[Docs]** Updated docs.  
    - Clean up and fixed typos.  
    - Improved formatting.  
    - Improved and corrected many individual macro pages.  
    - Added docs for new macros / systems.

### May 26, 2019 (v2.2.3)

- **[Demo]** Added a demo for all the custom macros.  
- **[Docs]** These macros now have a dedicated website at: https://macros.twinelab.net/  
    - Added Google Analytics to the webpage.
    - Minor refactor / reformat of docs for the webpage.
- **[Docs]** Fixed the name of the Swap Macro Set docs.

### May 9, 2019 (v2.2.2)

- **[Update]** Fixed some macros to be `shadowWrapper`-aware; this allows said macros to work with the `<<capture>>` macro.  
    - The Message Macro was made `shadowWrapper`-aware.  
    - The Mouseover Macro was made `shadowWrapper`-aware.  
    - The Typesim Macro was made `shadowWrapper`-aware.

### Feb 15, 2019 (v2.2.1)

- **[Update]** Simple Inventory:  
    - Added the `inv#count()` and `inv#isEmpty()` instance methods.  
    - Fixed bug in `inv#pickUp()`/`<<pickup>>` where the `unique` keyword would occasionally fail.  
    - Fixed bug in the `<<newinventory>>` macro that caused adding items at initialization to error.

### Jan 13, 2019 (v2.2.0)

- **[New]** Added the UI Macro.  
- **[New]** Added the Swap Macro Set.  
- **[New]** Added the Mouseover Macro.

### Jul 22, 2018 (v2.1.0)

- **[Update]** Internal improvements to the First Macro suggested be TheMadExile.  
- **[Retired]** Removed the Dropdown macro.  
    - SugarCube 2 now comes with a `<<listbox>>` macro in its standard library.
- **[New]** Added the Done Macro, with improvements from TheMadExile.  
- **[Docs]** Started the Simple Inventory guide (incomplete).

### Jun 29, 2018 (v2.0.1)

- **[Update]** Several bug fixes to Simple Inventory.  
- **[Docs]** Fixed several typos, improved docs, cleanup.

### Jun 29, 2018 (v2.0.0)

- **[New]** Released v2.0.0 of the **Custom Macro Collection**.  
- **[Update]** Retired old macros. Now only available via a release.  
- **[Docs]** Rewrote / reorganized all documentation.