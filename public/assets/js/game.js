////////////////////////////////////////////////////////////
//                      Polyfills                         //
////////////////////////////////////////////////////////////

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame =
			window[vendors[x] + 'CancelAnimationFrame'] ||
			window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				                           callback(currTime + timeToCall);
			                           },
			                           timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

$(window).load(function() {
	game.init();
});

////////////////////////////////////////////////////////////
//                Game Engine                             //
////////////////////////////////////////////////////////////

var game = {
	// Start initializing objects, preloading assets and display start screen
	init: function() {
		levels.init();
		loader.init();

		// Hide all game layers and display the start screen
		$('.gamelayer').hide();
		$('#gamestartscreen').show();

		// Get handler for game canvas and context
		this.canvas = $('#gamecanvas')[0];
		if(this.canvas){
			this.context = this.canvas.getContext('2d');
		}
	},
	showLevelScreen: function() {
		$('.gamelayer').hide();
		$('#levelselectscreen').show();
	}
};
