(function () {
    'use strict';

    // selectors to ignore
    var ignored = ['a', ':button', '*[role="button"]', '.continue-macro-ignore', '#ui-bar', '#ui-dialog'];

    function ignoreMe () {
        $(document).on('click.continue-macro keyup.continue-macro', ignored.join(', '), function (ev) { 
            ev.stopPropagation(); 
        });
    }

    function addIgnore () {
        if (State.length > 0) {
            return false;
        }
        var args = [].slice.call(arguments).flatten();
        ignored = ignored.concat(args);
        return true;
    }

    $(document).one(':passagerender', function () {
        ignoreMe();
    });

    // continue functions
    function cont (press, cb) {
        if (!cb || typeof cb !== 'function') {
            return;
        }
        var events = 'click.continue-macro';
        if (press) {
            events = events + ' keyup.continue-macro';
        }
        $(document).one(events, function () {
            cb();
        });
    }

    function reset () {
        var args = [].slice.call(arguments).flatten();
        ignored = ignored.concat(args);
        $(document).off('click.continue-macro  keyup.continue-macro');
        ignoreMe();
    }

    // macros

    // <<ignore selectors...>>
    Macro.add('ignore', {
        handler : function () {
            var check = addIgnore(this.args);
            if (!check) {
                return this.error('the <<ignore>> macro should only be run from StoryInit or equivalent.');
            }
        }
    });

    // <<cont [append] [press]>>Code<</cont>>
    Macro.add('cont', {
        tags : null,
        handler : function () {
            var append = this.args.includes('append'),
                press = this.args.includesAny('key', 'keypress', 'press', 'button'),
                self = this,
                wiki = self.payload[0].contents;
            cont(press, function () {
                if (append) {
                    $(self.output).wiki(wiki);
                } else {
                    $.wiki(wiki);
                }
            });
        }
    });

    // APIs

    setup.cont = cont;
    setup.cont.ignore = addIgnore;
    setup.cont.reset = reset;

    window.cont = window.cont || setup.cont;

}());