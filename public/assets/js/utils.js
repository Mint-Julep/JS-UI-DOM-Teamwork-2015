var utils = {
	comparePositions: function(pos1, pos2) {
		return pos1.x == pos2.x && pos1.y == pos2.y;
	},
	removeFromArray: function(array, item) {
		for (var i = 0, len = array.length; i < len; i++) {
			if (item == array[i]) {
				array.splice(i, 1);
			}
		}

		return array;
	},
	polyfills:function(){
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame =
				window[vendors[x] + 'CancelAnimationFrame'] ||
				window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					},
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
		}
	}
};



