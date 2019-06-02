(function () {
    'use strict';
    // v1.0.0; by Chapel, for SugarCube 2 (>= v2.29.0)

    if (!Template || !Template.add || typeof Template.add !== 'function') {
        alert('Warning, this version of SugarCube does not include the Template API. Please upgrade to v2.29.0 or higher.');
        return;
    }

    // CONFIGURATION

    var config = {
        name : 'gender',
        showSetting : true,
        label : 'Gender',
        desc : '',
        storyVar : '%%gender',
        default : 'female' // female, male, or other
    };

    // DATA

    // the point-replace id
    var settingID = '#setting-control-' + config.name;

    // preset pornoun map
    var genderMap = {
        subjective : ['she', 'he', 'they'],
        objective : ['her', 'him', 'them'],
        possessive : ['hers', 'his', 'theirs'],
        determiner : ['her', 'his', 'their'],
        reflexive : ['herself', 'himself', 'themself'],
        noun : ['woman', 'man', 'person']
    };

    // INTERNAL FUNCTIONS

    // custom dialog function
    function createDialog (name, element, classes) {
        var reopen = false;
        if (Dialog.isOpen() && $('#ui-dialog-body').hasClass('settings')) {
            reopen = true;
        }
        Dialog.close();
        Dialog.setup(name, (reopen) ? classes + ' reopen' : classes);
        Dialog.append(element);
        Dialog.open();
    }

    function genderForm () { // create a form for users to configure their pronouns
        var $wrapper = $(document.createElement('div'));

        function createInput (label, name, def) { // create text inputs
            return $(document.createElement('label'))
                .append(label)
                .css('display', 'block')
                .append($(document.createElement('input'))
                    .attr({
                        type : 'text',
                        name : name
                    })
                    .css({
                        float : 'right',
                        'margin-left' : '0.2em'
                    })
                    .val(def)
                );
        }

        function createDropdown (label, name, list) { // create dropdowns
            var $select = $(document.createElement('select'))
                .attr('name', name)
                .css('float', 'right');
            list.forEach( function (opt, idx) {
                console.log(idx);
                $(document.createElement('option'))
                    .attr('value', String(idx))
                    .append(opt)
                    .appendTo($select);
            });
            return $(document.createElement('label')).css('display', 'block').append(label, $select);
        }

        var $inputs = Object.keys(genderMap).map( function (key) {
            // create an input for each type of pronoun
            var idx = 2;
            if (config.default === 'male') {
                idx = 1;
            } else if (config.default === 'female') {
                idx = 0;
            }
            var sv = State.variables;
            var def = genderMap[key][idx];
            if (sv[config.storyVar] && sv[config.storyVar][key]) {
                def = sv[config.storyVar][key];
            }
            return createInput(key.toUpperFirst() + ': ', 'gender-' + key, def);
        });

        var $presets = createDropdown('Presets: ', 'gender-preset', ['She/Her', 'He/Him', 'They/Them'])
            .on('change', function () {
                // auto-fill text inputs when the preset is changed
                var value = Number($(this).find('select').val());
                if (!Number.isNaN(value)) {
                    $inputs.forEach( function ($input) {
                        var $text = $input.find('input');
                        var type = $text.attr('name').split('-')[1];
                        $text.val(genderMap[type][value]);
                    });
                }
            });

        var $select = $presets.find('select');
        if (!State.variables[config.storyVar]) {
            // set defaults
            if (config.default === 'male') {
                $select.val('1');
            } else if (config.default === 'female') {
                $select.val('0');
            } else {
                $select.val('2');
            }
        } else {
            $select.val(''); // custom config, no preset
        }
        
        var $confirm = $(document.createElement('button'))
            .wiki('Confirm')
            .addClass('gender-confirm')
            .ariaClick({ label : 'Confirm pronoun selection.' }, function () {
                // this button saves the pronoun config settings
                var sv = State.variables;
                sv[config.storyVar] = {};
                $inputs.forEach( function ($input) {
                    var $text = $input.find('input');
                    var type = $text.attr('name').split('-')[1];
                    sv[config.storyVar][type] = $text.val().trim().toLowerCase();
                });
                // reopen the settings modal or close the modal
                if ($('#ui-dialog-body').hasClass('reopen')) {
                    UI.settings();
                }
                Dialog.close();
            });

        var $form = (function () {
            // add some line breaks to the generated form
            var $els = [$presets, '<br>'];
            $inputs.forEach( function ($input) {
                $els.push($input);
                $els.push('<br>');
            });
            $els.push($confirm);
            return $els;
        }());

        return $wrapper.append($form);

    }

    // CORE FUNCTIONS

    function handleGender () {
        // this function opens the custom modal
        createDialog('Customize Gender', genderForm(), 'custom-gender');
    }

    function getGender () {
        // get the player's gender (custom or grab the default)
        // custom
        if (State.variables[config.storyVar] && State.variables[config.storyVar][subjective]) {
            return State.variables[config.storyVar];
        }
        // default
        var idx = 2;
        if (config.default === 'male') {
            idx = 1;
        } else if (config.default === 'female') {
            idx = 0;
        }
        var ret = {};
        Object.keys(genderMap).forEach( function (key) {
            ret[key] = genderMap[key][idx];
        });
        return ret;
    }

    // SETTINGS API

    if (config.showSetting) {
        Setting.addToggle(config.name, {
            label : config.label,
            desc : (config.desc && typeof config.desc === 'string' && config.desc.trim()) ? 
                config.desc.trim() : undefined
        });

        $(document).on(':dialogopen :dialogopened', function () {
            if ($('#ui-dialog-body').hasClass('settings')) {
                $(settingID).parent('div').empty().append( $(document.createElement('button'))
                    .append('Configure...')
                    .ariaClick( function () {
                        handleGender();
                    })
                );
            }
        });
    }

    // TEMPLATES

    function isUpper (name, string) {
        // is name is uppercase, return uppercased string
        if (name[0] === name[0].toUpperCase()) {
            return string.toUpperFirst();
        }
        return string;
    }
    
    Template.add(['he', 'she', 'they', 'He', 'She', 'They'], function () {
        return isUpper(this.name, getGender().subjective);
    });
    Template.add(['him', 'her', 'them', 'Him', 'Her', 'Them'], function () {
        return isUpper(this.name, getGender().objective);
    });
    Template.add(['his', 'hers', 'theirs', 'His', 'Hers', 'Theirs'], function () {
        return isUpper(this.name, getGender().possessive);
    });
    Template.add(['his_', 'her_', 'their', 'His_', 'Her_', 'Their'], function () {
        return isUpper(this.name, getGender().determiner);
    });
    Template.add(['himself', 'herself', 'themself', 'Himself', 'Herself', 'Themself'], function () {
        return isUpper(this.name, getGender().reflexive);
    });
    Template.add(['man', 'woman', 'person', 'Man', 'Woman', 'Person'], function () {
        return isUpper(this.name, getGender().noun);
    });
    

    // MACRO

    // `<<pronouns>>` -> opens the modal for pronoun configuration, probably best paired with a link
    Macro.add('pronouns', {
        skipArgs : true,
        handler : function () {
            handleGender();
        }
    });

    // JAVASCRIPT API

    setup.gender = {
        // get the pronoun object; `setup.gender.pronouns().subjective` -> get `he`, `she`, etc
        pronouns : getGender,
        // open the pronoun config modal from JS; `setup.gender.dialog()`
        dialog : handleGender
    };

    window.gender = window.gender || setup.gender;

}());