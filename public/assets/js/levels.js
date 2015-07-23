////////////////////////////////////////////////////////////
//                      Levels                            //
////////////////////////////////////////////////////////////

var levels = {
	// Level data
	data: [
		{ // First level
			foreground: 'foreground',
			background: 'background',
			entities: []
		},
		{ // Second level
			foreground: 'foreground',
			background: 'background',
			entities: []
		},
		{ // Third level
			foreground: 'foreground',
			background: 'background',
			entities: []
		}
	],
	// Initialize level selection screen
	init: function() {
		var html = "";
		for (var i = 0; i < levels.data.length; i++) {
			var level = levels.data[i];
			html += '<input type="button" value="' + (i + 1) + '">';
		}
		$('#levelselectscreen').html(html);

		// Set the button click event handlers to load level
		$('#levelselectscreen').find('input').click(function() {
			levels.load(this.value - 1);
			$('#levelselectscreen').hide();
		});
	},
	// Load all data and images for a specific level
	load: function(number) {
	}
};
