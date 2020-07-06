( function () {
    'use strict';

    var baseURL = 'https://cdn.jsdelivr.net/gh/chapelr/custom-macros-for-sugarcube-2@latest/scripts/minified/';
    var extension = '.min.js';
    var extensionCSS = '.min.css';

    var fileNameMap = {
        'Articles (A/An) Macros' : 'articles',
        'The Continue Macro Set': 'continue',
        'The CSS Macro' : 'css-macro',
        'Cyles System' : 'cycles',
        'Dialog API Macros' : 'dialog-api-macro-set',
        'The Done Macro' : 'done',
        'The Event Macro Set' : 'events',
        'The Fading Macro Set' : 'fading-macro-set',
        'The First Macro' : 'first-macro',
        'File System Macros' : 'fs',
        'The Message Macro' : 'message-macro',
        'The Meters Macro Set' : 'meters',
        'The Mouseover Macro' : 'mouseover',
        'The Popover Macro' : 'popover+css',
        'The Notify Macro' : 'notify+css',
        'Dice Roller and Fairmath Functions' : 'operations',
        'Playtime System' : 'playtime',
        'Pronoun Templates' : 'pronouns',
        'Simple Inventory' : 'simple-inventory',
        'The Speech Box System' : 'speech+css',
        'Swap Macro Set' : 'swap-macro-set',
        'The Typesim Macro' : 'type-sim',
        'The UI Macro' : 'ui-macro',
        'The Preload Macro' : 'preload'
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