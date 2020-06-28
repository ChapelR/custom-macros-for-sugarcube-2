// dialog API macro set, by chapel; for sugarcube 2
// version 1.3.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#dialog-api-macros

// <<dialog>> macro
Macro.add('dialog', {
       tags : ['onopen', 'onclose'],
    handler : function () {
        
        // handle args (if any)
        var errors = [];
        var content = '', onOpen = null, onClose = null;
        var title = (this.args.length > 0) ? this.args[0] : '';
        var classes = (this.args.length > 1) ? this.args.slice(1).flatten() : [];

        this.payload.forEach( function (pl, idx) {
            if (idx === 0) {
                content = pl.contents;
            } else {
                if (pl.name === 'onopen') {
                    onOpen = onOpen ? onOpen + pl.contents : pl.contents;
                } else {
                    onClose = onClose ? onClose + pl.contents : pl.contents;
                }
            }
        });
        
        // add the macro- class
        classes.push('macro-' + this.name);
        
        // dialog box
        Dialog.setup(title, classes.join(' '));
        Dialog.wiki(content);

        // should these be shadowWrapper-aware?
        if (onOpen && typeof onOpen === 'string' && onOpen.trim()) {
            $(document).one(':dialogopened', function () {
                $.wiki(onOpen);
            });
        }

        if (onClose && typeof onClose === 'string' && onClose.trim()) {
            $(document).one(':dialogclosed', function () {
                $.wiki(onClose);
            });
        }

        Dialog.open();
        
    }

});

// <<popup>> macro
Macro.add('popup', {
    handler : function () {
        
        // errors
        if (this.args.length < 1) {
            return this.error('need at least one argument; the passage to display');
        }
        if (!Story.has(this.args[0])) {
            return this.error('the passage ' + this.args[0] + 'does not exist');
        }
        
        // passage name and title
        var psg   = this.args[0];
        var title = (this.args.length > 1) ? this.args[1] : '';
        var classes = (this.args.length > 2) ? this.args.slice(2).flatten() : [];
        
        // add the macro- class
        classes.push('macro-' + this.name);
        
        // dialog box
        Dialog.setup(title, classes.join(' '));
        Dialog.wiki(Story.get(psg).processText());
        Dialog.open();
        
    }

});

// <<dialogclose>> macro
Macro.add('dialogclose', { 
    skipArgs : true, 
    handler : function () {
        Dialog.close();
    } 
});