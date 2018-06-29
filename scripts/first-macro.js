// first macro, by chapel; for sugarcube 2
// version 1.1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#first-macro

// <<first>> macro
Macro.add('first', {
       tags : ['then', 'finally'],
    handler : function () {

        var $wrapper = $(document.createElement('span')),
            last     = this.payload[this.payload.length - 1],
            visits   = visited() - 1, 
            content;
            
            if (visits < this.payload.length) {
                content = this.payload[visits].contents;
            } else {
                content = (last.name === 'finally') ? last.contents : '';
            }

        $wrapper
            .wiki(content)
            .addClass('macro-' + this.name)
            .appendTo(this.output);
    }

});