// fading macro set, by chapel; for SugarCube 2
// version 1.0

/*
<<fadein>> macro

syntax:
<<fadein (optional: delay) (animation length)>>...<</fadein>>

	*delay: the delay, in seconds, to wait before the animation starts.
	*animation length: the length of the fading animation, in seconds.
	
description:
<<fadein>> causes its content to fade in.  you can delay the animation (and should if you're using SugarCube's default transitions) and set the length of the animation.  both values must be in seconds, but you can use floating point values to emulate ms.  note that only *output* is delayed by this macro; code will still execute on passage load, meaning it shouldn't be used in the same way as <<timed>>, but it can be paired with <<timed>> to achieve that sort of effect.

examples:
<<fadein 10>>Fade me in over the course of ten seconds.<</fadein>>
<<fadein 0.2 0.5>>Fade me in over half a second, but give the passage transition a moment to finish.<</fadein>>
<<fadein 20 0.2>>Hide the way [[forward]] for 20 seconds...<</fadein>>
*/
Macro.add('fadein', {
	   tags : null,
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = ('macro-' + this.name);
		var content   = this.payload[0].contents;
		var delay     = 0;
		var time      = 0;

		if (this.args.length === 1) {
			var delay = 0;
			var time  = this.args[0] * 1000;
		} else if (this.args.length === 2) {
			var delay = this.args[0] * 1000;
			var time  = this.args[1] * 1000;
		} else {
			return this.error('incorrect number of arguments...');
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output)
			.hide()
			.delay(delay)
			.fadeIn(time);

	}
});

/*
<<fadeout>> macro

syntax:
<<fadeout (optional: delay) (animation length)>>...<</fadein>>

	*delay: the delay, in seconds, to wait before the animation starts.
	*animation length: the length of the fading animation, in seconds.
	
description:
<<fadeout>> causes its content to fade out.  you can delay the animation (and should if you're using SugarCube's default transitions) and set the length of the animation.  both values must be in seconds, but you can use floating point values to emulate ms.  content is set to {display: none;} after the animation completes, so the page may reflow.

examples:
<<fadeout 10>>Fade me out over the course of ten seconds.<</fadeout>>
<<fadeout 0.2 4>>Fade me out over four seconds, but give the passage transition a moment to finish.<</fadeout>>
<<fadeout 20 2>>This text will disappear after 20 seconds...read fast!<</fadeout>>
*/
Macro.add('fadeout', {
	   tags : null,
	handler : function () {

		var $wrapper  = $(document.createElement('span'));
		var className = ('macro-' + this.name);
		var content   = this.payload[0].contents;
		var delay     = 0;
		var time      = 0;

		if (this.args.length === 1) {
			var delay = 0;
			var time  = this.args[0] * 1000;
		} else if (this.args.length === 2) {
			var delay = this.args[0] * 1000;
			var time  = this.args[1] * 1000;
		} else {
			return this.error('incorrect number of arguments...');
		}

		$wrapper
			.wiki(content)
			.addClass(className)
			.appendTo(this.output)
			.delay(delay)
			.fadeOut(time);

	}
});