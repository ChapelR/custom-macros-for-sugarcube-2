/*
    the following `(function () {...}());` statement creates a local scope for our JavaScript code.
    this is called an IIFE, or "immediately invoked function expression". most langauges have block scoping,
    JS has function scoping. think of this as a way to get block scoping to prevent any of our stuff from
    polluting the global scope.
*/

(function () {

    /*
        in SC, all of your scripts run in-engine are run in strict mode no matter what you do, so the below
        statement is optional. still, it's best to be explicit with what's happening. generally speaking, I
        recommend strict mode all the time; there's some cases where you may want to skip it, but overall it
        makes JavaScript way more consistent and way more likely to tell you about errors instead of doing something
        unexpected.
    */

    'use strict';

    /*
        I usually use an object like the one below to set up user configuration options. because of
        when our script is loaded, we need to set these options here, we can't do something like 
        `Config.swapMacro.normal = 'x'` like SugarCube's configs can, at least not in SC's current version
    */

    var options = {  
        // the colors of the content
        tryGlobal : true,
        resetButton : true, // if false, renders a link (`<a>`) instead of a button
        normal : 'violet',
        selected : 'red',
        cls : 'swappable' // we use 'cls' because 'class' is a reserved word in JavaScript
    };

    setup.swap = setup.swap || {};

    /*
        the `first` variable below is inside what is called a 'closure.' this means the variable is 
        only accessible within this `(function () { ... }());` scope. this variable will hold one of our swap
        elements. if it's set to something when a swap is clicked, it'll do the swap thing
    */

    var $first = null;

    function getCurrent (str) {
        // create a function on the fly
        var g = function () {
            return str;
        };
        setup.swap.current = g;
        if (options.tryGlobal) {
            window.swapCurrent = g;
        }
    }

    function removeCurrent () {
        if (setup.swap.current && typeof setup.swap.current === 'function') {
            delete setup.swap.current;
        }
        if (options.tryGlobal && window.swapCurrent && typeof window.swapCurrent === 'function') {
            delete window.swapCurrent;
        }
    }

    /*
        we're going to have a function and a macro definition. we can put the function
        inside the macro, but I try to avoid doing that--doing so means that the only way you can
        use this system from inside JavaScript is by the jQuery `wiki()` methods, which are slow.
        by creating the function separately, we build a JavaScript-facing API for authors to use, but
        more on that later.
    */

    function swappable (content /* the word(s) to be swapped */, wiki /* wikicode to run */) {
        /*
            $wrapper is a jQuery object; we add the $ at the start to denote this,
            the $ has nothing to do with story variables, so don't let that confuse you
        */
        var $wrapper = $(document.createElement('span'));
        // a wrapper is just an element to hold the stuff we want.
        var $swappable = $(document.createElement('a'))
            .wiki(content) // this wikifies (parses the `content` into the `a` element)
            .css('color', options.normal) // set our default color
            .attr({
                // these are custom html attributes; they always start with `data-`
                'data-swap-flag' : 'false', // set our custom attribute to the string false
                // normally you wouldn't use a string, but html converts everything to a string
                'data-orig-content' : content, // this is the original content so we can reset it
                'data-wiki-code' : wiki || ''
            }) 
            .addClass(options.cls) // this adds out class
            .appendTo($wrapper); // this adds the `a` element to our wrapper

        /*
            we're going to add our event handlers now. we could chain these above, but this is simpler to comment
            we use SC's `ariaClick()` method instead of `on('click', ...)` or `click(...)` because it is designed
            for accessibility from the ground up.
        */

        $swappable.ariaClick( function (ev /* this is the event object */) {
            ev.preventDefault(); // this stops any default browser behavior from happening
            // we cache a reference to $(this); the jQuery-wrapped `this`, since we'll use it a lot
            var $this = $(this); // the `this` keyword in an event handler is the element the handler was attached to

            // let's check the swapped state
            // we check this first because swapping an element with itself is possible, but a waste of resources
            if ($this.attr('data-swap-flag') === 'true') {
                // if the attribute swap flag is already set, we should toggle it
                $this
                    .attr('data-swap-flag', 'false')
                    .css('color', options.normal);
                // reset the first clicked element, since this one was clicked twice
                $first = null;
            } else {
                // this was clicked and wasn't clicked twice, so let's see if there's already an element in `first`
                if (!$first) {
                    // null is false-y and jQuery objects are truthy. this block is run if nothing was captured by `first` yet
                    $first = $this; // we pass a reference to *this* element to first
                    // then we set the element to appear selected
                    $this
                        .attr('data-swap-flag', 'true')
                        .css('color', options.selected);
                } else {
                    // another element was already selected. there's a few things we need to do here.
                    var firstContent = $first.text();
                    var secondContent = $this.text();

                    // cache the wikifier code
                    var firstWiki = $first.attr('data-wiki-code');
                    var secondWiki = $this.attr('data-wiki-code');

                    $first
                        // reset the flag and color
                        .attr('data-swap-flag', 'false')
                        .css('color', options.normal)
                        // empty and replace the content
                        .empty()
                        .wiki(secondContent);
                    $this // do the same with $this
                        .attr('data-swap-flag', 'false')
                        .css('color', options.normal)
                        .empty()
                        .wiki(firstContent);
                    // reset $first!

                    // run the wikifier code for both, if they exist
                    if (firstWiki && typeof firstWiki === 'string' && firstWiki.trim()) {
                        getCurrent(secondContent);
                        $.wiki(firstWiki);
                    }
                    if (secondWiki && typeof secondWiki === 'string' && secondWiki.trim()) {
                        getCurrent(firstContent);
                        $.wiki(secondWiki);
                    }
                    removeCurrent();
                    $first = null;
                }
            }
        });

        // we return the whole html structure
        return $wrapper;

        /*
            the html structure is:

            <span> ($wrapper)
                <a class='swappable' data-swap-flag='false'> ($swappable)
                    [content]
                </a>
            </span>
        */
    }

    function reset () {
        // this function will reset ever swappable element on the page
        $first = null;
        // reset each link
        $('a.' + options.cls).each( function () {
            var $this = $(this);
            $this
                // restore original content
                .empty()
                .wiki($this.attr('data-orig-content'))
                // reset flag and color
                .attr('data-swap-flag', 'false')
                .css('color', options.normal);
        });
    }

    // now lets make a macro

    Macro.add('swap' /* the macro name, so `<<swap>>` */, {
        tags : ['onswap'], // this makes a container macro, eg: `<<macro>>...<</macro>>`
        skipArgs : true, // we aren't using the argument parser, so this saves us performance
        handler : function () {
            // this is the macro's behavior, `this` represents the context and content of the macro
            var content = this.payload[0].contents; // this is the content between <<swap>> and <<onswap>>
            var wikiCode = this.payload[1] ? this.payload[1].contents : ''; // the code between <<onswap>> and <</swap>>
            var output = this.output; // this is the macro's position on the page--it's where the output will go
            var name = this.name; // this is the macro's name (eg: 'swap'); this lets us change the macros name easily rather than hard-coding it

            // now we call our function
            var $wrapper = swappable(content, wikiCode);

            // now we append the generated jQuery element to the output area:
            $wrapper
                .addClass('macro-' + name)
                .appendTo(output);
        }
    });

    // now for a <<swapreset>> macro

    Macro.add('resetswap', { // by skipping the `tags` option altogether, we make a normal macro (eg, no closing tag)
        handler : function () {
            var text = (this.args && this.args[0] && typeof this.args[0] === 'string') ? this.args[0] : 'Reset';
            $(document.createElement(options.resetButton ? 'button' : 'a'))
                .wiki(text)
                .ariaClick({ label : 'Reset all swappable elements.' }, function (ev) {
                    ev.preventDefault();
                    reset();
                })
                .appendTo(this.output);
        }
    });

    // now we send out API functions to setup
    setup.swap.create = swappable;
    setup.swap.reset = reset;
    // now we have a JavaScript API and a set of macros!
}());