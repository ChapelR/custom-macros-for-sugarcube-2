// notify.js, by chapel; for sugarcube 2
// version 1.0.0
// requires notify.css / notify.min.css

$(document.body).append("<div id='notify'></div>");
$(document).on(':notify', function (e) {
    if (e.message && typeof e.message === 'string') {
        // trim message
        e.message.trim();
        // classes
        if (e.class) {
            if (typeof e.class === 'string') {
                e.class = 'open macro-notify ' + e.class;
            } else if (Array.isArray(e.class)) {
                e.class = 'open macro-notify ' + e.class.join(' ');
            } else {
                e.class = 'open macro-notify';
            }
        } else {
            e.class = 'open macro-notify';
        }
        
        // delay
        if (e.delay) {
            if (typeof e.delay !== 'number') {
                e.delay = Number(e.delay)
            }
            if (Number.isNaN(e.delay)) {
                e.delay = 2000;
            }
        } else {
            e.delay = 2000;
        }
        
        $('#notify')
            .empty()
            .wiki(e.message)
            .addClass(e.class)
                
        setTimeout(function () {
            $('#notify').removeClass();
        }, e.delay);
    }
});

// <<notify delay 'classes'>> message <</notify>>
Macro.add('notify', {
       tags : null,
    handler : function () {
        
        // set up
        var msg     = this.payload[0].contents, 
            time    = false, 
            classes = false, i;
        
        // arguments
        if (this.args.length > 0) {
            if (typeof this.args[0] === 'number') {
                time    = this.args[0];
                classes = (this.args.length > 1) ? this.args.slice(1).flatten() : false;
            } else {
                classes = this.args.flatten().join(' ');
            }
        }
        
        // fire event
        $(document).trigger({
            type    : ':notify',
            message : msg,
            delay   : time,
            class   : classes
        });
        
    }
});