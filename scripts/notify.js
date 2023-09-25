(function () {
    // notify.js, by chapel; for sugarcube 2
    // version 1.1.1
    // requires notify.css / notify.min.css

	let isPending = false;
  
    const DEFAULT_TIME = 2000, // default notification time (in MS)
		ANIMATION_TIME = 300, // based on the .3s css transition
		isCssTime = /\d+m?s$/,
    	queue = [];
	
    $(document.body).append("<div id='notify'></div>");
    $(document).on(':notify', function (ev) {
      	isPending = true;
  
        if (!ev.delay || Number.isNaN(ev.delay)) {ev.delay = DEFAULT_TIME;}

       	$('#notify')
        	.wiki(ev.message)
          	.addClass('open macro-notify '+ev.class);
                    
        setTimeout(e => {
          	isPending = false;
          
        	$('#notify')
            	.empty()
            	.removeClass();

          	if (queue.length) {
            	setTimeout(e => {
            		notify(queue.shift());
                }, ANIMATION_TIME);
        	}
       	}, ev.delay);
    });

    function notify(message, time, classes) {
     	let notifObject;
      
        if (Array.isArray(message)) {
        	message.forEach(m => notify(m));
            return;
        } else if (typeof message === 'object') {
          	notifObject = message;
        } else {
          	if (typeof message !== 'string' || !message.trim()) {
            	return;
            }
          	
          	if (Array.isArray(classes)) {
				classes = classes.join(' ');
			}
          
        	notifObject = {
              	message : message.trim(),
              	delay : typeof time === 'number' ? time : false,
              	class : classes || ''
            };
        }

      	if (isPending) {
        	queue.push(notifObject);
        } else {
          	notifObject.type = ':notify';
        	$(document).trigger(notifObject);
        }
    };
	
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
