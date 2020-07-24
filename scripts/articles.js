(function () {
    // v1.0.0
    'use strict';

    var _overrides = new Map();

    var _defaultIrregulars = [ // lifted from: https://github.com/tandrewnichols/indefinite/blob/master/lib/irregular-words.js
        // e
        'eunuch', 'eucalyptus', 'eugenics', 'eulogy', 'euphemism', 'euphony', 'euphoria', 'eureka', 'european', 'euphemistic', 'euphonic', 'euphoric', 'euphemistically', 'euphonically', 'euphorically', 
        // h
        'heir', 'heiress', 'herb', 'homage', 'honesty', 'honor', 'honour', 'hour', 'honest', 'honorous', 'honestly', 'hourly',
        // o
        'one', 'ouija', 'once',
        // u
        'ubiquitous', 'ugandan', 'ukrainian', 'unanimous', 'unicameral', 'unified', 'unique', 'unisex', 'universal', 'urinal', 'urological', 'useful', 'useless', 'usurious', 'usurped', 'utilitarian', 'utopic', 'ubiquitously', 'unanimously', 'unicamerally', 'uniquely', 'universally', 'urologically', 'usefully', 'uselessly', 'usuriously'
    ];

    var _validArticles = ['a', 'an'];

    var _vowels = /[aeiou8]/i;
    var _acronyms = /[A-Z]+$/;
    var _irregularAcronyms = /[UFHLMNRSX]/;
    var _punctuation = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;

    function _switch (article) {
        if (article === 'a') {
            return 'an';
        }
        return 'a';
    }

    function _isAcronym (word, article) {
        if (_acronyms.test(word) && _irregularAcronyms.test(word.first())) {
            return _switch(article);
        }
        return false;
    }

    function _isDefaultIrregular (word, article) {
        if (_defaultIrregulars.includes(word.toLowerCase())) {
            return _switch(article);
        }
        return false;
    }

    function addOverride (article, word, caseSensitive) {
        var msg;
        if (State.length > 0) {
            // must be called in story JS or StoryInit, as the override map isn't stateful
            msg = 'cannot add article override -> needs to be run in StoryInit special passage or earlier';
            console.error(msg);
            return msg;
        }
        // check args
        if (!word || typeof word !== 'string') {
            msg = 'cannot add article override -> invalid word';
            console.error(msg);
            return msg;
        }
        if (article && typeof article === 'string') {
            // clean up article
            article = article.toLowerCase().trim();
        }
        if (!_validArticles.includes(article)) {
            msg = 'cannot add article override -> invalid article, must be "a" or "an"';
            console.error(msg);
            return msg;
        }
        // clean up phrase
        word = word.trim();

        if (caseSensitive) {
            _overrides.set(word, {
                article : article,
                caseSensitive : !!caseSensitive
            });
        } else {
            _overrides.set(word.toLowerCase(), {
                article : article,
                caseSensitive : !!caseSensitive
            });
        }
    }

    function _checkOverrides (word) {
        word = word.trim();
        // check user-defined overrides
        var check = word.toLowerCase();
        if (_overrides.has(check) || _overrides.has(word)) {
            var override = _overrides.get(check) || _overrides.get(word);
            // check if we require an exact (case-sensitive) match
            if (override.caseSensitive && !_overrides.has(word)) {
                    return null;
            }
            // return the article
            return override.article;
        }
        // return nothing, passing on to built-in article checks
        return null;
    }

    function _checkVowels (word) {
        var article;
        // select the article based on vowels
        if (_vowels.test(word.first())) {
            article = 'an';
        } else {
            article = 'a';
        }
        // check for irregular words, then acronyms
        return _isDefaultIrregular(word, article) || _isAcronym(word, article) || article;
    }

    function find (word) {
        if (!word || typeof word !== 'string') {
            return;
        }
        var cleanedWord = word.trim().split(' ')[0].trim();
        cleanedWord = cleanedWord.replace(_punctuation, '');
        return _checkOverrides(cleanedWord) || _checkVowels(cleanedWord);
    }

    function article (word, upper) {
        if (!word || typeof word !== 'string') {
            return word; // ? just throw back whatever we got
        }
        var article = find(word);
        // return article, capitalized if requested, appended to the original phrase
        return (upper ? article.toUpperFirst() : article) + ' ' + word;
    }

    setup.articles = {
        find : find,
        output : article,
        override : addOverride
    };

    Macro.add('setarticle', {
        handler : function () {
            var check = addOverride(this.args[0], this.args[1], this.args[2]);
            if (check && typeof check === 'string') {
                this.error(check);
            }
        }
    });

    Macro.add(['a', 'an', 'A', 'An'], {
        handler : function () {
            var isUpper = this.name.first() === this.name.first().toUpperCase();
            this.output.append(article(String(this.args[0]), isUpper));
        }
    });
}());