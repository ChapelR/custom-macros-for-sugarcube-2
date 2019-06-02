## Changelog

[Back to the main readme](./README.md).

?> I'm going to start keeping a changelog for these macros because keeping track of them is becoming a nightmare. The overall version numbers are not really helpful for tracking what's happening on a macro-by-macro basis, but I'm trying to stick to major version bumps meaning breaking changes in any macro, or complete refactors of the whole collection, like what v2.0.0 was. Minor version updates indicate new macros have been added. Patch version updates means individual macro updates and bug fixes, or documentation, website, or demo updates.

### DATE (v2.3.0)

- **[Update]** Simple Inventory:  
    - Refactored code base.  
    - The `setup` API is now at `setup.Inventory`. `setup.simpleInv.inventory` continues to exist for legacy code.  
    - Several other internal improvements.  
    - Sent more data to `<<linkedinventory>>` wrappers to allow easier live updates for receiving inventories.  
    - Several dozen small clean-ups and fixes.  
- **[Update]** Playtime System:  
    - Refactored code base.  
    - Internal improvements.  
- **[New]** CSS Macro.  
- **[New]** Pronoun templates system.  
- **[Demo]** Updated demo.  
    - Simple Inventory and Playtime updated to new versions.  
    - Added pronoun templates and CSS macro examples.  
    - Cleanup and fixed typos.  
- **[Docs]** Updated docs.  
    - Clean up and fixed typos.  
    - Improved and corrected Simple Inventory docs.  
    - Improved and corrected Playtime system docs.  
    - Added docs for CSS macro and Pronoun templates system.

### May 26, 2019 (v2.2.3)

- **[Demo]** Added a demo for all the custom macros.  
- **[Docs]** These macros now have a dedicated website at: https://macros.twinelab.net/  
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
- **[New]** Added the Done Macro, with improvements from TheMadExile.  
- **[Docs]** Started the Simple Inventory guide (incomplete).

### Jun 29, 2018 (v2.0.0)

- **[New]** Released v2.0.0 of the **Custom Macro Collection**.  
- **[Update]** Retired old macros. Now only available via a release.  
- **[Docs]** Rewrote / reorganized all documentation.