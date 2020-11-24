## The Articles (A/An) Macro Set

[Back to the main readme](./README.md).

Attempts to prepend the correct indefinite article (e.g., 'a' or 'an') based on the indicated word or phrase. Many times over more complicated than simply checking if the first letter is a vowel, this macro will correctly assign fairly complicated cases, like "a UFO", "an X", "an hour", "a European", and "a horror", among others. For edge cases, users can also set up overrides to force the system to identify certain words or phrases as requiring one article or the other.

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/articles.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/articles.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=articles).  
**GUIDE:** Not available.

### Macros: `<<a>>`, `<<an>>`, `<<A>>`, and `<<An>>`

**Syntax**:
```
<<a text>>
<<an text>>
<<A text>>
<<An text>>
```

This macro attempts to take the following text and prepend it with the appropriate indefinite article. If the macro name is capitalized, e.g. `<<A>>` or `<<An>>` the indefinite article that is generated will be capitalized in the output. There is functionally no difference between `<<a>>` and `<<an>>` and between `<<A>>` and `<<An>>`, they are included simply to feel better to write based on what you're writing.

> [!TIP]
> The parser used by this macro contains a lengthy list of common special cases and a series of pretty intricate rules for how it determines whether to use 'a' or 'an', there will be exceptions and strange cases it can't account for. For those cases, you will want to use [overrides](#macro-ltltsetarticlegtgt)

**Argument**:
- `text` a string of text, can be a word or a bunch or words.

**Examples**:
```
<<set _adjective to either('steel', 'adamantium', 'stone', 'iron', 'bronze', 'iridium');

You found <<a _adjective>> sword!

<<An _adjective>> sword fell off the cart.
```

### Macro: `<<setarticle>>`

**Syntax**: `<<setarticle article text [caseSensitive]>>`

This macro adds an *override* to the `<<a>>`-style macros, allowing you to assign certain words or phrases to use a specific article every time. You can optionally make the override case-sensitive, so that only phrases that match the *exact* case of the provided text are overridden.

> [!DANGER]
> This macro will only work in your `StoryInit` special passage. Overrides must be set up before the story begins. Failure to call this macro in the `StoryInit` special passage or earlier will throw an error.

**Arguments**:
- `article` the string `'a'` or the string `'an'`&mdash;the article to set the provided text to use.
- `text` a string of text, can be a word or a bunch or words, to assign an article.
- `caseSensitive` if a third argument is provided and truth-y, the text will only be overridden if it matches the exact case of the override.

**Examples**:
```
/* add the word 'US' (case-sensitive) and assign it the article 'a' */
<<setarticle 'a' 'US' true>>
<<a 'US'>> citizen /* -> 'a US citizen' */
<<a 'un'>>-vs-them situation /* -> 'an us-vs-them situation' */

<<setarticle 'a' 'onceler'>>
<<an 'Oncler'>> /* a Onceler */
```

### JavaScript API

#### Function: `setup.articles.find()`

**Syntax**: `setup.articles.find(text)`

This function takes a string and finds the correct indefinite article and returns it.

**Returns**: a string

**Arguments**:
- `text` (*string*) a string of text, can be a word or a bunch or words.

**Examples**:
```
setup.articles.find('UFO'); // 'a'
setup.articles.find('animal'); // 'an'
setup.articles.find('1'); // 'a'
setup.articles.find('86'); // 'an'
setup.articles.find('honorable man'); // 'an'
setup.articles.find('heir to the king'); // 'an'
setup.articles.find('horrible day'); // 'a'
setup.articles.find('painting'); // 'a'
```

#### Function: `setup.articles.output()`

**Syntax**: `setup.articles.output(text)`

This function takes a string and finds the correct indefinite article, then appends it to the source string and returns the whole thing.

**Returns**: a string

**Arguments**:
- `text` (*string*) a string of text, can be a word or a bunch or words.

**Examples**:
```
setup.articles.output('UFO'); // 'a UFO'
setup.articles.output('animal'); // 'an animal'
setup.articles.output('1'); // 'a 1'
setup.articles.output('86'); // 'an 86'
setup.articles.output('honorable man'); // 'an honorable man'
setup.articles.output('heir to the king'); // 'an heir to the king'
setup.articles.output('horrible day'); // 'a horrible day'
setup.articles.output('painting'); // 'a painting'
```

#### Function: `setup.articles.override()`

**Syntax**: `setup.articles.override(article, text, caseSensitive)`

This function creates an override [the same way the `<<setarticle>>` macro does](#macro-ltltsetarticlegtgt).

> [!DANGER]
> This function will only work in your `StoryInit` special passage or in you story JavaScript area. Overrides must be set up before the story begins. Failure to call this function in the `StoryInit` special passage or earlier will throw an error.

**Returns**: nothing

**Arguments**:
- `article` (*string*) the string `'a'` or the string `'an'`&mdash;the article to set the provided text to use.
- `text` (*string*) a string of text, can be a word or a bunch or words, to assign an article.
- `caseSensitive` (*boolean*) if a third argument is provided and truthy, the text will only be overridden if it matches the exact case of the override.

**Examples**:
```
setup.articles.override('a', 'US', true);
setup.articles.override('a', 'onceler');
```