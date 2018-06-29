// fullscreen macro set, by chapel; for sugarcube 2
// version 1.0.0

// fullscreen function
setup.fullscreen = function (element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

Macro.add('fullscreen', {
    handler : function() { 

        var bg = $('body').css('background-color');
        $('html').css('background-color', bg);

        setup.fullscreen(document.documentElement);

    }
});

Macro.add('fullscreenlink', {
    handler : function() { 
        
        var $wrapper  = $(document.createElement('span'));
        var $link     = $(document.createElement('a'));
        var className = 'macro-' + this.name;
        var bg;
        var linkText;
        
        if (this.args.length !== 1) {
            return this.error('incorrect number of arguments');
        }
        
        linkText = this.args[0];
        
        $link
            .wiki(linkText)
            .attr('id', 'fullscreen-macro-link')
            .ariaClick( function () {
                bg = $('body').css('background-color');
                $('html').css('background-color', bg);
                setup.fullscreen(document.documentElement);
            });
            
        $wrapper
            .append($link)
            .addClass(className)
            .appendTo(this.output);
            
    }
});