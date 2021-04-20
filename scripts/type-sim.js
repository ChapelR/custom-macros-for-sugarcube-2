(function () {
    'use strict';
    // typesim macro, by chapel; for sugarcube 2
    // version 2.0.0

    function typeSim (content, $target, callback) {
        if (!content || typeof content !== 'string') {
            return;
        }

        if ($target && !($target instanceof $)) {
            $target = $($target);
        }

        var i = 0;
        var arrayify = content.split('');
        var message = [];

        var $textarea = $(document.createElement('textarea'))
            .addClass('type-sim')
            .on('input.type-sim', function () {
                var $self = $(this);
                i = message.push(arrayify[i]);
                $self.val(message.join(''));
                if (content.length === message.length) {
                    $self
                        .off('input.type-sim')
                        .ariaDisabled(true);
                    if (callback && typeof callback === 'function') {
                        callback(message.join(''));
                    }
                    $(document).trigger({ 
                        type : ':type-sim-end',
                        message : message.join('')
                    });
                }
            });

        if ($target && $target[0]) {
            $target.append($textarea);
        }

        return $textarea;
    }

    Macro.add('typesim', {
        tags : null,
        handler : function () {
            if (!this.args.length || !this.args[0] || typeof this.args[0] !== 'string') {
                return this.error('no text to type out was provided');
            }

            var $wrapper = $(document.createElement('span')).addClass('macro' + this.name);
            var $callbackOutput = $(document.createElement('div'));

            var wiki;
            if (this.payload[0].contents && this.payload[0].contents.trim()) {
                wiki = this.payload[0].contents;
            }

            function callback () {
                $callbackOutput.wiki(wiki);
            }

            typeSim(this.args[0], $wrapper, callback);

            $wrapper
                .append($callbackOutput)
                .appendTo($(this.output));
        }
    });

})();