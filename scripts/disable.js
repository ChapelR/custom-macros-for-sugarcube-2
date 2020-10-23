(function () {
    // disable.js, by chapel, for sugarcube 2
    // v1.0.0

    'use strict';

    var cls = 'disabled';
    var interactive = [
        'button',
        '*[role="button"]',
        'input',
        'optgroup',
        'option',
        'select',
        'textarea',
        'fieldset'
    ];

    function getEl (self) {
        // get the first interactive element
        var $el = $(self).find(interactive.join(',')).first();
        if (!$el[0]) {
            return $(self);
        }
        return $el;
    }

    function changeCls ($el) {
        if ($el.prop('disabled')) {
            $el.addClass(cls);
        } else {
            $el.removeClass(cls);
        }
    }

    function disable ($el, bool) {
        if (!($el instanceof $)) {
            $el = $($el);
        }
        if (bool == null) {
            $el.prop('disabled', !$el.prop('disabled'));
        } else {
            $el.prop('disabled', bool);
        }
        changeCls($el);
        return $el;
    }

    setup.disable = disable;

    Macro.add('disable', {
        tags : null,
        handler : function () {
            var bool, $wrapper = $(document.createElement('span'))
                .addClass('macro-' + this.name)
                .wiki(this.payload[0].contents);

            try {
                bool = this.args.raw.trim() ? !!Scripting.evalJavaScript(this.args.full) : undefined;
            } catch (err) {
                return this.error("bad evaluation: " + err.message);
            }

            disable(getEl($wrapper), bool);

            // output
            $(this.output).append($wrapper);
        }
    });

}());