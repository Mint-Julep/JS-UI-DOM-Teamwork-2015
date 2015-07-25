////////////////////////////////////////////////////////////
//                      Levels                            //
////////////////////////////////////////////////////////////

var levels = {
	// Level data
	data: [
		{ // First level
			name:"Level 1",
			map:[
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,2,0,1,1,1,0,0,0,0,1,1,1,0,0,1],
                [1,2,0,1,0,1,1,0,0,1,1,0,1,0,0,1],
                [1,2,0,0,0,0,1,1,1,1,0,0,0,0,0,1],
                [1,2,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
                [1,2,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
                [1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1],
                [1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
                [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			],
            tiles:{
                background:"tile-grass",
                wall:"tile-wall",
                breakable:"tile-wood"
            },
            initialPosition:{
                x:55,
                y:55
            }
		},
		{ // Second level
			name:"Level 2",
			map:[
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,0,1,0,0,0,0,0,0,2,0,0,0,0,0,1],
                [1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,0,0,2,0,0,2,0,0,0,0,2,2,0,0,1],
                [1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,2,2,0,0,1],
                [1,2,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,2,2,0,0,0,0,0,0,0,0,2,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			],
            tiles:{
                background:"tile-snow",
                wall:"tile-crate",
                breakable:"tile-ice"
            },
            initialPosition:{
                x:55,
                y:55
            }
		},
		{ // Third level
			name:"Level 0",
			map:[
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			],
            tiles:{
                background:"tile-grass",
                wall:"tile-wall",
                breakable:"tile-crate"
            },
            initialPosition:{
                x:55,
                y:205
            }
		}
	]
};
