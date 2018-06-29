// the <<done>> macro, v1.0.0; for SugarCube 2, by chapel

(function () {
	
	// the core function
	function done (wikiCode) {
		if (!wikiCode || typeof wikiCode !== 'string') {
			return; // bail out
		}
		// check the task name
		var cached;
		if (postdisplay[':chapel-done-macro'] && typeof postdisplay[':chapel-done-macro'] === 'function') {
			// two possibilities; 1) there's a <<done>> on the page already; 2) there's a another task the user named after me (flatterer)
			cached = clone(postdisplay[':chapel-done-macro']);
		}
		// register the task
		postdisplay[':chapel-done-macro'] = function (task) {
			delete postdisplay[task]; // single use
			
			if (cached && typeof cached === 'function') {
				cached(task); // run the cached function, which may also unregister... kind of a mess
			}
			
			$.wiki(wikiCode); // wikify the source code
		};
	}
	
	Macro.add('done', {
		tags : null,
		handler : function () {
			
			var wiki = this.payload[0].contents;
			
			done(wiki);
			
		}
	});
	
}());