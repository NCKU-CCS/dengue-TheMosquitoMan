window.addEventListener('load',function(){
	var Q = Quintus().include('Sprites , Scenes , Input , Anim , 2D , Audio , Touch , UI')
			.include('WarSprites , WarScenes , LandingUI , LevelUI , WarLevels')
			.enableSound()
			.setup({
				// scaleToFit: true,
				width:530 ,
				height: 550,
				upsampleWidth: 318,  // Double the pixel density of the 
  			upsampleHeight: 330 , 
				downsampleWidth: 901,
				downsampleHeight: 935
			})
			.touch();

  Q.input.keyboardControls();

	Q.load([
		// Images
		"sprite.png","level_bg.png","landing_bg_long.png","landing_play.png", "landing_story.png" ,"logo.png",
		"intro_bg.png","intro_man.png","intro_text.png","player_man_bg.png","player_mosking_bg.png",
		"katha_1_bg.png","animate_sprites.png","player_mos_rotate.png",
		"player_mos_bg.png","player_mos.png","katha_1_text.png","katha_close.png",

		// Sound
		"brickDeath.ogg",
		// Data
		"level.tmx" , "sprites.json","animate.json","player_mos_rotate.json"
		] , function(){
			Q.useTiles = window.location.href.indexOf('usetiles') > -1 ;

			// Set all sprites sheets
			Q.compileSheets("sprite.png" , "sprites.json") ;
			Q.compileSheets("animate_sprites.png" , "animate.json") ;
			Q.compileSheets("player_mos_rotate.png" , "player_mos_rotate.json") ;

			// Now add in the animations for the various sprites
			Q.animations("player_man_man", { 
        default: { frames: [ 0,1,2,3 ], rate: 1,  trigger:"startRotate",loop: false }
      });
			Q.animations("player_man_rotate", { 
        rotate: { frames: [ 0,1,2 ], rate: 0.3,  loop: true }
      });
      Q.animations("player_mos_rotate", { 
        rotate: { frames: [ 0,1,2,3,4,5,6,7,8 ], rate: 0.3,  loop: true }
      });
      Q.animations("mosking_anim", { 
        default: { frames: [ 0,1,2,3 ], rate: 0.3,  loop: true }
      });

			// Go Time
			Q.stageScene("title");
		})

	// Q.debug = true ;

	window.Q = Q ;
} , true);