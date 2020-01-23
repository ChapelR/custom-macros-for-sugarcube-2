## Changelog

[Back to the main readme](./README.md).

> [!NOTE]
> I'm going to start keeping a changelog for these macros because keeping track of them is becoming a nightmare. The overall version numbers are not really helpful for tracking what's happening on a macro-by-macro basis, but I'm trying to stick to major version bumps meaning breaking changes in any macro, or complete refactors of the whole collection, like what v2.0.0 was. Minor version updates indicate new macros have been added. Patch version updates means individual macro updates and bug fixes, or documentation, website, or demo updates.

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