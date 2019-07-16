(function () {
    'use-strict';

    function createZipFile (data) {
        var jsCode = null, cssCode = null;
        if (data.js && data.js.length) {
            jsCode = data.js.join('\n');
        }
        if (data.css && data.css.length) {
            cssCode = data.css.join('\n');
        }
        if (!jsCode && !cssCode) {
            return;
        }
        var zip = new JSZip();
        if (jsCode) {
            zip.file('bundle.js', jsCode);
        }
        if (cssCode) {
            zip.file('bundle.css', cssCode);
        }
        zip.generateAsync({ type : 'blob' })
            .then( function (bin) {
                download(bin, 'macros.zip', 'application/zip');
                $(document).trigger(':completed');
            });
    }

    function generateDownload () {
        $(document).on(':load-end', function (ev) {
            zip(ev.code);
        });
    }

    window.zip = createZipFile;
    window.dlHandler = generateDownload;
}());