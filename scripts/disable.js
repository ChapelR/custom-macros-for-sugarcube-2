(function () {
    // disable.js, by chapel, for sugarcube 2
    // v1.0.0

    'use strict';

    var cls = 'disabled';
    var interactive = ['button', 'fieldset', 'input', 'menuitem', 'optgroup', 'option', 'select', 'textarea'];

    function getEl (self) {
        // get the first interactive element
        var $el = $(self).find(interactive.join(',')).first();
        if (!$el[0]) {
            $el = $(self).children().eq(0);
            if (!$el[0]) {
                return $(self);
            }
        }
        return $el;
    }

    function changeCls ($el) {
        if ($el.ariaIsDisabled()) {
            $el.addClass(cls);
        } else {
            $el.removeClass(cls);
        }
    }

    function disable ($el, bool) {
        if (!($el instanceof $)) {
            $el = $($el);
        }
        $el.ariaDisabled((bool === undefined) ? true : !!bool);
        changeCls($el);
        return $el;
    }

    // no need for JS API as there us a built-in jQuery extension

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