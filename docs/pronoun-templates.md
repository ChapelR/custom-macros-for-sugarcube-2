## The Pronoun Templates

[Back to the main readme](./README.md).

This script leverages SugarCube 2's new [template markup](.) and [API](.) to create a complete, user configurable pronoun system. Users are free to list their own pronouns by filling out a form, or choose from one of three presets "He/Him", "She/Her", and "They/Them". You can use the provided macro or JavaScript function to give the user access to the pronoun configuration dialog, and you can optionally allow the user to re-configure their pronouns from the Settings dialog at their pleasure. 

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/pronouns.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/pronouns.js).  
**DEMO:** [Available](http://macros.twinelab.net/demo?macro=pronouns).  
**GUIDE:** Not available.

### Macro: `<<pronouns>>`

**Syntax**: `<<pronouns>>`

This macro opens the pronoun configuration dialog, a pop-up style form where the user can edit their pronouns or select a set of pronouns from one of three presets (female, male, and non-binary). 

**Usage**:
```
<<link 'Configure your gender and pronouns.'>>
    <<pronouns>>
<</link>>
```

### Included Templates 

See the [documentation](.) for more on template markup.

#### Determiner warning: 

The templates included here are designed to make your writing as simple and painless as possible, so many names are available for each template. For example, the template `?he` and `?she` will both reference the template for *subjective pronouns*. The only gotcha here are the determiners (possessive adjective pronouns), which are followed by an underscore `_` for the "his" and "her" determiner pronouns, since the use of "his" and "her" can be unclear. Consider the following: 

- "This car is **his**."  
- "This is **his** car."  
- "I don't know **him**."


- "This car is **hers**."  
- "This is **her** car."  
- "I don't like **her**."

The confusion here is that male pronouns and female pronouns both re-use the determiner as another form of pronoun, for the male pronoun, "his" is both the possessive and determiner form, for female pronouns, "her" is both the objective and determiner form. The non-binary "they/them" pronoun set, however, does not have this issue: 

- "This car is **theirs**."  
- "This is **their** car."  
- "I don't like **them**."

If you want to write your templates using the male or female pronouns, you will need to use the underscore where appropriate: 

- "This car is `?hers`."  
- "This is `?her_` car."  
- "I don't like `?her`."


- "This car is `?his`."  
- "This is `?his_` car."  
- "I don't like `?him`."

#### Capitalization 

To get a capitalized version of a template, for example, to start a sentence, simply capitalize the template. `?he`, for example, may return `he` or `she`, but `?He` will return `He` or `She`.

#### Template List

Here is the complete list of templates provided by this system.
<!-- tabs:start -->

##### **Subjective**

- `?he`  
- `?He`  
- `?she`  
- `?She`  
- `?they`  
- `?They`

##### **Objective**

- `?him`  
- `?Him`  
- `?her`  
- `?Her`  
- `?them`  
- `?Them`

##### **Possessive**

- `?his`  
- `?His`  
- `?hers`  
- `?Hers`  
- `?theirs`  
- `?Theirs`

##### **Determiner**

- `?his_`  
- `?His_`  
- `?her_`  
- `?Her_`  
- `?their`  
- `?Their`

##### **Reflexive**

- `?himself`  
- `?Himself`  
- `?herself`  
- `?Herself`  
- `?themself`  
- `?Themself`

##### **Nouns**

- `?man`  
- `?Man`  
- `?woman`  
- `?Woman`  
- `?person`  
- `?Person`

<!-- tabs:end -->

#### Template Examples

```
?He went to the bank to find out what state ?his_ mortgage was in. For ?him, all that mattered was that the house remained ?his.
```

etc...

### JavaScript API 

The following functions are available on `window.gender` and on `setup.gender`. 

#### the `gender.pronouns()` function

**Syntax**: `gender.pronouns()` or `setup.gender.pronouns()`

Returns an object containing all of the configured pronouns. Has the following properties:

- `subjective`  
- `objective`  
- `possessive`  
- `determiner`  
- `reflexive`  
- `noun`

**Example:**
```
<<= gender.pronouns().subjective>> /* prints the subjective pronoun, eg. "he" */
```

#### the `gender.dialog()` function

**Syntax**: `gender.dialog()` or `setup.gender.dialog()`

Opens the pronoun configuration dialog should you need to access it from JavaScript.

**Example:**
```
<<run gender.dialog()>> /* roughly equivalent to `<<pronouns>>` */
```

### Configuration 

Configuration options are near the top of the un-minified script. The critical options you may want to change are `showSetting` and `default`. The former determines whether the user can access the Setting API dialog to change their pronoun at any time. If you aren't using the Setting API, or if you'd rather the choice be permanent, you'll need to set this option to `false`. The `default` option determines which pronoun preset is defaulted to in the pronoun configuration dialog when the user first opens it, and also what the pronoun templates return prior to the user configuring their pronouns. You can change this option to `"male"`, `"female"`, or `"other"`.

### Other usage notes: 

**Variable warning**:

This system uses a story variable (`State.variable['%%gender']` by default) to store information in your game's state.  You should avoid overwriting this variable, or change it using the configuration options.

**Setting API warning**:

This system adds a setting to the Setting API. By default the setting's name is `gender`. You should avoid overwriting this setting, or change it using the configuration options (the `name` property of `config`). You can optionally disable the setting entirely via the config options.

**Styling options**:

This system creates a dialog with the class `custom-gender`. You can use this class to target the dialog and anything inside it for styling, e.g. `#ui-dialog-body.custom-gender input[type='text'] { color : violet; }`.