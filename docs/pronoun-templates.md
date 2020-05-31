## The Pronoun Templates

[Back to the main readme](./README.md).

This script leverages SugarCube 2's new [template markup](http://www.motoslave.net/sugarcube/2/docs/#markup-template) and [API](http://www.motoslave.net/sugarcube/2/docs/#template-api) to create a complete, user configurable pronoun system. Users are free to list their own pronouns by filling out a form, or choose from one of three presets "He/Him", "She/Her", and "They/Them". You can use the provided macro or JavaScript function to give the user access to the pronoun configuration dialog, and you can optionally allow the user to re-configure their pronouns from the Settings dialog at their pleasure. 

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

### Macro: `<<verb>>`

**Syntax**: `<<verb singularForm [pluralForm]>>`

This macro will attempt to pluralize verbs when the pronouns are set to `they/them`. If you provide it a singular third person pronoun, like `plays`, `is`, `suppresses`, `does`, etc, it will attempt to pluralize it using its internal rule set. However, given the vast number of irregularities, the pluralizer will often guess wrong. In these cases, you can instead supply a second argument that provides the correct plural form.

**Arguments**:
- `singularForm` provide the third person singular verb form (the one you'd use with he or she), e.g. `is`.
- `pluralForm` you can optionally provide a plural form for irregular verbs not understood by the pluralizer, e.g. `are` (though the pluralizer understands many common irregular verbs like the `be` forms).

> [!NOTE]
> I went with the singular-prime format here (meaning singular verb forms come first and plural forms aren't required) simply because it was easier to parse the singular forms to guess what pluralization rules were in play&mdash;not to imply any sort of preference or default for those forms.

**Usage**:
```
/* assume the players pronouns are they/them */

?He <<verb 'is'>> on the way. /* -> 'They are on the way.' */
?She<<verb "'s" "'re">> pretty cool. /* -> They're pretty cool. */
?He <<verb 'ran'>> away. /* -> 'They ran away.' */
?She <<verb 'goes'>> to the beach all the time. /* -> 'They go to the beach all the time.' */
```

### Included Templates 

See the [documentation](http://www.motoslave.net/sugarcube/2/docs/#markup-template) for more on template markup. Contractions `he's`, `she's` and `they're` are represented with a hyphen (e.g., `?he-s`) rather than an apostrophe.

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

##### **Contractions**

- `?he-s`  
- `?He-s`  
- `?she-s`  
- `?She-s`  
- `?they-re`  
- `?They-re`

<!-- tabs:end -->

#### Template Examples

```
?He went to the bank to find out what state ?his_ mortgage was in. For ?him, all that mattered was that the house remained ?his.
```

### JavaScript API 

The following functions are available on `window.gender` and on `setup.gender`. 

#### the `gender.pronouns()` function

**Syntax**: `gender.pronouns()` or `setup.gender.pronouns()`

**Returns**: a pronoun object.

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

#### the `gender.setPronouns()` function

**Syntax**: `gender.setPronouns(presetOrObj)` or `setup.gender.setPronouns(presetOrObj)`

**Returns**: a pronoun object, as above.

Allows you to set the pronouns. You may set them by providing the name of a preset as a string  (`"male"`, `"female"`, or `"other"`), or by passing an object. If you pass an object you may set as many or as few of the pronouns as you want.

**Arguments**:

- `presetOrObj` (*string* | *object*) a string representing a built-in preset to set the pronouns to, or an object enumerating the pronouns you wish to set. See above for a list of pronoun properties you can set.

**Example:**

```
/* set the pronouns to female */
<<run gender.setPronouns("female")>>

/* set the pronouns to e/em */
<<run gender.setPronouns({
	"subjective" : "e",
	"objective" : "em",
	"possessive" : "eirs",
	"determiner" : "eir",
	"reflexive" : "eirself",
	"noun" : "person"
})>>

/* set only one pronoun */
<<run gender.setPronouns({ "noun" : "person" })>>
```

#### the `gender.dialog()` function

**Syntax**: `gender.dialog()` or `setup.gender.dialog()`

Opens the pronoun configuration dialog should you need to access it from JavaScript.

**Example:**
```
<<run gender.dialog()>> /* roughly equivalent to `<<pronouns>>` */
```

#### the `gender.pluralize()` function

**Syntax**: `gender.pluralize(verb)`

**Returns**: a string.

Attempts to figure out and return a third-person plural form of a third-person singular verb by applying several rules in order. Eventually it will just attempt to remove an ending `s` if there is one, and if there isn't it'll simply return the original singular form it received

**Arguments**:
- `verb` (*string*) a verb to attempt to pluralize.

**Examples:**
```javascript
gender.pluralize('is') // -> 'are'
gender.pluralize('was') // -> 'were'
gender.pluralize('does') // -> 'do'
gender.pluralize('flies') // -> 'fly'
gender.pluralize('dies') // -> 'die'
gender.pluralize('went') // -> 'went'
gender.pluralize('catches') // -> 'catch'
```

> [!WARNING]
> Despite the rather rosy portrait painted by the above examples, there are many verbs that the function will not property pluralize.

### Configuration 

Configuration options are near the top of the un-minified script. The critical options you may want to change are `showSetting` and `default`. The former determines whether the user can access the Setting API dialog to change their pronoun at any time. If you aren't using the Setting API, or if you'd rather the choice be permanent, you'll need to set this option to `false`. The `default` option determines which pronoun preset is defaulted to in the pronoun configuration dialog when the user first opens it, and also what the pronoun templates return prior to the user configuring their pronouns. You can change this option to `"male"`, `"female"`, or `"other"`.

### Other usage notes: 

**Variable warning**:

This system uses a story variable (`State.variable['%%gender']` by default) to store information in your game's state.  You should avoid overwriting this variable, or change it using the configuration options.

**Setting API warning**:

This system adds a setting to the Setting API. By default the setting's name is `gender`. You should avoid overwriting this setting, or change it using the configuration options (the `name` property of `config`). You can optionally disable the setting entirely via the config options.

**Styling options**:

This system creates a dialog with the class `custom-gender`. You can use this class to target the dialog and anything inside it for styling, e.g. `#ui-dialog-body.custom-gender input[type='text'] { color : violet; }`.