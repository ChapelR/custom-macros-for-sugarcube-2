(function () {
    'use strict';
    // v1.2.0; by Chapel, for SugarCube 2 (>= v2.29.0)

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

    // modes
    var storedGenders = new Map();
    State.variables["%%gendermap_stateful"] = new Map();

    function statefulMapping (name, val) {
        var map = State.variables["%%gendermap_stateful"];
        if (val !== undefined) {
            map.set(name, val);
        }
        return map.get(name);
    }

    function setGenderMapping (character, gender, stateful) {
        var genderOpts = ["female", "male", "other"];
        var name, identity;
        if (typeof gender === "string" && genderOpts.includes(gender)) {
            identity = genderOpts.indexOf(gender);
        } else if (typeof gender === "number" && [0, 1, 2].includes(gender)) {
            identity = gender;
        } else if (typeof gender === "object" && !!gender.subjective && typeof gender.subjective === "string") {
            identity = clone(gender);
        } else {
            throw new Error("invalid type passed to setGenderMapping: must be an object containing pronouns, or a string or nimber correspoinding to a preset");
        }

        name = String(character);
        if (stateful) {
            statefulMapping(name, identity);
        } else {
            storedGenders.set(name, identity);
        }
    }

    function getStoredGender (name) {
        var stored = storedGenders.get(name);
        if (stored === undefined || stored === null) {
            stored = statefulMapping(name);
        }
        if (stored === undefined || stored === null) {
            return null;
        }
        return stored;
    }

    // CORE FUNCTIONS

    function handleGender () {
        // this function opens the custom modal
        createDialog('Customize Gender', genderForm(), 'custom-gender');
    }

    function getFromPreset (n) {
        // default
        if (typeof n !== "number" || Number.isNaN(n) || n > 2 || n < 0) {
            n = 0;
        }
        var ret = {};
        Object.keys(genderMap).forEach( function (key) {
            ret[key] = genderMap[key][n];
        });
        return ret;
    }

    function getGender () {
        // psm
        var psm_setting = setup["%%psm_setting"];
        if (psm_setting !== undefined) {
            if (typeof psm_setting === "object" && psm_setting.subjective) {
                return clone(psm_setting);
            }
            if (typeof psm_setting === "number") {
                return getFromPreset(psm_setting);
            }
            // can't process psm context
        }
        // get the player's gender (custom or grab the default)
        // custom
        if (State.variables[config.storyVar] && State.variables[config.storyVar].subjective) {
            return State.variables[config.storyVar];
        }
        // default
        return getFromPreset(config.default === 'male' ? 1 : 0);
    }

    function setPreset (gender) {
        var pn;
        switch (gender) {
            case 'female':
                pn = getFromPreset(0);
                break;
            case 'male':
                pn = getFromPreset(1);
                break;
            default:
                pn = getFromPreset(2);
        }
        State.variables[config.storyVar] = clone(pn);
        return pn;
    }

    function setPronouns (obj) {
        if (typeof obj !== 'object') {
            return;
        }
        State.variables[config.storyVar] = setPreset(config.default === 'male' ? 1 : 0);
        return Object.assign(State.variables[config.storyVar], obj);
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

    // singular endings
    var replaceWith_are = /^is$/i; // is
    var replaceWith_were = /^was$/i; // was
    var replaceWith_have = /^has$/i; // has
    var replaceWith_o = /oes$/i; // does, goes
    var replaceWith_ie = /^[dl]ies$/i; // dies
    var replaceWith_y = /ies$/i; // dries
    var remove_es = /sses$/i; // posesses
    var remove_es2 = /hes$/i; // catches
    var remove_s = /s$/i; // surpises, plays
    // the above are tested in order; if none apply, return singular form (e.g: ran -> ran)

    // test for 'they' pronoun
    var hasThey = /they/i;

    function makePlural (singular) {
        if (!singular || typeof singular !== 'string') {
            return singular;
        }
        singular = singular.trim();
        if (replaceWith_are.test(singular)) {
            return singular.replace(replaceWith_are, 'are');
        }
        if (replaceWith_were.test(singular)) {
            return singular.replace(replaceWith_were, 'were');
        }
        if (replaceWith_have.test(singular)) {
            return singular.replace(replaceWith_have, 'have');
        }
        if (replaceWith_o.test(singular)) {
            return singular.replace(replaceWith_o, 'o');
        }
        if (replaceWith_ie.test(singular)) {
            // need to use replaceWith_y regex here.
            return singular.replace(replaceWith_y, 'ie');
        }
        if (replaceWith_y.test(singular)) {
            return singular.replace(replaceWith_y, 'y');
        }
        if (remove_es.test(singular)) {
            return singular.replace(remove_es, 'ss');
        }
        if (remove_es2.test(singular)) {
            return singular.replace(remove_es2, 'h');
        }
        if (remove_s.test(singular)) {
            return singular.replace(remove_s, '');
        }
        return singular;
    }

    function _getPronounsArePlural () {
        return hasThey.test(getGender().subjective.trim());
    }

    // usage: pluralize('dries', null, true) -> dry; pluralize('supresses', 'supress') -> supresses
    function pluralize (singular, plural, forcePlural) {
        if (!forcePlural) {
            return singular;
        }
        if (plural && typeof plural === 'string') {
            return plural;
        }
        return makePlural(singular);
    }

    // TEMPLATES

    function isUpper (name, string) {
        // is name is uppercase, return uppercased string
        if (name.first() === name.first().toUpperCase()) {
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
    Template.add(['he-s', 'she-s', 'they-re', 'He-s', 'She-s', 'They-re'], function () {
        return isUpper(this.name, getGender().subjective + pluralize("&apos;s", "&apos;re", _getPronounsArePlural()));
    });

    // MACRO

    // `<<pronouns>>` -> opens the modal for pronoun configuration, probably best paired with a link
    Macro.add('pronouns', {
        skipArgs : true,
        handler : function () {
            handleGender();
        }
    });

    // <<verb singular [plural] [makePlural]>>
    Macro.add('verb', {
        handler: function () {
            var pl = _getPronounsArePlural();

            if (this.args.length < 1) {
                return this.error('Please pass at least a singular third person pronoun to this macro.');
            }

            if (this.args.includes('plural')) {
                pl = true;
            }

            this.output.append(pluralize(String(this.args[0]), (this.args[1]) ? String(this.args[1]) : null, !!pl));
        }
    });

    // set gender map
    // <<newpronounset name pronouns stateful>>
    Macro.add("newpronounset", {
        handler : function () {
            if (this.args.length < 2) {
                return this.error("Please pass at least two arguments, the name of the set and the pronoun configuration desired.");
            }

            var stateful = this.args[2];
            if (stateful === undefined) {
                // default to stateful outside storyinit or equivalent
                var stateful = State.length > 0;
            }

            setGenderMapping(this.args[0], this.args[1], stateful);
        }
    });

    // <<psm "name">> ?he <</psm>>
    // <<pronounsetmode "name">> ?he <</pronounsetmode>>
    Macro.add([ "pronounsetmode", "psm" ], {
        tags : null,
        handler : function () {
            if (this.args.length < 1) {
                return this.error("Please indicate the saved pronoun set to use.");
            }

            var psm = this.args[0];
            var contents = this.payload[0].contents;
            
            var $out = $(document.createElement("span"))
                .addClass("pronoun-set-mode")
                .attr("data-psm-name", this.args[0])
                .appendTo($(this.output));
            
            // deep closure??? magic
            (function () {
                setup["%%psm_context"] = psm;
                setup["%%psm_setting"] = getStoredGender(psm);
                $out.wiki(contents);
                delete setup["%%psm_context"], setup["%%psm_setting"];
            }());
        }
    });

    // gendermap mode

    // JAVASCRIPT API

    setup.gender = {
        // get the pronoun object; `setup.gender.pronouns().subjective` -> get `he`, `she`, etc
        pronouns : getGender,
        // set pronouns from presets or manually
        setPronouns : function (presetOrObj) {
            if (typeof presetOrObj === 'string') {
                return setPreset(presetOrObj);
            }
            if (typeof presetOrObj === 'object') {
                return setPronouns(presetOrObj);
            }
        },
        // open the pronoun config modal from JS; `setup.gender.dialog()`
        dialog : handleGender,
        // pluralizer function
        pluralize : makePlural
    };

    window.gender = window.gender || setup.gender;

}());