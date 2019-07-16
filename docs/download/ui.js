$( function () {
    window.MACROS_SELECTED = [];
    var $checks = window.macroList.map( function (macro) {
        return $(document.createElement('p'))
            .append($(document.createElement('label'))
                .append($(document.createElement('input'))
                    .attr({
                        name : macro,
                        value : macro,
                        type : 'checkbox'
                    })).append(macro));
    });
    $('#checks').append($checks);
    $(':checkbox').on('input', function () {
        MACROS_SELECTED = [];
        $(':checkbox:checked').toArray().forEach( function (box) {
            MACROS_SELECTED.push($(box).attr('value'));
        });
    });
    $('#submit').on('click', function () {
        loadFiles(MACROS_SELECTED);
    });
    dlHandler();
});