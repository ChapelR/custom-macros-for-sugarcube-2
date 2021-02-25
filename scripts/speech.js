(function () {
    // v1.1.1
    'use strict';

    var characters = new Map();

    function addCharacter (name, displayname, icon) {
		if(icon === undefined && displayname){
			icon = displayname;
			displayname = null;
		}
        if (State.length) {
            throw new Error('addCharacter() -> must be called before story starts');
        }
        if (!name || !icon) {
            console.error('addCharacter() -> invalid arguments');
            return;
        }
        if (characters.has(name)) {
            console.error('addCharacter() -> overwriting character "' + name + '"');
        }
        characters.set(name, {displayName: displayname, image: icon});
    }

    function say ($output, character, text, imgSrc) {
        // 
        var $box = $(document.createElement('div'))
            .addClass(Util.slugify(character) + ' say');

			
        // portrait
        var _img = characters.has(character) ? characters.get(character).image : null;        
        var $img = $(document.createElement('img'))
            .attr('src', imgSrc || _img || '');

        if ($img.attr('src') && $img.attr('src').trim()) {
            $box.append($img);
        }

        // name and content boxes
		var _name =  character.toUpperFirst();
		if (characters.has(character) && characters.get(character).displayName) {
            _name = characters.get(character).displayName;
        }

        $box.append($(document.createElement('p'))
            .wiki(_name))
            .append($(document.createElement('p'))
                .wiki(text));

        if ($output) {
            if (!($output instanceof $)) {
                $output = $($output);
            }
            $box.appendTo($output);
        }

        return $box;
    }

    setup.say = say;
    setup.addCharacter = addCharacter;

    Macro.add('character', {
        // character macro
        handler : function () {
            addCharacter(this.args[0], this.args[1], this.args[2]);
        }
    });

    $(document).one(':passagestart', function () {
        // construct array of character names
        var names = Array.from(characters.keys());
        names.push('say');
        // generate macros
        Macro.add(names, {
            tags : null,
            handler : function () {
                if (this.name !== 'say') {
                    say(this.output, this.name, this.payload[0].contents);
                } else {
                    say(this.output, this.args[0], this.payload[0].contents, this.args[1]);
                }
            }
        });
    });
}());