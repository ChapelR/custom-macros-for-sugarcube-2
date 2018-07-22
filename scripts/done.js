// the <<done>> macro, v1.0.1; for SugarCube 2, by chapel

(function () {
    
    var counter = 1;
    // the core function
    
    Macro.add('done', {
        skipArgs : true,
        tags : null,
        handler : function () {
            
            var wiki = this.payload[0].contents.trim();

            if (wiki === '') {
                return; // bail
            }
            
            postdisplay[':chapel-done-macro-' + counter] = function (task) {
                delete postdisplay[task]; // single use
                $.wiki(wiki); // wikify the source code
            };
            
            counter++;
        }
    });
    
}());