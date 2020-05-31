## Chapel's Custom Macro Collection (v2.5.3)

- [Try the demo!](https://macros.twinelab.net/demo)
- [Downloads](./download ':ignore')
- [Changelog](./changelog.md)
- [Release Notes](https://twinelab.net/blog/tags/macros/)

### Documentation
- **Gameplay Systems and Mechanics**
  - [The Simple Inventory System](./simple-inventory.md)
  - [The Cycles System](./cycles-system.md)
  - [The Playtime System](./playtime-system.md)
- **Interface and Style**
  - [The Dialog API Macro Set](./dialog-api-macro-set.md)
  - [The UI Macro](./ui-macro.md)
  - [The Fading Macro Set](./fading-macros.md)
  - [The CSS Macro](./css-macro.md)
  - [The Notify Macro](./notify-macro.md)
  - [The Meter Macro Set](./meter-macros.md)
  - [The Speech Box System](./speech-box-system.md)
- **User Interaction and Events**
  - [The Event Macros](./event-macros.md)
  - [The Continue Macro Set](./continue-macro.md)
  - [The Swap Macro Set](./swap-macro-set.md)
  - [The Mouseover Macro](./mouseover-macro.md)
  - [The Message Macro](./message-macro.md)
  - [The Typing Simulation Macro](./type-sim.md)
- **Grammar and Language**
  - [The Pronoun Templates](./pronoun-templates.md) *updated*
  - [The Articles (A/An) Macros](./articles.md)
- **Utilities and Other**
  - [The Done Macro](./done-macro.md)
  - [The File System Macro Set](./file-system-macros.md)
  - [The First Macro](./first-macro.md)
  - [Dice Roller and Fairmath Functions](./operations-api.md)

### Installation Guide

To install these macros, all you need is the code. You can get the code by copy and pasting from the [repo](https://github.com/ChapelR/custom-macros-for-sugarcube-2/tree/master/scripts), or by generating a custom download using the [download utility](./download ':ignore'). If you use the downloader, select the scripts you want and click the `Create Download` button. Extract the files from the downloaded zip file and install the `bundle.js` and `bundle.css` files (see below).

If you opt to get the files from GitHub, It is highly recommended that you install the minified versions (found in the `scripts/minified/` [directory of the repo](https://github.com/ChapelR/custom-macros-for-sugarcube-2/tree/master/scripts/minified)), as these versions will have improved performance.  You will only need the non-minified versions if you plan to edit the code in some way. Links to both the minified and pretty scripts are available on the individual documentation pages for each macro / system.

> [!WARNING]
> To install these macros, you will need to be using the most recent version of SugarCube 2 in most cases, and this is almost never the version that comes with Twine 2.  See [SugarCube's website](http://www.motoslave.net/sugarcube/2/#downloads) for updating / installation instructions.

- For **Twine 2** users: copy and paste the JavaScript code into your [story JavaScript area](https://twinery.org/wiki/twine2:adding_custom_javascript_and_css).  Some macros may also require CSS code, which goes in your story stylesheet.

- For **Twine 1**, you'll need to copy and paste the JavaSCript portions into a script-tagged passage, and the CSS portions (if any) into a stylesheet-tagged passage. You can create new passages and add the tags yourself, or right-click on a blank spot in the editor and select new script here and new stylesheet here to generate each passage.

- For **Twee2**, refer to [its documentation](https://dan-q.github.io/twee2/documentation.html#twee2-syntax-special-passages) for how to create the tagged passages you need.

- For **Tweego**, simply place the code in `.js` and `.css` files as appropriate and include them in your directory / command line options just as you would any other code files.

#### Installation: Troubleshooting

If you're having issues, please try some of these solutions.

- If you're getting the code from GitHub, before copying the script you want from GitHub, you can find a button above the code on the right called `raw`.  Try using this code instead, as it takes you to a page with only the code allowing you to copy it and paste it much more easily, and preventing potential encoding issues.

- If you downloaded the files with the download utility, make sure to open the files and copy them with a text editor, **not** a word processor.

- Make sure you're using the latest version of SugarCube 2 and of your preferred compiler.

- Make sure that any code above my scripts in your JavaScript is correct, particularly in ending with a semicolon and with regard to closed parens, quotation marks, brackets, braces, etc. Try testing without my code again to make sure you didn't overwrite a chunk of whatever code was already there, which is easy to do in the tiny boxes you get from the Twine apps.

If none of those common solutions help you with the problem, open an issue here on the repo.  Be sure to tell me the exact version of SugarCube (found in the `Change story format` menu option in Twine 2) and the exact version of your compiler (for Twine 2, the bottom right on the story list).

> [!NOTE]
> Please try to screen grab or copy/paste any specific error messages, and provide sample code or steps to reproduce the issue if possible.

### General Troubleshooting

If a script doesn't seem to be working right, remember:
 * Everything is case-sensitive--`<<message>>` and `<<MESSAGE>>` are not going to point to the same macro.

 * Follow the instructions carefully.  There are a few places where my macros break with traditional SugarCube things, like the orders of arguments and stuff.  I'm trying to hew closer to SugarCube's standards moving forward, though.

 * Make sure you're using SugarCube 2, the most recent version you can.  This is very rarely the same as the version packaged with Twine 2 or the other compilers.

If you're reasonably sure you've read the docs and are using the right version and such, feel free to open an issue.

### Suggestions

Have ideas? I'm open to contributions, both in the form of ideas and code. Open an issue or pull request if you want to help out or make suggestions for new macros or systems.

### I Need Help!

If you're having an issue with these macros and suspect that it's operator error rather than a bug, you can still open an issue, but a faster way to get help would be to post in one of these Twine communities:

 * [The Twine Category at IntFiction.org](https://intfiction.org/c/authoring/twine)
 * [The Official Twine Discord Server](https://discordapp.com/invite/n5dJvPp)
 * [The Unoffical Twine Subreddit](https://www.reddit.com/r/twinegames/)

> [!TIP]
> Regardless of where you seek help, you'll want to provide links to the scripts you're using for your potential answerers.  Don't expect people to know what "Chapel's fading macros" are or how they work just from that.

### You Don't Write Good...

Please take a minute and help me out by reporting any errors in the documentation via an issue, or pull request a fix if you've got the time and know-how.  Both are greatly appreciated.

### Credit and Attribution

This code is dedicated to the public domain.  You **don't** need to provide credit, attribution, or anything else if you don't want to.

> [!NOTE]
> If you do wish to credit me, which I always appreciate, you can credit me as Chapel, but please do not imply that I directly worked on your game.

> [!TIP]
> If you have any questions or concerns about this, refer to the [license](https://github.com/ChapelR/custom-macros-for-sugarcube-2/blob/master/LICENSE) or reach out to me.

### Donations

> [!NOTE]
> Note: I suggest donating to [Twine development](https://www.patreon.com/klembot) or [SugarCube development](https://www.patreon.com/thomasmedwards) if you really want to help out, but I'd welcome a few dollars if you feel like it.

[![ko-fi](https://www.ko-fi.com/img/donate_sm.png)](https://ko-fi.com/F1F8IC35)