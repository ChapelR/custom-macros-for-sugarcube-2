(function () {
    // simple-inventory.js, by chapel; for sugarcube 2
    // version 2.3.0
    'use strict';

    // options object

    var options = {
        tryGlobal : true,
        defaultStrings : {
            empty     : 'The inventory is empty...',
            listDrop  : 'Discard',
            separator : '\n'
        }
    };

    // private functions

    function _attachEvent (inv, loc, items, cont) {
        // attach special inventory change events to the document
        $(document).trigger({
            type       : (cont === 'initialized') ?  ':inventory-init' : ':inventory-update', // the event name
            instance   : inv, // the calling instance; the giver in transfers
            receiving  : loc, // the inventory recieving transfers, or null
            moved      : items, // the items moved to or from the calling inventory, or null
            context    : cont // drop, pickup, transfer, or initialized
        });
    }

    function _getUID (name, i) {
        // generates a random, unique-enough-for-this-purpose ID
        var key = Math.random().toString(36).substring(7);
        if (arguments.length < 2) {
            // we'll generate an id anyway, but it might not be as unique as i'd like.
            name = Math.random().toString(36).substring(7);
            i    = random(99);
        }
        return ('simple-inv-' + i + '-' + Date.now() + '-' + name.replace(/[^A-Za-z0-9]/g, '') + '-' + key);
    }

    // constructor

    function Inventory (array) {
        if (array) {
            // some number of arguments were passed
            array = [].slice.call(arguments);
            array = array.flatten();
        } else { 
            // no arguments were passed
            array = [];
        }
        
        if (this instanceof Inventory) {
            this.inv = array;
            array = (array.length) ? array : null;
            // run the event only if assignement is successful
            _attachEvent(this, null, array, 'initialized');
        } else { // if the author forgets the 'new' operator, add it for them
            return new Inventory(array);
        }
    }

    // static methods

    Object.assign(Inventory, {
        is : function (inv) {
            // test to see if passed object is an inventory instance
            return (inv instanceof Inventory);
        },
        log : function (inv) {
            // logs the inventory to the console (for debugging)
            var string = (Inventory.is(inv)) ?
                ('Inventory.log() -> ' + inv.toArray().join(' - ')) : 
                ('Inventory.log() -> object is not an inventory...');
            return string;
        },
        removeDuplicates : function (inv) {
            // removes duplicate items from an inventory
            if (!Inventory.is(inv)) {
                return; // not an inventory
            }
            var items = inv.toArray();
            var uniq  = (function (i) {
                var ret = [];
                i.forEach( function (item) {
                    if (!ret.includes(item)) {
                        ret.push(item);
                    }
                });
                return ret;
            }(items));
            
            return uniq;
        }
    });

    Object.assign(Inventory.prototype, {
        transfer : function (loc) {
            // transfer items from this inventory to a specified inventory
            if (arguments.length < 2) {
                return this; // error in args, do nothing
            }   
            if (!Inventory.is(loc)) {
                return this; // error in args, do nothing
            }
            
            var items = [].slice.call(arguments);
            items = items.slice(1).flatten();
            
            var pushed = [];
            for (var i = 0, l = items.length; i < l; i++) {
                // only transfer the item if it exists
                if (this.inv.includes(items[i])) { 
                    this.inv.delete(items[i]);
                    pushed.push(items[i]);
                }
            }
            
            if (pushed.length) {
                loc.inv = loc.inv.concat(pushed);
                _attachEvent(this, loc, pushed, 'transfer');
                return this; // for chaining
            }
            return this; // for chaining
        },
        
        has : function () { // this inventory has any of the passed items
            var items = [].slice.call(arguments).flatten();
            if (items && items.length) {
                return this.inv.includesAny(items);
            }
            return false;
        },
        
        hasAll : function () { // this inventory has all of the passed items
            var items = [].slice.call(arguments).flatten();
            if (items && items.length) {
                return this.inv.includesAll(items);
            }
            return false;
        },
        
        pickUp : function (unique) { // add items to this inventory
            var items = [].slice.call(arguments).flatten(), inventory = this;
            if (items && items.length) {
                if (unique === 'unique' || items[0] === 'unique') { // items must be unique in each inventory instance
                    items = items.splice(1);
                    items = (function (items) { 
                        var ret = []; // this code could use some cleanup
                        items.forEach(function (item) {
                            if (!inventory.inv.includes(item) && !ret.includes(item)) {
                                ret.push(item);
                            }
                        });
                        return ret;
                    }(items));
                }
                // concat the arrays and call the event
                this.inv = this.inv.concat(items);
                _attachEvent(this, null, items, 'pickup');
            }
            return this; // for chaining
        },
        
        drop : function () { // remove items from this inventory
            var items = [].slice.call(arguments).flatten(),
                inventory = this, del; // we need to access this in the <array>.forEach()
            if (items && items.length) {
                var moved = [];
                items.forEach(function (item) {
                    if (inventory.has(item)) {
                        moved.push(item); // for the event below
                        del = inventory.inv.indexOf(item);
                        inventory.inv.deleteAt(del);
                    }
                });
                _attachEvent(this, null, moved, 'drop');
            }
            return this; // for chaining
        },
        
        use : function () { // attempt to use this item
            var items = [].slice.call(arguments).flatten(),
                inventory = this; // we need to access this in the <array>.forEach()
            if (items && items.length) {
                var moved = [];
                items.forEach(function (item) {
                    if (inventory.has(item)) {
                        moved.push(item); // for the event below
                    }
                });
                _attachEvent(this, null, moved, 'used');
            }
            return this; // for chaining
        },

        sort : function () { // sorts this inventory
            this.inv = this.inv.sort();
            _attachEvent(this, null, null, 'sort');
            return this;
        },
        
        show : function (sep) { // returns a string representing the inventory
            if (!sep || typeof sep !== 'string') {
                sep = options.defaultStrings.separator; // default
            }
            if (this.inv.length) {
                return this.inv.join(sep);
            }
            return options.defaultStrings.empty; // nothing is in this inventory
        },
        
        empty : function () { // remove all items from this inventory
            var temp = clone(this.inv); // for the event
            this.inv = []; 
            // this is still technically a 'drop' event
            _attachEvent(this, null, temp, 'drop');
            return this; // for that sweet chaining action
        },
        
        toArray : function () { // not super necessary
            return (this.inv);
        },

        count : function (item) {
            // if item, count the number of duplicates
            if (item && typeof item === 'string') {
                var cnt = 0;
                this.toArray().forEach( function (i) {
                    if (i === item) {
                        cnt++;
                    }
                });
                return cnt;
            }
            // else return the length
            return this.toArray().length;
        },

        isEmpty : function () {
            return this.toArray().length === 0;
        },
        
        linkedList : function (loc, action) { // construct the list elements to keep the macro call clean-ish
            if (!loc || !Inventory.is(loc)) {
                loc = false; // if no loc, then no transferring
            }
            
            // set up vars
            var list = this.toArray();
            var inv = this;
            var $wrapper = $(document.createElement('span'));
            
            // if inventory is empty, append message and return element
            if (!list || !list.length) {
                $wrapper.wiki(options.defaultStrings.empty);
                return $wrapper;
            }
            
            // construct the link list
            list.forEach(function (item, idx, arr) {
                var $listing = $(document.createElement('span')),
                    $link    = $(document.createElement('a')),
                    drop     = (action) ? action : options.defaultStrings.drop, // the action name or default
                    UID      = _getUID(item, idx); // create a unique element ID 
                
                $link // create the drop link
                    .wiki(drop)
                    .addClass('simple-inv drop-link');
                
                // add click event handler
                $link.ariaClick(function () {
                    if ('Use' == drop)
                    {
                        inv.use(item);
                        return;
                    }

                    if (loc) {
                        inv.transfer(loc, item);
                    } else {
                        inv.drop(item);
                    }
                    $('#' + UID).empty(); // empty the listing by its UID
                });
                
                // set up the listing element, which contains the name and the link
                $listing
                    .attr('id', UID)
                    .addClass('simple-inv link-listing')
                    .wiki(item + ' ')
                    .append($link);
                
                // add newline via <br> for listings that aren't last
                // this also allows the newline to disappear with its associated listing when dropped
                if (idx < arr.length - 1) {
                    $listing.wiki('<br />');
                }
                
                // attach to the return element
                $wrapper.append($listing);
            });
            
            // return the whole element
            return $wrapper;
        },
        
        // we need to reassign this since we may have clobbered it using the prototype
        constructor : Inventory,
        
        toJSON : function () { // the custom revive wrapper for SugarCube's state tracking
            // use `setup` version in case the global version is unavailable
            return JSON.reviveWrapper('new setup.Inventory(' + JSON.stringify(this.inv) + ')');
        },
        
        clone : function () { return new Inventory(this.inv); }
    });

    // JS APIs

    setup.Inventory = Inventory;
    setup.simpleInv = { inventory : Inventory }; // legacy

    if (options.tryGlobal) {
        // this allows authors to access the JS API using the global Inventory function
        window.Inventory = window.Inventory || Inventory;
        // ... but only if window.Inventory is undefined
    }

    // macros

    // <<newinventory '$var' '(optional) list of items'>>
    Macro.add('newinventory', {
        handler : function () {

            if (this.args.length < 1) {
                return this.error('incorrect number of arguments');
            }
            var varName = this.args[0].trim();
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[0] + '" is missing its sigil ($ or _)');
            }
            
            // set up new inventory
            Wikifier.setValue(varName, new Inventory(this.args.slice(1).flatten()));
        }
    });

    // <<pickup '$var' 'list of items'>>
    Macro.add('pickup', {
        handler : function () {
            
            if (this.args.length < 2) {
                return this.error('incorrect number of arguments');
            }
            
            var varName = this.args[0].trim();
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[0] + '" is missing its sigil ($ or _)');
            }
            
            // check if story var is an inventory instance
            var inv = Wikifier.getValue(varName);
            if (!Inventory.is(inv)) {
                return this.error('variable ' + varName + ' is not an inventory!');
            }
            
            inv.pickUp(this.args.slice(1).flatten());
        }
    });

    // <<drop '$var' 'list of items'>>
    Macro.add('drop', {
        handler : function () {
            
            if (this.args.length < 2) {
                return this.error('incorrect number of arguments');
            }
            
            var varName = this.args[0].trim();
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[0] + '" is missing its sigil ($ or _)');
            }
            
            // check if story var is an inventory instance
            var inv = Wikifier.getValue(varName);
            if (!Inventory.is(inv)) {
                return this.error('variable ' + varName + ' is not an inventory!');
            }
            
            inv.drop(this.args.slice(1).flatten());
        }
    });

    // <<transfer '$var' '$anotherVar' 'list of items'>>
    Macro.add('transfer', {
        handler : function () {
            
            if (this.args.length < 3) {
                return this.error('incorrect number of arguments');
            }
            
            var varName = this.args[0].trim();
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[0] + '" is missing its sigil ($ or _)');
            }
            
            // check if story var is an inventory instance
            var inv = Wikifier.getValue(varName);
            if (!Inventory.is(inv)) {
                return this.error('variable ' + varName + ' is not an inventory!');
            }
            
            /* the receiving inventory */
            var recVarName = this.args[1].trim();
            // check variable string
            if (recVarName[0] !== '$' && recVarName[0] !== '_') {
                return this.error('variable name "' + this.args[1] + '" is missing its sigil ($ or _)');
            }
            
            // check if story var is an inventory instance
            var recInv = Wikifier.getValue(recVarName);
            if (!Inventory.is(recInv)) {
                return this.error('variable ' + recVarName + ' is not an inventory!');
            }
            
            inv.transfer(recInv, this.args.slice(2).flatten());
        }
    });

    // <<dropall '$var'>>
    Macro.add('dropall', {
        handler : function () {
            
            if (this.args.length !== 1) {
                return this.error('incorrect number of arguments');
            }
            
            var varName = this.args[0].trim();
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[0] + '" is missing its sigil ($ or _)');
            }
            
            // check if story var is an inventory instance
            var inv = Wikifier.getValue(varName);
            if (!Inventory.is(inv)) {
                return this.error('variable ' + varName + ' is not an inventory!');
            }
            
            inv.empty();
        }
    });

    // <<clear>> (same as <<dropall>>)
    Macro.add('clear', 'dropall', false);

    // <<sort '$var'>>
    Macro.add('sort', {
        handler : function () {
            
            if (this.args.length !== 1) {
                return this.error('incorrect number of arguments');
            }
            
            var varName = this.args[0].trim();
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[0] + '" is missing its sigil ($ or _)');
            }
            
            // check if story var is an inventory instance
            var inv = Wikifier.getValue(varName);
            if (!Inventory.is(inv)) {
                return this.error('variable ' + varName + ' is not an inventory!');
            }
            
            inv.sort();
        }
    });

    // <<inventory '$var' 'separator'>>
    Macro.add('inventory', {
        handler : function () {
            
            if (this.args.length < 1 || this.args.length > 2) {
                return this.error('incorrect number of arguments');
            }
            
            var varName = this.args[0].trim();
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[0] + '" is missing its sigil ($ or _)');
            }
            
            // check if story var is an inventory instance
            var inv = Wikifier.getValue(varName);
            if (!Inventory.is(inv)) {
                return this.error('variable ' + varName + ' is not an inventory!');
            }
            
            // create output element and add to DOM
            var $wrapper = $(document.createElement('span')), 
                sep = (this.args[1]) ? this.args[1] : false;
            
            $wrapper
                .wiki(inv.show(sep))
                .addClass('macro-' + this.name)
                .appendTo(this.output);
        }
    });

    // <<linkedinventory 'action name' '$var' '(optional) $anotherVar'
    Macro.add('linkedinventory', {
        handler : function () {
            
            if (this.args.length < 2 || this.args.length > 3) {
                return this.error('incorrect number of arguments');
            }
            
            var recInv = false,
                recVarName = '',
                varName = this.args[1].trim(),
                action = (typeof this.args[0] === 'string') ? this.args[0] : false; // the action name, which is required
            
            if (!action) { // just in case
                return this.error('first argument should be the link text');
            }
            
            // check variable string
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error('variable name "' + this.args[1] + '" is missing its sigil ($ or _)');
            }
            
            // use a varID for linked lists
            var varID = Util.slugify(varName); 
            varID = this.name + '-' + varID;
            
            // check if story var is an inventory instance
            var inv = Wikifier.getValue(varName);
            if (!Inventory.is(inv)) {
                return this.error('variable ' + varName + ' is not an inventory!');
            }
            
            if (this.args.length > 2) {
                // the receiving inventory, if applicable
                recVarName = this.args[2].trim();
                // check variable string
                if (recVarName[0] !== '$' && recVarName[0] !== '_') {
                    return this.error('variable name "' + this.args[2] + '" is missing its sigil ($ or _)');
                }
                
                // check if story var is an inventory instance
                recInv = Wikifier.getValue(recVarName);
                if (!Inventory.is(recInv)) {
                    return this.error('variable ' + recVarName + ' is not an inventory!');
                }
            }
            
            // create output and att to DOM
            var $list = inv.linkedList(recInv, action);
            $list
                .attr({ // add data to reconstruct the call via an event
                    id : varID,
                    'data-rec' : recVarName,
                    'data-self' : varName,
                    'data-action' : action
                })
                .addClass('macro-' + this.name)
                .appendTo(this.output);
        }
    });

}());