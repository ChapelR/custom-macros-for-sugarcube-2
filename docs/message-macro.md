## The Message Macro

[Back to the main readme](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/readme.md).

This macro displays a link or, optionally, a button. The link or button can be clicked to display a message immediately below it in the passage text, and clicked again to collapse the message. 

**THE CODE:** [Minified](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/minified/message-macro.min.js). [Pretty](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/scripts/message-macro.js).  
**DEMO:** [Available](http://holylandgame.com/custom-macros.html).  
**GUIDE:** Not available.

### Macro: `<<message>>`

**Syntax**: `<<message [linkText] [btn] [id]>>`

Creates a link (or button) on the page.  When clicked, the content between the tags is displayed on the next line, reflowing the following text.  The player can click the same link again to 'collpase' the message.

* **linkText**: (optional) the text of the link.  if omitted, default text is displayed (the default text can be edited above)
* **btn**: (optional) if `btn` is included in the macro's arguments, a button is generated instead of a link
* **id**: (optional) if multiple messages are displayed on the same page with the same link text, you need to provide each one with a unique id.

**Usage**:
```
<<message>>Text<</message>>
// creates a link that reads 'Help' (by default) and can be clicked to display the content between the tags and clicked again to collapse the content.

<<message 'click me' btn>>Text<</message>>
// creates the message with the link text 'click me' and renders it as a button element

<<message 'Click here!' 'uniqueID'>>...<</message>>
<<message 'Click here!' 'anotherUniqueID'>>...<</message>>
// creates two messages with the same link text.  they must be given two different, unique IDs to appear in the same passage.
```

## Othe Usage Notes:

**Styling Options**:

Message content is given the class `.message-text`; you can control the appearance of the message's content using this selector in your CSS. (For example: `.message-text {color: green;}` would render the text of all messages in green).

**Configuration**:

You can alter the `setup.messageMacro.default` configuration option in your story JavaScript to change what the default link text is when you omit the argument.

```javascript
// <<message>> macros without linkText arguments will display `YAY`:
setup.messageMacro.default = 'YAY';
```