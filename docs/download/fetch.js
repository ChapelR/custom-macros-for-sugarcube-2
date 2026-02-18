( function () {
    'use strict';

    const baseURL = 'https://cdn.jsdelivr.net/gh/chapelr/custom-macros-for-sugarcube-2@latest/scripts/minified/';
    const extension = '.min.js';
    const extensionCSS = '.min.css';

    const fileNameMap = {
        'Articles (A/An) Macros': 'articles',
        'CSS Macro': 'css-macro',
        'Continue Macro Set': 'continue',
        'Cycles System': 'cycles',
        'Dialog API Macros': 'dialog-api-macro-set',
        'Dice Roller and Fairmath Functions': 'operations',
        'Disable Macro': 'disable',
        'Event Macro Set': 'events',
        'Fading Macro Set': 'fading-macro-set',
        'File System Macros': 'fs',
        'First Macro': 'first-macro',
        'Message Macro': 'message-macro',
        'Meters Macro Set': 'meters',
        'Mouseover Macro': 'mouseover',
        'Notify Macro': 'notify+css',
        'Playtime System': 'playtime',
        'Popover Macro': 'popover+css',
        'Preload Macro': 'preload',
        'Pronoun Templates': 'pronouns',
        'Speech Box System': 'speech+css',
        'Swap Macro Set': 'swap-macro-set',
        'Typesim Macro': 'type-sim',
        'UI Macro': 'ui-macro'
    };

    var macros = Object.keys(fileNameMap);

    function fetchFiles (arr) {
        var files = [];
        arr.forEach( function (macro) {
            if (!macro || typeof macro !== 'string' || !macro.trim()) {
                return;
            }
            var fn = fileNameMap[macro];
            if (!fn || !fn.trim()) {
                return;
            }
            if (fn.includes('+css')) {
                fn = fn.split('+')[0];
                files.push(baseURL + fn + extensionCSS);
            }
            files.push(baseURL + fn + extension);
        });
        return files;
    }

    function loadFiles (files) {
        var code = {
            js : [],
            css : [],
            noLoad : 0
        };
        var isCSS = false;
        files.forEach( function (file, idx, arr) {
            $.ajax({
                url : file,
                beforeSend : function (xhr) {
                    xhr.overrideMimeType('text/plain; charset=utf8');
                }
            })
                .done( function (data) {
                    isCSS = this.url.includes('.css');
                    code[isCSS ? 'css' : 'js'].push(data);
                    var progress = (code.js.length + code.css.length + code.noLoad) / arr.length;
                    $(document).trigger({
                        type : ':progress',
                        progress : progress
                    });
                    if (progress === 1) {
                        $(document).trigger({ 
                            type : ':load-end', 
                            code : code
                        });
                    }
                })
                .fail( function () {
                    code.noLoad++;
                    var progress = (code.js.length + code.css.length + code.noLoad) / arr.length;
                    alert('Something went wrong when generating the download.');
                    $(document).trigger({
                        type : ':progress',
                        progress : progress
                    });
                });
        });
    }

    window.macroList = macros;
    window.loadFiles = function (macroNames) {
        if (!(macroNames instanceof Array)) {
            return;
        }
        $(document).trigger(':load-start');
        var data = loadFiles(fetchFiles(macroNames));
        return data;
    };
}());
