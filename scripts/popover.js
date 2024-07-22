(function () {
    'use strict';
    // popover macro, by chapel, for SugarCube 2
    // v1.0.1

    function handleClasses () {
        return [].slice.call(arguments).flat(Infinity).filter( function (c) {
            return c && typeof c === 'string' && c.trim();
        }) || [];
    }

    function popover (content, classList) {
        classList = handleClasses(classList);
        $('#ui-overlay, #ui-dialog').addClass('popover');
        // classList
        $('#ui-overlay, #ui-dialog, #ui-dialog-body').addClass(classList);
        // no-click
        if (classList.includesAny('noclick', 'no-click')) {
            $('#ui-overlay').removeClass('ui-close');
        }
        // dialog
        Dialog.setup('', 'popover');
        Dialog.wiki(content);
        Dialog.open();
        // remove classes
        $(document).one(':dialogclosed', function () {
            $('#ui-overlay').addClass('ui-close');
            $('#ui-overlay, #ui-dialog').removeClass('popover');
            $('#ui-overlay, #ui-dialog, #ui-dialog-body').removeClass(classList);
        });
    }

    // built-in options: invert, opaque, transparent, noclick
    Macro.add('popover', {
        tags: null,
        handler : function () {
            popover(this.payload[0].contents, this.args);
        }
    });

    Macro.add('dismisspopover', {
        skipArgs: true,
        handler : function () {
            if ($('ui-overlay').hasClass('popover')) {
                Dialog.close();
            }
        }
    });

    setup.popover = popover;
}());