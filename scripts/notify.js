(function () {
    // notify.js, by chapel; for sugarcube 2
    // version 1.1.1
    // requires notify.css / notify.min.css

    var DEFAULT_TIME = 2000; // default notification time (in MS)

    var isCssTime = /\d+m?s$/;

    $(document.body).append("<div id='notify'></div>");
    $(document).on(':notify', function (ev) {
        if (ev.message && typeof ev.message === 'string') {
            // trim message
            ev.message.trim();
            // classes
            if (ev.class) {
                if (typeof ev.class === 'string') {
                    ev.class = 'open macro-notify ' + ev.class;
                } else if (Array.isArray(ev.class)) {
                    ev.class = 'open macro-notify ' + ev.class.join(' ');
                } else {
                    ev.class = 'open macro-notify';
                }
            } else {
                ev.class = 'open macro-notify';
            }
            
            // delay
            if (ev.delay) {
                if (typeof ev.delay !== 'number') {
                    ev.delay = Number(ev.delay);
                }
                if (Number.isNaN(ev.delay)) {
                    ev.delay = DEFAULT_TIME;
                }
            } else {
                ev.delay = DEFAULT_TIME;
            }
            
            $('#notify')
                .empty()
                .wiki(ev.message)
                .addClass(ev.class);
                    
            setTimeout(function () {
                $('#notify').removeClass();
            }, ev.delay);
        }
    });

    function notify (message, time, classes) {
        if (typeof message !== 'string') {
            return;
        }

        if (typeof time !== 'number') {
            time = false;
        }

        $(document).trigger({
            type    : ':notify',
            message : message,
            delay   : time,
            class   : classes || ''
        });
    }

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
                var cssTime = isCssTime.test(this.args[0]);
                if (typeof this.args[0] === 'number' || cssTime) {
                    time    = cssTime ? Util.fromCssTime(this.args[0]) : this.args[0];
                    classes = (this.args.length > 1) ? this.args.slice(1).flatten() : false;
                } else {
                    classes = this.args.flatten().join(' ');
                }
            }
            
            // fire event
            notify(msg, time, classes);
            
        }
    });

    setup.notify = notify;
}());