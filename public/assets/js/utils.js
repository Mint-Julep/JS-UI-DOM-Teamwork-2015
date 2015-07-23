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
	}
};



