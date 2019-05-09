(function () {
    // mouseover macro, v 1.0.1, by chapel, for sugarcube 2

    Macro.add('mouseover', {

        tags: [
            'onhover', 
            'onmouseover', 
            'onmousein', 
            'onmouseenter',
            'onmouseout'
        ],

        skipArgs: true,

        handler: function () {

            if (this.payload.length < 2) {
                return this.error('No event tag used.');
            }

            var wiki = {
                mouseover : [],
                mousein : [],
                mouseout : []
            };

            var $el = $(document.createElement('span'))
                .addClass('macro-' + this.name)
                .wiki(this.payload[0].contents)
                .appendTo(this.output);

            // iterate through the tags
            this.payload.forEach( function (payload) {
                switch (payload.name) {
                    case 'onhover':
                    case 'onmouseover':
                        wiki.mouseover.push(payload.contents);
                        break;
                    case 'onmousein':
                    case 'onmouseenter':
                        wiki.mousein.push(payload.contents);
                        break;
                    case 'onmouseout':
                        wiki.mouseout.push(payload.contents);
                        break;
                    default:
                        return;
                }
            });

            // attach appropriate events
            if (wiki.mouseover.length) {
                $el.on('mouseover', this.createShadowWrapper(function (ev) {
                    $.wiki(wiki.mouseover.join(' '));
                }));
            }
            if (wiki.mousein.length) {
                $el.on('mouseenter', this.createShadowWrapper(function (ev) {
                    $.wiki(wiki.mousein.join(' '));
                }));
            }
            if (wiki.mouseout.length) {
                $el.on('mouseout', this.createShadowWrapper(function (ev) {
                    $.wiki(wiki.mouseout.join(' '));
                }));
            }
        }
    });
}());