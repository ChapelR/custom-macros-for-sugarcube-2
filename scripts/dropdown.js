// dropdown macro, by chapel; for sugarcube 2
// version 1.0
// see the documentation: 

// <<dropdown>> macro
Macro.add('dropdown', {
	handler : function () {
		
        var $wrapper = $(document.createElement('span'));
        var $drop    = $(document.createElement('select'));
		
        var opts      = this.args;
        var storyVar = opts.shift();
        var store;
        var i;
		
        // handle simple errors
        if (typeof storyVar == 'undefined') {
            return this.error('No arguments provided.');
        }
        if (opts.length < 1) {
            return this.error('Must provide at least one list option.');
        }
		
        if (storyVar.charAt(0) === '$') {
            store = State.variables;
        } else if (storyVar.charAt(0) === '_') {
            store = State.temporary;
        } else {
            return this.error('First argument should be a valid TwineScript variable.');
        }
        storyVar = storyVar.slice(1);
        store[storyVar] = opts[0];
			
		
        for (i = 0; i < opts.length; i++) {
            var $option = $(document.createElement('option'));
            $option
                .attr('value', opts[i])
                .wiki(opts[i])
                .appendTo($drop);
        }
		
        $drop
            .attr({
                name : 'dropdown-macro',
                id   : storyVar
            })
            .appendTo($wrapper);
		
        $wrapper
            .addClass('macro-' + this.name)
            .appendTo(this.output);
		
        $(document).on('change', 'select#' + storyVar, function () { 
            store[storyVar] = $('select#' + storyVar).val();
        })
		
		
    }
});