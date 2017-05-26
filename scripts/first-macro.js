// first macro, by chapel; for sugarcube 2
// version 1.0

/*
<<first>> macro

syntax:
<<first>>...<<then>>...<<finally>>...<</first>>

explanation:
A simple, slightly sexier repalcement for <<if visited()>> and <<switch visited()>>, based loosely on Leon's <<once>> macro.  <<first>> shows text on the first visit to a passage, and you can use <<then>> to show different text on subsequent visits.  Use <<finally>> to show text that persists over *all* subsequent visits.  !!!Do not nest <<first>> macros inside each other; it won't cause an error, but it also likely won't work the way you expect.  If you need nesting, you'll need to use variables.

examples:
// show something or run code only on first visit to any given passage:
<<first>>Show only on first visit.<</first>>

// show something only on second and all subsequent visits:
<<first>><<finally>>Show me on every visit except the first.<</first>> 

// show different text on first three visits, then nothing:
<<first>>\
	First visit text.
<<then>>\
	Second visit text.
<<then>>\
	Third visit text.
<</first>>

// show different text on first two visits then different text on the third visit and subsequent visits: 
<<first>>\
	First visit text.
<<then>>\
	Second visit text.
<<finally>>\
	Third visit and subsequent visits text.
<</first>>
*/
Macro.add('first', {
	   tags : ['then', 'finally'],
	handler : function () {

			var $wrapper    = $(document.createElement('span'));
			var className   = 'macro-' + this.name;
			var length      = this.payload.length;
			var visits       = visited() - 1;
		    var lastTag     = this.payload[ length - 1 ].name;
		    var lastContent = this.payload[ length - 1 ].contents;

			if (visits < length){
				content = this.payload[visits].contents;
            } else {
                content = (lastTag === 'remains') ? lastContent : '';
            }

			$wrapper
				.wiki(content)
				.addClass(className)
				.appendTo(this.output);
		}

	});