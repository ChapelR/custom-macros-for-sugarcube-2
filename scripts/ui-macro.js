(function () {
    // ui macro, for SugarCube 2, by Chapel, v1.0.1
    
    var ui = {
        update : UIBar.setStoryElements,
        stow : UIBar.stow,
        unstow :  UIBar.unstow,
        toggle : function () {
            if ($('#ui-bar').hasClass('stowed')) {
                UIBar.unstow();
            } else {
                UIBar.stow();
            }
        },
        hide : function () {
            $('#ui-bar').css('display', 'none');
        },
        show : function () {
            $('#ui-bar').css('display', 'block');
        },
        kill : function () {
            $('#ui-bar').css('display', 'none');
            $('#story').css('margin-left', '2.5em');
        },
        restore : function () {
            $('#ui-bar').css('display', 'block');
            $('#story').css('margin-left', '20em');
        },
        jump : UI.jumpto,
        saves : UI.saves,
        restart : UI.restart,
        settings : UI.settings,
        share : UI.share,
        aliases : {
            refresh : 'update',
            reload : 'update',
            destroy : 'kill',
            revive : 'restore',
            jumpto : 'jump',
            save : 'saves',
            load : 'saves',
            setting : 'settings',
            sharing : 'share'
        },
    };

    var validCommands = Object.keys(ui);

    function isValid (command) {
        return validCommands.includes(command);
    }

    function alias (command) {
        return ui.aliases[command] || null;
    }

    function runCommand (command) {
        if (!command || typeof command !== 'string') {
            return 'Command is not a string.'; // error
        }
        command = command.toLowerCase().trim();
        if (!isValid(command)) {
            command = alias(command);
            if (!command) {
                return 'Command "' + command + '" is not a valid command.'; // error
            }
        }
        ui[command]();
        return false;
    }

    function processCommandList (arr) {
        if (!Array.isArray(arr)) {
            return 'Command list error.';
        }
        var check = [];
        arr.forEach( function (cmd) {
            check.push(runCommand(cmd));
        });
        return check;
    }

    Macro.add('ui', {
        handler : function () {

            if (!Array.isArray(this.args) || !this.args.length) {
                this.error('No commands passed to macro.');
            }

            var cmdList = this.args.flat(Infinity);

            var ret = processCommandList(cmdList);

            var errors = '';

            ret = ret.filter( function (result) {
                return typeof result === 'string';
            });

            errors = ret.join(' ');

            if (ret.length && errors) {
                this.error(errors);
            }

        }
    });

}());