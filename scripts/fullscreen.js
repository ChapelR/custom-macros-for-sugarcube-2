(function () {
    'use strict';
    // fullscreen macro set, by chapel; for sugarcube 2
    // version 1.1.0

    // private functions and vars 

    var _target = document.body;

    // fullscreen state
    function _isFullscreen () {
        return !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement);
    }

    // fullscreen function
    function _fullscreen (element) {
        if (_isFullscreen()) {
            return;
        }
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // exit fullscreen
    function _revert () {
        if (!_isFullscreen()) {
            return;
        }
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // toggle fullscreen
    function _toggle (element) {
        if (_isFullscreen()) {
            _revert();
        } else {
            _fullscreen(_target);
        }
    }

    // MACROS

    Macro.add('fullscreen', { // now toggles
        handler : function() { _toggle(_target); }
    });

    Macro.add('fullscreenlink', { // now toggles
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
                    _toggle(_target);
                });
                
            $wrapper
                .append($link)
                .addClass(className)
                .appendTo(this.output);
                
        }
    });

    // API

    setup.fullscreen = function (bool) {
        if (bool === undefined) { // no arg (toggle)
            _toggle(_target);
        } else if (bool) { // true
            _fullscreen(_target);
        } else { // false
            _revert();
        }
    };

    setup.isFullscreen = _isFullscreen;

}());